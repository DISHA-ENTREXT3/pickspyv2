import os
import json
import requests
import re

POLLINATIONS_API_KEY = os.environ.get("POLLINATIONS_API_KEY") # User will integrate this later
AI_MODEL = "gemini" # Dedicated model for Gemini 2.5 Flash Lite on Pollinations.ai

def analyze_with_pollinations(product_name, price, region):
    """
    Primary analysis using Pollinations.ai (Google Gemini 2.5 Flash Lite)
    Optimized for ultra-low latency and live-ready performance.
    """
    prompt = f"""
    Analyze e-commerce viability for the product: "{product_name}".
    Target Price: {price}
    Target Region: {region}

    Provide a JSON response with the following structure:
    {{
      "actualFullName": "string (The real official product name found)",
      "viabilityScore": number (0-100),
      "recommendation": "dropship" | "white-label" | "skip",
      "topRisks": [{{"risk": "string", "severity": "high"|"medium"|"low"}}],
      "suggestions": [{{"type": "string", "suggestion": "string"}}],
      "reasoning": "string (Explain based on market data for {region})"
    }}
    
    Be critical and realistic. Return ONLY the JSON.
    """
    
    headers = {"Content-Type": "application/json"}
    if POLLINATIONS_API_KEY:
        headers["Authorization"] = f"Bearer {POLLINATIONS_API_KEY}"

    try:
        # Pollinations.ai OpenAI-compatible endpoint
        response = requests.post(
            "https://text.pollinations.ai/",
            headers=headers,
            json={
                "model": AI_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a professional e-commerce market analyst."},
                    {"role": "user", "content": prompt}
                ],
                "jsonMode": True
            },
            timeout=20
        )
        
        if response.status_code == 200:
            content = response.text
            # Clean up potential markdown formatting if jsonMode is not perfectly respected
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(content)
            
    except Exception as e:
        print(f"⚠️ Pollinations.ai analysis failed: {e}")
    return None

def analyze_with_gemini(product_name, price, region):
    """Fallback to direct Gemini if available (Legacy Support)"""
    try:
        import google.generativeai as genai
        GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
        if not GEMINI_API_KEY:
            return None
            
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash') # Updated to latest flash
        prompt = f"Analyze product viability for {product_name} at {price} in {region}. Return JSON."
        response = model.generate_content(prompt)
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        print(f"⚠️ Direct Gemini fallback failed: {e}")
    return None

def get_ai_analysis(product_name, price, region):
    """Orchestrate AI analysis with Pollinations.ai as primary"""
    print(f"🤖 AI Analysis: Pollinations.ai (Gemini 2.5 Flash Lite) for {product_name}")
    
    # 1. Primary: Pollinations.ai
    result = analyze_with_pollinations(product_name, price, region)
    if result: return result
    
    # 2. Secondary: Direct Gemini Fallback
    print(f"🤖 AI Fallback: Direct Gemini for {product_name}")
    result = analyze_with_gemini(product_name, price, region)
    if result: return result
    
    # Final Layer
    return {
        "actualFullName": product_name,
        "viabilityScore": 60,
        "recommendation": "skip",
        "topRisks": [{"risk": "AI Service Unavailable", "severity": "high"}],
        "suggestions": [{"type": "system", "suggestion": "Check Pollinations.ai / Gemini status"}],
        "reasoning": "AI layers failed to provide real-time analysis data."
    }

