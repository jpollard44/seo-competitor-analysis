import { BaseAgent } from './base_agent';

export interface TechnicalSEOAnalysis {
  scores: {
    overall: number;
    security: number;
    performance: number;
    structure: number;
  };
  issues: Array<{
    severity: string;
    category: string;
    description: string;
    impact: string;
    recommendation: string;
  }>;
  structure: {
    depth: number;
    internalLinks: number;
    brokenLinks: number;
    redirects: number;
    canonicals: number;
  };
  security: {
    https: boolean;
    mixedContent: boolean;
    securityHeaders: string[];
    sslExpiry?: Date;
  };
  performance: {
    serverResponse: number;
    resourceSize: number;
    compression: boolean;
    caching: boolean;
  };
  recommendations: string[];
}

export class TechnicalSEOAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Technical SEO expert agent. Analyze the provided URL and data to evaluate:
      1. Site structure and architecture
      2. Page load speed and performance metrics
      3. Security implementation and best practices
      4. Server configuration and response times
      5. Resource optimization and delivery
      
      Provide analysis in a structured JSON format with specific metrics and recommendations.
      Focus on technical aspects that affect SEO performance.
    `;
  }

  async analyze(input: string, html?: string): Promise<string | TechnicalSEOAnalysis> {
    if (!html) {
      return this.analyzeWithAI(input);
    }

    const userPrompt = `
      Analyze the technical SEO aspects of: ${input}
      
      Provide detailed analysis including:
      1. Site structure evaluation
      2. Security assessment
      3. Performance metrics
      4. Technical optimization recommendations
      
      Format the response as JSON with the following structure:
      {
        "scores": { "overall": number, "security": number, "performance": number, "structure": number },
        "structure": { "depth": number, "internalLinks": number, "brokenLinks": number, "redirects": number, "canonicals": number },
        "security": { "https": boolean, "mixedContent": boolean, "securityHeaders": string[] },
        "performance": { "serverResponse": number, "resourceSize": number, "compression": boolean, "caching": boolean },
        "recommendations": string[]
      }
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response);
  }

  private parseAnalysis(response: string): TechnicalSEOAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse technical SEO analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): TechnicalSEOAnalysis {
    return {
      scores: { overall: 0, security: 0, performance: 0, structure: 0 },
      structure: { depth: 0, internalLinks: 0, brokenLinks: 0, redirects: 0, canonicals: 0 },
      security: { https: false, mixedContent: false, securityHeaders: [] },
      performance: { serverResponse: 0, resourceSize: 0, compression: false, caching: false },
      recommendations: [],
      issues: []
    };
  }
} 