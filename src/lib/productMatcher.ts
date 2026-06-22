import { Product, StyleDNA } from '../data/types';

/**
 * Scores a product's match against the user's Style DNA profile.
 * Returns a score between 0 and 100 representing suitability.
 */
export function scoreProduct(product: Product, dna: StyleDNA): number {
  // If onboarding is not completed, return a default match score (e.g., based on fallback parameters)
  if (!dna || !dna.completedOnboarding) {
    // Return a base match score with a slight random variation to feel alive, but constant per product
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 85 + (hash % 11); // Scores between 85% and 95%
  }

  let score = 0;
  let maxWeight = 0;

  // 1. BODY SHAPE MATCHING (Weight: 30)
  const bodyShapeWeight = 30;
  maxWeight += bodyShapeWeight;
  if (dna.bodyShape && product.bodyShapeSuitable) {
    if (product.bodyShapeSuitable.includes(dna.bodyShape)) {
      score += bodyShapeWeight;
    } else {
      // Small penalty, but still eligible
      score += bodyShapeWeight * 0.4;
    }
  } else {
    // If not specified, add neutral credit
    score += bodyShapeWeight * 0.8;
  }

  // 2. SKIN TONE & PALETTE MATCHING (Weight: 25)
  const colorWeight = 25;
  maxWeight += colorWeight;
  if (dna.skinToneCategory && product.skinToneSuitable) {
    if (product.skinToneSuitable.includes(dna.skinToneCategory)) {
      score += colorWeight;
    } else {
      score += colorWeight * 0.3;
    }
  } else {
    score += colorWeight * 0.8;
  }

  // 3. STYLE VIBE OVERLAP (Weight: 20)
  const vibeWeight = 20;
  maxWeight += vibeWeight;
  if (dna.styleVibe && product.tags) {
    const vibeTag = dna.styleVibe.toLowerCase();
    const hasVibe = product.tags.some(tag => tag.toLowerCase() === vibeTag);
    if (hasVibe) {
      score += vibeWeight;
    } else {
      score += vibeWeight * 0.5; // partial credit for matching general aesthetic
    }
  } else {
    score += vibeWeight * 0.8;
  }

  // 4. BUDGET FIT (Weight: 15)
  const budgetWeight = 15;
  maxWeight += budgetWeight;
  if (dna.budgetRange) {
    const [minBudget, maxBudget] = dna.budgetRange;
    const price = product.priceNumber;
    
    if (price >= minBudget && price <= maxBudget) {
      score += budgetWeight;
    } else if (price < minBudget) {
      score += budgetWeight * 0.9; // Bargain items are mostly fine
    } else {
      // Over budget scaling penalty
      const overpct = (price - maxBudget) / maxBudget;
      const penalty = Math.min(budgetWeight, overpct * 10);
      score += Math.max(0, budgetWeight - penalty);
    }
  } else {
    score += budgetWeight * 0.9;
  }

  // 5. FIT PREFERENCE (Weight: 10)
  const fitWeight = 10;
  maxWeight += fitWeight;
  if (dna.fitPreference && product.fit) {
    const pref = dna.fitPreference.toLowerCase();
    const prodFit = product.fit.toLowerCase();
    
    if (prodFit.includes(pref) || pref.includes(prodFit)) {
      score += fitWeight;
    } else {
      score += fitWeight * 0.6;
    }
  } else {
    score += fitWeight * 0.9;
  }

  // Normalize to 0-100 range
  const finalScore = maxWeight > 0 ? (score / maxWeight) * 100 : 90;
  return Math.round(Math.max(50, Math.min(100, finalScore)));
}

/**
 * Returns products sorted by their compatibility score.
 */
export function getTopMatches(products: Product[], dna: StyleDNA, limit: number = 10): (Product & { matchScore: number })[] {
  return products
    .map(p => ({
      ...p,
      matchScore: scoreProduct(p, dna)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
