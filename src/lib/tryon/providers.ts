export type TryOnResult = {
  resultUrl: string;
  provider: string;
  durationMs: number;
};

// ─── PROVIDER 1: Replicate (MAIN) ────────────────────────
export async function runReplicate(
  personImage: string,
  garmentImage: string
): Promise<TryOnResult> {
  const start = Date.now();
  
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('Replicate API token is not configured in environment variables.');
  }

  const Replicate = (await import('replicate')).default;
  const replicate = new Replicate({ 
    auth: process.env.REPLICATE_API_TOKEN 
  });

  console.log('[TRY-ON REPLICATE] Submitting task to viktorfa/leffa...');
  const output = await replicate.run(
    'viktorfa/leffa:latest',
    {
      input: {
        human_img: personImage,
        garm_img: garmentImage,
        garment_des: 'clothing item',
      }
    }
  ) as string[];

  if (!output || output.length === 0) {
    throw new Error('Replicate did not return any output image.');
  }

  return {
    resultUrl: output[0],
    provider: 'replicate',
    durationMs: Date.now() - start,
  };
}

// ─── PROVIDER 2: HuggingFace (FALLBACK) ──────────────────
export async function runHuggingFace(
  personImage: string,
  garmentImage: string
): Promise<TryOnResult> {
  const start = Date.now();

  if (!process.env.HF_TOKEN) {
    throw new Error('HuggingFace token is not configured in environment variables.');
  }

  console.log('[TRY-ON HUGGINGFACE] Submitting task to yisol/IDM-VTON...');
  
  // Clean base64 prefixes if present, as some HuggingFace endpoints expect raw base64 or files
  // If it's a base64 string, strip the data:image/png;base64 prefix before sending
  const cleanPersonImage = personImage.startsWith('data:') 
    ? personImage.split(',')[1] 
    : personImage;
  const cleanGarmentImage = garmentImage.startsWith('data:') 
    ? garmentImage.split(',')[1] 
    : garmentImage;

  const response = await fetch(
    'https://api-inference.huggingface.co/models/yisol/IDM-VTON',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { 
          human_img: cleanPersonImage, 
          garm_img: cleanGarmentImage 
        }
      }),
      signal: AbortSignal.timeout(90_000), // 90 seconds timeout
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HuggingFace returned error code ${response.status}: ${errText}`);
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return {
    resultUrl: `data:image/png;base64,${base64}`,
    provider: 'huggingface',
    durationMs: Date.now() - start,
  };
}

// ─── PROVIDER 3: Kling AI via PiAPI (ALTERNATIVE) ────────
export async function runKling(
  personImage: string,
  garmentImage: string,
  garmentType: 'upper' | 'lower' | 'dress' = 'upper'
): Promise<TryOnResult> {
  const start = Date.now();

  if (!process.env.PIAPI_KEY) {
    throw new Error('Kling AI / PiAPI key is not configured in environment variables.');
  }

  console.log('[TRY-ON KLING] Submitting ai_try_on task to PiAPI...');

  // Step 1: Submit the try-on task
  const submitRes = await fetch('https://api.piapi.ai/api/v1/task', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.PIAPI_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'kling',
      task_type: 'ai_try_on',
      input: {
        model_input: personImage,          // person photo URL or base64
        ...(garmentType === 'upper' && { upper_input: garmentImage }),
        ...(garmentType === 'lower' && { lower_input: garmentImage }),
        ...(garmentType === 'dress' && { dress_input:  garmentImage }),
        batch_size: 1,
      },
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    throw new Error(`PiAPI task submission failed: ${errText}`);
  }

  const { task_id, error } = await submitRes.json();
  if (error) {
    throw new Error(`Kling submission error: ${error}`);
  }

  console.log(`[TRY-ON KLING] Task submitted. Task ID: ${task_id}. Polling...`);

  // Step 2: Poll for result
  const maxPolls = 40; // 120 seconds max
  for (let i = 0; i < maxPolls; i++) {
    // wait 3s between polls
    await new Promise(r => setTimeout(r, 3000)); 

    console.log(`[TRY-ON KLING] Polling task status (attempt ${i + 1}/${maxPolls})...`);
    const pollRes = await fetch(
      `https://api.piapi.ai/api/v1/task/${task_id}`,
      { headers: { 'x-api-key': process.env.PIAPI_KEY } }
    );
    
    if (!pollRes.ok) {
      console.warn(`[TRY-ON KLING] Status poll failed (attempt ${i + 1}):`, await pollRes.text());
      continue;
    }

    const poll = await pollRes.json();
    console.log(`[TRY-ON KLING] Current task status: ${poll.status}`);

    if (poll.status === 'completed') {
      const outputUrl = poll.output?.image_url || (Array.isArray(poll.output) ? poll.output[0] : poll.output);
      if (!outputUrl) {
        throw new Error('Kling task completed but returned no output URL.');
      }
      return {
        resultUrl: outputUrl,
        provider: 'kling',
        durationMs: Date.now() - start,
      };
    }
    
    if (poll.status === 'failed') {
      throw new Error(`Kling task processing failed on server: ${poll.error || 'Unknown error'}`);
    }
  }

  throw new Error('Kling processing timed out after 120 seconds.');
}
