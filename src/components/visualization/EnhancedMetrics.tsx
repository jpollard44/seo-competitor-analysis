import React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { MetricsData } from '../../services/ai-agents/types';
import { InfoOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

// Define metric descriptions directly in this file to avoid circular dependencies
interface MetricTooltipProps {
  name: string;
  value: number | string;
  description: string;
  goodRange: string;
  unit?: string;
}

const MetricTooltip: React.FC<MetricTooltipProps> = ({ 
  name, 
  value, 
  description, 
  goodRange,
  unit = '' 
}) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Typography variant="h6" component="div" sx={{ mr: 0.5 }}>
        {name}: {value}{unit}
      </Typography>
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" paragraph>
              {description}
            </Typography>
            <Typography variant="body2">
              <strong>Good Range:</strong> {goodRange}
            </Typography>
          </Box>
        }
      >
        <InfoOutlined fontSize="small" color="action" />
      </Tooltip>
    </Box>
  );
};

interface EnhancedMetricsProps {
  metrics: MetricsData;
}

const EnhancedMetrics: React.FC<EnhancedMetricsProps> = ({ metrics }) => {
  const theme = useTheme();

  const getColorForMetric = (metric: string, value: number): string => {
    switch (metric) {
      case 'lcp':
        return value < 2500 ? theme.palette.success.main : 
               value < 4000 ? theme.palette.warning.main : theme.palette.error.main;
      case 'fid':
        return value < 100 ? theme.palette.success.main : 
               value < 300 ? theme.palette.warning.main : theme.palette.error.main;
      case 'cls':
        return value < 0.1 ? theme.palette.success.main : 
               value < 0.25 ? theme.palette.warning.main : theme.palette.error.main;
      case 'ttfb':
        return value < 200 ? theme.palette.success.main : 
               value < 500 ? theme.palette.warning.main : theme.palette.error.main;
      case 'fcp':
        return value < 1800 ? theme.palette.success.main : 
               value < 3000 ? theme.palette.warning.main : theme.palette.error.main;
      default:
        return value > 70 ? theme.palette.success.main : 
               value > 50 ? theme.palette.warning.main : theme.palette.error.main;
    }
  };

  const metricDescriptions = {
    lcp: {
      name: 'Largest Contentful Paint',
      description: 'Measures when the largest content element becomes visible.',
      goodRange: '< 2.5s',
      unit: 'ms'
    },
    fid: {
      name: 'First Input Delay',
      description: 'Measures the time from first user interaction to browser response.',
      goodRange: '< 100ms',
      unit: 'ms'
    },
    cls: {
      name: 'Cumulative Layout Shift',
      description: 'Measures visual stability by quantifying unexpected layout shifts.',
      goodRange: '< 0.1',
      unit: ''
    },
    ttfb: {
      name: 'Time to First Byte',
      description: 'Measures the time between the request and the first byte of response.',
      goodRange: '< 200ms',
      unit: 'ms'
    },
    fcp: {
      name: 'First Contentful Paint',
      description: 'Measures the time until the first content is rendered.',
      goodRange: '< 1.8s',
      unit: 'ms'
    },
    si: {
      name: 'Speed Index',
      description: 'Measures how quickly content is visually displayed during page load.',
      goodRange: '< 3.4s',
      unit: 'ms'
    },
    mobileScore: {
      name: 'Mobile Score',
      description: 'Overall score for mobile performance and usability.',
      goodRange: '> 70',
      unit: ''
    },
    contentScore: {
      name: 'Content Score',
      description: 'Overall score for content quality and relevance.',
      goodRange: '> 70',
      unit: ''
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Performance Metrics
      </Typography>
      
      <Grid container spacing={3}>
        {Object.entries(metrics).map(([key, value]) => {
          const metricKey = key as keyof MetricsData;
          const metricInfo = metricDescriptions[metricKey as keyof typeof metricDescriptions];
          
          return (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 1, 
                border: 1, 
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <MetricTooltip 
                  name={metricInfo.name}
                  value={value}
                  description={metricInfo.description}
                  goodRange={metricInfo.goodRange}
                  unit={metricInfo.unit}
                />
                
                <Box sx={{ mt: 2, width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4 }}>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: typeof value === 'number' && value <= 100 ? `${value}%` : '70%',
                      bgcolor: getColorForMetric(key, value as number),
                      borderRadius: 4
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default EnhancedMetrics; 