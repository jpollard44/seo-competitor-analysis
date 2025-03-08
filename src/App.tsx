import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { ComprehensiveAnalysis } from './services/ai-agents/types';
import { analyzeSEO, fetchHtmlContent } from './services/api/seoAnalysis';

// Import components individually to avoid circular dependencies
import ComprehensiveReport from './components/visualization/ComprehensiveReport';
import { SiteDescriptionAgent, SiteDescriptionAnalysis } from './services/ai-agents/site-description.agent';
import { CompetitorAnalysisAgent, CompetitorAnalysis } from './services/ai-agents/competitor-analysis.agent';
import { KeywordResearchAgent, KeywordResearchAnalysis } from './services/ai-agents/keyword-research.agent';
import ApiKeyTest from './components/ApiKeyTest';
import AnalysisForm from './components/AnalysisForm';

// Define the analysis form data interface
interface AnalysisFormData {
  url: string;
  htmlSnippet?: string;
  targetKeywords?: string[];
}

// Define the analysis result interface
interface AnalysisResult {
  analysis: ComprehensiveAnalysis;
  siteDescription: string;
  competitors: Array<{
    name: string;
    url: string;
    overlapScore: number;
    commonKeywords: string[];
  }>;
  topKeywords: Array<{
    keyword: string;
    volume: number;
    difficulty: number;
    relevance: number;
  }>;
  competitorAnalysis: CompetitorAnalysis | null;
  keywordAnalysis: KeywordResearchAnalysis | null;
}

// Define the analysis stages
const ANALYSIS_STAGES = [
  'Fetching website content',
  'Analyzing Technical SEO',
  'Analyzing Content',
  'Analyzing User Experience',
  'Analyzing Mobile Optimization',
  'Analyzing Competitors',
  'Researching Keywords',
  'Generating Report'
];

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordResearchAnalysis | null>(null);
  const [isGeneratingCompetitorAnalysis, setIsGeneratingCompetitorAnalysis] = useState(false);
  const [isGeneratingKeywordAnalysis, setIsGeneratingKeywordAnalysis] = useState(false);
  const [isGeneratingSiteDescription, setIsGeneratingSiteDescription] = useState(false);
  
  // Error handling
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  
  // Check for stored API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyDialog(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyDialog(false);
    }
  };

  const analyzeSiteDescription = async (url: string, html: string) => {
    if (!apiKey) {
      console.warn('No API key provided for site description analysis');
      return;
    }
    
    try {
      setIsGeneratingSiteDescription(true);
      setNotification('Analyzing website content to generate description...');
      console.log('Starting site description analysis for URL:', url);
      
      const siteDescriptionAgent = new SiteDescriptionAgent(apiKey);
      
      // Add a timeout to ensure we don't wait forever
      const timeoutPromise = new Promise<SiteDescriptionAnalysis>((_, reject) => {
        setTimeout(() => reject(new Error('Site description generation timed out')), 60000);
      });
      
      // Race the analysis against the timeout
      const descriptionResult = await Promise.race([
        siteDescriptionAgent.analyze(url, html),
        timeoutPromise
      ]);
      
      console.log('Site description analysis completed:', descriptionResult);
      
      // Update the analysis result with the new site description
      setAnalysisResult(prev => prev ? {
        ...prev,
        siteDescription: descriptionResult.description
      } : null);
      
      setIsGeneratingSiteDescription(false);
      setNotification('Site description generated successfully');
      setTimeout(() => setNotification(null), 3000);
      
    } catch (error) {
      console.error('Error generating site description:', error);
      
      // Check if it's an API key error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isApiKeyError = errorMessage.includes('API key');
      
      setIsGeneratingSiteDescription(false);
      
      setNotification(isApiKeyError 
        ? 'Invalid API key for OpenAI' 
        : 'Failed to generate site description');
      
      setTimeout(() => setNotification(null), 5000);
      
      // If it's an API key error, show the dialog
      if (isApiKeyError) {
        setShowApiKeyDialog(true);
      }
    }
  };

  const analyzeCompetitors = async (url: string, html: string) => {
    if (!apiKey) {
      console.warn('No API key provided for competitor analysis');
      return;
    }
    
    try {
      setIsGeneratingCompetitorAnalysis(true);
      setNotification('Analyzing competitors...');
      console.log('Starting competitor analysis for URL:', url);
      
      const competitorAgent = new CompetitorAnalysisAgent(apiKey);
      
      // Add a timeout to ensure we don't wait forever
      const timeoutPromise = new Promise<CompetitorAnalysis>((_, reject) => {
        setTimeout(() => reject(new Error('Competitor analysis timed out')), 60000);
      });
      
      // Race the analysis against the timeout
      const result = await Promise.race([
        competitorAgent.analyze(url, html),
        timeoutPromise
      ]);
      
      console.log('Competitor analysis completed:', result);
      setCompetitorAnalysis(result);
      setIsGeneratingCompetitorAnalysis(false);
      setNotification('Competitor analysis completed');
      setTimeout(() => setNotification(null), 3000);
      
    } catch (error) {
      console.error('Error generating competitor analysis:', error);
      setIsGeneratingCompetitorAnalysis(false);
      setNotification('Failed to generate competitor analysis');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const analyzeKeywords = async (url: string, html: string) => {
    if (!apiKey) {
      console.warn('No API key provided for keyword analysis');
      return;
    }
    
    try {
      setIsGeneratingKeywordAnalysis(true);
      setNotification('Analyzing keywords...');
      console.log('Starting keyword analysis for URL:', url);
      
      const keywordAgent = new KeywordResearchAgent(apiKey);
      
      // Add a timeout to ensure we don't wait forever
      const timeoutPromise = new Promise<KeywordResearchAnalysis>((_, reject) => {
        setTimeout(() => reject(new Error('Keyword analysis timed out')), 60000);
      });
      
      // Race the analysis against the timeout
      const result = await Promise.race([
        keywordAgent.analyze(url, html),
        timeoutPromise
      ]);
      
      console.log('Keyword analysis completed:', result);
      setKeywordAnalysis(result);
      setIsGeneratingKeywordAnalysis(false);
      setNotification('Keyword analysis completed');
      setTimeout(() => setNotification(null), 3000);
      
    } catch (error) {
      console.error('Error generating keyword analysis:', error);
      setIsGeneratingKeywordAnalysis(false);
      setNotification('Failed to generate keyword analysis');
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // Handle form submission
  const handleAnalysis = async (formData: AnalysisFormData) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCompetitorAnalysis(null);
    setKeywordAnalysis(null);
    setError('');
    
    try {
      // Start the analysis process
      await runAnalysisWithProgress(formData);
    } catch (error: unknown) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
      setShowError(true);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage('');
      setAnalysisProgress(0);
    }
  };
  
  // Simulate the analysis process with progress updates
  const runAnalysisWithProgress = async (formData: AnalysisFormData) => {
    // Validate URL format
    let validUrl = formData.url;
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }
    
    try {
      // Fetch HTML content
      setAnalysisStage('Fetching website content');
      setAnalysisProgress(10);
      setNotification('Attempting to fetch website content...');
      
      const html = await fetchHtmlContent(validUrl);
      setNotification(null);
      setAnalysisProgress(20);
      
      // Start all analyses in parallel
      setAnalysisStage('Analyzing website content');
      setAnalysisProgress(30);
      
      // Start the specialized analyses in parallel
      analyzeSiteDescription(validUrl, html);
      analyzeCompetitors(validUrl, html);
      analyzeKeywords(validUrl, html);
      
      // Progress through the remaining stages
      for (let i = 2; i < ANALYSIS_STAGES.length; i++) {
        const stage = ANALYSIS_STAGES[i];
        setAnalysisStage(stage);
        setAnalysisProgress(30 + (i * 10));
        // Short delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Call the main analysis service
      setAnalysisStage('Generating Report');
      setAnalysisProgress(90);
      
      const result = await analyzeSEO(
        validUrl, 
        formData.htmlSnippet || '', 
        formData.targetKeywords ? formData.targetKeywords.join(',') : undefined
      );
      
      // Validate that the result has the expected structure
      if (!result || !result.technical) {
        throw new Error('Invalid analysis result: missing required data');
      }
      
      // Create a properly structured AnalysisResult object
      const analysisResult: AnalysisResult = {
        analysis: result,
        siteDescription: "Analysis complete", // Default value, will be updated by analyzeSiteDescription
        competitors: [],
        topKeywords: [],
        competitorAnalysis: null,
        keywordAnalysis: null
      };
      
      setAnalysisResult(analysisResult);
      setAnalysisProgress(100);
      setNotification('Analysis complete!');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error during analysis:', error);
      throw new Error('Failed to analyze the website. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          SEO Analysis Dashboard
        </Typography>
        
        {/* Single Analysis Form */}
        <AnalysisForm 
          onSubmit={handleAnalysis} 
          isAnalyzing={isAnalyzing}
          analysisStage={analysisStage}
          analysisProgress={analysisProgress}
        />
        
        {/* Analysis Results */}
        {analysisResult && analysisResult.analysis && analysisResult.analysis.technical && (
          <ComprehensiveReport 
            analysis={analysisResult.analysis}
            siteDescription={analysisResult.siteDescription}
            competitors={competitorAnalysis?.mainCompetitors || []}
            topKeywords={keywordAnalysis?.primaryKeywords || []}
            isGeneratingSiteDescription={isGeneratingSiteDescription}
            isGeneratingCompetitorAnalysis={isGeneratingCompetitorAnalysis}
            isGeneratingKeywordAnalysis={isGeneratingKeywordAnalysis}
            competitorAnalysis={competitorAnalysis}
            keywordAnalysis={keywordAnalysis}
          />
        )}
      </Box>
      
      {/* Notifications and Dialogs */}
      <Snackbar
        open={!!notification}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onClose={() => setShowApiKeyDialog(false)}>
        <DialogTitle>Enter OpenAI API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To analyze websites, we need your OpenAI API key. This will be stored locally in your browser.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="OpenAI API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          
          {apiKey && <ApiKeyTest apiKey={apiKey} />}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiKeyDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveApiKey} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App; 