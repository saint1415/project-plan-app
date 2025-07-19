import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme/theme';
import AppHeader from './components/AppHeader';
import ProjectPlanPage from './components/ProjectPlanPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ProjectPlanPage />
      </Container>
    </ThemeProvider>
  );
}

export default App;
