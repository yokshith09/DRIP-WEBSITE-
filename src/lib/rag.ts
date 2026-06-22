import { Product, StyleDNA } from '../data/types';
import { PRODUCTS } from '../data/products';
import { scoreProduct } from './productMatcher';

// Common English stopwords to filter out from query matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'cant', 'cannot', 'could', 'couldnt',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows',
  'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself',
  'lets',
  'me', 'more', 'most', 'mustnt', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such',
  'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt',
  'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves',
  'suggest', 'recommend', 'show', 'find', 'buy', 'get', 'need', 'want', 'looking', 'please'
]);

/**
 * Parses a query into clean search terms.
 */
function getSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 1 && !STOP_WORDS.has(term));
}

/**
 * Retrieves the most relevant products using RAG logic.
 * Combines keyword relevance score and Style DNA compatibility score.
 */
const OUTFIT_TRIGGERS = [
  'outfit', 'look', 'style', 'wear', 'theme', 'casual', 'formal', 'party', 
  'wedding', 'beach', 'summer', 'winter', 'office', 'vibe', 'suit', 
  'pairing', 'combination', 'wardrobe', 'dress up', 'matching', 'fitting'
];

const TOP_SUBCATEGORIES = new Set([
  'shirts', 'polos', 't-shirts', 'tops', 'kurtas', 'bodysuits', 'dresses'
]);

const BOTTOM_SUBCATEGORIES = new Set([
  'pants', 'jeans', 'shorts', 'cargos', 'skirts'
]);

function isOutfitRequest(query: string): boolean {
  const lower = query.toLowerCase();
  return OUTFIT_TRIGGERS.some(trigger => lower.includes(trigger));
}

/**
 * Retrieves the most relevant products using RAG logic.
 * Combines keyword relevance score and Style DNA compatibility score.
 */
export function retrieveProducts(query: string, dna: StyleDNA, limit: number = 8): Product[] {
  const terms = getSearchTerms(query);
  
  // If no descriptive terms were extracted, return top matches based purely on Style DNA
  if (terms.length === 0) {
    const scored = PRODUCTS
      .map(p => ({
        product: p,
        score: scoreProduct(p, dna)
      }))
      .sort((a, b) => b.score - a.score);

    if (isOutfitRequest(query)) {
      const tops: Product[] = [];
      const bottoms: Product[] = [];
      const others: Product[] = [];

      for (const item of scored) {
        const sub = (item.product.subcategory || '').toLowerCase();
        if (TOP_SUBCATEGORIES.has(sub)) {
          tops.push(item.product);
        } else if (BOTTOM_SUBCATEGORIES.has(sub)) {
          bottoms.push(item.product);
        } else {
          others.push(item.product);
        }
      }

      const result: Product[] = [];
      result.push(...tops.slice(0, 3));
      result.push(...bottoms.slice(0, 3));
      result.push(...others.slice(0, 2));

      if (result.length < limit) {
        const existingIds = new Set(result.map(p => p.id));
        for (const item of scored) {
          if (!existingIds.has(item.product.id)) {
            result.push(item.product);
            if (result.length >= limit) break;
          }
        }
      }
      return result.slice(0, limit);
    }

    return scored.slice(0, limit).map(item => item.product);
  }

  const scoredProducts = PRODUCTS.map(product => {
    let keywordScore = 0;
    
    const nameLower = product.name.toLowerCase();
    const brandLower = product.brand.toLowerCase();
    const categoryLower = product.category.toLowerCase();
    const subcategoryLower = product.subcategory.toLowerCase();
    const materialLower = product.material?.toLowerCase() || '';
    const fitLower = product.fit?.toLowerCase() || '';
    
    // Match terms against various product fields
    terms.forEach(term => {
      // Direct matches in high-value fields get higher weights
      if (subcategoryLower.includes(term)) keywordScore += 10;
      if (nameLower.includes(term)) keywordScore += 8;
      if (brandLower.includes(term)) keywordScore += 6;
      if (categoryLower.includes(term)) keywordScore += 5;
      
      // Secondary fields
      if (materialLower.includes(term)) keywordScore += 3;
      if (fitLower.includes(term)) keywordScore += 3;
      
      // Tags
      if (product.tags) {
        product.tags.forEach(tag => {
          if (tag.toLowerCase().includes(term)) {
            keywordScore += 4;
          }
        });
      }
      
      // Colors
      if (product.colors) {
        product.colors.forEach(color => {
          if (color.toLowerCase().includes(term)) {
            keywordScore += 4;
          }
        });
      }
    });

    // Compute Style DNA score
    const dnaScore = scoreProduct(product, dna);

    // Final combined score: keyword relevance (scaled) + DNA score
    // If a product doesn't match search terms at all, penalize its keyword score heavily
    const finalScore = (keywordScore > 0 ? keywordScore * 5 : -50) + dnaScore;

    return {
      product,
      finalScore
    };
  });

  // Sort by highest score first
  const sortedScored = scoredProducts.sort((a, b) => b.finalScore - a.finalScore);

  if (isOutfitRequest(query)) {
    const tops: Product[] = [];
    const bottoms: Product[] = [];
    const others: Product[] = [];

    for (const item of sortedScored) {
      const sub = (item.product.subcategory || '').toLowerCase();
      if (TOP_SUBCATEGORIES.has(sub)) {
        tops.push(item.product);
      } else if (BOTTOM_SUBCATEGORIES.has(sub)) {
        bottoms.push(item.product);
      } else {
        others.push(item.product);
      }
    }

    const result: Product[] = [];
    result.push(...tops.slice(0, 3));
    result.push(...bottoms.slice(0, 3));
    result.push(...others.slice(0, 2));

    if (result.length < limit) {
      const existingIds = new Set(result.map(p => p.id));
      for (const item of sortedScored) {
        if (!existingIds.has(item.product.id)) {
          result.push(item.product);
          if (result.length >= limit) break;
        }
      }
    }
    return result.slice(0, limit);
  }

  // Sort and select top items overall
  return sortedScored.slice(0, limit).map(item => item.product);
}
