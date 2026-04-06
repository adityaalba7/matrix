from groq import Groq
from app.config import settings

def ask_gemini(prompt: str, system: str = "") -> str:
    """
    LLM wrapper. Originally for Gemini, now hooked into Groq
    to satisfy the user's requirement.
    """
    client = Groq(api_key=settings.groq_api_key)
    
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile", # Defaulting to a high-quality model
    )

    return chat_completion.choices[0].message.content
