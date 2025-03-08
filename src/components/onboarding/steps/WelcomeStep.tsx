import React from 'react';
import { Box, Typography } from '@mui/material';
import { Rocket as RocketIcon } from '@mui/icons-material';

const WelcomeStep: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <RocketIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Welcome to SEO Tool!
      </Typography>
      <Typography color="textSecondary">
        Let's set up your account in just a few steps. We'll help you track your competitors,
        find keyword opportunities, and improve your SEO strategy.
      </Typography>
    </Box>
  );
};

export default WelcomeStep; 