
import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import ExportMenu from './ExportMenu';
import ExportDocx from './ExportDocx';
import { Task, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Define project scope',
    description: 'Clarify what is in and out of scope.',
    status: 'Not Started',
    priority: 'High',
    startDate: new Date(),
    endDate: null,
    tags: [],
    progress: 0,
    dependencies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Kickoff meeting',
    description: 'Meet with stakeholders to align on goals.',
    status: 'In Progress',
    priority: 'Medium',
    startDate: new Date(),
    endDate: null,
    tags: [],
    progress: 50,
    dependencies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const statusColumns: TaskStatus[] = [
  'Not Started',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled',
];

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task
      )
    );
  };

  return (
    <>
      <ExportMenu tasks={tasks} />
      <ExportDocx tasks={tasks} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {statusColumns.map(status => (
            <Grid item xs={12} sm={6} md={2.4} key={status}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                {status}
              </Typography>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: 200,
                      background: snapshot.isDraggingOver ? '#e0e7ff' : '#f1f5f9',
                      borderRadius: 2,
                      p: 1,
                    }}
                  >
                    {tasks
                      .filter(task => task.status === status)
                      .map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                marginBottom: 12,
                                ...provided.draggableProps.style,
                              }}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {tasks.filter(task => task.status === status).length === 0 && (
                      <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
                        <Typography variant="body2">No tasks</Typography>
                      </Box>
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" color="primary">
            Add Task
          </Button>
        </Box>
      </DragDropContext>
    </>
  );
};

export default TaskBoard;
