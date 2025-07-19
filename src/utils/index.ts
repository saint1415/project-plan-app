
import { format } from 'date-fns';

export function formatDate(date: Date | null): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

export function getPriorityColor(priority: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' {
  switch (priority) {
    case 'Critical':
      return 'error';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'primary';
    case 'Low':
    default:
      return 'default';
  }
}

export function getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'primary';
    case 'On Hold':
      return 'warning';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
}
