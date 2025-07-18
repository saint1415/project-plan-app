import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

// Mocked initial collaborators (replace with real data when backend is ready)
const MOCK_COLLABORATORS = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Owner' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Editor' }
];

const Collaboration = () => {
  const { user } = useProjectPlan();
  const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    // Simple email validation
    if (!inviteEmail.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setInviteError('Please enter a valid email address.');
      setIsInviting(false);
      return;
    }

    // Simulate async invite (replace with real API call)
    setTimeout(() => {
      if (collaborators.some(c => c.email === inviteEmail)) {
        setInviteError('This user is already a collaborator.');
      } else {
        setCollaborators([
          ...collaborators,
          {
            id: Date.now().toString(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: 'Viewer'
          }
        ]);
        setInviteSuccess('Invitation sent!');
        setInviteEmail('');
      }
      setIsInviting(false);
    }, 800);
  };

  return (
    <div className="collaboration-container">
      <h2>Collaboration</h2>
      <p>Invite team members to collaborate on your project plan.</p>
      <form className="invite-form" onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="Invite by email"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          disabled={isInviting}
          required
        />
        <button type="submit" disabled={isInviting}>
          {isInviting ? 'Inviting...' : 'Invite'}
        </button>
      </form>
      {inviteError && <div className="invite-error">{inviteError}</div>}
      {inviteSuccess && <div className="invite-success">{inviteSuccess}</div>}

      <h3>Collaborators</h3>
      <ul className="collaborators-list">
        {collaborators.map(collab => (
          <li key={collab.id} className="collaborator-item">
            <span className="collab-name">{collab.name}</span>
            <span className="collab-email">&lt;{collab.email}&gt;</span>
            <span className="collab-role">{collab.role}</span>
            {user && user.email === collab.email && (
              <span className="collab-you">(You)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

Collaboration.propTypes = {};

export default Collaboration;
