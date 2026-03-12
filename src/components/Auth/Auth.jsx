import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

    try {
      await axios.post(url, {
        requestType: 'PASSWORD_RESET',
        email
      });
      setSuccess('Password reset link sent! Please check your email inbox.');
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to send reset email';
      setError(message.replace(/_/g, ' '));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

      // Dispatch login action
      dispatch(authActions.login({
        token: idToken,
        userId: localId
      }));

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

  const toggleMode = () => {
    setIsForgotPassword(false);
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isForgotPassword
              ? 'Reset Password'
              : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isForgotPassword
              ? 'Enter your email to receive a password reset link'
              : isLogin
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

        {success && (
          <div className="success-message" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#4ade80',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <AlertCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {isForgotPassword ? (
          <form className="auth-form" onSubmit={handleResetPassword}>
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

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Mail size={20} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <div className="auth-toggle" style={{ marginTop: '1.5rem' }}>
              <span className="toggle-link" onClick={() => setIsForgotPassword(false)}>
                Back to Login
              </span>
            </div>
          </form>
        ) : (
          <>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  {isLogin && (
                    <span
                      className="toggle-link"
                      style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                        setSuccess('');
                      }}
                    >
                      Forgot Password?
                    </span>
                  )}
                </div>
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
              <span className="toggle-link" onClick={toggleMode}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
