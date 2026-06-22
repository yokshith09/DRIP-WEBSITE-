export interface ColorAnalysisResult {
  dominantHex: string;
  toneCategory: 'warm' | 'cool' | 'neutral';
  colorPalette: string[];
  avoidColors: string[];
}

export function analyzeSkinTone(imageElement: HTMLImageElement): ColorAnalysisResult {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2D canvas context');
    }

    // Use a small resolution for speed and average calculations
    canvas.width = 100;
    canvas.height = 100;
    
    ctx.drawImage(imageElement, 0, 0, 100, 100);

    // Sample the center region (middle of face)
    // Box of 20x20 in the exact center
    const x = 40;
    const y = 40;
    const width = 20;
    const height = 20;
    
    const imgData = ctx.getImageData(x, y, width, height);
    const data = imgData.data;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Ignore fully transparent or pure black/white pixels (e.g. background/hair check)
      if (a > 200 && !(r < 10 && g < 10 && b < 10) && !(r > 245 && g > 245 && b > 245)) {
        totalR += r;
        totalG += g;
        totalB += b;
        count++;
      }
    }

    // Default averages if no pixels passed filter
    const avgR = count > 0 ? Math.round(totalR / count) : 210;
    const avgG = count > 0 ? Math.round(totalG / count) : 180;
    const avgB = count > 0 ? Math.round(totalB / count) : 155;

    const dominantHex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

    // Skin undertone classification using RGB ratios:
    // Warm tones have higher red/yellow dominance (Red > Green > Blue) and higher Red-to-Blue ratio.
    // Cool tones have less extreme Red-to-Blue difference or closer blue levels.
    const rRatio = avgR / (avgB || 1);
    const gRatio = avgG / (avgB || 1);
    
    let toneCategory: 'warm' | 'cool' | 'neutral' = 'neutral';
    
    if (rRatio > 1.35 && gRatio > 1.1) {
      toneCategory = 'warm'; // Peachy/golden undertones
    } else if (rRatio < 1.25) {
      toneCategory = 'cool'; // Pinkish/cool undertones
    } else {
      toneCategory = 'neutral'; // Balanced undertone
    }

    // Professional color palettes based on season & undertone
    let colorPalette: string[] = [];
    let avoidColors: string[] = [];

    switch (toneCategory) {
      case 'warm':
        colorPalette = ['Terracotta', 'Olive Green', 'Mustard Gold', 'Sage Green', 'Warm Beige', 'Rust Orange', 'Cream'];
        avoidColors = ['Icy Blue', 'Stark White', 'Cool Grey', 'Magenta', 'Electric Purple'];
        break;
      case 'cool':
        colorPalette = ['Sapphire Blue', 'Emerald Green', 'Royal Violet', 'Lavender', 'Cool Grey', 'Magenta', 'Stark White'];
        avoidColors = ['Mustard Yellow', 'Rust Orange', 'Warm Peach', 'Olive Gold', 'Cream'];
        break;
      case 'neutral':
        colorPalette = ['Emerald Green', 'Dusty Rose', 'Plum Purple', 'Navy Blue', 'Charcoal', 'Teal', 'Off-White'];
        avoidColors = ['Neon Yellow', 'Stark Orange', 'Lime Green'];
        break;
    }

    return {
      dominantHex,
      toneCategory,
      colorPalette,
      avoidColors
    };

  } catch (error) {
    console.error('[COLOR ANALYSIS] Failed skin tone evaluation, using neutral fallback:', error);
    // Safe standard neutral fallback
    return {
      dominantHex: '#D8B598', // Standard neutral fawn hex
      toneCategory: 'neutral',
      colorPalette: ['Emerald Green', 'Dusty Rose', 'Navy Blue', 'Charcoal', 'Off-White'],
      avoidColors: ['Neon Yellow', 'Stark Orange']
    };
  }
}
