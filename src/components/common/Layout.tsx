import React from 'react';
import { Box, Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
        minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
      }}
    >
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 