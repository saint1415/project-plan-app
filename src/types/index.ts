
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date | null;
  endDate: Date | null;
  tags: string[];
  progress: number;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus =
  | 'Not Started'
  | 'In Progress'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';

export type TaskPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';
