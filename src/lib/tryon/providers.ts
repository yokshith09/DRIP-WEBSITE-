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

// ─── PROVIDER 2: HuggingFace via Gradio Client ──────────
// BUG FIX: yisol/IDM-VTON is a Gradio Space, NOT an Inference API model.
// Must use @gradio/client to talk to it, not raw fetch to api-inference.huggingface.co
export async function runHuggingFace(
  personImage: string,
  garmentImage: string
): Promise<TryOnResult> {
  const start = Date.now();

  if (!process.env.HF_TOKEN) {
    throw new Error('HuggingFace token is not configured in environment variables.');
  }

  console.log('[TRY-ON HUGGINGFACE] Connecting to yisol/IDM-VTON Gradio Space...');

  const { Client } = await import('@gradio/client');

  const client = await Client.connect('yisol/IDM-VTON', {
    token: process.env.HF_TOKEN as `hf_${string}`,
  });

  // Convert base64/URL images to Blob for Gradio
  const personBlob = await imageToBlob(personImage);
  const garmentBlob = await imageToBlob(garmentImage);

  console.log('[TRY-ON HUGGINGFACE] Submitting prediction to /tryon endpoint...');

  const result = await client.predict('/tryon', [
    { background: personBlob, layers: [], composite: personBlob }, // dict input for person image
    garmentBlob,       // garment image
    'clothing item',   // garment description
    true,              // auto-generate mask
    false,             // auto-crop & resizing
    30,                // denoising steps
    42,                // seed
  ]);

  const data = result.data as any[];
  const output = data[0];

  if (!output) {
    throw new Error('HuggingFace IDM-VTON returned empty output.');
  }

  // The output can be a URL string or an object with a .url property
  const resultUrl = typeof output === 'string' ? output : output?.url ?? output;

  console.log(`[TRY-ON HUGGINGFACE] ✓ Success in ${Date.now() - start}ms`);

  return {
    resultUrl,
    provider: 'huggingface',
    durationMs: Date.now() - start,
  };
}

// ─── PROVIDER 3: Kling AI via PiAPI ─────────────────────
// BUG FIX: PiAPI wraps every response in { code, data: {...}, message }.
// task_id is at data.task_id, NOT at the root level.
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
    throw new Error(`PiAPI task submission failed (HTTP ${submitRes.status}): ${errText}`);
  }

  const submitJson = await submitRes.json();
  
  // FIX: Extract task_id from the data envelope, not root level
  const taskId = submitJson?.data?.task_id;
  if (!taskId) {
    throw new Error(`PiAPI submit returned no task_id. Full response: ${JSON.stringify(submitJson)}`);
  }

  console.log(`[TRY-ON KLING] Task submitted. Task ID: ${taskId}. Polling...`);

  // Step 2: Poll for result
  const maxPolls = 40; // 120 seconds max
  for (let i = 0; i < maxPolls; i++) {
    // wait 3s between polls
    await new Promise(r => setTimeout(r, 3000)); 

    console.log(`[TRY-ON KLING] Polling task status (attempt ${i + 1}/${maxPolls})...`);
    const pollRes = await fetch(
      `https://api.piapi.ai/api/v1/task/${taskId}`,
      { headers: { 'x-api-key': process.env.PIAPI_KEY! } }
    );
    
    if (!pollRes.ok) {
      console.warn(`[TRY-ON KLING] Status poll failed (attempt ${i + 1}):`, await pollRes.text());
      continue;
    }

    const pollJson = await pollRes.json();
    // FIX: Status is inside data envelope
    const status = pollJson?.data?.status;
    const output = pollJson?.data?.output;
    
    console.log(`[TRY-ON KLING] Current task status: ${status}`);
    // Log full response for debugging output field structure
    if (status === 'completed') {
      console.log(`[TRY-ON KLING] Full completed response:`, JSON.stringify(pollJson));
    }

    if (status === 'completed') {
      // Try multiple possible output field locations
      const resultUrl = 
        output?.works?.[0]?.image?.resource ??
        output?.image_url ??
        output?.works?.[0]?.cover?.resource ??
        (Array.isArray(output) ? output[0] : null) ??
        output;
        
      if (!resultUrl || typeof resultUrl !== 'string') {
        throw new Error(`Kling completed but could not parse output URL. Raw output: ${JSON.stringify(output)}`);
      }
      
      return {
        resultUrl,
        provider: 'kling',
        durationMs: Date.now() - start,
      };
    }
    
    if (status === 'failed') {
      throw new Error(`Kling task processing failed: ${JSON.stringify(pollJson?.data?.error || pollJson)}`);
    }
  }

  throw new Error('Kling processing timed out after 120 seconds.');
}


// ─── Helper: Convert base64 data URI or URL to Blob ─────
async function imageToBlob(imageInput: string): Promise<Blob> {
  if (imageInput.startsWith('data:')) {
    // Base64 data URI → Blob
    const [header, data] = imageInput.split(',');
    const mimeMatch = header.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const binary = Buffer.from(data, 'base64');
    return new Blob([binary], { type: mime });
  } else {
    // URL → fetch and convert to Blob
    const response = await fetch(imageInput);
    return await response.blob();
  }
}
