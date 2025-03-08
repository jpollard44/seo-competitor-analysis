export interface Competitor {
  domain: string;
  domainAuthority: number;
  organicTraffic: number;
  keywordOverlap: number;
  type: 'product' | 'seo';
  rankings: {
    top3: number;
    top10: number;
    total: number;
  };
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  totalKeywords: number;
  uniqueKeywords: number;
  sharedKeywords: number;
} 