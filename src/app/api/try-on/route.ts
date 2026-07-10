import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runTryOnWithFallback } from '@/lib/tryon';
import { createClient } from '@/lib/supabase/server';

// Helper to convert local relative path to base64 for cloud providers
function getLocalImageAsBase64(relativeUrl: string): string | null {
  try {
    const cleanPath = relativeUrl.startsWith('/') ? relativeUrl.slice(1) : relativeUrl;
    const absolutePath = path.join(process.cwd(), 'public', cleanPath);
    
    if (fs.existsSync(absolutePath)) {
      const fileBuffer = fs.readFileSync(absolutePath);
      const ext = path.extname(absolutePath).toLowerCase();
      let mimeType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') {
        mimeType = 'image/jpeg';
      } else if (ext === '.webp') {
        mimeType = 'image/webp';
      }
      return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.error('Error reading local image:', error);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    // 1. Enforce strict server-side API Route Protection
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('[SECURITY] Blocked unauthorized Try-On API request. No valid session found.');
      return NextResponse.json(
        { error: 'Unauthorized. You must be securely logged in to use the AI Virtual Try-On.' },
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
        { error: 'User body photo (personImage or modelImage) is required.' },
        { status: 400 }
      );
    }

    if (!garmentImage) {
      return NextResponse.json(
        { error: 'Garment image (garmentImage) is required.' },
        { status: 400 }
      );
    }

    // Process garment image: if it's a relative path, convert to server-side base64
    let processedGarmentImage = garmentImage;
    if (garmentImage.startsWith('/') && !garmentImage.startsWith('data:')) {
      const base64Garment = getLocalImageAsBase64(garmentImage);
      if (base64Garment) {
        processedGarmentImage = base64Garment;
      } else {
        return NextResponse.json(
          { error: `Garment image file not found on server: ${garmentImage}` },
          { status: 400 }
        );
      }
    }

    console.log(`[API TRY-ON] Dispatching request to multi-provider orchestrator (Garment Category: ${garmentType})...`);
    
    const result = await runTryOnWithFallback({
      personImage,
      garmentImage: processedGarmentImage,
      garmentType: garmentType,
    });

    return NextResponse.json({
      success: true,
      resultUrl: result.resultUrl,
      provider: result.provider,
      durationMs: result.durationMs,
    });

  } catch (error: any) {
    console.error('[API TRY-ON] General route failure:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong during try-on processing' },
      { status: 500 }
    );
  }
}
