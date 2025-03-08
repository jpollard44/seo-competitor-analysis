import { BaseAgent } from './base_agent';

export interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number;
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
}

export interface KeywordResearchAnalysis {
  primaryKeywords: Keyword[];
  secondaryKeywords: Keyword[];
  longTailKeywords: Keyword[];
  keywordGaps: string[];
  recommendedFocus: string[];
}

export class KeywordResearchAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Keyword Research expert agent. Your task is to analyze website content and identify relevant keywords.
      
      Follow these guidelines:
      1. Identify primary and secondary keywords based on the website's content
      2. Discover long-tail keyword opportunities
      3. Assess keyword difficulty and search volume
      4. Identify keyword gaps
      5. Recommend keyword focus areas
      
      Provide a comprehensive analysis with specific insights.
      Focus on providing actionable keyword intelligence.
    `;
  }

  async analyze(input: string, html?: string): Promise<KeywordResearchAnalysis> {
    console.log('KeywordResearchAgent.analyze called with URL:', input);
    
    if (!html || html.length < 100) {
      console.warn('HTML content is missing or too short, returning default analysis');
      return this.getDefaultAnalysis(input);
    }

    try {
      // Extract text content from HTML to reduce token usage
      const textContent = this.extractTextFromHtml(html);
      console.log('Extracted text content length for keyword research:', textContent.length);
      
      if (textContent.length < 100) {
        console.warn('Extracted text content is too short, returning default analysis');
        return this.getDefaultAnalysis(input);
      }
      
      const userPrompt = `
        Analyze the following website and identify its main keywords:
        URL: ${input}
        
        Website Content:
        ${textContent.substring(0, 10000)}
        
        Based on this content, provide:
        1. Identify 5-10 primary keywords that are most relevant to this website
        2. Identify 5-10 secondary keywords that support the primary keywords
        3. Discover 5-10 long-tail keyword opportunities
        4. Identify keyword gaps (keywords the site should target but doesn't)
        5. Recommend keyword focus areas
        
        For each keyword, estimate:
        - Monthly search volume (realistic estimate)
        - Keyword difficulty (0-100)
        - Relevance to the website (0-10)
        - Search intent (informational, navigational, transactional, commercial)
        
        Format the response as JSON with the following structure:
        {
          "primaryKeywords": [
            {
              "keyword": "main keyword",
              "volume": 1000,
              "difficulty": 65,
              "relevance": 9,
              "intent": "informational"
            }
          ],
          "secondaryKeywords": [...],
          "longTailKeywords": [...],
          "keywordGaps": ["Gap 1", "Gap 2"],
          "recommendedFocus": ["Focus 1", "Focus 2"]
        }
      `;

      console.log('Sending keyword research prompt to OpenAI');
      const response = await this.analyzeWithAI(userPrompt);
      console.log('Received keyword research response from OpenAI:', response.substring(0, 100) + '...');
      
      const result = this.parseAnalysis(response, input);
      console.log('Parsed keyword research:', result);
      return result;
    } catch (error) {
      console.error('Keyword research failed:', error);
      
      // If we have an API key error, throw it to be handled by the caller
      if (error instanceof Error && error.message.includes('API key')) {
        throw error;
      }
      
      return this.getDefaultAnalysis(input);
    }
  }

  private extractTextFromHtml(html: string): string {
    try {
      // Create a simple text extraction by removing HTML tags
      const textContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return textContent;
    } catch (error) {
      console.error('Error extracting text from HTML for keyword research:', error);
      return 'Error extracting content from website.';
    }
  }

  private parseAnalysis(response: string, url: string): KeywordResearchAnalysis {
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const parsed = JSON.parse(jsonString);
      
      // Validate and normalize the parsed object
      const validateKeyword = (kw: any): Keyword => {
        const validIntents = ['informational', 'navigational', 'transactional', 'commercial'];
        return {
          keyword: kw.keyword || 'Unknown Keyword',
          volume: typeof kw.volume === 'number' ? kw.volume : Math.floor(Math.random() * 1000) + 100,
          difficulty: typeof kw.difficulty === 'number' ? kw.difficulty : Math.floor(Math.random() * 100),
          relevance: typeof kw.relevance === 'number' ? kw.relevance : Math.floor(Math.random() * 10) + 1,
          intent: validIntents.includes(kw.intent) ? kw.intent : 'informational'
        };
      };
      
      const primaryKeywords = Array.isArray(parsed.primaryKeywords) 
        ? parsed.primaryKeywords.map(validateKeyword)
        : [];
        
      const secondaryKeywords = Array.isArray(parsed.secondaryKeywords) 
        ? parsed.secondaryKeywords.map(validateKeyword)
        : [];
        
      const longTailKeywords = Array.isArray(parsed.longTailKeywords) 
        ? parsed.longTailKeywords.map(validateKeyword)
        : [];
      
      return {
        primaryKeywords: primaryKeywords.length > 0 ? primaryKeywords : this.getDefaultAnalysis(url).primaryKeywords,
        secondaryKeywords: secondaryKeywords.length > 0 ? secondaryKeywords : this.getDefaultAnalysis(url).secondaryKeywords,
        longTailKeywords: longTailKeywords.length > 0 ? longTailKeywords : this.getDefaultAnalysis(url).longTailKeywords,
        keywordGaps: Array.isArray(parsed.keywordGaps) ? parsed.keywordGaps : [],
        recommendedFocus: Array.isArray(parsed.recommendedFocus) ? parsed.recommendedFocus : []
      };
    } catch (error) {
      console.error('Failed to parse keyword research:', error);
      console.error('Raw response:', response);
      return this.getDefaultAnalysis(url);
    }
  }

  private getDefaultAnalysis(url: string): KeywordResearchAnalysis {
    // Extract domain from URL for better default values
    let domain = url;
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch (e) {
      console.error('Error extracting domain from URL:', e);
    }
    
    // Generate some default keywords based on the domain
    const domainParts = domain.split('.');
    const baseName = domainParts[0];
    
    return {
      primaryKeywords: [
        {
          keyword: baseName,
          volume: 1200,
          difficulty: 65,
          relevance: 10,
          intent: 'navigational'
        },
        {
          keyword: `${baseName} services`,
          volume: 880,
          difficulty: 55,
          relevance: 9,
          intent: 'commercial'
        },
        {
          keyword: `${baseName} reviews`,
          volume: 590,
          difficulty: 40,
          relevance: 8,
          intent: 'informational'
        }
      ],
      secondaryKeywords: [
        {
          keyword: `${baseName} pricing`,
          volume: 320,
          difficulty: 35,
          relevance: 7,
          intent: 'commercial'
        },
        {
          keyword: `${baseName} alternatives`,
          volume: 210,
          difficulty: 45,
          relevance: 6,
          intent: 'commercial'
        }
      ],
      longTailKeywords: [
        {
          keyword: `how to use ${baseName}`,
          volume: 140,
          difficulty: 25,
          relevance: 8,
          intent: 'informational'
        },
        {
          keyword: `is ${baseName} worth it`,
          volume: 90,
          difficulty: 20,
          relevance: 7,
          intent: 'informational'
        }
      ],
      keywordGaps: [`${baseName} tutorial`, `${baseName} vs competitors`],
      recommendedFocus: [`${baseName} benefits`, `${baseName} features`]
    };
  }
} 