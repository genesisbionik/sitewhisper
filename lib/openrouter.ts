const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

export async function generateChatCompletion(messages: { role: string; content: string }[]) {
  console.log("Message",messages)
  console.log(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,"OPEN ROUTERRR")
  if (!OPENROUTER_API_KEY) {
    return "I apologize, but I'm currently running in limited mode without AI capabilities. The administrator needs to configure the OpenRouter API key to enable advanced AI features."
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://sitewhisper.com',
        'X-Title': 'SiteWhisper'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: messages,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Failed to generate chat completion: ${response.status} ${response.statusText}. ${errorBody}`)
    }

    const data = await response.json()
    console.log(data)
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenRouter API')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw error // Re-throw the error to be handled by the caller
  }
}

