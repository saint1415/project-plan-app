import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

// PDF generation with jsPDF
import jsPDF from 'jspdf';

// Word document generation with docx
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const Export = () => {
  const { projectPlan } = useProjectPlan();
  const [exportError, setExportError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState('json');

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      let dataStr, fileName, mimeType, blob, url;

      if (format === 'json') {
        dataStr = JSON.stringify(projectPlan, null, 2);
        fileName = 'project-plan.json';
        mimeType = 'application/json';
        blob = new Blob([dataStr], { type: mimeType });
      } else if (format === 'csv') {
        // Flatten sections for CSV
        const headers = ['Section Title', 'Section Description', 'Created At'];
        const rows = projectPlan.sections.map(s => [
          JSON.stringify(s.title || ''),
          JSON.stringify(s.description || ''),
          JSON.stringify(s.createdAt || '')
        ]);
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        fileName = 'project-plan.csv';
        mimeType = 'text/csv';
        blob = new Blob([csvContent], { type: mimeType });
      } else if (format === 'pdf') {
        // Generate a simple PDF summary
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(projectPlan.title || 'Project Plan', 10, 20);
        
        doc.setFontSize(12);
        if (projectPlan.description) {
          const splitDescription = doc.splitTextToSize(projectPlan.description, 180);
          doc.text(splitDescription, 10, 35);
        }
        
        let y = projectPlan.description ? 50 : 35;
        
        projectPlan.sections.forEach((section, idx) => {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          
          doc.setFontSize(14);
          doc.text(`${idx + 1}. ${section.title || 'Untitled Section'}`, 10, y);
          y += 10;
          
          doc.setFontSize(11);
          if (section.description) {
            const splitText = doc.splitTextToSize(section.description, 180);
            doc.text(splitText, 15, y);
            y += splitText.length * 5;
          }
          y += 8;
        });
        
        fileName = 'project-plan.pdf';
        doc.save(fileName);
        setIsExporting(false);
        return;
      } else if (format === 'docx') {
        // Generate Word document
        const children = [];
        
        // Title
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: projectPlan.title || 'Project Plan',
                bold: true,
                size: 32
              })
            ],
            heading: HeadingLevel.TITLE
          })
        );
        
        // Description
        if (projectPlan.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: projectPlan.description,
                  size: 24
                })
              ]
            })
          );
          children.push(new Paragraph({ text: '' })); // Empty line
        }
        
        // Sections
        projectPlan.sections.forEach((section, idx) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${idx + 1}. ${section.title || 'Untitled Section'}`,
                  bold: true,
                  size: 28
                })
              ],
              heading: HeadingLevel.HEADING_1
            })
          );
          
          if (section.description) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.description,
                    size: 24
                  })
                ]
              })
            );
          }
          
          children.push(new Paragraph({ text: '' })); // Empty line
        });
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: children
          }]
        });
        
        blob = await Packer.toBlob(doc);
        fileName = 'project-plan.docx';
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else {
        throw new Error('Unsupported export format');
      }

      url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDescriptions = {
    json: 'Complete project data in JSON format',
    csv: 'Spreadsheet-compatible table format',
    pdf: 'Formatted document for viewing and printing',
    docx: 'Microsoft Word document format'
  };

  return (
    <div className="export-container">
      <h2>Export Project Plan</h2>
      <p>Download your project plan in your preferred format.</p>
      
      <div className="export-format-select">
        <label htmlFor="export-format">Format:</label>
        <select
          id="export-format"
          value={format}
          onChange={e => setFormat(e.target.value)}
          disabled={isExporting}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word (.docx)</option>
        </select>
        <p className="format-description">
          {formatDescriptions[format]}
        </p>
      </div>
      
      <button
        className="export-btn"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
      </button>
      
      {exportError && (
        <div className="export-error">
          <strong>Error:</strong> {exportError}
        </div>
      )}
    </div>
  );
};

Export.propTypes = {};

export default Export;
