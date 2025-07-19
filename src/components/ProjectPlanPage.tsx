
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import TaskBoard from './TaskBoard';
import GanttChart from './GanttChart';

const ProjectPlanPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h2" gutterBottom>
        Project Plan
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Welcome to your modern project plan! Add tasks, track progress, and export your plan.
        </Typography>
      </Paper>
      <TaskBoard />
      <GanttChart tasks={[]} />
    </Box>
  );
};

export default ProjectPlanPage;
