import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
  return (
    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard; 