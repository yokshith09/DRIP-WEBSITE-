import { NextResponse } from 'next/server';
import { runTryOnWithFallback } from '@/lib/tryon';
import { createClient } from '@/lib/supabase/server';

// Helper: Upload base64 or local image to a temporary public host (uguu.se)
// PiAPI (Kling) STRICTLY requires absolute public URLs. It will silently fail or reject base64.
// HuggingFace Gradio client also works much more reliably with URLs than Blobs/Buffers in Node.
async function getPublicUrl(imageInput: string): Promise<string> {
  if (imageInput.startsWith('http')) return imageInput;
  
  let buffer: Buffer;
  let mime = 'image/jpeg';
  let filename = 'image.jpg';

  if (imageInput.startsWith('data:')) {
    const commaIdx = imageInput.indexOf(',');
    const header = imageInput.slice(0, commaIdx);
    const data = imageInput.slice(commaIdx + 1);
    const mimeMatch = header.match(/data:(.*?);/);
    if (mimeMatch) mime = mimeMatch[1];
    filename = `image.${mime.split('/')[1] || 'jpg'}`;
    buffer = Buffer.from(data, 'base64');
  } else if (imageInput.startsWith('/')) {
    // Local public file
    const fs = await import('fs');
    const path = await import('path');
    const filepath = path.join(process.cwd(), 'public', imageInput);
    buffer = fs.readFileSync(filepath);
    if (imageInput.endsWith('.png')) mime = 'image/png';
    if (imageInput.endsWith('.webp')) mime = 'image/webp';
    filename = path.basename(imageInput);
  } else {
    throw new Error('Unsupported image format. Must be URL, base64 data URI, or absolute local path starting with /');
  }

  console.log(`[API TRY-ON] Uploading ${filename} to temporary host...`);
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mime });
  formData.append('files[]', blob, filename);
  
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body: formData });
  const data = await res.json();
  if (!data.success || !data.files || data.files.length === 0) {
    throw new Error('Failed to upload image to temporary public host');
  }
  return data.files[0].url;
}

export async function POST(req: Request) {
  try {
    // 1. Enforce strict server-side API Route Protection
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      console.warn('[API TRY-ON] Auth check failed:', authError?.message || 'No session');
      return NextResponse.json(
        { success: false, error: `Authentication required. ${authError?.message || 'Please log in and try again.'}` },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Support both 'personImage' (new) and 'modelImage' (old) variable keys
    const personImage = body.personImage || body.modelImage;
    const garmentImage = body.garmentImage;
    const garmentType = body.garmentType || 'upper';

    if (!personImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: personImage (user body photo).' },
        { status: 400 }
      );
    }

    if (!garmentImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: garmentImage.' },
        { status: 400 }
      );
    }

    console.log(`[API TRY-ON] Formatting images for API providers...`);
    const processedPersonImage = await getPublicUrl(personImage);
    const processedGarmentImage = await getPublicUrl(garmentImage);

    console.log(`[API TRY-ON] Person image URL: ${processedPersonImage}`);
    console.log(`[API TRY-ON] Garment image URL: ${processedGarmentImage}`);
    console.log(`[API TRY-ON] Dispatching to multi-provider orchestrator (Category: ${garmentType})...`);

    // Check which API keys are configured
    const configuredKeys = [
      process.env.HF_TOKEN ? 'HF_TOKEN' : null,
      process.env.PIAPI_KEY ? 'PIAPI_KEY' : null,
      process.env.REPLICATE_API_TOKEN ? 'REPLICATE_API_TOKEN' : null,
    ].filter(Boolean);
    console.log(`[API TRY-ON] Configured API keys: ${configuredKeys.length > 0 ? configuredKeys.join(', ') : 'NONE (simulation mode)'}`);
    
    const result = await runTryOnWithFallback({
      personImage: processedPersonImage,
      garmentImage: processedGarmentImage,
      garmentType,
    });

    console.log(`[API TRY-ON] ✓ Completed via ${result.provider} in ${result.durationMs}ms (fallback used: ${result.fallbackUsed})`);

    return NextResponse.json({
      success: true,
      resultUrl: result.resultUrl,
      provider: result.provider,
      durationMs: result.durationMs,
    });

  } catch (error: any) {
    console.error('[API TRY-ON] Route-level failure:', error?.message || error);
    console.error('[API TRY-ON] Stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during try-on processing.' },
      { status: 500 }
    );
  }
}
