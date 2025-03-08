import { BaseAgent } from './base_agent';

export interface ContentAnalysis {
  scores: {
    overall: number;
    readability: number;
    relevance: number;
    optimization: number;
  };
  content: {
    wordCount: number;
    readingTime: number;
    readabilityScore: number;
    paragraphCount: number;
    sentenceCount: number;
  };
  keywords: {
    primary: string;
    secondary: string[];
    density: Record<string, number>;
    distribution: Record<string, number>;
  };
  semantics: {
    topics: string[];
    entities: string[];
    sentiment: number;
  };
  recommendations: string[];
}

export class ContentStrategyAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Content Strategy expert agent. Analyze the provided content to evaluate:
      1. Content quality and readability
      2. Keyword usage and optimization
      3. Topic coverage and semantic relevance
      4. Content structure and organization
      5. User engagement potential
      
      Provide analysis in a structured JSON format with specific metrics and recommendations.
      Focus on content aspects that affect SEO performance and user engagement.
    `;
  }

  async analyze(userInput: string): Promise<string>;
  async analyze(url: string, content: string): Promise<ContentAnalysis>;
  async analyze(urlOrInput: string, content?: string): Promise<string | ContentAnalysis> {
    if (content === undefined) {
      return this.analyzeWithAI(urlOrInput);
    }
    const userPrompt = `
      Analyze the content strategy for: ${urlOrInput}
      
      Content to analyze:
      ${content}
      
      Provide detailed analysis including:
      1. Content quality assessment
      2. Keyword analysis
      3. Semantic evaluation
      4. Content optimization recommendations
      
      Format the response as JSON with the following structure:
      {
        "scores": { "overall": number, "readability": number, "relevance": number, "optimization": number },
        "content": { "wordCount": number, "readingTime": number, "readabilityScore": number, "paragraphCount": number, "sentenceCount": number },
        "keywords": { "primary": string, "secondary": string[], "density": Object, "distribution": Object },
        "semantics": { "topics": string[], "entities": string[], "sentiment": number },
        "recommendations": string[]
      }
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response);
  }

  private parseAnalysis(response: string): ContentAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse content analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): ContentAnalysis {
    return {
      scores: { overall: 0, readability: 0, relevance: 0, optimization: 0 },
      content: { wordCount: 0, readingTime: 0, readabilityScore: 0, paragraphCount: 0, sentenceCount: 0 },
      keywords: { primary: '', secondary: [], density: {}, distribution: {} },
      semantics: { topics: [], entities: [], sentiment: 0 },
      recommendations: []
    };
  }
} 