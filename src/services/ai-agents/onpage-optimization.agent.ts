import { BaseAgent } from './base_agent';

export interface OnPageAnalysis {
  scores: {
    overall: number;
    titles: number;
    meta: number;
    headings: number;
    images: number;
  };
  elements: {
    title: {
      content: string;
      length: number;
      keywords: string[];
    };
    meta: {
      description: string;
      keywords: string[];
      robots: string;
      canonical: string;
    };
    headings: Array<{
      level: number;
      content: string;
      keywords: string[];
    }>;
    images: Array<{
      src: string;
      alt: string;
      optimized: boolean;
    }>;
  };
  recommendations: string[];
}

export class OnPageOptimizationAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are an On-Page SEO expert agent. Analyze the provided page elements to evaluate:
      1. Title tag optimization
      2. Meta tags implementation
      3. Heading structure and hierarchy
      4. Image optimization
      5. URL structure
      
      Provide analysis in a structured JSON format with specific metrics and recommendations.
      Focus on on-page elements that affect SEO performance.
    `;
  }

  async analyze(userInput: string): Promise<string>;
  async analyze(url: string, html: string): Promise<OnPageAnalysis>;
  async analyze(urlOrInput: string, html?: string): Promise<string | OnPageAnalysis> {
    if (html === undefined) {
      return this.analyzeWithAI(urlOrInput);
    }
    const userPrompt = `
      Analyze the on-page optimization for: ${urlOrInput}
      
      HTML Content:
      ${html}
      
      Provide detailed analysis including:
      1. Title and meta tags assessment
      2. Heading structure analysis
      3. Image optimization check
      4. On-page element recommendations
      
      Format the response as JSON with the following structure:
      {
        "scores": { "overall": number, "titles": number, "meta": number, "headings": number, "images": number },
        "elements": {
          "title": { "content": string, "length": number, "keywords": string[] },
          "meta": { "description": string, "keywords": string[], "robots": string, "canonical": string },
          "headings": [{ "level": number, "content": string, "keywords": string[] }],
          "images": [{ "src": string, "alt": string, "optimized": boolean }]
        },
        "recommendations": string[]
      }
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response);
  }

  private parseAnalysis(response: string): OnPageAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse on-page analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): OnPageAnalysis {
    return {
      scores: { overall: 0, titles: 0, meta: 0, headings: 0, images: 0 },
      elements: {
        title: { content: '', length: 0, keywords: [] },
        meta: { description: '', keywords: [], robots: '', canonical: '' },
        headings: [],
        images: []
      },
      recommendations: []
    };
  }
} 