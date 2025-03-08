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
    description: 'Measures visual stability of the page.',
    howMeasured: 'Calculates unexpected layout shifts during page lifecycle.',
    goodRange: 'Good: < 0.1 | Needs Improvement: 0.1-0.25 | Poor: > 0.25',
    impact: 'Affects user experience and reading comfort.'
  },
  ttfb: {
    name: 'Time to First Byte (TTFB)',
    description: 'Measures server response time.',
    howMeasured: 'Time between request and first byte received.',
    goodRange: 'Good: < 0.8s | Needs Improvement: 0.8-1.8s | Poor: > 1.8s',
    impact: 'Indicates server and network performance.'
  },
  fcp: {
    name: 'First Contentful Paint (FCP)',
    description: 'Measures time until first content appears.',
    howMeasured: 'Tracks when first text/image is painted.',
    goodRange: 'Good: < 1.8s | Needs Improvement: 1.8-3s | Poor: > 3s',
    impact: 'Important for perceived load speed.'
  },
  si: {
    name: 'Speed Index',
    description: 'Measures how quickly content is visually displayed.',
    howMeasured: 'Analyzes visual progression of page load.',
    goodRange: 'Good: < 3.4s | Needs Improvement: 3.4-5.8s | Poor: > 5.8s',
    impact: 'Reflects overall perceived performance.'
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

export interface MetricDisplayProps {
  metricKey: string;
  value: number | string;
  unit?: string;
  showIcon?: boolean;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  metricKey,
  value,
  unit = '',
  showIcon = true
}) => {
  const metricInfo = metricDefinitions[metricKey];

  if (!metricInfo) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2">
        {value}
        {unit}
      </Typography>
      {showIcon && (
        <Tooltip title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2">{metricInfo.name}</Typography>
            <Typography variant="body2">{metricInfo.description}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>How it's measured:</strong><br />
              {metricInfo.howMeasured}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Target ranges:</strong><br />
              {metricInfo.goodRange}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Impact:</strong><br />
              {metricInfo.impact}
            </Typography>
          </Box>
        }>
          <InfoOutlined fontSize="small" sx={{ opacity: 0.7, cursor: 'help' }} />
        </Tooltip>
      )}
    </Box>
  );
};

export default MetricDisplay; 