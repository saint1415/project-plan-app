import React, { useState } from 'react';
import { Button, InputField, Modal } from '../Common';

const Collaboration = ({ projectData, onProjectUpdate }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareMethod, setShareMethod] = useState('file');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [shareableLink, setShareableLink] = useState('');

  const handleExportForSharing = () => {
    if (!projectData || Object.keys(projectData).length === 0) {
      alert('Please add some content before sharing.');
      return;
    }

    const projectJson = JSON.stringify(projectData, null, 2);
    const blob = new Blob([projectJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSharedProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (window.confirm('Import this project? This will replace your current project data.')) {
          onProjectUpdate(importedData);
        }
      } catch (error) {
        alert('Invalid project file. Please select a valid project plan file.');
      }
    };
    reader.readAsText(file);
  };

  const generateShareableLink = () => {
    // This is a placeholder for future implementation
    // In a real app, this would upload to a cloud service and return a shareable link
    const mockLink = `https://project-plan-app.com/shared/${Date.now()}`;
    setShareableLink(mockLink);
    navigator.clipboard.writeText(mockLink).then(() => {
      alert('Shareable link copied to clipboard! (Note: This is a demo link)');
    });
  };

  const collaborationMethods = [
    {
      id: 'file',
      title: 'File Sharing',
      description: 'Export and import project files',
      icon: '📁',
      available: true
    },
    {
      id: 'link',
      title: 'Shareable Link',
      description: 'Generate a link others can access',
      icon: '🔗',
      available: false // Future feature
    },
    {
      id: 'realtime',
      title: 'Real-time Collaboration',
      description: 'Work together simultaneously',
      icon: '👥',
      available: false // Future feature
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration</h3>
        <p className="text-sm text-gray-600">
          Share your project plan with team members and stakeholders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {collaborationMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 ${
              method.available 
                ? 'border-gray-200 hover:bg-gray-50 cursor-pointer' 
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
            onClick={() => method.available && setShareMethod(method.id)}
          >
            <div className="text-2xl mb-2">{method.icon}</div>
            <h4 className="font-medium text-gray-900 mb-1">{method.title}</h4>
            <p className="text-sm text-gray-600">{method.description}</p>
            {!method.available && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">File-Based Collaboration</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExportForSharing} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export for Sharing
            </Button>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded font-medium hover:bg-gray-300 cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Shared Project
              <input
                type="file"
                accept=".json"
                onChange={handleImportSharedProject}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <strong>How it works:</strong> Export your project as a JSON file and share it with collaborators. 
              They can import it into their own instance of the app to view and edit.
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-700">
              <strong>Coming Soon:</strong> Real-time collaboration, shareable links, and cloud synchronization features are in development.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
