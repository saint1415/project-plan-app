import React, { useState } from 'react';
import { Button, LoadingSpinner } from '../Common';
import { exportToPDF, exportToWord, exportToMarkdown, exportToExcel } from '../../utils';

const Export = ({ projectData, projectTitle = 'Project Plan' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('');

  const exportOptions = [
    { 
      id: 'pdf', 
      name: 'PDF', 
      icon: '📄', 
      description: 'Portable Document Format',
      handler: exportToPDF 
    },
    { 
      id: 'word', 
      name: 'Word', 
      icon: '📝', 
      description: 'Microsoft Word Document',
      handler: exportToWord 
    },
    { 
      id: 'markdown', 
      name: 'Markdown', 
      icon: '📋', 
      description: 'Markdown Text File',
      handler: exportToMarkdown 
    },
    { 
      id: 'excel', 
      name: 'Excel', 
      icon: '📊', 
      description: 'Microsoft Excel Spreadsheet',
      handler: exportToExcel 
    }
  ];

  const handleExport = async (format, handler) => {
    if (!projectData || Object.keys(projectData).length === 0) {
      alert('Please fill out at least one section before exporting.');
      return;
    }

    setIsExporting(true);
    setExportFormat(format);

    try {
      await handler(projectData, projectTitle);
    } catch (error) {
      console.error(`Export to ${format} failed:`, error);
      alert(`Failed to export to ${format}. Please try again.`);
    } finally {
      setIsExporting(false);
      setExportFormat('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Project Plan</h3>
        <p className="text-sm text-gray-600">
          Choose a format to download your project plan. All filled sections will be included.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleExport(option.id, option.handler)}
            disabled={isExporting}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex-shrink-0 text-2xl mr-3">{option.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">{option.name}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </div>
            {isExporting && exportFormat === option.id && (
              <LoadingSpinner size="sm" className="ml-2" />
            )}
          </button>
        ))}
      </div>

      {projectData && Object.keys(projectData).length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-green-700">
              Ready to export! {Object.keys(projectData).length} section(s) completed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Export;
