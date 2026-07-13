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
    throw new Error('Replicate API token is not configured.');
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
    throw new Error('Replicate returned no output image.');
  }

  return {
    resultUrl: output[0],
    provider: 'replicate',
    durationMs: Date.now() - start,
  };
}

// ─── PROVIDER 2: HuggingFace via Gradio Client ──────────
// yisol/IDM-VTON is a Gradio Space — must use @gradio/client, not the Inference API.
export async function runHuggingFace(
  personImage: string,
  garmentImage: string
): Promise<TryOnResult> {
  const start = Date.now();

  if (!process.env.HF_TOKEN) {
    throw new Error('HuggingFace token (HF_TOKEN) is not configured.');
  }

  console.log('[TRY-ON HF] Connecting to yisol/IDM-VTON Gradio Space...');

  let Client: any;
  try {
    const mod = await import('@gradio/client');
    Client = mod.Client;
  } catch (importErr) {
    throw new Error(`Failed to import @gradio/client: ${importErr}`);
  }

    let client: any;
    let handle_file: any;
  try {
    const mod = await import('@gradio/client');
    Client = mod.Client;
    handle_file = mod.handle_file;
  } catch (importErr) {
    throw new Error(`Failed to import @gradio/client: ${importErr}`);
  }

  try {
    client = await Client.connect('yisol/IDM-VTON', {
      token: process.env.HF_TOKEN as `hf_${string}`,
    });
  } catch (connectErr: any) {
    // The space might be sleeping or down
    const msg = connectErr?.message || String(connectErr);
    if (msg.includes('sleeping') || msg.includes('loading') || msg.includes('starting')) {
      throw new Error(`HuggingFace Space is sleeping/starting up. Please retry in 30-60 seconds. (${msg})`);
    }
    throw new Error(`Failed to connect to HF Space: ${msg}`);
  }

  console.log('[TRY-ON HF] Submitting prediction to /tryon endpoint with URLs...');

  let result: any;
  try {
    // Gradio handle_file perfectly wraps URLs into FileData for the backend
    const personFile = handle_file(personImage);
    const garmentFile = handle_file(garmentImage);

    result = await client.predict('/tryon', [
      { background: personFile, layers: [], composite: null },
      garmentFile,
      'clothing item',   // garment description
      true,              // auto-generate mask
      false,             // auto-crop & resizing
      30,                // denoising steps
      42,                // seed
    ]);
  } catch (predictErr: any) {
    throw new Error(`HF prediction failed: ${predictErr?.message || String(predictErr)}`);
  }

  const data = result?.data as any[];
  if (!data || data.length === 0) {
    throw new Error('HuggingFace IDM-VTON returned empty output data array.');
  }

  const output = data[0];
  if (!output) {
    throw new Error('HuggingFace IDM-VTON returned null output.');
  }

  // Output can be a URL string or an object with a .url property
  const resultUrl = typeof output === 'string' ? output : output?.url ?? null;

  if (!resultUrl || typeof resultUrl !== 'string') {
    throw new Error(`HF returned unexpected output format: ${JSON.stringify(output).slice(0, 200)}`);
  }

  console.log(`[TRY-ON HF] ✓ Success in ${Date.now() - start}ms`);

  return {
    resultUrl,
    provider: 'huggingface',
    durationMs: Date.now() - start,
  };
}

// ─── PROVIDER 3: Kling AI via PiAPI ─────────────────────
// PiAPI wraps responses in { code, data: {...}, message } envelope.
export async function runKling(
  personImage: string,
  garmentImage: string,
  garmentType: 'upper' | 'lower' | 'dress' = 'upper'
): Promise<TryOnResult> {
  const start = Date.now();

  if (!process.env.PIAPI_KEY) {
    throw new Error('PiAPI key (PIAPI_KEY) is not configured.');
  }

  console.log('[TRY-ON KLING] Submitting ai_try_on task to PiAPI...');

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
        model_input: personImage,
        ...(garmentType === 'upper' && { upper_input: garmentImage }),
        ...(garmentType === 'lower' && { lower_input: garmentImage }),
        ...(garmentType === 'dress' && { dress_input:  garmentImage }),
        batch_size: 1,
      },
    }),
  });

  const submitText = await submitRes.text();
  let submitJson: any;
  try {
    submitJson = JSON.parse(submitText);
  } catch {
    throw new Error(`PiAPI returned non-JSON response (HTTP ${submitRes.status}): ${submitText.slice(0, 300)}`);
  }

  if (!submitRes.ok) {
    throw new Error(`PiAPI submission failed (HTTP ${submitRes.status}): ${JSON.stringify(submitJson)}`);
  }

  // Extract task_id from the data envelope
  const taskId = submitJson?.data?.task_id;
  if (!taskId) {
    throw new Error(`PiAPI returned no task_id. Response: ${JSON.stringify(submitJson).slice(0, 500)}`);
  }

  console.log(`[TRY-ON KLING] Task submitted. ID: ${taskId}. Polling...`);

  // Poll for result (max 120 seconds)
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));

    const pollRes = await fetch(
      `https://api.piapi.ai/api/v1/task/${taskId}`,
      { headers: { 'x-api-key': process.env.PIAPI_KEY! } }
    );
    
    if (!pollRes.ok) {
      console.warn(`[TRY-ON KLING] Poll ${i+1} failed: HTTP ${pollRes.status}`);
      continue;
    }

    const pollJson = await pollRes.json();
    const status = pollJson?.data?.status;
    const output = pollJson?.data?.output;
    
    console.log(`[TRY-ON KLING] Poll ${i+1}: status=${status}`);

    if (status === 'completed') {
      console.log(`[TRY-ON KLING] Full output:`, JSON.stringify(pollJson?.data).slice(0, 1000));
      
      // Try multiple possible output field locations from PiAPI docs
      const resultUrl = 
        output?.works?.[0]?.image?.resource ??
        output?.image_url ??
        output?.works?.[0]?.cover?.resource ??
        (Array.isArray(output) ? output[0] : null) ??
        (typeof output === 'string' ? output : null);
        
      if (!resultUrl || typeof resultUrl !== 'string') {
        throw new Error(`Kling completed but output URL not found. Raw: ${JSON.stringify(output).slice(0, 500)}`);
      }
      
      return {
        resultUrl,
        provider: 'kling',
        durationMs: Date.now() - start,
      };
    }
    
    if (status === 'failed') {
      throw new Error(`Kling task failed: ${JSON.stringify(pollJson?.data?.error || pollJson?.data).slice(0, 500)}`);
    }
  }

  throw new Error('Kling processing timed out after 120 seconds.');
}
