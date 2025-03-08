export const config = {
  api: {
    openai: {
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7,
    },
  },
  analysis: {
    maxTimeout: 300000, // 5 minutes
    retryAttempts: 3,
    concurrentAnalyses: 5,
  },
  ui: {
    refreshInterval: 5000, // 5 seconds
    maxHistoryItems: 10,
  },
};

export const metricThresholds = {
  lcp: {
    good: 2500,
    needsImprovement: 4000,
  },
  fid: {
    good: 100,
    needsImprovement: 300,
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // Add more metric thresholds
}; 