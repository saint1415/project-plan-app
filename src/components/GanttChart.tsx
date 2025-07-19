
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  // For demo: just a placeholder, you can integrate a real Gantt chart library later
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Gantt Chart (Coming Soon)
      </Typography>
      <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
        {/* Placeholder for Gantt chart */}
        <span>Gantt chart visualization will appear here.</span>
      </Box>
    </Paper>
  );
};

export default GanttChart;
