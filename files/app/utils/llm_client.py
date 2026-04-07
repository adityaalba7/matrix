import httpx
from groq import Groq
from app.config import settings

def _ask_groq(prompt: str, system: str = "") -> str:
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is not configured.")
    
    client = Groq(api_key=settings.groq_api_key)
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile", 
    )
    return chat_completion.choices[0].message.content

def _ask_gemini(prompt: str, system: str = "") -> str:
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={settings.gemini_api_key}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    if system:
        payload["systemInstruction"] = {
            "parts": [{"text": system}]
        }

    with httpx.Client() as client:
        response = client.post(url, json=payload, timeout=30.0)
        response.raise_for_status()
        data = response.json()
        
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            return "Error: Unexpected response format from Gemini."

def ask_llm(prompt: str, system: str = "", provider: str = "groq") -> str:
    """
    Routes the LLM request to the specialized provider.
    - 'groq': Blazing fast, great for rapid generation.
    - 'gemini': Large context, great for deep reasoning.
    """
    if provider == "groq":
        return _ask_groq(prompt, system)
    elif provider == "gemini":
        return _ask_gemini(prompt, system)
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
