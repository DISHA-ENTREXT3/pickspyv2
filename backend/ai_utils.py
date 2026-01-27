import os
import json
import google.generativeai as genai
import requests

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
AI_MODEL = os.environ.get("AI_MODEL", "openai/gpt-4o-mini")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_with_openrouter(product_name, price, region):
    """Fallback to OpenRouter if configured"""
    if not OPENROUTER_API_KEY:
        return None
        
    prompt = f"""
    Analyze the following product for e-commerce viability:
    Product: {product_name}
    Target Price: {price}
    Target Region: {region}

    Provide a JSON response with the following structure:
    {{
      "viabilityScore": number (0-100),
      "recommendation": "dropship" | "white-label" | "skip",
      "topRisks": [{{"risk": "string", "severity": "high"|"medium"|"low"}}],
      "suggestions": [{{"type": "string", "suggestion": "string"}}],
      "reasoning": "string"
    }}
    
    Be critical and realistic.
    """
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": AI_MODEL,
                "messages": [{"role": "user", content: prompt}],
                "temperature": 0.7
            },
            timeout=15
        )
        if response.status_code == 200:
            data = response.json()
            content = data['choices'][0]['message']['content']
            # Extract JSON
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
    except Exception as e:
        print(f"⚠️ OpenRouter analysis failed: {e}")
    return None

def analyze_with_gemini(product_name, price, region):
    """Primary analysis using Google Gemini"""
    if not GEMINI_API_KEY:
        return None
        
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Analyze the following product for e-commerce viability:
        Product: {product_name}
        Target Price: {price}
        Target Region: {region}

        Provide a JSON response with the following structure:
        {{
          "viabilityScore": number (0-100),
          "recommendation": "dropship" | "white-label" | "skip",
          "topRisks": [{{"risk": "string", "severity": "high"|"medium"|"low"}}],
          "suggestions": [{{"type": "string", "suggestion": "string"}}],
          "reasoning": "string"
        }}
        
        Be critical and realistic. Return ONLY the JSON.
        """
        
        response = model.generate_content(prompt)
        text = response.text
        
        # Clean markdown if present
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"⚠️ Gemini analysis failed: {e}")
    return None

def get_ai_analysis(product_name, price, region):
    """Orchestrate AI analysis with layers of fallback"""
    # 1. Try Gemini first (as requested)
    print(f"🤖 AI Analysis Layer 1: Gemini for {product_name}")
    result = analyze_with_gemini(product_name, price, region)
    if result: return result
    
    # 2. Try OpenRouter second
    print(f"🤖 AI Analysis Layer 2: OpenRouter for {product_name}")
    result = analyze_with_openrouter(product_name, price, region)
    if result: return result
    
    # 3. Final Mock Fallback
    print(f"🤖 AI Analysis Layer 3: Mock Fallback for {product_name}")
    return {
        "viabilityScore": 65,
        "recommendation": "dropship",
        "topRisks": [
            {"risk": "Data connectivity issue", "severity": "high"},
            {"risk": "General market saturation", "severity": "medium"}
        ],
        "suggestions": [
            {"type": "angle", "suggestion": "Refresh your API keys to get live analysis"}
        ],
        "reasoning": "AI layers failed to respond. Showing baseline analysis based on typical market performance."
    }
