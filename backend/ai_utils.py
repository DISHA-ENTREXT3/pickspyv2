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

def analyze_with_perplexity(product_name, price, region):
    """Primary analysis using Perplexity (Llama 3.1 with live browsing)"""
    if not OPENROUTER_API_KEY:
        return None
        
    prompt = f"""
    SEARCH THE LIVE WEB for the actual product: "{product_name}".
    Find its full official name, real-time demand, and a high-quality direct image URL.
    Target Price: {price}
    Target Region: {region}

    Provide a JSON response with the following structure:
    {{
      "actualFullName": "string (The real official product name found)",
      "realImageUrl": "string (Direct link to a high-res product image found on the web)",
      "viabilityScore": number (0-100),
      "recommendation": "dropship" | "white-label" | "skip",
      "topRisks": [{{"risk": "string", "severity": "high"|"medium"|"low"}}],
      "suggestions": [{{"type": "string", "suggestion": "string"}}],
      "reasoning": "string (Explain based on live data found)"
    }}
    
    Be critical and realistic. Return ONLY the JSON.
    """
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "perplexity/llama-3.1-sonar-large-128k-online",
                "messages": [{"role": "user", content: prompt}],
                "temperature": 0.1
            },
            timeout=30 # Longer timeout for browsing
        )
        if response.status_code == 200:
            data = response.json()
            content = data['choices'][0]['message']['content']
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
    except Exception as e:
        print(f"⚠️ Perplexity analysis failed: {e}")
    return None

def analyze_with_gemini(product_name, price, region):
    """Secondary analysis using Google Gemini"""
    if not GEMINI_API_KEY:
        return None
        
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Analyze e-commerce viability for: {product_name}
        Price: {price}
        Region: {region}

        Return JSON:
        {{
          "actualFullName": "{product_name}",
          "viabilityScore": number,
          "recommendation": "string",
          "topRisks": [],
          "suggestions": [],
          "reasoning": "string"
        }}
        """
        response = model.generate_content(prompt)
        text = response.text
        import re
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        print(f"⚠️ Gemini analysis failed: {e}")
    return None

def analyze_with_openrouter(product_name, price, region):
    """Generic OpenRouter Fallback"""
    if not OPENROUTER_API_KEY:
        return None
        
    prompt = f"Analyze product viability for {product_name} at {price} in {region}. Return JSON."
    
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
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
    except Exception as e:
        print(f"⚠️ OpenRouter fallback failed: {e}")
    return None

def get_ai_analysis(product_name, price, region):
    """Orchestrate AI analysis with layers of fallback"""
    # 1. Try Perplexity first (Powerful Browsing + Image Discovery)
    print(f"🤖 AI Analysis Layer 1: Perplexity Sonar for {product_name}")
    result = analyze_with_perplexity(product_name, price, region)
    if result: return result
    
    # 2. Try Gemini second
    print(f"🤖 AI Analysis Layer 2: Gemini for {product_name}")
    result = analyze_with_gemini(product_name, price, region)
    if result: return result
    
    # 3. Try standard OpenRouter (any model)
    print(f"🤖 AI Analysis Layer 3: OpenRouter Fallback for {product_name}")
    result = analyze_with_openrouter(product_name, price, region)
    if result: return result
    
    # Final Layer
    return {
        "actualFullName": product_name,
        "viabilityScore": 60,
        "recommendation": "skip",
        "topRisks": [{"risk": "Connection failure", "severity": "high"}],
        "suggestions": [{"type": "angle", "suggestion": "Try again later"}],
        "reasoning": "AI layers failed. Please check connectivity."
    }
