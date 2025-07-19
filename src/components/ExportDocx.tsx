import React from 'react';
import { Button } from '@mui/material';
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { Task } from '../types';

interface ExportDocxProps {
  tasks: Task[];
}

const ExportDocx: React.FC<ExportDocxProps> = ({ tasks }) => {
  const handleExport = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Project Tasks",
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 300 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Title")] }),
                    new TableCell({ children: [new Paragraph("Description")] }),
                    new TableCell({ children: [new Paragraph("Status")] }),
                    new TableCell({ children: [new Paragraph("Priority")] }),
                    new TableCell({ children: [new Paragraph("Start Date")] }),
                    new TableCell({ children: [new Paragraph("End Date")] }),
                  ],
                }),
                ...tasks.map(
                  (task) =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(task.title)] }),
                        new TableCell({ children: [new Paragraph(task.description)] }),
                        new TableCell({ children: [new Paragraph(task.status)] }),
                        new TableCell({ children: [new Paragraph(task.priority)] }),
                        new TableCell({ children: [new Paragraph(task.startDate ? task.startDate.toString().slice(0, 10) : "")] }),
                        new TableCell({ children: [new Paragraph(task.endDate ? task.endDate.toString().slice(0, 10) : "")] }),
                      ],
                    })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "project-tasks.docx");
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleExport} sx={{ ml: 2 }}>
      Export as DOCX
    </Button>
  );
};

export default ExportDocx;
