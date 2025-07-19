
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const AppHeader: React.FC = () => (
  <AppBar position="sticky" color="default" elevation={1}>
    <Toolbar>
      <Box
        component="img"
        src="/logo192.png"
        alt="Logo"
        sx={{ width: 40, height: 40, mr: 2 }}
      />
      <Typography variant="h5" color="primary" fontWeight={700}>
        Project Plan Pro
      </Typography>
    </Toolbar>
  </AppBar>
);

export default AppHeader;
