import React, { useState, useEffect } from "react";

// PMBOK-aligned sections with guidance and example content
const PMBOK_SECTIONS = [
  {
    group: "Initiating",
    sections: [
      {
        key: "charter",
        label: "Project Charter",
        guidance: "Formally authorizes the project and documents initial requirements.",
        example: `Project Title: Website Redesign Initiative
Project Sponsor: Jane Smith, VP of Marketing
Project Manager: John Doe
Purpose: To modernize the company website to improve user experience and increase lead generation.
Objectives:
- Launch new website by Q4 2025
- Increase site traffic by 30% within 6 months
- Improve mobile usability score to 95%
Key Stakeholders: Marketing, IT, Sales, Customers`
      }
    ]
  },
  {
    group: "Planning",
    sections: [
      {
        key: "scope",
        label: "Scope Management Plan",
        guidance: "Defines what is and is not included in the project.",
        example: `In Scope:
- Redesign of all public-facing web pages
- Migration of existing content
- Integration with CRM
Out of Scope:
- Internal portal redesign
- New content creation
Deliverables:
- Responsive website
- User documentation`
      },
      {
        key: "schedule",
        label: "Schedule Management Plan",
        guidance: "Establishes timelines, milestones, and deliverables.",
        example: `Milestones:
- Requirements Gathering: May 2025
- Design Approval: June 2025
- Development Complete: August 2025
- User Testing: September 2025
- Go Live: October 2025
Tools: Gantt chart, MS Project`
      },
      {
        key: "cost",
        label: "Cost Management Plan",
        guidance: "Estimates, budgets, and controls project costs.",
        example: `Estimated Budget: $120,000
Major Cost Categories:
- Design: $30,000
- Development: $60,000
- Testing: $10,000
- Training: $5,000
- Contingency: $15,000
Cost Tracking: Monthly review by PM`
      },
      {
        key: "quality",
        label: "Quality Management Plan",
        guidance: "Defines quality standards and how they will be achieved.",
        example: `Quality Objectives:
- 99.9% uptime post-launch
- <1% critical bugs in user testing
- Accessibility compliance (WCAG 2.1 AA)
Quality Assurance:
- Code reviews
- Automated testing
- User acceptance testing`
      },
      {
        key: "resource",
        label: "Resource Management Plan",
        guidance: "Identifies and manages project team and resources.",
        example: `Project Team:
- Project Manager: John Doe
- Lead Designer: Alice Lee
- Developers: 3 FTEs
- QA: 1 FTE
Resource Plan:
- Weekly team meetings
- Resource allocation tracked in MS Project`
      },
      {
        key: "communications",
        label: "Communications Management Plan",
        guidance: "Defines how information will be shared.",
        example: `Stakeholder Updates: Bi-weekly email
Team Meetings: Weekly standup (Monday 10am)
Documentation: Shared Google Drive
Escalation: Issues escalated to sponsor within 24 hours`
      },
      {
        key: "risk",
        label: "Risk Management Plan",
        guidance: "Identifies, analyzes, and plans for project risks.",
        example: `Top Risks:
- Delays in design approval (Mitigation: Early stakeholder engagement)
- Developer turnover (Mitigation: Cross-training)
- Integration issues with CRM (Mitigation: Early technical review)
Risk Log: Maintained by PM`
      },
      {
        key: "procurement",
        label: "Procurement Management Plan",
        guidance: "How goods/services will be acquired.",
        example: `Vendors:
- Web design agency (contracted)
- Stock photo provider (subscription)
Procurement Process:
- RFP issued for design agency
- Monthly invoice review`
      },
      {
        key: "stakeholder",
        label: "Stakeholder Management Plan",
        guidance: "Identifies stakeholders and engagement strategies.",
        example: `Key Stakeholders:
- Jane Smith (Sponsor)
- Marketing Team
- IT Department
- End Users
Engagement:
- Monthly stakeholder review meetings
- Feedback surveys post-launch`
      }
    ]
  },
  {
    group: "Executing",
    sections: [
      {
        key: "execution",
        label: "Project Execution",
        guidance: "Directs and manages project work.",
        example: `Tasks:
- Implement approved designs
- Migrate content
- Integrate CRM
- Conduct QA testing
Status Reporting: Weekly progress updates`
      }
    ]
  },
  {
    group: "Monitoring & Controlling",
    sections: [
      {
        key: "monitoring",
        label: "Monitoring & Controlling",
        guidance: "Tracks, reviews, and regulates project progress.",
        example: `KPIs:
- Schedule variance
- Budget variance
- Defect rate
Change Control:
- All changes reviewed by Change Control Board
- Change log maintained in project folder`
      }
    ]
  },
  {
    group: "Closing",
    sections: [
      {
        key: "closing",
        label: "Project Closing",
        guidance: "Finalizes all activities and closes the project.",
        example: `Closing Activities:
- Final deliverable sign-off
- Lessons learned session
- Release project resources
- Archive documentation
- Celebrate team success!`
      }
    ]
  }
];

// Helper for PDF export
const loadJsPDF = () =>
  new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.body.appendChild(script);
  });

function getSectionCount() {
  return PMBOK_SECTIONS.reduce((sum, group) => sum + group.sections.length, 0);
}

function getCompletedCount(sections) {
  return Object.values(sections).filter((v) => v && v.trim().length > 0).length;
}

export default function App() {
  const [manager, setManager] = useState("");
  const [sections, setSections] = useState(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem("projectPlanSections");
    if (saved) return JSON.parse(saved);
    // Otherwise, use example content
    const initial = {};
    PMBOK_SECTIONS.forEach((group) =>
      group.sections.forEach(
        (s) => (initial[s.key] = s.example || "")
      )
    );
    return initial;
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("projectPlanSections", JSON.stringify(sections));
  }, [sections]);

  // Save manager name to localStorage
  useEffect(() => {
    localStorage.setItem("projectPlanManager", manager);
  }, [manager]);

  // Load manager name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("projectPlanManager");
    if (saved) setManager(saved);
  }, []);

  // Handle section text change
  const handleSectionChange = (key, value) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  // Reset all fields
  const resetPlan = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the plan? All progress will be lost."
      )
    ) {
      const initial = {};
      PMBOK_SECTIONS.forEach((group) =>
        group.sections.forEach(
          (s) => (initial[s.key] = s.example || "")
        )
      );
      setSections(initial);
      setManager("");
      localStorage.removeItem("projectPlanSections");
      localStorage.removeItem("projectPlanManager");
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    setPdfLoading(true);
    const jsPDF = await loadJsPDF();
    const doc = new jsPDF({
      unit: "pt",
      format: "a4"
    });

    const margin = 40;
    let y = margin;

    // Title
    doc.setFont("Times", "bold");
    doc.setFontSize(22);
    doc.text("Project Plan (PMBOK)", margin, y);
    y += 32;

    // Project Manager
    doc.setFont("Times", "normal");
    doc.setFontSize(14);
    doc.text(`Project Manager: ${manager || "________"}`, margin, y);
    y += 24;

    // Date
    const today = new Date();
    doc.text(
      `Date: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
      margin,
      y
    );
    y += 24;

    // Divider
    doc.setLineWidth(0.5);
    doc.line(margin, y, 555, y);
    y += 16;

    // Sections
    doc.setFontSize(12);
    PMBOK_SECTIONS.forEach((group) => {
      doc.setFont("Times", "bold");
      doc.setFontSize(15);
      if (y > 750) {
        doc.addPage();
        y = margin;
      }
      doc.text(group.group, margin, y);
      y += 20;
      group.sections.forEach((section) => {
        if (y > 750) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("Times", "bold");
        doc.setFontSize(13);
        doc.text(section.label, margin + 10, y);
        y += 16;
        doc.setFont("Times", "italic");
        doc.setFontSize(11);
        doc.text(section.guidance, margin + 10, y);
        y += 14;
        doc.setFont("Times", "normal");
        doc.setFontSize(12);
        const text = sections[section.key] || " ";
        const lines = doc.splitTextToSize(text, 480);
        doc.text(lines, margin + 10, y);
        y += lines.length * 14 + 8;
      });
      y += 8;
    });

    doc.save("Project_Plan_PMBOK.pdf");
    setPdfLoading(false);
  };

  // Progress calculation
  const totalSections = getSectionCount();
  const completedSections = getCompletedCount(sections);
  const progress = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="container" style={{ fontFamily: "Times New Roman, Times, serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(90deg, #e3eafc 0%, #f8fafc 100%)",
        borderRadius: 12,
        padding: "28px 24px 18px 24px",
        marginBottom: 28,
        boxShadow: "0 2px 12px #0001",
        textAlign: "center"
      }}>
        <img src="logo.png" alt="Project Plan Pro Logo" style={{ width: 56, height: 56, marginBottom: 8 }} />
        <h1 style={{ margin: 0, fontSize: "2.1rem", color: "#23408e" }}>Project Plan Pro</h1>
        <div style={{ color: "#23408e", fontWeight: 500, fontSize: "1.1rem", marginTop: 4 }}>
          PMBOK-Aligned Project Planning Tool
        </div>
        <div style={{ color: "#4b5563", fontSize: "1rem", marginTop: 8 }}>
          Create, manage, and export professional project plans with built-in PMBOK guidance and best practices.
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, color: "#23408e", marginBottom: 4 }}>
          Plan Completion: {progress}%
        </div>
        <div style={{
          background: "#e5e7eb",
          borderRadius: 6,
          height: 14,
          width: "100%",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
            borderRadius: 6,
            transition: "width 0.4s"
          }} />
        </div>
      </div>

      {/* Project Manager Name */}
      <form
        style={{
          background: "#f8f8f8",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          boxShadow: "0 2px 8px #0001"
        }}
        onSubmit={e => e.preventDefault()}
      >
        <label style={{ fontWeight: "bold", fontSize: 16 }}>
          Project Manager Name:
          <input
            type="text"
            value={manager}
            onChange={e => setManager(e.target.value)}
            placeholder="Enter name"
            style={{
              marginLeft: 12,
              padding: 6,
              fontSize: 15,
              borderRadius: 4,
              border: "1px solid #bbb",
              width: 220
            }}
            required
          />
        </label>
      </form>

      {/* PMBOK Sections */}
      {PMBOK_SECTIONS.map(group => (
        <div key={group.group} style={{ marginBottom: 28 }}>
          <div style={{
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "#23408e",
            marginBottom: 8,
            borderLeft: "4px solid #2563eb",
            paddingLeft: 10
          }}>
            {group.group}
          </div>
          {group.sections.map(section => (
            <div
              key={section.key}
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                boxShadow: "0 1px 4px #0001",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontWeight: "bold", fontSize: 15, marginRight: 8 }}>
                  {section.label}
                </label>
                <span
                  title={section.guidance}
                  style={{
                    marginLeft: 4,
                    color: "#2563eb",
                    cursor: "help",
                    fontSize: 18
                  }}
                  aria-label={`Guidance: ${section.guidance}`}
                  tabIndex={0}
                >ℹ️</span>
                {sections[section.key] && sections[section.key].trim().length > 0 && (
                  <span style={{
                    marginLeft: 10,
                    color: "#22c55e",
                    fontSize: 18
                  }} title="Section complete">✔️</span>
                )}
              </div>
              <textarea
                value={sections[section.key]}
                onChange={e => handleSectionChange(section.key, e.target.value)}
                placeholder={section.example}
                rows={section.example.split("\n").length + 2}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 8,
                  fontSize: 15,
                  borderRadius: 4,
                  border: "1px solid #bbb",
                  resize: "vertical"
                }}
              />
              <div style={{
                fontSize: "0.95em",
                color: "#6b7280",
                marginTop: 4,
                fontStyle: "italic"
              }}>
                Example: {section.example}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <button
          onClick={exportToPDF}
          disabled={pdfLoading || !manager}
          style={{
            background: "#2d6cdf",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 17,
            padding: "12px 32px",
            border: "none",
            borderRadius: 6,
            cursor: pdfLoading || !manager ? "not-allowed" : "pointer",
            opacity: pdfLoading || !manager ? 0.6 : 1,
            boxShadow: "0 2px 8px #0002",
            marginRight: 16
          }}
        >
          {pdfLoading ? "Exporting..." : "Export to PDF"}
        </button>
        <button
          onClick={resetPlan}
          style={{
            background: "#f3f4f6",
            color: "#23408e",
            fontWeight: "bold",
            fontSize: 17,
            padding: "12px 32px",
            border: "1.5px solid #2563eb",
            borderRadius: 6,
            cursor: "pointer",
            marginLeft: 16
          }}
        >
          Reset Plan
        </button>
      </div>
      <div style={{ textAlign: "center", color: "#6b7280", fontSize: "0.98em", marginTop: 12 }}>
        Your progress is saved automatically in your browser.
      </div>
    </div>
  );
}
