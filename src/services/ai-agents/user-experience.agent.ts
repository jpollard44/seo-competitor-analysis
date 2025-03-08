import { BaseAgent } from './base_agent';

export interface UserExperienceAnalysis {
  scores: {
    overall: number;
    navigation: number;
    accessibility: number;
    interactivity: number;
    layout: number;
  };
  navigation: {
    menuStructure: {
      depth: number;
      clarity: number;
      consistency: number;
    };
    userFlow: {
      pathLength: number;
      clickDepth: number;
      deadEnds: number;
    };
    searchability: {
      searchPresent: boolean;
      filterOptions: number;
      searchPlacement: string;
    };
  };
  accessibility: {
    contrast: number;
    focusability: boolean;
    ariaLabels: boolean;
    keyboardNav: boolean;
    textScaling: boolean;
  };
  interactivity: {
    cta: {
      visibility: number;
      placement: string[];
      effectiveness: number;
    };
    forms: {
      usability: number;
      validation: boolean;
      feedback: boolean;
    };
    engagement: {
      scrollDepth: number;
      interactionRate: number;
      bounceRate: number;
    };
  };
  recommendations: string[];
}

export class UserExperienceAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are a UX expert agent. Analyze the provided page to evaluate:
      1. Navigation structure and user flow
      2. Accessibility implementation
      3. Interactive elements and engagement
      4. Layout effectiveness
      5. User behavior patterns
      
      Provide analysis in a structured JSON format with specific metrics and recommendations.
      Focus on user experience aspects that affect SEO and user engagement.
    `;
  }

  async analyze(userInput: string): Promise<string>;
  async analyze(url: string, html: string): Promise<UserExperienceAnalysis>;
  async analyze(urlOrInput: string, html?: string): Promise<string | UserExperienceAnalysis> {
    if (html === undefined) {
      return this.analyzeWithAI(urlOrInput);
    }
    const userPrompt = `
      Analyze the user experience for: ${urlOrInput}
      
      HTML Content:
      ${html}
      
      Provide detailed analysis including:
      1. Navigation assessment
      2. Accessibility evaluation
      3. Interaction analysis
      4. UX optimization recommendations
      
      Format the response as JSON matching the UserExperienceAnalysis interface.
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response);
  }

  private parseAnalysis(response: string): UserExperienceAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse UX analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): UserExperienceAnalysis {
    return {
      scores: {
        overall: 0,
        navigation: 0,
        accessibility: 0,
        interactivity: 0,
        layout: 0
      },
      navigation: {
        menuStructure: { depth: 0, clarity: 0, consistency: 0 },
        userFlow: { pathLength: 0, clickDepth: 0, deadEnds: 0 },
        searchability: { searchPresent: false, filterOptions: 0, searchPlacement: '' }
      },
      accessibility: {
        contrast: 0,
        focusability: false,
        ariaLabels: false,
        keyboardNav: false,
        textScaling: false
      },
      interactivity: {
        cta: { visibility: 0, placement: [], effectiveness: 0 },
        forms: { usability: 0, validation: false, feedback: false },
        engagement: { scrollDepth: 0, interactionRate: 0, bounceRate: 0 }
      },
      recommendations: []
    };
  }
} 