import { SITEWHISPER_IDENTITY, getSystemPrompt } from './sitewhisper-identity';

const AI_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
const MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;

// Add more detailed logging
console.log("AI Service initialization:", {
  isProduction: process.env.NODE_ENV === 'production',
  hasDeepSeekKey: !!AI_API_KEY,
  hasAnthropicKey: !!ANTHROPIC_API_KEY,
  hasMistralKey: !!MISTRAL_API_KEY,
});

// Use the comprehensive system prompt
const SYSTEM_PROMPT = getSystemPrompt();

export async function generateAICompletion(
  messages: { role: string; content: string }[],
  model: 'deepseek' | 'claude' | 'mistral' = 'deepseek'
) {
  try {
    let response;
    
    switch (model) {
      case 'claude':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY!,
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            messages,
            system: SYSTEM_PROMPT,
          }),
        });
        break;
      
      case 'mistral':
        response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistral-large-latest',
            messages,
            system: SYSTEM_PROMPT,
          }),
        });
        break;
      
      default: // deepseek
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages,
            system: SYSTEM_PROMPT,
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });
    }

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
} 