import React, { useState, useEffect } from 'react';
import { Button, Modal } from '../Common';
import { copyToClipboard } from '../../utils';

// List of popular AI services
const AI_SERVICES = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com/' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/' },
  { id: 'copilot', name: 'Copilot', url: 'https://copilot.microsoft.com/' },
  { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/' }
];

const AI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showAIServices, setShowAIServices] = useState(false);
  const [customAIUrl, setCustomAIUrl] = useState('');
  const [customAIUrlInput, setCustomAIUrlInput] = useState('');

  // Load custom AI URL from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('customAIUrl') || '';
    setCustomAIUrl(savedUrl);
    setCustomAIUrlInput(savedUrl);
  }, []);

  const promptTemplates = [
    // ... (your existing promptTemplates array)
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
    // ... (other templates)
  ];

  const handlePromptSelect = async (prompt) => {
    try {
      await copyToClipboard(prompt.template);
      setSelectedPrompt(prompt);
      setShowAIServices(true);
      alert(`Prompt "${prompt.title}" copied to clipboard! Now open your preferred AI service.`);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      alert('Failed to copy prompt. Please copy manually.');
    }
  };

  const handleCustomAIUrlSave = () => {
    setCustomAIUrl(customAIUrlInput);
    localStorage.setItem('customAIUrl', customAIUrlInput);
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

      {/* AI Service Quick Links */}
      {showAIServices && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="mb-2 font-semibold text-green-800">
            Open your preferred AI service and paste the copied prompt:
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {AI_SERVICES.map(service => (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
              >
                {service.name}
              </a>
            ))}
            {customAIUrl && (
              <a
                href={customAIUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                My AI
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Set your own AI service URL"
              value={customAIUrlInput}
              onChange={e => setCustomAIUrlInput(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              style={{ minWidth: 220 }}
            />
            <Button
              variant="secondary"
              onClick={handleCustomAIUrlSave}
              disabled={!customAIUrlInput}
            >
              Save My AI URL
            </Button>
          </div>
          <button
            className="mt-2 text-xs text-gray-500 underline"
            onClick={() => setShowAIServices(false)}
          >
            Close
          </button>
        </div>
      )}

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
