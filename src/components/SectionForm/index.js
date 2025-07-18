import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

const SectionForm = () => {
  const {
    projectPlan,
    addSection,
    updateSection,
    deleteSection
  } = useProjectPlan();

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Start editing a section
  const handleEdit = section => {
    setEditingId(section.id);
    setForm({ title: section.title, description: section.description });
    setError(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: '', description: '' });
    setError(null);
  };

  // Save new or edited section
  const handleSave = e => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!form.title.trim()) {
      setError('Section title is required.');
      setIsSaving(false);
      return;
    }

    if (editingId) {
      updateSection(editingId, { ...form });
      setEditingId(null);
    } else {
      addSection({ ...form });
    }
    setForm({ title: '', description: '' });
    setIsSaving(false);
  };

  // Delete a section
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(id);
      if (editingId === id) handleCancel();
    }
  };

  return (
    <div className="section-form-container">
      <h2>Project Sections</h2>
      <form className="section-form" onSubmit={handleSave}>
        <input
          type="text"
          name="title"
          placeholder="Section Title"
          value={form.title}
          onChange={handleChange}
          disabled={isSaving}
          required
        />
        <textarea
          name="description"
          placeholder="Section Description"
          value={form.description}
          onChange={handleChange}
          disabled={isSaving}
        />
        <div className="form-actions">
          <button type="submit" disabled={isSaving}>
            {editingId ? (isSaving ? 'Saving...' : 'Update Section') : (isSaving ? 'Saving...' : 'Add Section')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </button>
          )}
        </div>
        {error && <div className="form-error">{error}</div>}
      </form>

      <ul className="sections-list">
        {projectPlan.sections.length === 0 && (
          <li className="section-empty">No sections yet. Add your first section!</li>
        )}
        {projectPlan.sections.map(section => (
          <li key={section.id} className="section-item">
            <div className="section-header">
              <strong>{section.title}</strong>
              <div className="section-actions">
                <button onClick={() => handleEdit(section)} aria-label="Edit section">Edit</button>
                <button onClick={() => handleDelete(section.id)} aria-label="Delete section">Delete</button>
              </div>
            </div>
            {section.description && <p className="section-description">{section.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

SectionForm.propTypes = {};

export default SectionForm;
