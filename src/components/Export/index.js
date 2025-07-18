import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if your context is elsewhere

const Export = () => {
  const { projectPlan } = useProjectPlan();
  const [exportError, setExportError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format = 'json') => {
    setIsExporting(true);
    setExportError(null);

    try {
      let dataStr, fileName, mimeType;

      if (format === 'json') {
        dataStr = JSON.stringify(projectPlan, null, 2);
        fileName = 'project-plan.json';
        mimeType = 'application/json';
      } else {
        throw new Error('Unsupported export format');
      }

      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);

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

  return (
    <div className="export-container">
      <h2>Export Project Plan</h2>
      <p>Download your project plan as a JSON file for backup or sharing.</p>
      <button
        className="export-btn"
        onClick={() => handleExport('json')}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export as JSON'}
      </button>
      {exportError && <div className="export-error">{exportError}</div>}
    </div>
  );
};

Export.propTypes = {};

export default Export;
