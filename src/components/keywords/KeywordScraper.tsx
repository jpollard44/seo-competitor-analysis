import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  DataGrid,
  GridColDef as MuiGridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Keyword, KeywordAnalysis, KeywordGroup } from '../../types/keyword';
import KeywordFilters, { KeywordFilters as FilterType } from './KeywordFilters';
import KeywordGroups from './KeywordGroups';
import { scrapeKeywords } from '../../services/keyword';
import { groupKeywords } from '../../utils/keywordGrouping';
import KeywordMetrics from './KeywordMetrics';

// Add type definitions
type GridColDef = MuiGridColDef;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`keyword-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const columns: GridColDef[] = [
  { field: 'term', headerName: 'Keyword', flex: 1 },
  { field: 'searchVolume', headerName: 'Volume', width: 120 },
  { field: 'difficulty', headerName: 'Difficulty', width: 120 },
  { field: 'cpc', headerName: 'CPC', width: 100 },
  {
    field: 'currentRank',
    headerName: 'Rank',
    width: 100,
    renderCell: (params: GridRenderCellParams) => (
      params.value ? (
        <Chip 
          label={params.value} 
          color={params.value <= 10 ? "success" : "default"}
          size="small"
        />
      ) : '-'
    ),
  },
  {
    field: 'competitors',
    headerName: 'Top Competitors',
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {params.value.slice(0, 2).map((comp: { domain: string; rank: number }) => (
          <Chip
            key={comp.domain}
            label={`${comp.domain} (#${comp.rank})`}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    ),
  },
];

const KeywordScraper: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    minVolume: 0,
    maxVolume: 100000,
    minDifficulty: 0,
    maxDifficulty: 100,
    minCpc: 0,
    maxCpc: 50,
    hasRanking: false,
    hasCompetitors: false,
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis>({
    keywords: [],
    groups: [],
    stats: {
      totalKeywords: 0,
      averageDifficulty: 0,
      totalVolume: 0,
      opportunityScore: 0
    }
  });

  // Apply filters to keywords
  const getFilteredKeywords = (keywords: Keyword[]): Keyword[] => {
    return keywords.filter(keyword => {
      const matchesVolume = keyword.searchVolume >= filters.minVolume && 
                          keyword.searchVolume <= filters.maxVolume;
      
      const matchesDifficulty = keyword.difficulty >= filters.minDifficulty && 
                               keyword.difficulty <= filters.maxDifficulty;
      
      const matchesCpc = keyword.cpc >= filters.minCpc && 
                        keyword.cpc <= filters.maxCpc;
      
      const matchesRanking = !filters.hasRanking || 
                            (keyword.currentRank !== undefined);
      
      const matchesCompetitors = !filters.hasCompetitors || 
                                keyword.competitors.length > 0;
      
      const matchesSearch = !searchTerm || 
                          keyword.term.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesVolume && matchesDifficulty && matchesCpc && 
             matchesRanking && matchesCompetitors && matchesSearch;
    });
  };

  // Handle keyword data fetching and processing
  const fetchAndProcessKeywords = async () => {
    try {
      setLoading(true);
      const data = await scrapeKeywords(['competitor1.com', 'competitor2.com']);
      
      // Group the keywords
      const groups = groupKeywords(data.keywords);
      
      setKeywordAnalysis({
        ...data,
        groups
      });
      
      // Apply initial filters
      setKeywords(getFilteredKeywords(data.keywords));
    } catch (error) {
      console.error('Error fetching keywords:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  // Effect to apply filters when they change
  useEffect(() => {
    if (keywordAnalysis.keywords.length > 0) {
      setKeywords(getFilteredKeywords(keywordAnalysis.keywords));
    }
  }, [filters, searchTerm]);

  // Handle group selection
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = keywordAnalysis.groups.find((g: KeywordGroup) => g.id === groupId);
    if (group) {
      setKeywords(getFilteredKeywords(group.keywords));
    }
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilters(true);
  };

  // Handle filter apply
  const handleApplyFilters = (newFilters: FilterType) => {
    setFilters(newFilters);
    setKeywords(getFilteredKeywords(keywordAnalysis.keywords));
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchAndProcessKeywords();
  }, []);

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting keywords...');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ width: 300 }}>
        <KeywordGroups
          groups={keywordAnalysis.groups}
          onSelectGroup={handleGroupSelect}
          selectedGroupId={selectedGroupId}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack spacing={2}>
          <KeywordMetrics keywords={keywords} />
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Keyword Scraper</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={handleFilterClick}
                  >
                    Filters
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<ExportIcon />}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                </Box>
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="All Keywords" />
                  <Tab label="Opportunities" />
                  <Tab label="Ranking Keywords" />
                </Tabs>
              </Box>

              <Box sx={{ mt: 3, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ height: 400 }}>
                  <DataGrid
                    rows={keywords}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                  />
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {/* Opportunities tab content */}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {/* Ranking keywords tab content */}
              </TabPanel>
            </CardContent>
          </Card>
        </Stack>
      </Box>
      <KeywordFilters
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </Box>
  );
};

export default KeywordScraper; 