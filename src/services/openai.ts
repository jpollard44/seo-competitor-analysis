import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: For production, calls should go through your backend
});

export const analyzeSEOWithAI = async (url: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO analyst. Analyze websites and provide detailed, actionable recommendations. 
          Focus on these key areas:
          1. Technical SEO
          2. Content Strategy
          3. On-page Optimization
          4. User Experience
          5. Mobile Optimization
          Format your response in clear sections with bullet points.`
        },
        {
          role: "user",
          content: `Perform a comprehensive SEO analysis for: ${url}
          
          Please include:
          - Technical SEO audit points
          - Content improvement suggestions
          - User experience recommendations
          - Mobile optimization tips
          - Key action items prioritized by importance
          
          Format the response in a clear, structured way that can be easily read and implemented.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No analysis received from AI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      console.error('OpenAI API Error:', error.message);
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key configuration');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('API rate limit reached. Please try again later.');
      }
    }
    throw new Error('AI analysis failed. Please try again.');
  }
};

// Helper function to validate URL before analysis
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Function to format AI response for better display
export const formatAIResponse = (response: string): string => {
  // Add line breaks between sections
  const formattedResponse = response
    .replace(/(\d+\.)/g, '\n$1') // Add line break before numbered points
    .replace(/([A-Z][A-Za-z\s]+:)/g, '\n\n$1\n') // Add line breaks around section headers
    .trim();

  return formattedResponse;
}; 