import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectPlan } from '../../App'; // Adjust path if needed

const Auth = () => {
  const { user, setUser, setActiveView } = useProjectPlan();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    setError(null);
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setUser({ name, email });
    setActiveView('editor');
  };

  const handleSignOut = () => {
    setUser(null);
    setEmail('');
    setName('');
  };

  if (user) {
    return (
      <div className="auth-container">
        <h2>Welcome, {user.name}!</h2>
        <p className="text-gray-600">Signed in as <strong>{user.email}</strong></p>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form className="auth-form" onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <div className="auth-tip">
        <small>
          <strong>Note:</strong> This is a demo sign-in. Real authentication can be added later.
        </small>
      </div>
    </div>
  );
};

Auth.propTypes = {};

export default Auth;
