import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip as MuiTooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  AreaChart,
  Area,
} from 'recharts';
import {
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  Fullscreen as FullscreenIcon,
  ArrowBack,
} from '@mui/icons-material';
import { Keyword, KeywordDrilldown } from '../../types/keyword';
import { motion, AnimatePresence } from 'framer-motion';
import { Fade, Grow } from '@mui/material';

interface KeywordMetricsProps {
  keywords: Keyword[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const KeywordMetrics: React.FC<KeywordMetricsProps> = ({ keywords }) => {
  const [selectedChart, setSelectedChart] = useState<string>('volume');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'difficulty' | 'cpc'>('volume');
  const [drilldownData, setDrilldownData] = useState<KeywordDrilldown | null>(null);
  const [chartView, setChartView] = useState<'overview' | 'drilldown'>('overview');

  // Prepare data for volume distribution
  const volumeDistribution = keywords.reduce((acc: any[], keyword) => {
    const range = Math.floor(keyword.searchVolume / 1000) * 1000;
    const existing = acc.find(item => item.range === range);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ range, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.range - b.range);

  // Prepare data for difficulty vs volume scatter plot
  const difficultyVsVolume = keywords.map(keyword => ({
    difficulty: keyword.difficulty,
    volume: keyword.searchVolume,
    term: keyword.term
  }));

  // Prepare data for ranking distribution
  const rankingDistribution = keywords.reduce((acc: any[], keyword) => {
    if (keyword.currentRank) {
      const range = keyword.currentRank <= 3 ? 'Top 3' :
                   keyword.currentRank <= 10 ? 'Top 10' :
                   keyword.currentRank <= 30 ? 'Top 30' : 'Other';
      const existing = acc.find(item => item.name === range);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: range, value: 1 });
      }
    }
    return acc;
  }, []);

  // Prepare competitor comparison data
  const competitorData = keywords.reduce((acc: any[], keyword) => {
    keyword.competitors.forEach(comp => {
      const existing = acc.find(item => item.domain === comp.domain);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ domain: comp.domain, count: 1 });
      }
    });
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 5);

  // Prepare opportunity score data
  const opportunityData = keywords.map(keyword => ({
    term: keyword.term,
    score: (keyword.searchVolume / 1000) * (100 - keyword.difficulty) / 100,
    volume: keyword.searchVolume,
    difficulty: keyword.difficulty,
  })).sort((a, b) => b.score - a.score).slice(0, 10);

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'High Volume',
      value: keywords.filter(k => k.searchVolume > 10000).length,
    },
    {
      metric: 'Low Difficulty',
      value: keywords.filter(k => k.difficulty < 30).length,
    },
    {
      metric: 'High CPC',
      value: keywords.filter(k => k.cpc > 5).length,
    },
    {
      metric: 'Top 10',
      value: keywords.filter(k => k.currentRank && k.currentRank <= 10).length,
    },
    {
      metric: 'Competitor Coverage',
      value: keywords.filter(k => k.competitors.length > 2).length,
    },
  ];

  // New data preparation for treemap
  const treeMapData = keywords.reduce((acc: any[], keyword) => {
    const category = keyword.term.split(' ')[0];
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += keyword.searchVolume;
      existing.keywords.push(keyword);
    } else {
      acc.push({
        name: category,
        value: keyword.searchVolume,
        keywords: [keyword]
      });
    }
    return acc;
  }, []);

  // Trend data (mock data - replace with real trend data if available)
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
    volume: Math.floor(Math.random() * 10000),
    difficulty: Math.floor(Math.random() * 100)
  }));

  const handleChartChange = (event: React.MouseEvent<HTMLElement>, newChart: string) => {
    if (newChart !== null) {
      setSelectedChart(newChart);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    // TODO: Implement chart export
    handleMenuClose();
  };

  const handleDrilldown = (category: string, data: Keyword[]) => {
    const metrics = {
      avgVolume: data.reduce((sum, k) => sum + k.searchVolume, 0) / data.length,
      avgDifficulty: data.reduce((sum, k) => sum + k.difficulty, 0) / data.length,
      totalKeywords: data.length,
      avgCpc: data.reduce((sum, k) => sum + k.cpc, 0) / data.length
    };

    setDrilldownData({
      category,
      keywords: data,
      metrics
    });
    setChartView('drilldown');
  };

  const renderDrilldownView = () => {
    if (!drilldownData) return null;

    return (
      <Fade in={chartView === 'drilldown'}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => setChartView('overview')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">{drilldownData.category} Analysis</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Metrics Summary</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      {Object.entries(drilldownData.metrics).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                          <Typography variant="body2" color="textSecondary">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="h6">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drilldownData.keywords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="searchVolume"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="difficulty"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    );
  };

  // Add TreeMap chart
  const renderTreeMap = () => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" gutterBottom>
        Keyword Categories Distribution
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeMapData}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            onClick={(data: any) => handleDrilldown(data.name, data.keywords)}
          >
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'grey.300' }}>
                      <Typography variant="body2">{data.name}</Typography>
                      <Typography variant="body2">
                        Keywords: {data.keywords.length}
                      </Typography>
                      <Typography variant="body2">
                        Volume: {data.value.toLocaleString()}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chartView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Keyword Metrics</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <ToggleButtonGroup
                  value={selectedChart}
                  exclusive
                  onChange={handleChartChange}
                  size="small"
                >
                  <ToggleButton value="volume">Volume</ToggleButton>
                  <ToggleButton value="difficulty">Difficulty</ToggleButton>
                  <ToggleButton value="opportunity">Opportunity</ToggleButton>
                  <ToggleButton value="competitors">Competitors</ToggleButton>
                </ToggleButtonGroup>
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleExport}>
                <FileDownloadIcon sx={{ mr: 1 }} /> Export Chart
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <FullscreenIcon sx={{ mr: 1 }} /> Full Screen
              </MenuItem>
            </Menu>

            {chartView === 'overview' ? (
              <Grid container spacing={3}>
                {/* Volume Distribution */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Search Volume Distribution
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeDistribution}>
                        <XAxis 
                          dataKey="range"
                          tickFormatter={(value) => `${value/1000}k`}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [value, 'Keywords']}
                          labelFormatter={(value) => `${value/1000}k searches`}
                        />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* Difficulty vs Volume */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Difficulty vs Volume
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="difficulty" 
                          name="Difficulty" 
                          domain={[0, 100]}
                        />
                        <YAxis 
                          dataKey="volume" 
                          name="Volume"
                          tickFormatter={(value) => `${value/1000}k`}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ payload }) => {
                            if (payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'grey.300' }}>
                                  <Typography variant="body2">{data.term}</Typography>
                                  <Typography variant="body2">Difficulty: {data.difficulty}</Typography>
                                  <Typography variant="body2">Volume: {data.volume.toLocaleString()}</Typography>
                                </Box>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          data={difficultyVsVolume} 
                          fill="#8884d8"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* Ranking Distribution */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ranking Distribution
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rankingDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {rankingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* New Radar Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Keyword Metrics Overview
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        <Radar
                          name="Keywords"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* Opportunity Score Chart */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Top Opportunities
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={opportunityData}
                        layout="vertical"
                        margin={{ left: 100 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="term" type="category" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                          content={({ payload }) => {
                            if (payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'grey.300' }}>
                                  <Typography variant="body2">{data.term}</Typography>
                                  <Typography variant="body2">Score: {data.score.toFixed(2)}</Typography>
                                  <Typography variant="body2">Volume: {data.volume.toLocaleString()}</Typography>
                                  <Typography variant="body2">Difficulty: {data.difficulty}</Typography>
                                </Box>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="score" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {renderTreeMap()}
              </Grid>
            ) : (
              renderDrilldownView()
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default KeywordMetrics; 