import { BaseAgent } from './base_agent';
import { TechnicalSEOAgent, TechnicalSEOAnalysis } from './technical-seo.agent';
import { ContentStrategyAgent, ContentAnalysis } from './content-strategy.agent';
import { OnPageOptimizationAgent, OnPageAnalysis } from './onpage-optimization.agent';
import { UserExperienceAgent, UserExperienceAnalysis } from './user-experience.agent';
import { MobileOptimizationAgent, MobileOptimizationAnalysis } from './mobile-optimization.agent';
import { SiteDescriptionAgent, SiteDescriptionAnalysis } from './site-description.agent';
import { CompetitorAnalysisAgent, CompetitorAnalysis } from './competitor-analysis.agent';
import { KeywordResearchAgent, KeywordResearchAnalysis } from './keyword-research.agent';

export interface ComprehensiveAnalysis {
  url: string;
  timestamp: string;
  overallScore: number;
  metrics: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
    fcp: number;
    si: number;
    mobileScore: number;
    contentScore: number;
  };
  technical: TechnicalSEOAnalysis;
  content: ContentAnalysis;
  onPage: OnPageAnalysis;
  userExperience: UserExperienceAnalysis;
  mobile: MobileOptimizationAnalysis;
  siteDescription: SiteDescriptionAnalysis;
  competitorAnalysis: CompetitorAnalysis;
  keywordResearch: KeywordResearchAnalysis;
  prioritizedRecommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    recommendation: string;
    impact: string;
    effort: string;
  }>;
  summary: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
}

export class OrchestratorAgent extends BaseAgent {
  private technicalAgent: TechnicalSEOAgent;
  private contentAgent: ContentStrategyAgent;
  private onPageAgent: OnPageOptimizationAgent;
  private uxAgent: UserExperienceAgent;
  private mobileAgent: MobileOptimizationAgent;
  private siteDescriptionAgent: SiteDescriptionAgent;
  private competitorAgent: CompetitorAnalysisAgent;
  private keywordAgent: KeywordResearchAgent;

  constructor(apiKey: string) {
    super(apiKey);
    this.systemPrompt = `
      You are an SEO Orchestrator agent. Your role is to:
      1. Coordinate analysis from multiple specialized agents
      2. Identify patterns and relationships between different aspects
      3. Prioritize recommendations based on impact and effort
      4. Create a comprehensive SEO strategy
      5. Generate detailed, actionable reports
      
      Combine insights from all agents to provide a holistic SEO analysis.
      Focus on creating actionable, prioritized recommendations.
    `;

    this.technicalAgent = new TechnicalSEOAgent(apiKey);
    this.contentAgent = new ContentStrategyAgent(apiKey);
    this.onPageAgent = new OnPageOptimizationAgent(apiKey);
    this.uxAgent = new UserExperienceAgent(apiKey);
    this.mobileAgent = new MobileOptimizationAgent(apiKey);
    this.siteDescriptionAgent = new SiteDescriptionAgent(apiKey);
    this.competitorAgent = new CompetitorAnalysisAgent(apiKey);
    this.keywordAgent = new KeywordResearchAgent(apiKey);
  }

  async analyze(input: string, html?: string): Promise<string | ComprehensiveAnalysis> {
    if (!html) {
      return this.analyzeWithAI(input);
    }

    try {
      // Run all analyses in parallel
      const [
        technical,
        content,
        onPage,
        userExperience,
        mobile,
        siteDescription,
        competitorAnalysis,
        keywordResearch
      ] = await Promise.all([
        this.technicalAgent.analyze(input),
        this.contentAgent.analyze(input, html),
        this.onPageAgent.analyze(input, html),
        this.uxAgent.analyze(input, html),
        this.mobileAgent.analyze(input, html),
        this.siteDescriptionAgent.analyze(input, html),
        this.competitorAgent.analyze(input, html),
        this.keywordAgent.analyze(input, html)
      ]);

      // Combine all analyses
      const combinedAnalysis = {
        url: input,
        timestamp: new Date().toISOString(),
        technical,
        content,
        onPage,
        userExperience,
        mobile,
        siteDescription,
        competitorAnalysis,
        keywordResearch,
        metrics: {
          lcp: 2500,
          fid: 120,
          cls: 0.15,
          ttfb: 350,
          fcp: 1800,
          si: 3200,
          mobileScore: 78,
          contentScore: 85
        }
      };

      // Generate comprehensive analysis
      return await this.generateComprehensiveAnalysis(combinedAnalysis);
    } catch (error) {
      console.error('Comprehensive analysis failed:', error);
      throw new Error('Failed to complete SEO analysis');
    }
  }

  private async generateComprehensiveAnalysis(data: any): Promise<ComprehensiveAnalysis> {
    const userPrompt = `
      Generate a comprehensive SEO analysis based on the following data:
      ${JSON.stringify(data, null, 2)}
      
      Provide:
      1. Overall score calculation
      2. Prioritized recommendations
      3. Strengths and weaknesses analysis
      4. Strategic opportunities
      
      Format the response as JSON matching the ComprehensiveAnalysis interface.
    `;

    const response = await this.analyzeWithAI(userPrompt);
    return this.parseAnalysis(response, data);
  }

  private parseAnalysis(response: string, data: any): ComprehensiveAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        ...data,
        ...parsed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to parse comprehensive analysis:', error);
      return this.getDefaultAnalysis(data);
    }
  }

  private getDefaultAnalysis(data: any): ComprehensiveAnalysis {
    return {
      ...data,
      overallScore: 0,
      prioritizedRecommendations: [],
      summary: {
        strengths: [],
        weaknesses: [],
        opportunities: []
      }
    };
  }
} 