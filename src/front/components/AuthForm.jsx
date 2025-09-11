// --- src/components/AuthForm.jsx ---
// A reusable form for both Sign In and Sign Up.

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function AuthForm({ type, onClose }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSignUp = type === 'signUp';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call your backend API
    // For now, we'll just use our mock login function
    login({ email, password });
    onClose(); // Close the modal on submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">&times;</button>
        <div className="modal-header">
          <Logo width="60" height="60" />
          <h2 className="modal-title">{isSignUp ? 'Create Account' : 'Welcome Back!'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" required placeholder="••••••••" />
            </div>
          )};
          <button type="submit" className="btn btn-submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        
      </div>
    </div>
  );
};
