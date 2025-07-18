import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

// Example templates (expand as needed)
const TEMPLATES = [
  {
    id: 'basic',
    name: 'Basic Project',
    description: 'A simple project plan with introduction, goals, and tasks.',
    data: {
      title: 'New Project',
      description: 'This is a basic project template.',
      sections: [
        { id: '1', title: 'Introduction', description: 'Project overview and context.' },
        { id: '2', title: 'Goals', description: 'List of project goals.' },
        { id: '3', title: 'Tasks', description: 'Key tasks and milestones.' }
      ],
      metadata: {
        version: '1.0.0'
      }
    }
  },
  {
    id: 'agile',
    name: 'Agile Sprint Plan',
    description: 'A template for agile teams planning a sprint.',
    data: {
      title: 'Sprint Plan',
      description: 'Template for agile sprint planning.',
      sections: [
        { id: '1', title: 'Sprint Goals', description: 'What do we want to achieve this sprint?' },
        { id: '2', title: 'User Stories', description: 'List of user stories and acceptance criteria.' },
        { id: '3', title: 'Tasks', description: 'Breakdown of tasks for the sprint.' },
        { id: '4', title: 'Retrospective', description: 'Notes and learnings from the sprint.' }
      ],
      metadata: {
        version: '1.0.0'
      }
    }
  }
];

const Templates = () => {
  const { loadTemplate, setActiveView } = useProjectPlan();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);

  const handleApplyTemplate = async (template) => {
    setIsLoading(true);
    setApplyError(null);
    try {
      // Simulate async if needed
      await new Promise(res => setTimeout(res, 300));
      loadTemplate(template.data);
      setActiveView('editor');
    } catch (err) {
      setApplyError('Failed to apply template: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="templates-container">
      <h2>Project Templates</h2>
      <p>Select a template to quickly start your project plan.</p>
      <div className="templates-list">
        {TEMPLATES.map(template => (
          <div
            key={template.id}
            className={`template-card${selectedTemplate && selectedTemplate.id === template.id ? ' selected' : ''}`}
            onClick={() => setSelectedTemplate(template)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedTemplate && selectedTemplate.id === template.id}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <button
              className="apply-template-btn"
              onClick={e => {
                e.stopPropagation();
                handleApplyTemplate(template);
              }}
              disabled={isLoading}
            >
              {isLoading && selectedTemplate && selectedTemplate.id === template.id
                ? 'Applying...'
                : 'Apply Template'}
            </button>
          </div>
        ))}
      </div>
      {applyError && <div className="template-error">{applyError}</div>}
      {selectedTemplate && (
        <div className="template-preview">
          <h4>Preview: {selectedTemplate.name}</h4>
          <ul>
            {selectedTemplate.data.sections.map(section => (
              <li key={section.id}>
                <strong>{section.title}:</strong> {section.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Templates.propTypes = {};

export default Templates;
