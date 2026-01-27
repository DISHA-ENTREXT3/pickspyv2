const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || "openai/gpt-4o-mini";

export interface AIAnalysisResult {
  viabilityScore: number;
  recommendation: 'dropship' | 'white-label' | 'skip';
  topRisks: { risk: string; severity: 'high' | 'medium' | 'low' }[];
  suggestions: { type: 'price' | 'angle' | 'feature' | 'audience'; suggestion: string }[];
  reasoning: string;
}

export const analyzeProductWithAI = async (
  productName: string,
  price: string,
  region: string
): Promise<AIAnalysisResult> => {
  if (!OPENROUTER_API_KEY) {
    console.info("ℹ️ OpenRouter API key not configured. Using demonstration data.");
    return getMockAnalysis();
  }

  const prompt = `
    Analyze the following product for e-commerce viability:
    Product: ${productName}
    Target Price: ${price}
    Target Region: ${region}

    Provide a JSON response with the following structure:
    {
      "viabilityScore": number (0-100),
      "recommendation": "dropship" | "white-label" | "skip",
      "topRisks": [{"risk": "string", "severity": "high"|"medium"|"low"}],
      "suggestions": [{"type": "string", "suggestion": "string"}],
      "reasoning": "string"
    }
    
    Be critical and realistic.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://pickspy.entrext.in", // Optional, for OpenRouter rankings
        "X-Title": "PickSpy", // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.choices[0].message.content || "";
    
    // Attempt to parse JSON from the response
    const jsonStr = generatedText.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) {
      return JSON.parse(jsonStr);
    } else {
      throw new Error("Failed to parse JSON from AI response");
    }
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return getMockAnalysis();
  }
};

const getMockAnalysis = (): AIAnalysisResult => ({
  viabilityScore: 73,
  recommendation: 'dropship',
  topRisks: [
    { risk: 'High competition from established sellers in Q4', severity: 'high' },
    { risk: 'Seasonal demand peaks may require inventory planning', severity: 'medium' },
    { risk: 'Shipping weight affects margins at the target price point', severity: 'medium' },
  ],
  suggestions: [
    { type: 'price', suggestion: 'Consider increasing price for sustainable margins' },
    { type: 'angle', suggestion: 'Position as a problem-solver rather than a generic item' },
    { type: 'audience', suggestion: 'Target specific niches rather than general audience' },
  ],
  reasoning: 'AI analysis service is currently unavailable or key is missing. Showing demonstration data. Real analysis would evaluate competition, trends, and profitability based on live data.',
});
