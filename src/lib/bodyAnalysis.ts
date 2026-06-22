import { BodyShape } from '../data/types';

export async function analyzeBodyShape(shoulderHipRatio: number): Promise<{
  bodyShape: BodyShape;
  confidence: number;
  shoulderHipRatio: number;
  isFallback: boolean;
}> {
  // Classify body shape based on user-calibrated shoulder-to-hip ratios
  let bodyShape: BodyShape = 'rectangle';

  if (shoulderHipRatio > 1.12) {
    bodyShape = 'inverted-triangle'; // Broad shoulders, narrow hips
  } else if (shoulderHipRatio < 0.90) {
    bodyShape = 'pear'; // Hips wider than shoulders
  } else if (shoulderHipRatio >= 0.98 && shoulderHipRatio <= 1.05) {
    bodyShape = 'hourglass'; // Balanced shoulder/hip with subtle waist curve
  } else if (shoulderHipRatio >= 0.90 && shoulderHipRatio < 0.98) {
    bodyShape = 'rectangle'; // Straight athletic cut, balanced widths
  } else {
    bodyShape = 'apple'; // Rounded center
  }

  console.log(`[BODY ANALYSIS] Calibrated: ${bodyShape} (Ratio: ${shoulderHipRatio.toFixed(2)})`);

  return {
    bodyShape,
    confidence: 100,
    shoulderHipRatio: parseFloat(shoulderHipRatio.toFixed(2)),
    isFallback: false
  };
}
