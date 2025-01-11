import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Box sx={{ height: 64 }} /> {/* Navbar height offset */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 