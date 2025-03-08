import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  TextField,
  Paper,
  Alert
} from '@mui/material';
import { generateAnalysis } from '../services/api/openai';

interface ApiKeyTestProps {
  apiKey: string;
}

const ApiKeyTest: React.FC<ApiKeyTestProps> = ({ apiKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState('Describe what an SEO tool does in one sentence.');

  const testApiKey = async () => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await generateAnalysis(
        apiKey,
        'You are a helpful assistant.',
        testPrompt
      );
      
      setResult(response);
    } catch (err) {
      console.error('API key test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Test OpenAI API Key
      </Typography>
      
      <TextField
        fullWidth
        label="Test Prompt"
        variant="outlined"
        value={testPrompt}
        onChange={(e) => setTestPrompt(e.target.value)}
        margin="normal"
      />
      
      <Button 
        variant="contained" 
        onClick={testApiKey} 
        disabled={isLoading || !apiKey}
        sx={{ mt: 2, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Test API Key'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            API Response:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2">
              {result}
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default ApiKeyTest; 