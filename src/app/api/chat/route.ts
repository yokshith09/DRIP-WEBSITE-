import { NextResponse } from 'next/server';
import { retrieveProducts } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const { messages, styleDNA } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY environment variable is not configured. Please set the Groq API key in your .env or .env.local file.' },
        { status: 500 }
      );
    }

    // Extract the latest query from user messages to fetch relevant items
    const userMessages = messages.filter((m: any) => m.sender === 'user' || m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    const query = lastUserMessage ? (lastUserMessage.text || lastUserMessage.content || '') : '';

    // Retrieve the top 8 products based on search query keywords and Style DNA matching (RAG)
    const retrievedProducts = retrieveProducts(query, styleDNA || {}, 8);

    // Standardize catalog metadata for LLM context efficiency
    const compactCatalog = retrievedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      priceNumber: p.priceNumber,
      fit: p.fit,
      material: p.material,
      tags: p.tags,
      bodyShapeSuitable: p.bodyShapeSuitable,
      skinToneSuitable: p.skinToneSuitable,
    }));

    // Inject StyleDNA context if provided
    let styleDNAContext = 'No Style DNA profile available yet. Guide the user to take the style DNA test in the Profile page or offer to help them find their style.';
    if (styleDNA && styleDNA.completedOnboarding) {
      styleDNAContext = `User Style DNA Profile:
- Body Shape: ${styleDNA.bodyShape || 'Not analyzed'}
- Height: ${styleDNA.height ? `${styleDNA.height} cm` : 'Not specified'}
- Fit Preference: ${styleDNA.fitPreference || 'Regular'}
- Skin Tone: ${styleDNA.skinTone || 'Not analyzed'} (Category: ${styleDNA.skinToneCategory || 'Neutral'})
- Recommended Palette: ${styleDNA.colorPalette ? styleDNA.colorPalette.join(', ') : 'Not specified'}
- Avoid Colors: ${styleDNA.avoidColors ? styleDNA.avoidColors.join(', ') : 'None'}
- Style Vibe: ${styleDNA.styleVibe || 'Minimalist'}
- Preferred Occasions: ${styleDNA.occasions ? styleDNA.occasions.join(', ') : 'Casual'}
- Budget Range: ₹${styleDNA.budgetRange ? styleDNA.budgetRange[0] : 1000} - ₹${styleDNA.budgetRange ? styleDNA.budgetRange[1] : 15000}
- Liked Products: ${styleDNA.likedProducts ? styleDNA.likedProducts.join(', ') : 'None'}
- Disliked Products: ${styleDNA.dislikedProducts ? styleDNA.dislikedProducts.join(', ') : 'None'}

CRITICAL: Keep these parameters in mind! Make sure you suggest products that fit their budget range, match their body shape suitability, match their style vibe, and are in their recommended color palette. Proactively mention WHY these products are perfect for their body shape (${styleDNA.bodyShape}) or skin tone!`;
    }

    const SYSTEM_INSTRUCTION = `You are a sophisticated, professional AI fashion stylist and consultant for "DRIP", a premium digital fashion destination.
Your tone is confident, editorial, knowledgeable, slightly avant-garde, and friendly. You provide expert-level fashion consultations.

Here is the DRIP Curated Catalog (retrieved dynamically based on user's query and style preferences):
${JSON.stringify(compactCatalog, null, 2)}

Here is the current shopper's profile:
${styleDNAContext}

Guidelines for interaction:
1. Recommend actual products from the provided DRIP Curated Catalog. Always reference them by name and brand.
2. Provide concrete styling advice (e.g. "Pair this Oxford Cotton Shirt with Chinos and Chelsea boots for an effortless smart-casual look").
3. IMPORTANT: When you suggest/recommend products, you MUST append a recommendation token at the end of your advice or paragraph in this format: [RECOMMEND: id1, id2] where "id1", "id2" are the exact product IDs from the catalog (e.g. [RECOMMEND: m1, a5]). This token is consumed by the UI to render beautiful interactive product cards. Do not make up IDs; only use real IDs from the catalog.
4. Keep your responses concise, visually structured (using markdown headers, bold text, bullet points), and highly fashion-forward.
5. If the user asks about virtual try-on, encourage them to click the "Try-On" button on any product details page or click the AI Fitting Room icon.
6. Speak in Indian context where appropriate (pricing in rupees, occasions like weddings, festivals, office-wear).
7. SUGGEST COORDINATED OUTFITS: When suggesting outfits, style recommendations, or looks, bundle items together into complete ensembles (e.g. Top + Bottom + Footwear + Accessory/Layer). Clearly structure each recommended look, explain why the items pair well together, why they fit the user's specific Style DNA profile, and add the recommendation token [RECOMMEND: top_id, bottom_id, foot_id] right below each look to display them as card collections.`;

    // Map message history to Groq/OpenAI compatible format
    const groqMessages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
        content: m.text || m.content || '',
      }))
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || 'Failed to call Groq API');
    }

    // Set up SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('data: ')) {
                const dataStr = trimmedLine.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(dataStr);
                  const deltaText = parsed.choices?.[0]?.delta?.content || '';
                  if (deltaText) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: deltaText })}\n\n`));
                  }
                } catch (e) {
                  // Partial JSON chunk
                }
              }
            }
          }
        } catch (e: any) {
          console.error('Groq Stream parsing error:', e);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e.message || 'Stream error occurred' })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Groq API General Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong while connecting to the AI service' },
      { status: 500 }
    );
  }
}
