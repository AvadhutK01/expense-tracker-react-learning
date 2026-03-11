import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin
      ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg'
      : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg';

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const { idToken, localId } = response.data;

      // Store token in local storage
      localStorage.setItem('token', idToken);
      localStorage.setItem('userId', localId);

      console.log('User logged in successfully');

      // Navigate to home page
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error?.message || 'An error occurred. Please try again.';
      setError(message.replace(/_/g, ' '));
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Join us today and start tracking your expenses'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : isLogin ? (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
