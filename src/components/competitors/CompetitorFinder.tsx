import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  DataGrid,
  GridColDef as MuiGridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Competitor } from '../../types/competitor';

// Add type definitions
type GridColDef = MuiGridColDef;

const columns: GridColDef[] = [
  { field: 'domain', headerName: 'Domain', flex: 1 },
  { field: 'domainAuthority', headerName: 'DA', width: 90 },
  { field: 'organicTraffic', headerName: 'Traffic', width: 120 },
  { field: 'keywordOverlap', headerName: 'Keyword Overlap', width: 140 },
  { field: 'type', headerName: 'Type', width: 100 },
  {
    field: 'rankings',
    headerName: 'Top Rankings',
    width: 160,
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2">
        {`Top 3: ${params.value.top3} | Top 10: ${params.value.top10}`}
      </Typography>
    ),
  },
];

const CompetitorFinder: React.FC = () => {
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Integrate with actual API
      // This is mock data for now
      const mockCompetitors: Competitor[] = [
        {
          domain: 'competitor1.com',
          domainAuthority: 45,
          organicTraffic: 150000,
          keywordOverlap: 67,
          type: 'product',
          rankings: { top3: 12, top10: 45, total: 156 }
        },
        // Add more mock data...
      ];

      setCompetitors(mockCompetitors);
    } catch (err) {
      setError('Failed to analyze competitors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Competitor Finder
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Your Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select
              value={industry}
              label="Industry"
              onChange={(e) => setIndustry(e.target.value)}
            >
              <MenuItem value="ecommerce">E-commerce</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="health">Healthcare</MenuItem>
              <MenuItem value="education">Education</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading || !website || !industry}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {competitors.length > 0 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={competitors}
              columns={columns}
              getRowId={(row: Competitor) => row.domain}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorFinder; 