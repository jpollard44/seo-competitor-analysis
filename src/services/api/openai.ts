import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export const getOpenAIInstance = (apiKey: string): OpenAI => {
  if (!openaiInstance || openaiInstance.apiKey !== apiKey) {
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
    });
  }
  return openaiInstance;
};

export const generateAnalysis = async (
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  try {
    const openai = getOpenAIInstance(apiKey);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Use the appropriate model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    
    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 