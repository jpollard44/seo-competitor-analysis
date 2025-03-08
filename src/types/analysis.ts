export interface CompetitorAnalysis {
  domain: string;
  domainAuthority: number;
  organicTraffic: number;
  commonKeywords: number;
  topPages: Array<{ url: string; traffic: number }>;
}

export interface KeywordAnalysis {
  term: string;
  searchVolume: number;
  difficulty: number;
  currentRank?: number;
  opportunity: number;
}

export interface RankingAnalysis {
  totalKeywords: number;
  averagePosition: number;
  top10Keywords: number;
  top3Keywords: number;
  improvementOpportunities: number;
}

export interface ContentAnalysis {
  missingTopics: string[];
  contentGaps: Array<{ topic: string; priority: number }>;
  wordCount: number;
  readabilityScore: number;
}

export interface AnalysisResults {
  competitors: CompetitorAnalysis[];
  keywords: KeywordAnalysis[];
  rankings: RankingAnalysis;
  content: ContentAnalysis;
} 