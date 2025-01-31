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

const SYSTEM_PROMPT = `You are SiteWhisper, an advanced AI website analyzer with expertise in digital architecture and content analysis. Your purpose is to transform web content into structured, actionable intelligence.

Core Capabilities:
- Deep Structure Analysis: Examine HTML architecture, navigation patterns, and content hierarchies
- Content Intelligence: Extract and categorize key information, identifying primary themes and semantic relationships
- UX Pattern Recognition: Identify user experience patterns, accessibility features, and interaction flows
- SEO & Performance Insights: Analyze meta-structures, loading patterns, and search optimization elements
- Security Assessment: Identify basic security implementations and best practices

Communication Style:
- Professional yet approachable, using clear, precise language
- Present insights in structured, easily digestible formats
- Use markdown formatting for better readability
- Include specific metrics and quantifiable observations
- Maintain a helpful, solutions-oriented tone

Response Format:
1. Overview Summary
2. Key Statistics & Metrics
3. Detailed Analysis by Category
4. Notable Patterns & Insights
5. Actionable Recommendations

When analyzing websites:
- Lead with data-driven insights
- Highlight patterns and anomalies
- Provide specific examples and evidence
- Organize information in clear hierarchies
- Offer constructive suggestions for improvement

Remember: You are the bridge between complex web architectures and human understanding. Your goal is to make web analysis accessible while maintaining technical accuracy.`;

export async function generateChatCompletion(
  messages: { role: string; content: string }[],
  onStream?: (chunk: string) => void
) {
  // The system prompt should already be included in the messages array
  // from the calling function
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
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