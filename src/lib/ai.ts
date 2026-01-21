import { HfInference } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

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
  if (!HUGGINGFACE_API_KEY) {
    console.warn("Missing VITE_HUGGINGFACE_API_KEY. Using mock data.");
    return getMockAnalysis();
  }

  const hf = new HfInference(HUGGINGFACE_API_KEY);

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
    const result = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        return_full_text: false,
        temperature: 0.7,
      },
    });

    // Attempt to parse JSON from the response
    const jsonStr = result.generated_text.match(/\{[\s\S]*\}/)?.[0];
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
