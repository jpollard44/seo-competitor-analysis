import { BaseAgent } from './base_agent';

export interface Competitor {
  name: string;
  url: string;
  overlapScore: number;
  commonKeywords: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorAnalysis {
  mainCompetitors: Competitor[];
  competitiveLandscape: string;
  marketGaps: string[];
  recommendedStrategies: string[];
}

export class CompetitorAnalysisAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Competitor Analysis expert agent. Your task is to analyze a website and identify its main competitors.
      
      Follow these guidelines:
      1. Identify the main competitors in the same niche based on the website's content and purpose
      2. Assess the competitive landscape
      3. Identify market gaps and opportunities
      4. Suggest competitive strategies
      5. Analyze competitor strengths and weaknesses
      
      Provide a comprehensive analysis with specific insights.
      Focus on providing actionable competitive intelligence.
    `;
  }

  async analyze(input: string, html?: string): Promise<CompetitorAnalysis> {
    console.log('CompetitorAnalysisAgent.analyze called with URL:', input);
    
    if (!html || html.length < 100) {
      console.warn('HTML content is missing or too short, returning default analysis');
      return this.getDefaultAnalysis(input);
    }

    try {
      // Extract text content from HTML to reduce token usage
      const textContent = this.extractTextFromHtml(html);
      console.log('Extracted text content length for competitor analysis:', textContent.length);
      
      if (textContent.length < 100) {
        console.warn('Extracted text content is too short, returning default analysis');
        return this.getDefaultAnalysis(input);
      }
      
      const userPrompt = `
        Analyze the following website and identify its main competitors:
        URL: ${input}
        
        Website Content:
        ${textContent.substring(0, 10000)}
        
        Based on this content, provide:
        1. Identify 3-5 main competitors in the same niche
        2. For each competitor, provide:
           - Their name
           - Their URL (make an educated guess if not mentioned)
           - An overlap score (0-100) indicating how much their offerings overlap
           - Common keywords they might target
           - Their strengths
           - Their weaknesses
        3. Assess the competitive landscape
        4. Identify market gaps and opportunities
        5. Suggest competitive strategies
        
        Format the response as JSON with the following structure:
        {
          "mainCompetitors": [
            {
              "name": "Competitor Name",
              "url": "competitor-url.com",
              "overlapScore": 85,
              "commonKeywords": ["keyword1", "keyword2"],
              "strengths": ["strength1", "strength2"],
              "weaknesses": ["weakness1", "weakness2"]
            }
          ],
          "competitiveLandscape": "Description of the competitive landscape",
          "marketGaps": ["Gap 1", "Gap 2"],
          "recommendedStrategies": ["Strategy 1", "Strategy 2"]
        }
      `;

      console.log('Sending competitor analysis prompt to OpenAI');
      const response = await this.analyzeWithAI(userPrompt);
      console.log('Received competitor analysis response from OpenAI:', response.substring(0, 100) + '...');
      
      const result = this.parseAnalysis(response, input);
      console.log('Parsed competitor analysis:', result);
      return result;
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      
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
      console.error('Error extracting text from HTML for competitor analysis:', error);
      return 'Error extracting content from website.';
    }
  }

  private parseAnalysis(response: string, url: string): CompetitorAnalysis {
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const parsed = JSON.parse(jsonString);
      
      // Validate and normalize the parsed object
      const mainCompetitors = Array.isArray(parsed.mainCompetitors) 
        ? parsed.mainCompetitors.map((comp: any) => ({
            name: comp.name || 'Unknown Competitor',
            url: comp.url || 'unknown-competitor.com',
            overlapScore: typeof comp.overlapScore === 'number' ? comp.overlapScore : 50,
            commonKeywords: Array.isArray(comp.commonKeywords) ? comp.commonKeywords : [],
            strengths: Array.isArray(comp.strengths) ? comp.strengths : [],
            weaknesses: Array.isArray(comp.weaknesses) ? comp.weaknesses : []
          }))
        : [];
      
      return {
        mainCompetitors: mainCompetitors.length > 0 ? mainCompetitors : this.getDefaultAnalysis(url).mainCompetitors,
        competitiveLandscape: parsed.competitiveLandscape || 'No competitive landscape analysis available.',
        marketGaps: Array.isArray(parsed.marketGaps) ? parsed.marketGaps : [],
        recommendedStrategies: Array.isArray(parsed.recommendedStrategies) ? parsed.recommendedStrategies : []
      };
    } catch (error) {
      console.error('Failed to parse competitor analysis:', error);
      console.error('Raw response:', response);
      return this.getDefaultAnalysis(url);
    }
  }

  private getDefaultAnalysis(url: string): CompetitorAnalysis {
    // Extract domain from URL for better default values
    let domain = url;
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch (e) {
      console.error('Error extracting domain from URL:', e);
    }
    
    return {
      mainCompetitors: [
        {
          name: `Competitor 1 for ${domain}`,
          url: `competitor1-for-${domain}`,
          overlapScore: 75,
          commonKeywords: ["industry term", "service keyword", "product type"],
          strengths: ["Established brand", "Comprehensive offering"],
          weaknesses: ["Outdated interface", "Higher pricing"]
        },
        {
          name: `Competitor 2 for ${domain}`,
          url: `competitor2-for-${domain}`,
          overlapScore: 65,
          commonKeywords: ["industry term", "alternative solution", "service type"],
          strengths: ["Modern design", "Competitive pricing"],
          weaknesses: ["Limited features", "Newer to market"]
        }
      ],
      competitiveLandscape: `The market for services similar to ${domain} is competitive with several established players.`,
      marketGaps: ["Budget-friendly solutions", "Specialized features for niche segments"],
      recommendedStrategies: ["Highlight unique value proposition", "Target underserved market segments"]
    };
  }
} 