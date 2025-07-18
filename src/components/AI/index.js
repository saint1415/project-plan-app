import React, { useState } from 'react';
import { Button, Modal } from '../Common';
import { copyToClipboard } from '../../utils';

const AI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const promptTemplates = [
    {
      id: 'project-overview',
      title: 'Project Overview',
      description: 'Generate a comprehensive project overview',
      template: `Please help me create a professional project overview. Here's what I have so far:

[USER_TEXT]

Please expand this into a comprehensive project overview that includes:
- Clear project purpose and objectives
- Key stakeholders and their roles
- High-level scope and deliverables
- Success criteria
- Timeline overview

Make it professional and suitable for executive presentation.`
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Identify and analyze project risks',
      template: `Based on this project information:

[USER_TEXT]

Please help me identify potential risks and create mitigation strategies. For each risk, provide:
- Risk description
- Probability (High/Medium/Low)
- Impact (High/Medium/Low)
- Mitigation strategy
- Contingency plan

Focus on common project management risks like scope creep, resource constraints, technical challenges, and timeline issues.`
    },
    {
      id: 'stakeholder-analysis',
      title: 'Stakeholder Analysis',
      description: 'Analyze project stakeholders',
      template: `Help me analyze stakeholders for this project:

[USER_TEXT]

Please provide:
- Complete stakeholder list with roles
- Influence vs Interest matrix
- Communication preferences for each stakeholder
- Engagement strategies
- Potential concerns and how to address them

Make it comprehensive for effective stakeholder management.`
    },
    {
      id: 'timeline-optimization',
      title: 'Timeline Optimization',
      description: 'Optimize project timeline and milestones',
      template: `Review this project timeline:

[USER_TEXT]

Please help optimize it by:
- Identifying critical path activities
- Suggesting realistic timeframes
- Recommending key milestones
- Identifying dependencies
- Proposing buffer time for risks

Provide a structured timeline with phases, activities, and durations.`
    }
  ];

  const handlePromptSelect = async (prompt) => {
    try {
      await copyToClipboard(prompt.template);
      setSelectedPrompt(prompt);
      alert(`Prompt "${prompt.title}" copied to clipboard! You can now paste it into your preferred AI service.`);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      alert('Failed to copy prompt. Please copy manually.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Prompt Templates</h3>
        <p className="text-sm text-gray-600">
          Pre-configured prompts to help you get better results from AI services. Click to copy and use with ChatGPT, Gemini, or other AI tools.
        </p>
      </div>

      <div className="space-y-3">
        {promptTemplates.map((prompt) => (
          <div
            key={prompt.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{prompt.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => handlePromptSelect(prompt)}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Prompt
              </Button>
              <button
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setIsModalOpen(true);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700">
            <strong>Tip:</strong> Replace [USER_TEXT] in the prompt with your actual project content for best results.
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPrompt?.title || 'Prompt Preview'}
        className="max-w-2xl"
      >
        {selectedPrompt && (
          <div>
            <p className="text-sm text-gray-600 mb-4">{selectedPrompt.description}</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {selectedPrompt.template}
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => handlePromptSelect(selectedPrompt)}>
                Copy Prompt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AI;
