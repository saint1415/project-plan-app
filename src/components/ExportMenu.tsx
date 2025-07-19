
import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { jsPDF } from 'jspdf';
import { Task } from '../types';

interface ExportMenuProps {
  tasks: Task[];
}

const ExportMenu: React.FC<ExportMenuProps> = ({ tasks }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Project Tasks', 10, 10);
    tasks.forEach((task, idx) => {
      doc.text(
        `${idx + 1}. ${task.title} [${task.status}] (${task.priority})`,
        10,
        20 + idx * 10
      );
    });
    doc.save('project-tasks.pdf');
    handleClose();
  };

  const exportCSV = () => {
    const csvRows = [
      ['Title', 'Description', 'Status', 'Priority', 'Start Date', 'End Date'],
      ...tasks.map((t) => [
        t.title,
        t.description,
        t.status,
        t.priority,
        t.startDate ? t.startDate.toISOString().split('T')[0] : '',
        t.endDate ? t.endDate.toISOString().split('T')[0] : '',
      ]),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((e) => e.join(',')).join('
');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'project-tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={exportPDF}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportCSV}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportMenu;
