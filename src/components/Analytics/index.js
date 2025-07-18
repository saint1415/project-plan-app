import React from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

const Analytics = () => {
  const { projectPlan } = useProjectPlan();
  const { sections = [], metadata = {}, title = '', description = '' } = projectPlan;

  const totalSections = sections.length;
  const sectionWordCounts = sections.map(
    s => wordCount(s.title) + wordCount(s.description)
  );
  const totalWords =
    wordCount(title) +
    wordCount(description) +
    sectionWordCounts.reduce((a, b) => a + b, 0);
  const avgWordsPerSection = totalSections
    ? Math.round(sectionWordCounts.reduce((a, b) => a + b, 0) / totalSections)
    : 0;

  return (
    <div className="analytics-container">
      <h2>Project Analytics</h2>
      <div className="analytics-stats">
        <div className="stat-item">
          <span className="stat-label">Sections:</span>
          <span className="stat-value">{totalSections}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Words:</span>
          <span className="stat-value">{totalWords}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Words/Section:</span>
          <span className="stat-value">{avgWordsPerSection}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Last Updated:</span>
          <span className="stat-value">
            {metadata.updatedAt
              ? new Date(metadata.updatedAt).toLocaleString()
              : 'N/A'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Version:</span>
          <span className="stat-value">{metadata.version || '1.0.0'}</span>
        </div>
      </div>
      <div className="analytics-breakdown">
        <h3>Section Breakdown</h3>
        <ul>
          {sections.map((section, idx) => (
            <li key={section.id || idx}>
              <strong>{section.title || 'Untitled Section'}:</strong>{' '}
              {wordCount(section.title) + wordCount(section.description)} words
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Analytics.propTypes = {};

export default Analytics;
