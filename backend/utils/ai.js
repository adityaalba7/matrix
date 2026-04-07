import 'dotenv/config';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

/**
 * Universal Dual-Provider AI function (Groq primary, Cohere fallback).
 * Set format_json=true to force JSON output (ensure your prompt asks for JSON).
 */
export const askAI = async (prompt, systemInstruction = '', format_json = false) => {
  // Try Groq first
  if (GROQ_API_KEY) {
    try {
      const payload = {
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      };

      if (format_json) {
        payload.response_format = { type: 'json_object' };
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch (e) {
      console.error('[Groq fallthrough]', e.message);
    }
  }
  
  // Fallback to Cohere Trial
  if (COHERE_API_KEY) {
    try {
      const response = await fetch('https://api.cohere.com/v1/chat', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'accept': 'application/json'
        }, 
        body: JSON.stringify({
          model: 'command-r-plus',
          message: prompt,
          preamble: systemInstruction || undefined,
          // Cohere supports response_format for JSON in command-r-plus
          ...(format_json && { response_format: { type: 'json_object' } })
        }) 
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cohere API ${response.status}: ${errText}`);
      }
      
      const data = await response.json();
      return data.text?.trim() || '';
    } catch (e) {
      console.error('[Cohere fallthrough]', e.message);
    }
  }
  
  throw new Error('No AI provider available (Groq & Cohere exhausted)');
};
