import { BaseAgent } from './base_agent';

export interface SiteDescriptionAnalysis {
  description: string;
  category: string;
  targetAudience: string[];
  mainPurpose: string;
  contentType: string[];
}

export class SiteDescriptionAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Site Description expert agent. Your task is to analyze website content and provide a comprehensive description.
      
      Follow these guidelines:
      1. Extract the main purpose and focus of the website
      2. Identify the industry/category the site belongs to
      3. Determine the likely target audience based on content, tone, and offerings
      4. Assess the main purpose (e.g., e-commerce, information, lead generation)
      5. Categorize the types of content present (e.g., blog posts, product pages)
      
      Provide a concise but informative description that captures the essence of the website.
      Focus on accuracy and objectivity in your analysis.
    `;
  }

  async analyze(input: string, html?: string): Promise<SiteDescriptionAnalysis> {
    console.log('SiteDescriptionAgent.analyze called with URL:', input);
    console.log('HTML content length:', html?.length || 0);
    
    if (!html || html.length < 100) {
      console.warn('HTML content is missing or too short, returning default analysis');
      return this.getDefaultAnalysis();
    }

    try {
      // Extract text content from HTML to reduce token usage
      const textContent = this.extractTextFromHtml(html);
      console.log('Extracted text content length:', textContent.length);
      
      if (textContent.length < 100) {
        console.warn('Extracted text content is too short, returning default analysis');
        return this.getDefaultAnalysis();
      }
      
      const userPrompt = `
        Analyze the following website and provide a comprehensive description:
        URL: ${input}
        
        Website Content:
        ${textContent}
        
        Based on this content, provide:
        1. A concise 2-3 sentence overview of what the site is about
        2. The industry/category the site belongs to
        3. The likely target audience
        4. The main purpose of the site (e.g., e-commerce, information, lead generation)
        5. The type of content on the site
        
        Format the response as JSON with the following structure:
        {
          "description": "A concise description of the website",
          "category": "The industry/category",
          "targetAudience": ["Primary audience", "Secondary audience"],
          "mainPurpose": "The main purpose of the site",
          "contentType": ["Blog posts", "Product pages", etc.]
        }
      `;

      console.log('Sending prompt to OpenAI');
      const response = await this.analyzeWithAI(userPrompt);
      console.log('Received response from OpenAI:', response.substring(0, 100) + '...');
      
      const result = this.parseAnalysis(response);
      console.log('Parsed analysis:', result);
      return result;
    } catch (error) {
      console.error('Site description analysis failed:', error);
      
      // If we have an API key error, throw it to be handled by the caller
      if (error instanceof Error && error.message.includes('API key')) {
        throw error;
      }
      
      return this.getDefaultAnalysis();
    }
  }

  private extractTextFromHtml(html: string): string {
    try {
      // Create a simple text extraction by removing HTML tags
      // This is a basic implementation - a more sophisticated approach would use a proper HTML parser
      const textContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ') // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')   // Remove styles
        .replace(/<[^>]*>/g, ' ')                                           // Remove HTML tags
        .replace(/\s+/g, ' ')                                               // Normalize whitespace
        .trim();
      
      // Limit the text content to reduce token usage (approximately 8000 tokens)
      return textContent.substring(0, 12000);
    } catch (error) {
      console.error('Error extracting text from HTML:', error);
      return 'Error extracting content from website.';
    }
  }

  private parseAnalysis(response: string): SiteDescriptionAnalysis {
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const parsed = JSON.parse(jsonString);
      
      // Validate the parsed object has the required fields
      if (!parsed.description) {
        console.warn('Parsed response missing description field:', parsed);
        return {
          ...this.getDefaultAnalysis(),
          description: typeof parsed === 'string' ? parsed : 'Invalid response format'
        };
      }
      
      return {
        description: parsed.description || 'No description available',
        category: parsed.category || 'Unknown',
        targetAudience: Array.isArray(parsed.targetAudience) ? parsed.targetAudience : ['General audience'],
        mainPurpose: parsed.mainPurpose || 'Information',
        contentType: Array.isArray(parsed.contentType) ? parsed.contentType : ['Web pages']
      };
    } catch (error) {
      console.error('Failed to parse site description analysis:', error);
      console.error('Raw response:', response);
      
      // If the response is a string but not valid JSON, use it as the description
      if (typeof response === 'string' && response.length > 0) {
        return {
          ...this.getDefaultAnalysis(),
          description: response.substring(0, 500) // Use the first 500 chars as description
        };
      }
      
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): SiteDescriptionAnalysis {
    return {
      description: "Unable to generate a description for this website.",
      category: "Unknown",
      targetAudience: ["General audience"],
      mainPurpose: "Information",
      contentType: ["Web pages"]
    };
  }
} 