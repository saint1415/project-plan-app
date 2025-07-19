import React, { useState, createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import './styles.css';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const ProjectStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  APPROVED: 'approved',
  ARCHIVED: 'archived'
};

const UserRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

const ProjectMethodologies = {
  TRADITIONAL: 'traditional',
  AGILE: 'agile',
  HYBRID: 'hybrid',
  LEAN: 'lean',
  PRINCE2: 'prince2'
};

// Enhanced PMBOK Sections with professional structure
const ENHANCED_PMBOK_SECTIONS = {
  'project-charter': {
    id: 'project-charter',
    title: 'Project Charter',
    description: 'High-level project purpose, objectives, and authority',
    category: 'Initiating',
    processGroup: 'initiating',
    knowledgeArea: 'integration',
    required: true,
    estimatedTime: 8,
    complexity: 'medium',
    fields: [
      { id: 'purpose', label: 'Project Purpose', type: 'textarea', required: true },
      { id: 'objectives', label: 'Project Objectives', type: 'textarea', required: true },
      { id: 'success-criteria', label: 'Success Criteria', type: 'textarea', required: true },
      { id: 'assumptions', label: 'Key Assumptions', type: 'textarea', required: false },
      { id: 'constraints', label: 'Project Constraints', type: 'textarea', required: false }
    ],
    aiPrompt: `Create a comprehensive Project Charter that establishes project authority:

**Project Context:** [USER_TEXT]

Please develop:
1. **Business Case & Justification** - Clear business need and ROI
2. **Project Objectives (SMART)** - Specific, measurable outcomes  
3. **High-Level Scope** - Major deliverables and milestones
4. **Stakeholder Overview** - Key stakeholders and decision structure
5. **Assumptions & Constraints** - Resource, timeline, and technology limitations
6. **Risk Overview** - Major risk categories and mitigation strategies

Format as an executive-ready document suitable for sponsor approval.`
  },
  'stakeholder-management': {
    id: 'stakeholder-management',
    title: 'Stakeholder Management Plan',
    description: 'Stakeholder analysis and engagement strategies',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'stakeholder',
    required: true,
    estimatedTime: 12,
    complexity: 'high',
    fields: [
      { id: 'stakeholder-register', label: 'Stakeholder Register', type: 'textarea', required: true },
      { id: 'power-interest-analysis', label: 'Power/Interest Analysis', type: 'textarea', required: true },
      { id: 'engagement-strategies', label: 'Engagement Strategies', type: 'textarea', required: true }
    ],
    aiPrompt: `Develop a comprehensive Stakeholder Management Plan:

**Current Stakeholder Info:** [USER_TEXT]

Create detailed documentation including:
1. **Stakeholder Register** - Complete identification with roles and influence
2. **Power/Interest Analysis** - Classification and stakeholder attitudes  
3. **Engagement Strategies** - Specific approaches for each stakeholder group
4. **Communication Planning** - Information needs and reporting requirements
5. **Monitoring & Control** - Satisfaction metrics and engagement tracking

Focus on building and maintaining stakeholder support throughout the project.`
  },
  'scope-statement': {
    id: 'scope-statement',
    title: 'Project Scope Statement',
    description: 'Detailed project scope, deliverables, and boundaries',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'scope',
    required: true,
    estimatedTime: 10,
    complexity: 'high',
    fields: [
      { id: 'scope-description', label: 'Scope Description', type: 'textarea', required: true },
      { id: 'deliverables', label: 'Major Deliverables', type: 'textarea', required: true },
      { id: 'acceptance-criteria', label: 'Acceptance Criteria', type: 'textarea', required: true },
      { id: 'exclusions', label: 'Project Exclusions', type: 'textarea', required: true }
    ],
    aiPrompt: `Create a detailed Project Scope Statement with clear boundaries:

**Project Information:** [USER_TEXT]

Develop comprehensive scope documentation:
1. **Product Scope Description** - Features, performance, and quality standards
2. **Project Scope Description** - Work required to deliver the product
3. **Major Deliverables** - Tangible work products and milestones
4. **Acceptance Criteria** - Specific criteria for deliverable acceptance
5. **Project Exclusions** - Work explicitly not included
6. **Constraints & Assumptions** - Limitations and environmental factors

Ensure clarity to prevent scope creep and misunderstandings.`
  },
  'wbs': {
    id: 'wbs',
    title: 'Work Breakdown Structure (WBS)',
    description: 'Hierarchical decomposition of project work',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'scope',
    required: false,
    estimatedTime: 16,
    complexity: 'high',
    fields: [
      { id: 'wbs-structure', label: 'WBS Hierarchy', type: 'textarea', required: true },
      { id: 'work-packages', label: 'Work Package Descriptions', type: 'textarea', required: true },
      { id: 'wbs-dictionary', label: 'WBS Dictionary', type: 'textarea', required: true }
    ],
    aiPrompt: `Create a comprehensive Work Breakdown Structure (WBS):

**Project Scope:** [USER_TEXT]

Develop complete WBS including:
1. **WBS Hierarchy** - Level 1: Major phases, Level 2: Sub-deliverables, Level 3: Work packages
2. **Work Package Details** - Clear, actionable work descriptions (8-80 hour rule)
3. **WBS Dictionary** - Detailed descriptions with scope and acceptance criteria
4. **Deliverables Structure** - Tangible outputs at each level
5. **Estimation Framework** - Effort estimates and resource requirements

Follow the 100% rule - ensure all project work is captured.`
  },
  'schedule': {
    id: 'schedule',
    title: 'Project Schedule Management',
    description: 'Timeline, dependencies, and resource allocation',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'schedule',
    required: false,
    estimatedTime: 20,
    complexity: 'very-high',
    fields: [
      { id: 'activity-list', label: 'Activity List', type: 'textarea', required: true },
      { id: 'dependencies', label: 'Activity Dependencies', type: 'textarea', required: true },
      { id: 'milestones', label: 'Project Milestones', type: 'textarea', required: true },
      { id: 'critical-path', label: 'Critical Path Analysis', type: 'textarea', required: true }
    ],
    aiPrompt: `Develop comprehensive Project Schedule Management:

**Work Breakdown & Resources:** [USER_TEXT]

Create detailed schedule documentation:
1. **Activity Definition** - Complete activity list with resource needs
2. **Sequencing & Dependencies** - Logical relationships and constraints  
3. **Duration Estimation** - Three-point estimates with contingency
4. **Schedule Development** - Critical path and optimization
5. **Milestone Planning** - Key deliverables and decision points
6. **Baseline & Control** - Approved schedule and performance metrics

Focus on realistic, achievable timelines.`
  },
  'budget': {
    id: 'budget',
    title: 'Cost Management Plan',
    description: 'Budget planning and financial controls',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'cost',
    required: false,
    estimatedTime: 14,
    complexity: 'high',
    fields: [
      { id: 'cost-estimates', label: 'Detailed Cost Estimates', type: 'textarea', required: true },
      { id: 'budget-breakdown', label: 'Budget Breakdown Structure', type: 'textarea', required: true },
      { id: 'cost-controls', label: 'Cost Control Procedures', type: 'textarea', required: true },
      { id: 'funding-requirements', label: 'Funding Requirements', type: 'textarea', required: true }
    ],
    aiPrompt: `Create comprehensive Cost Management Plan:

**Project Requirements:** [USER_TEXT]

Develop detailed cost management:
1. **Cost Estimation** - Bottom-up estimates with accuracy levels
2. **Budget Structure** - Cost breakdown by WBS elements
3. **Funding Analysis** - Cash flow and payment schedules
4. **Cost Control** - Earned value management and metrics
5. **Risk & Contingency** - Cost risk assessment and reserves

Ensure financial transparency and accountability.`
  },
  'risk-management': {
    id: 'risk-management',
    title: 'Risk Management Plan',
    description: 'Risk identification, analysis, and response strategies',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'risk',
    required: false,
    estimatedTime: 18,
    complexity: 'very-high',
    fields: [
      { id: 'risk-register', label: 'Risk Register', type: 'textarea', required: true },
      { id: 'risk-analysis', label: 'Risk Analysis & Assessment', type: 'textarea', required: true },
      { id: 'response-strategies', label: 'Risk Response Strategies', type: 'textarea', required: true }
    ],
    aiPrompt: `Develop comprehensive Risk Management Plan:

**Project Context:** [USER_TEXT]

Create detailed risk management:
1. **Risk Identification** - Comprehensive risk inventory by category
2. **Qualitative Analysis** - Probability, impact, and priority assessment
3. **Quantitative Analysis** - Expected monetary value and simulation
4. **Response Planning** - Avoid, mitigate, transfer, accept strategies
5. **Monitoring & Control** - Risk tracking and communication protocols

Focus on both threats and opportunities.`
  },
  'quality-management': {
    id: 'quality-management',
    title: 'Quality Management Plan',
    description: 'Quality standards, assurance, and control measures',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'quality',
    required: false,
    estimatedTime: 12,
    complexity: 'medium',
    fields: [
      { id: 'quality-standards', label: 'Quality Standards & Metrics', type: 'textarea', required: true },
      { id: 'qa-processes', label: 'Quality Assurance Processes', type: 'textarea', required: true },
      { id: 'qc-measures', label: 'Quality Control Measures', type: 'textarea', required: true }
    ],
    aiPrompt: `Create comprehensive Quality Management Plan:

**Project Requirements:** [USER_TEXT]

Develop complete quality framework:
1. **Quality Standards** - Organizational policies and industry standards
2. **Quality Planning** - Approach, roles, and resource requirements
3. **Quality Assurance** - Process audits and best practices
4. **Quality Control** - Inspection, testing, and measurement
5. **Metrics & Monitoring** - Performance indicators and trend analysis
6. **Improvement Framework** - Lessons learned and process enhancement

Align with organizational quality policies.`
  },
  'communications': {
    id: 'communications',
    title: 'Communications Management Plan',
    description: 'Stakeholder communication and information management',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'communications',
    required: false,
    estimatedTime: 10,
    complexity: 'medium',
    fields: [
      { id: 'communication-matrix', label: 'Communication Matrix', type: 'textarea', required: true },
      { id: 'reporting-requirements', label: 'Reporting Requirements', type: 'textarea', required: true },
      { id: 'meeting-protocols', label: 'Meeting Protocols', type: 'textarea', required: true }
    ],
    aiPrompt: `Develop comprehensive Communications Management Plan:

**Stakeholder Information:** [USER_TEXT]

Create detailed communication strategy:
1. **Communication Strategy** - Overall approach and objectives
2. **Stakeholder Analysis** - Information needs and preferences
3. **Communication Matrix** - Who, what, when, how framework
4. **Reporting Framework** - Status reports and dashboards
5. **Meeting Management** - Types, attendance, and procedures
6. **Information Systems** - Tools, platforms, and security

Ensure timely, accurate, and relevant information flow.`
  },
  'resource-management': {
    id: 'resource-management',
    title: 'Resource Management Plan',
    description: 'Human resources, team development, and capacity planning',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'resource',
    required: false,
    estimatedTime: 14,
    complexity: 'high',
    fields: [
      { id: 'team-structure', label: 'Team Structure & Organization', type: 'textarea', required: true },
      { id: 'roles-responsibilities', label: 'Roles & Responsibilities (RACI)', type: 'textarea', required: true },
      { id: 'skill-requirements', label: 'Skill Requirements & Competencies', type: 'textarea', required: true }
    ],
    aiPrompt: `Create comprehensive Resource Management Plan:

**Project Requirements:** [USER_TEXT]

Develop detailed resource strategy:
1. **Resource Planning** - Approach and allocation principles
2. **Team Structure** - Organization and reporting relationships
3. **Roles & Responsibilities** - RACI matrix and accountabilities
4. **Competency Management** - Skills assessment and development
5. **Acquisition Strategy** - Staffing and vendor management
6. **Team Development** - Performance and retention strategies

Focus on building high-performing teams.`
  },
  'procurement': {
    id: 'procurement',
    title: 'Procurement Management Plan',
    description: 'Vendor selection, contracts, and external resources',
    category: 'Planning',
    processGroup: 'planning',
    knowledgeArea: 'procurement',
    required: false,
    estimatedTime: 16,
    complexity: 'high',
    fields: [
      { id: 'procurement-strategy', label: 'Procurement Strategy', type: 'textarea', required: true },
      { id: 'vendor-selection', label: 'Vendor Selection Criteria', type: 'textarea', required: true },
      { id: 'contract-types', label: 'Contract Types & Terms', type: 'textarea', required: true }
    ],
    aiPrompt: `Develop comprehensive Procurement Management Plan:

**Project Requirements:** [USER_TEXT]

Create detailed procurement strategy:
1. **Procurement Strategy** - Overall approach and market analysis
2. **Make-or-Buy Analysis** - Internal vs external sourcing
3. **Vendor Management** - Selection criteria and evaluation
4. **Contract Strategy** - Types, terms, and risk allocation
5. **Procurement Process** - Timeline, RFP, and award procedures
6. **Contract Administration** - Performance monitoring and control

Ensure compliance with organizational procurement policies.`
  }
};

// ============================================================================
// CONTEXT & STATE MANAGEMENT
// ============================================================================

const ProjectPlanContext = createContext();

export const useProjectPlan = () => {
  const context = useContext(ProjectPlanContext);
  if (!context) {
    throw new Error('useProjectPlan must be used within a ProjectPlanProvider');
  }
  return context;
};

// Enhanced Project Plan Provider
const ProjectPlanProvider = ({ children }) => {
  const [projectPlan, setProjectPlan] = useState({
    id: generateId(),
    title: '',
    description: '',
    methodology: ProjectMethodologies.TRADITIONAL,
    status: ProjectStatus.DRAFT,
    priority: 'medium',
    enabledSections: ['project-charter', 'stakeholder-management', 'scope-statement'],
    sections: {},
    team: [],
    budget: { planned: 0, actual: 0, currency: 'USD' },
    timeline: { startDate: null, endDate: null, milestones: [] },
    risks: [],
    issues: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '2.0.0',
      phase: 'setup',
      createdBy: 'current-user',
      tags: [],
      category: 'general'
    }
  });

  const [user] = useState({
    id: 'current-user',
    name: 'Project Manager',
    email: 'pm@company.com',
    role: UserRoles.OWNER
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  // Utility function
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Memoized project statistics
  const projectStats = useMemo(() => {
    const totalSections = projectPlan.enabledSections.length;
    const completedSections = projectPlan.enabledSections.filter(sectionId => {
      const content = projectPlan.sections[sectionId];
      return content && Object.values(content).some(val => val && val.trim());
    }).length;

    const totalEstimatedHours = projectPlan.enabledSections.reduce((total, sectionId) => {
      const section = ENHANCED_PMBOK_SECTIONS[sectionId];
      return total + (section?.estimatedTime || 0);
    }, 0);

    const completionPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

    return {
      totalSections,
      completedSections,
      completionPercentage,
      totalEstimatedHours,
      remainingHours: Math.round(totalEstimatedHours * (1 - completionPercentage / 100))
    };
  }, [projectPlan.enabledSections, projectPlan.sections]);

  // Update functions
  const updateProjectMetadata = useCallback((updates) => {
    setProjectPlan(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const toggleSection = useCallback((sectionId) => {
    const section = ENHANCED_PMBOK_SECTIONS[sectionId];
    if (section?.required) return;

    setProjectPlan(prev => ({
      ...prev,
      enabledSections: prev.enabledSections.includes(sectionId)
        ? prev.enabledSections.filter(id => id !== sectionId)
        : [...prev.enabledSections, sectionId],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const updateSection = useCallback((sectionId, content) => {
    setProjectPlan(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          ...content,
          updatedAt: new Date().toISOString()
        }
      },
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const generateAIPrompt = useCallback(async (sectionId) => {
    const section = ENHANCED_PMBOK_SECTIONS[sectionId];
    if (!section) return null;

    const sectionContent = projectPlan.sections[sectionId] || {};
    const contextText = Object.values(sectionContent).join('\n\n') || '[No content yet]';

    const enhancedPrompt = section.aiPrompt.replace('[USER_TEXT]', contextText);

    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      return enhancedPrompt;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return enhancedPrompt;
    }
  }, [projectPlan]);

  const contextValue = {
    projectPlan,
    user,
    activeView,
    isLoading,
    auditLog,
    projectStats,
    setActiveView,
    updateProjectMetadata,
    toggleSection,
    updateSection,
    generateAIPrompt,
    ENHANCED_PMBOK_SECTIONS,
    ProjectStatus,
    ProjectMethodologies
  };

  return (
    <ProjectPlanContext.Provider value={contextValue}>
      {children}
    </ProjectPlanContext.Provider>
  );
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Professional Navigation
const EnhancedNavigation = () => {
  const { activeView, setActiveView, projectPlan, projectStats } = useProjectPlan();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'setup', label: 'Setup', icon: '⚙️' },
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'editor', label: 'Editor', icon: '✏️' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
    { id: 'export', label: 'Export', icon: '📤' }
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Project Plan Pro v2.0</h1>
            <div className="text-sm text-gray-300">
              {projectPlan.title || 'Untitled Project'}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">Progress:</span>
              <span className="ml-1 font-semibold text-green-400">
                {projectStats.completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-1 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Professional Dashboard
const ProjectDashboard = () => {
  const { projectPlan, projectStats, ENHANCED_PMBOK_SECTIONS } = useProjectPlan();

  const getProcessGroupStats = (processGroup) => {
    const sections = Object.values(ENHANCED_PMBOK_SECTIONS).filter(
      section => section.processGroup === processGroup && projectPlan.enabledSections.includes(section.id)
    );
    const completed = sections.filter(section => {
      const content = projectPlan.sections[section.id];
      return content && Object.values(content).some(val => val && val.trim());
    });
    return { total: sections.length, completed: completed.length };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-3xl font-bold text-blue-600">{projectStats.completionPercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${projectStats.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Sections</p>
              <p className="text-3xl font-bold text-green-600">
                {projectStats.completedSections}/{projectStats.totalSections}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estimated Hours</p>
              <p className="text-3xl font-bold text-purple-600">{projectStats.totalEstimatedHours}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">⏱️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{projectStats.remainingHours}h remaining</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Methodology</p>
              <p className="text-xl font-bold text-orange-600 capitalize">{projectPlan.methodology}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Process Groups Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress by Process Group</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['initiating', 'planning', 'executing', 'monitoring', 'closing'].map(group => {
            const stats = getProcessGroupStats(group);
            const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

            return (
              <div key={group} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                    <circle
                      cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
                      className="text-blue-600 transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900">{percentage}%</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 capitalize">{group}</h4>
                <p className="text-xs text-gray-500">{stats.completed}/{stats.total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Project Setup Component
const ProjectSetup = () => {
  const { projectPlan, updateProjectMetadata, setActiveView } = useProjectPlan();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateProjectMetadata({
      title: formData.get('title'),
      description: formData.get('description'),
      methodology: formData.get('methodology'),
      metadata: { phase: 'creation' }
    });
    setActiveView('sections');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Project Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Project Title *</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={projectPlan.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={projectPlan.description}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Methodology</label>
          <select
            name="methodology"
            defaultValue={projectPlan.methodology}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={ProjectMethodologies.TRADITIONAL}>Traditional/Waterfall</option>
            <option value={ProjectMethodologies.AGILE}>Agile</option>
            <option value={ProjectMethodologies.HYBRID}>Hybrid</option>
            <option value={ProjectMethodologies.LEAN}>Lean</option>
            <option value={ProjectMethodologies.PRINCE2}>PRINCE2</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue to Section Selection
        </button>
      </form>
    </div>
  );
};

// Section Manager Component  
const SectionManager = () => {
  const { projectPlan, toggleSection, setActiveView, ENHANCED_PMBOK_SECTIONS } = useProjectPlan();

  const totalEstimatedHours = projectPlan.enabledSections.reduce((total, sectionId) => {
    const section = ENHANCED_PMBOK_SECTIONS[sectionId];
    return total + (section?.estimatedTime || 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Project Sections</h2>
        <p className="text-gray-600">Choose PMBOK sections for your {projectPlan.methodology} project.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {Object.values(ENHANCED_PMBOK_SECTIONS).map(section => {
          const isEnabled = projectPlan.enabledSections.includes(section.id);

          return (
            <div
              key={section.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isEnabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              } ${section.required ? 'opacity-75' : ''}`}
              onClick={() => !section.required && toggleSection(section.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {section.processGroup}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      ~{section.estimatedTime}h
                    </span>
                    {section.required && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Required</span>
                    )}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  disabled={section.required}
                  className="w-4 h-4 text-blue-600 rounded"
                  readOnly
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveView('setup')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <div className="text-sm text-gray-600">
          {projectPlan.enabledSections.length} sections • {totalEstimatedHours}h estimated
        </div>
        <button
          onClick={() => setActiveView('editor')}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

// Content Editor Component
const ContentEditor = () => {
  const { projectPlan, updateSection, ENHANCED_PMBOK_SECTIONS } = useProjectPlan();
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (projectPlan.enabledSections.length > 0 && !activeSection) {
      setActiveSection(projectPlan.enabledSections[0]);
    }
  }, [projectPlan.enabledSections, activeSection]);

  if (!activeSection) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-600">No sections selected</h2>
      </div>
    );
  }

  const currentSection = ENHANCED_PMBOK_SECTIONS[activeSection];
  const sectionContent = projectPlan.sections[activeSection] || {};

  const handleContentChange = (field, value) => {
    updateSection(activeSection, { ...sectionContent, [field]: value });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Sections</h3>
          <nav className="space-y-1">
            {projectPlan.enabledSections.map(sectionId => {
              const section = ENHANCED_PMBOK_SECTIONS[sectionId];
              const hasContent = projectPlan.sections[sectionId] && 
                Object.values(projectPlan.sections[sectionId]).some(val => val && val.trim());

              return (
                <button
                  key={sectionId}
                  onClick={() => setActiveSection(sectionId)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === sectionId
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{section.title}</span>
                    {hasContent && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
              <p className="text-gray-600 mt-1">{currentSection.description}</p>
            </div>

            <div className="space-y-4">
              {currentSection.fields.map(field => {
                const fieldValue = sectionContent[field.id] || '';

                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <textarea
                      value={fieldValue}
                      onChange={(e) => handleContentChange(field.id, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Assistant Component
const AIAssistant = () => {
  const { projectPlan, generateAIPrompt, ENHANCED_PMBOK_SECTIONS } = useProjectPlan();
  const [selectedSection, setSelectedSection] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleGeneratePrompt = async () => {
    if (!selectedSection) return;

    const prompt = await generateAIPrompt(selectedSection);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
    alert('Prompt copied to clipboard! Open your preferred AI service and paste it.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Generate AI Prompts</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a section...</option>
              {projectPlan.enabledSections.map(sectionId => (
                <option key={sectionId} value={sectionId}>
                  {ENHANCED_PMBOK_SECTIONS[sectionId].title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGeneratePrompt}
            disabled={!selectedSection}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy AI Prompt to Clipboard
          </button>
        </div>

        {showPrompt && selectedSection && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium mb-2">Generated Prompt:</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {generatedPrompt}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 AI Services</h4>
        <p className="text-blue-700 text-sm mb-3">Use these AI services with the generated prompts:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'ChatGPT', url: 'https://chat.openai.com/' },
            { name: 'Claude', url: 'https://claude.ai/' },
            { name: 'Gemini', url: 'https://gemini.google.com/' },
            { name: 'Copilot', url: 'https://copilot.microsoft.com/' }
          ].map(service => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              {service.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export Component
const ExportComponent = () => {
  const { projectPlan, projectStats } = useProjectPlan();

  const exportToJSON = () => {
    const exportData = {
      ...projectPlan,
      exportedAt: new Date().toISOString(),
      stats: projectStats
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectPlan.title || 'project-plan'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvData = projectPlan.enabledSections.map(sectionId => {
      const section = ENHANCED_PMBOK_SECTIONS[sectionId];
      const content = projectPlan.sections[sectionId] || {};
      return {
        'Section ID': sectionId,
        'Section Title': section.title,
        'Category': section.category,
        'Process Group': section.processGroup,
        'Required': section.required ? 'Yes' : 'No',
        'Estimated Hours': section.estimatedTime,
        'Completion': Object.values(content).some(val => val && val.trim()) ? 'Complete' : 'Incomplete'
      };
    });

    const csvHeaders = Object.keys(csvData[0] || {});
    const csvRows = csvData.map(row => csvHeaders.map(header => `"${row[header] || ''}"`).join(','));
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectPlan.title || 'project-plan'}-summary-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Export Project Plan</h2>

      {/* Progress Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Export Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Project:</span> {projectPlan.title || 'Untitled'}</div>
          <div><span className="font-medium">Methodology:</span> {projectPlan.methodology}</div>
          <div><span className="font-medium">Sections:</span> {projectStats.totalSections}</div>
          <div><span className="font-medium">Completed:</span> {projectStats.completedSections}</div>
          <div><span className="font-medium">Progress:</span> {projectStats.completionPercentage}%</div>
          <div><span className="font-medium">Est. Hours:</span> {projectStats.totalEstimatedHours}h</div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">JSON Export</h4>
            <p className="text-sm text-gray-600 mb-3">Complete project data including all sections and metadata</p>
            <button
              onClick={exportToJSON}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">CSV Export</h4>
            <p className="text-sm text-gray-600 mb-3">Section summary in spreadsheet format</p>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 opacity-50">
            <h4 className="font-medium mb-2">PDF Export</h4>
            <p className="text-sm text-gray-600 mb-3">Professional document format (coming soon)</p>
            <button disabled className="bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 opacity-50">
            <h4 className="font-medium mb-2">Word Export</h4>
            <p className="text-sm text-gray-600 mb-3">Microsoft Word document (coming soon)</p>
            <button disabled className="bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  return (
    <ProjectPlanProvider>
      <div className="min-h-screen bg-gray-50">
        <EnhancedNavigation />
        <MainContent />
      </div>
    </ProjectPlanProvider>
  );
}

// Main Content Router
const MainContent = () => {
  const { activeView } = useProjectPlan();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ProjectDashboard />;
      case 'setup':
        return <ProjectSetup />;
      case 'sections':
        return <SectionManager />;
      case 'editor':
        return <ContentEditor />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'export':
        return <ExportComponent />;
      default:
        return <ProjectDashboard />;
    }
  };

  return (
    <main className="min-h-screen">
      {renderActiveView()}
    </main>
  );
};

export default App;
