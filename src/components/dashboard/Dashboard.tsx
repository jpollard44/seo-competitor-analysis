import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Search as SearchIcon, TrendingUp, TrendingDown, Warning, CheckCircle } from '@mui/icons-material';
import MetricCard from './MetricCard';
import CompetitorChart from './CompetitorChart';
import DomainAuthorityChart from './DomainAuthorityChart';
import { analyzeSEOWithAI, validateUrl, formatAIResponse } from '../../services/openai';

interface AnalysisStatus {
  competitors: 'pending' | 'loading' | 'completed' | 'error';
  keywords: 'pending' | 'loading' | 'completed' | 'error';
  rankings: 'pending' | 'loading' | 'completed' | 'error';
  content: 'pending' | 'loading' | 'completed' | 'error';
}

interface AnalysisResults {
  competitors: {
    domain: string;
    domainAuthority: number;
    organicTraffic: number;
    commonKeywords: number;
    topPages: { url: string; traffic: number }[];
  }[];
  keywords: {
    term: string;
    searchVolume: number;
    difficulty: number;
    currentRank: number;
    opportunity: number;
  }[];
  rankings: {
    totalKeywords: number;
    averagePosition: number;
    top10Keywords: number;
    top3Keywords: number;
    improvementOpportunities: number;
  };
  content: {
    missingTopics: string[];
    contentGaps: { topic: string; priority: number }[];
    wordCount: number;
    readabilityScore: number;
  };
  aiRecommendations: string;
}

const Dashboard: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({
    competitors: 'pending',
    keywords: 'pending',
    rankings: 'pending',
    content: 'pending',
  });
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const steps = [
    'Competitor Analysis',
    'Keyword Research',
    'Ranking Analysis',
    'Content Optimization'
  ];

  const handleAnalyze = async () => {
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setActiveStep(0);
    setAnalysisStatus({
      competitors: 'loading',
      keywords: 'pending',
      rankings: 'pending',
      content: 'pending',
    });

    try {
      // Step 1: Competitor Analysis
      await analyzeCompetitors();
      setActiveStep(1);
      setAnalysisStatus(prev => ({ ...prev, competitors: 'completed', keywords: 'loading' }));

      // Step 2: Keyword Research
      await analyzeKeywords();
      setActiveStep(2);
      setAnalysisStatus(prev => ({ ...prev, keywords: 'completed', rankings: 'loading' }));

      // Step 3: Ranking Analysis
      await analyzeRankings();
      setActiveStep(3);
      setAnalysisStatus(prev => ({ ...prev, rankings: 'completed', content: 'loading' }));

      // Step 4: Content Analysis
      await analyzeContent();
      setAnalysisStatus(prev => ({ ...prev, content: 'completed' }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
      setError(errorMessage);
      setAnalysisStatus(prev => ({
        ...prev,
        [steps[activeStep].toLowerCase().replace(' ', '')]: 'error'
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCompetitors = async () => {
    try {
      // Mock data instead of API call
      const mockData = [
        {
          domain: 'competitor1.com',
          domainAuthority: 65,
          organicTraffic: 250000,
          commonKeywords: 1200,
          topPages: [
            { url: '/blog/seo-tips', traffic: 15000 },
            { url: '/tools/analyzer', traffic: 12000 },
          ]
        },
        {
          domain: 'competitor2.com',
          domainAuthority: 58,
          organicTraffic: 180000,
          commonKeywords: 800,
          topPages: [
            { url: '/seo-guide', traffic: 9000 },
            { url: '/blog/keywords', traffic: 7500 },
          ]
        },
        // Add more mock competitors...
      ];

      setResults(prev => prev === null ? {
        competitors: mockData,
        keywords: [],
        rankings: {
          totalKeywords: 0,
          averagePosition: 0,
          top10Keywords: 0,
          top3Keywords: 0,
          improvementOpportunities: 0
        },
        content: {
          missingTopics: [],
          contentGaps: [],
          wordCount: 0,
          readabilityScore: 0
        },
        aiRecommendations: ''
      } : {
        ...prev,
        competitors: mockData
      });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    } catch (error) {
      throw new Error('Competitor analysis failed');
    }
  };

  const analyzeKeywords = async () => {
    try {
      // Mock data
      const mockData = [
        {
          term: 'seo tools',
          searchVolume: 12000,
          difficulty: 67,
          currentRank: 8,
          opportunity: 0.85
        },
        {
          term: 'keyword research',
          searchVolume: 8000,
          difficulty: 72,
          currentRank: 12,
          opportunity: 0.75
        },
        // Add more mock keywords...
      ];

      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          keywords: mockData
        };
      });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    } catch (error) {
      throw new Error('Keyword analysis failed');
    }
  };

  const analyzeRankings = async () => {
    try {
      // Mock data
      const mockData = {
        totalKeywords: 450,
        averagePosition: 15.3,
        top10Keywords: 45,
        top3Keywords: 12,
        improvementOpportunities: 28
      };

      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rankings: mockData
        };
      });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    } catch (error) {
      throw new Error('Rankings analysis failed');
    }
  };

  const analyzeContent = async () => {
    try {
      // Existing mock data
      const mockData = {
        missingTopics: ['Technical SEO', 'Link Building', 'Content Strategy'],
        contentGaps: [
          { topic: 'Mobile SEO', priority: 8 },
          { topic: 'Site Speed Optimization', priority: 9 },
          { topic: 'Schema Markup', priority: 7 }
        ],
        wordCount: 25000,
        readabilityScore: 72
      };

      // Validate URL before AI analysis
      if (!validateUrl(url)) {
        throw new Error('Invalid URL format');
      }

      // Add AI analysis with formatted response
      const aiResponse = await analyzeSEOWithAI(url);
      const formattedAiRecommendations = formatAIResponse(aiResponse);

      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          content: mockData,
          aiRecommendations: formattedAiRecommendations
        };
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Content analysis failed';
      throw new Error(errorMessage);
    }
  };

  const renderQuickStats = () => {
    if (!results) return null;

    return (
      <>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Competitors</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h3">{results.competitors.length}</Typography>
                <Typography color="textSecondary">Direct Competitors</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((results.competitors.length / 10) * 100, 100)} 
                />
                <Typography variant="body2" color="textSecondary">
                  {results.competitors.filter(c => c.domainAuthority > 30).length} strong competitors
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Keywords</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h3">{results.keywords.length}</Typography>
                <Typography color="textSecondary">Ranking Keywords</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    icon={<TrendingUp />} 
                    label={`${results.keywords.filter(k => k.opportunity > 0.7).length} opportunities`}
                    color="success"
                    size="small"
                  />
                  <Chip 
                    icon={<Warning />} 
                    label={`${results.keywords.filter(k => k.difficulty > 70).length} difficult`}
                    color="warning"
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rankings</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h3">{results.rankings.averagePosition.toFixed(1)}</Typography>
                <Typography color="textSecondary">Average Position</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`Top 3: ${results.rankings.top3Keywords}`}
                    color="success"
                    size="small"
                  />
                  <Chip 
                    label={`Top 10: ${results.rankings.top10Keywords}`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </>
    );
  };

  const renderDetailedResults = () => {
    if (!results) return null;

    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Analysis Results</Typography>
            
            <Grid container spacing={3}>
              {/* Competitor Analysis */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Top Competitors</Typography>
                <List>
                  {results.competitors.slice(0, 5).map((competitor) => (
                    <ListItem key={competitor.domain}>
                      <ListItemText
                        primary={competitor.domain}
                        secondary={`DA: ${competitor.domainAuthority} | Traffic: ${competitor.organicTraffic.toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Keyword Opportunities */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Top Keyword Opportunities</Typography>
                <List>
                  {results.keywords
                    .sort((a, b) => b.opportunity - a.opportunity)
                    .slice(0, 5)
                    .map((keyword) => (
                      <ListItem key={keyword.term}>
                        <ListItemText
                          primary={keyword.term}
                          secondary={`Volume: ${keyword.searchVolume.toLocaleString()} | Difficulty: ${keyword.difficulty}`}
                        />
                        <Chip
                          label={`Opportunity: ${(keyword.opportunity * 100).toFixed(0)}%`}
                          color="primary"
                          size="small"
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>

              {/* Content Gaps */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Content Recommendations</Typography>
                <List>
                  {results.content.contentGaps.map((gap) => (
                    <ListItem key={gap.topic}>
                      <ListItemText
                        primary={gap.topic}
                        secondary={`Priority: ${gap.priority}/10`}
                      />
                      <Chip
                        label="Missing Content"
                        color="warning"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* AI Recommendations */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  AI-Powered SEO Recommendations
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" whiteSpace="pre-line">
                      {results.aiRecommendations}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Website Analysis Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  label="Enter Website URL"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  fullWidth
                  error={Boolean(error)}
                  helperText={error}
                  disabled={isAnalyzing}
                />
                <Button
                  variant="contained"
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : <SearchIcon />}
                  onClick={handleAnalyze}
                  disabled={!url || isAnalyzing}
                  sx={{ height: 56 }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </Box>

              {(isAnalyzing || activeStep > 0) && (
                <Box sx={{ mt: 4 }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel>
                          {label}
                          {analysisStatus[label.toLowerCase().replace(' ', '') as keyof AnalysisStatus] === 'loading' && (
                            <CircularProgress size={16} sx={{ ml: 1 }} />
                          )}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {renderQuickStats()}

        {renderDetailedResults()}
      </Grid>
    </Box>
  );
};

export default Dashboard; 