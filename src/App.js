import React, { useState, createContext, useContext } from 'react';
import './styles.css';

// Import all components
import SectionForm from './components/SectionForm';
import Export from './components/Export';
import Templates from './components/Templates';
import Collaboration from './components/Collaboration';
import AI from './components/AI';
import Analytics from './components/Analytics';
import Auth from './components/Auth';

// Create Project Plan Context
const ProjectPlanContext = createContext();

// Custom hook to use the context
export const useProjectPlan = () => {
  const context = useContext(ProjectPlanContext);
  if (!context) {
    throw new Error('useProjectPlan must be used within a ProjectPlanProvider');
  }
  return context;
};

// Project Plan Provider Component
const ProjectPlanProvider = ({ children }) => {
  // Main project plan state
  const [projectPlan, setProjectPlan] = useState({
    title: '',
    description: '',
    sections: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  });

  // Current user state
  const [user, setUser] = useState(null);

  // Active view state
  const [activeView, setActiveView] = useState('editor');

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Add a new section to the project plan
  const addSection = (section) => {
    const newSection = {
      id: Date.now().toString(),
      ...section,
      createdAt: new Date().toISOString()
    };

    setProjectPlan(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Update an existing section
  const updateSection = (sectionId, updates) => {
    setProjectPlan(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates, updatedAt: new Date().toISOString() }
          : section
      ),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Delete a section
  const deleteSection = (sectionId) => {
    setProjectPlan(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Update project metadata
  const updateProjectMetadata = (updates) => {
    setProjectPlan(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Load a template
  const loadTemplate = (template) => {
    setProjectPlan({
      ...template,
      metadata: {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  };

  const contextValue = {
    // State
    projectPlan,
    user,
    activeView,
    isLoading,

    // Actions
    setProjectPlan,
    setUser,
    setActiveView,
    setIsLoading,
    addSection,
    updateSection,
    deleteSection,
    updateProjectMetadata,
    loadTemplate
  };

  return (
    <ProjectPlanContext.Provider value={contextValue}>
      {children}
    </ProjectPlanContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const { activeView, setActiveView, user } = useProjectPlan();

  const navItems = [
    { id: 'editor', label: 'Project Editor', icon: '📝' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'collaboration', label: 'Collaboration', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'export', label: 'Export', icon: '📤' }
  ];

  return (
    <nav className="app-navigation">
      <div className="nav-brand">
        <h2>Project Plan App</h2>
      </div>
      <div className="nav-items">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-user">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
          </div>
        ) : (
          <button onClick={() => setActiveView('auth')}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

// Main Content Component
const MainContent = () => {
  const { activeView, projectPlan } = useProjectPlan();

  const renderActiveView = () => {
    switch (activeView) {
      case 'editor':
        return <SectionForm />;
      case 'templates':
        return <Templates />;
      case 'ai':
        return <AI />;
      case 'collaboration':
        return <Collaboration />;
      case 'analytics':
        return <Analytics />;
      case 'export':
        return <Export />;
      case 'auth':
        return <Auth />;
      default:
        return <SectionForm />;
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>{projectPlan.title || 'Untitled Project'}</h1>
        {projectPlan.description && (
          <p className="project-description">{projectPlan.description}</p>
        )}
      </div>
      <div className="content-body">
        {renderActiveView()}
      </div>
    </main>
  );
};

// Main App Component
function App() {
  return (
    <ProjectPlanProvider>
      <div className="app">
        <Navigation />
        <MainContent />
      </div>
    </ProjectPlanProvider>
  );
}

export default App;
