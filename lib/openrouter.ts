const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// Add more detailed logging
console.log("OpenRouter initialization:", {
  isProduction: process.env.NODE_ENV === 'production',
  hasApiKey: !!DEEPSEEK_API_KEY,
  keyPrefix: DEEPSEEK_API_KEY?.substring(0, 4) // Only log first 4 chars for security
});

if (!DEEPSEEK_API_KEY) {
  console.error("DeepSeek API key is missing. Please check your environment variables.");
}

export async function generateChatCompletion(
  messages: { role: string; content: string }[],
  onStream?: (chunk: string) => void
) {
  // Add request logging
  console.log("Attempting API call:", {
    hasMessages: messages.length > 0,
    apiKeyStatus: DEEPSEEK_API_KEY ? 'Present' : 'Missing',
    endpoint: 'https://api.deepseek.com/v1/chat/completions'
  });

  console.log("Messages:", messages);
  console.log("API Key Status:", DEEPSEEK_API_KEY ? "Present" : "Missing");

  if (!DEEPSEEK_API_KEY) {
    return "I apologize, but I'm currently running in limited mode without AI capabilities. The administrator needs to configure the DeepSeek API key to enable advanced AI features.";
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`DeepSeek API Error: ${response.status} ${response.statusText}. ${errorBody}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from DeepSeek API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw error;
  }
}