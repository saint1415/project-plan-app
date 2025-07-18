import React, { useState, useEffect } from 'react';
import { Button, InputField, Modal } from '../Common';

const Templates = ({ onLoadTemplate, currentProjectData }) => {
  const [templates, setTemplates] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('projectPlanTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  }, []);

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem('projectPlanTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }

    if (!currentProjectData || Object.keys(currentProjectData).length === 0) {
      alert('Please fill out at least one section before creating a template.');
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      description: templateDescription.trim(),
      data: { ...currentProjectData },
      createdAt: new Date().toISOString(),
      sectionsCount: Object.keys(currentProjectData).length
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setTemplateName('');
    setTemplateDescription('');
    setIsCreateModalOpen(false);
  };

  const handleLoadTemplate = (template) => {
    if (window.confirm(`Load template "${template.name}"? This will replace your current project data.`)) {
      onLoadTemplate(template.data);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (window.confirm(`Delete template "${template.name}"? This action cannot be undone.`)) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Templates</h3>
          <p className="text-sm text-gray-600">
            Save your current project as a template or load from existing templates.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h4>
          <p className="text-gray-600 mb-4">Create your first template to reuse project structures.</p>
          <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Template
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>{template.sectionsCount} sections</span>
                    <span>Created {formatDate(template.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleLoadTemplate(template)}
                    className="text-sm"
                  >
                    Load
                  </Button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete template"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Template"
      >
        <div className="space-y-4">
          <InputField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., Software Development Project"
            required
          />
          <InputField
            label="Description (Optional)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            placeholder="Brief description of when to use this template"
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Templates;
