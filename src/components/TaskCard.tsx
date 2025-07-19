
import React from 'react';
import { Card, CardContent, Typography, Chip, Box, LinearProgress } from '@mui/material';
import { Task } from '../types';
import { formatDate, getPriorityColor, getStatusColor } from '../utils';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Card sx={{ mb: 1, borderLeft: `4px solid`, borderColor: getPriorityColor(task.priority) }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {task.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
          <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Start: {formatDate(task.startDate)} | End: {formatDate(task.endDate)}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={task.progress} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
