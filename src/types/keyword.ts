export interface Keyword {
  id: string;
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  currentRank?: number;
  competitors: {
    domain: string;
    rank: number;
    url: string;
  }[];
}

export interface KeywordGroup {
  id: string;
  name: string;
  keywords: Keyword[];
  totalVolume: number;
  averageDifficulty: number;
}

export interface KeywordAnalysis {
  keywords: Keyword[];
  groups: KeywordGroup[];
  stats: {
    totalKeywords: number;
    averageDifficulty: number;
    totalVolume: number;
    opportunityScore: number;
  };
}

export interface KeywordDrilldown {
  category: string;
  keywords: Keyword[];
  metrics: {
    avgVolume: number;
    avgDifficulty: number;
    totalKeywords: number;
    avgCpc: number;
  };
}

export interface TreeMapData {
  name: string;
  value: number;
  keywords: Keyword[];
} 