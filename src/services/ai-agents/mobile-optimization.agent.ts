import { BaseAgent } from './base_agent';

export interface MobileOptimizationAnalysis {
  scores: {
    overall: number;
    responsiveness: number;
    performance: number;
    usability: number;
    compatibility: number;
  };
  viewport: {
    configured: boolean;
    responsive: boolean;
    initialScale: number;
    userScalable: boolean;
  };
  touchTargets: {
    adequateSize: boolean;
    spacing: number;
    tapTargets: {
      total: number;
      problematic: number;
    };
  };
  performance: {
    mobileSpeed: number;
    resourceSize: number;
    imageOptimization: boolean;
    lazyLoading: boolean;
  };
  compatibility: {
    mobileFirst: boolean;
    mediaQueries: string[];
    fontScaling: boolean;
    orientationSupport: boolean;
  };
  recommendations: string[];
}

export class MobileOptimizationAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a Mobile Optimization expert agent. Analyze the provided page to evaluate:
      1. Mobile responsiveness and adaptation
      2. Touch interaction optimization
      3. Mobile performance metrics
      4. Device compatibility
      5. Mobile-specific features
      
      Provide analysis in a structured JSON format with specific metrics and recommendations.
      Focus on mobile optimization aspects that affect SEO and user experience.
    `;
  }

  async analyze(userInput: string): Promise<string>;
  async analyze(url: string, html: string): Promise<MobileOptimizationAnalysis>;
  async analyze(urlOrInput: string, html?: string): Promise<string | MobileOptimizationAnalysis> {
    if (html === undefined) {
      return this.analyzeWithAI(urlOrInput);
    }
    const userPrompt = `
      Analyze the mobile optimization for: ${urlOrInput}
      
      HTML Content:
      ${html}
      
      Provide detailed analysis including:
      1. Responsive design assessment
      2. Touch target evaluation
      3. Mobile performance metrics
      4. Mobile optimization recommendations
      
      Format the response as JSON matching the MobileOptimizationAnalysis interface.
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response);
  }

  private parseAnalysis(response: string): MobileOptimizationAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse mobile optimization analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): MobileOptimizationAnalysis {
    return {
      scores: {
        overall: 0,
        responsiveness: 0,
        performance: 0,
        usability: 0,
        compatibility: 0
      },
      viewport: {
        configured: false,
        responsive: false,
        initialScale: 1,
        userScalable: true
      },
      touchTargets: {
        adequateSize: false,
        spacing: 0,
        tapTargets: { total: 0, problematic: 0 }
      },
      performance: {
        mobileSpeed: 0,
        resourceSize: 0,
        imageOptimization: false,
        lazyLoading: false
      },
      compatibility: {
        mobileFirst: false,
        mediaQueries: [],
        fontScaling: false,
        orientationSupport: false
      },
      recommendations: []
    };
  }
} 