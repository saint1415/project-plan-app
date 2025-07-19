import React, { useState, useRef } from "react";

// Project plan sections
const SECTIONS = [
  { key: "introduction", label: "Introduction" },
  { key: "scope", label: "Scope Management" },
  { key: "schedule", label: "Schedule Management" },
  { key: "cost", label: "Cost Management" },
  { key: "quality", label: "Quality Management" },
  { key: "resource", label: "Resource Management" },
  { key: "communications", label: "Communications Management" },
  { key: "risk", label: "Risk Management" },
  { key: "procurement", label: "Procurement Management" },
  { key: "stakeholder", label: "Stakeholder Management" },
  { key: "change", label: "Change Management" },
  { key: "approval", label: "Approval & Sign-off" }
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

function App() {
  const [manager, setManager] = useState("");
  const [sections, setSections] = useState(
    SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: "" }), {})
  );
  const [pdfLoading, setPdfLoading] = useState(false);
  const formRef = useRef(null);

  // Handle section text change
  const handleSectionChange = (key, value) => {
    setSections((prev) => ({ ...prev, [key]: value }));
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
    doc.text("Project Plan", margin, y);
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
    SECTIONS.forEach((section) => {
      if (y > 750) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("Times", "bold");
      doc.text(section.label, margin, y);
      y += 18;
      doc.setFont("Times", "normal");
      const text = sections[section.key] || " ";
      const lines = doc.splitTextToSize(text, 500);
      doc.text(lines, margin, y);
      y += lines.length * 16 + 10;
    });

    doc.save("Project_Plan.pdf");
    setPdfLoading(false);
  };

  return (
    <div className="container" style={{ fontFamily: "Times New Roman, Times, serif", maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>Project Plan Pro</h1>
      <form
        ref={formRef}
        style={{
          background: "#f8f8f8",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          boxShadow: "0 2px 8px #0001"
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <label style={{ fontWeight: "bold", fontSize: 16 }}>
          Project Manager Name:
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
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

      {SECTIONS.map((section) => (
        <div
          key={section.key}
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 16,
            marginBottom: 18,
            boxShadow: "0 1px 4px #0001"
          }}
        >
          <label style={{ fontWeight: "bold", fontSize: 15 }}>
            {section.label}
          </label>
          <textarea
            value={sections[section.key]}
            onChange={(e) => handleSectionChange(section.key, e.target.value)}
            placeholder={`Enter details for ${section.label}`}
            rows={section.key === "introduction" ? 4 : 3}
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
        </div>
      ))}

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
            boxShadow: "0 2px 8px #0002"
          }}
        >
          {pdfLoading ? "Exporting..." : "Export to PDF"}
        </button>
      </div>
    </div>
  );
}

export default App;
