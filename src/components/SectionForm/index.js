import React, { useState } from 'react';
import { TextArea, Button } from '../Common';
import { copyToClipboard } from '../../utils';

const SectionForm = ({ 
  title, 
  description, 
  placeholder, 
  value, 
  onChange, 
  aiPromptTemplate,
  required = false 
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState('');

  const aiServices = [
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com' },
    { id: 'gemini', name: 'Google Gemini', url: 'https://gemini.google.com' },
    { id: 'claude', name: 'Claude', url: 'https://claude.ai' },
    { id: 'copilot', name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com' }
  ];

  const handleAISuggestion = () => {
    setIsAIModalOpen(true);
  };

  const handleAIServiceSelect = async (service) => {
    const prompt = aiPromptTemplate.replace('[USER_TEXT]', value || 'No content provided yet.');
    
    try {
      await copyToClipboard(prompt);
      window.open(service.url, '_blank');
      setIsAIModalOpen(false);
      setSelectedAI('');
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      alert('Failed to copy prompt. Please copy manually.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <TextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={6}
        required={required}
        className="mb-4"
      />

      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          onClick={handleAISuggestion}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Suggest with AI
        </Button>
        
        <div className="text-sm text-gray-500">
          {value?.length || 0} characters
        </div>
      </div>

      {/* AI Service Selection Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsAIModalOpen(false)} />
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose AI Service</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your text and a helpful prompt will be copied to your clipboard. Select an AI service to open:
              </p>
              <div className="space-y-2">
                {aiServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleAIServiceSelect(service)}
                    className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={() => setIsAIModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionForm;
