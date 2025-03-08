import { TechnicalSEOAnalysis } from './technical-seo.agent';
import { ContentAnalysis } from './content-strategy.agent';
import { OnPageAnalysis } from './onpage-optimization.agent';
import { UserExperienceAnalysis } from './user-experience.agent';
import { MobileOptimizationAnalysis } from './mobile-optimization.agent';
import { SiteDescriptionAnalysis } from './site-description.agent';
import { CompetitorAnalysis } from './competitor-analysis.agent';
import { KeywordResearchAnalysis } from './keyword-research.agent';

export interface MetricsData {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  si: number;
  mobileScore: number;
  contentScore: number;
}

export interface ComprehensiveAnalysis {
  url: string;
  timestamp: string;
  overallScore: number;
  metrics: MetricsData;
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

// Re-export all analysis types for convenience
export type {
  TechnicalSEOAnalysis,
  ContentAnalysis,
  OnPageAnalysis,
  UserExperienceAnalysis,
  MobileOptimizationAnalysis
}; 