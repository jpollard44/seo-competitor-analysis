import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

export interface MetricTooltipData {
  name: string;
  description: string;
  howMeasured: string;
  goodRange: string;
  impact: string;
}

export const metricDefinitions: Record<string, MetricTooltipData> = {
  lcp: {
    name: 'Largest Contentful Paint (LCP)',
    description: 'Measures when the largest content element becomes visible.',
    howMeasured: 'Tracks render time of the largest image or text block visible within viewport.',
    goodRange: 'Good: < 2.5s | Needs Improvement: 2.5s - 4s | Poor: > 4s',
    impact: 'Affects user perception of page load speed.'
  },
  fid: {
    name: 'First Input Delay (FID)',
    description: 'Measures the time from first user interaction to browser response.',
    howMeasured: 'Tracks the time between first user interaction and browser processing.',
    goodRange: 'Good: < 100ms | Needs Improvement: 100-300ms | Poor: > 300ms',
    impact: 'Critical for user experience and interactivity.'
  },
  cls: {
    name: 'Cumulative Layout Shift (CLS)',
    description: 'Measures visual stability by quantifying unexpected layout shifts.',
    howMeasured: 'Calculates the sum of all individual layout shift scores during page lifespan.',
    goodRange: 'Good: < 0.1 | Needs Improvement: 0.1-0.25 | Poor: > 0.25',
    impact: 'Affects user frustration when page elements move unexpectedly.'
  },
  ttfb: {
    name: 'Time to First Byte (TTFB)',
    description: 'Measures the time between the request and the first byte of response.',
    howMeasured: 'Calculated from request start to first byte of response received.',
    goodRange: 'Good: < 200ms | Needs Improvement: 200-500ms | Poor: > 500ms',
    impact: 'Indicates server response time and network conditions.'
  },
  fcp: {
    name: 'First Contentful Paint (FCP)',
    description: 'Measures the time until the first content is rendered.',
    howMeasured: 'Tracks when the browser renders the first bit of content from the DOM.',
    goodRange: 'Good: < 1.8s | Needs Improvement: 1.8-3s | Poor: > 3s',
    impact: 'Indicates when users first see content loading.'
  },
  si: {
    name: 'Speed Index (SI)',
    description: 'Measures how quickly content is visually displayed during page load.',
    howMeasured: 'Calculated by analyzing video recordings of page loads.',
    goodRange: 'Good: < 3.4s | Needs Improvement: 3.4-5.8s | Poor: > 5.8s',
    impact: 'Holistic measure of perceived loading performance.'
  },
  mobileScore: {
    name: 'Mobile Optimization Score',
    description: 'Overall mobile friendliness score.',
    howMeasured: 'Combines various mobile optimization metrics.',
    goodRange: 'Good: > 90 | Needs Improvement: 70-90 | Poor: < 70',
    impact: 'Critical for mobile SEO and user experience.'
  },
  contentScore: {
    name: 'Content Quality Score',
    description: 'Overall content quality assessment.',
    howMeasured: 'Analyzes readability, structure, and optimization.',
    goodRange: 'Good: > 85 | Needs Improvement: 65-85 | Poor: < 65',
    impact: 'Affects search rankings and user engagement.'
  }
};

interface MetricDisplayProps {
  metricKey: string;
  value: number | string;
  unit?: string;
  showDescription?: boolean;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  metricKey, 
  value, 
  unit = '', 
  showDescription = true 
}) => {
  const metricData = metricDefinitions[metricKey] || {
    name: metricKey,
    description: 'No description available',
    howMeasured: 'Not specified',
    goodRange: 'Not specified',
    impact: 'Not specified'
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="body1" sx={{ mr: 1 }}>
        <strong>{metricData.name}:</strong> {value}{unit}
      </Typography>
      
      {showDescription && (
        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {metricData.name}
              </Typography>
              <Typography variant="body2" paragraph>
                {metricData.description}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>How measured:</strong> {metricData.howMeasured}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Good range:</strong> {metricData.goodRange}
              </Typography>
              <Typography variant="body2">
                <strong>Impact:</strong> {metricData.impact}
              </Typography>
            </Box>
          }
        >
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      )}
    </Box>
  );
};

export default MetricDisplay; 