import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.email || !formData.password) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter both your email/username and password.',
      });
      return;
    }

    setLoading(true);

    // Mock authentication process
    setTimeout(() => {
      setLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'Sign in successful! Redirecting...',
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <header className="login-header">
          <span className="login-eyebrow">Hurfa Studio</span>
          <h1>Welcome Back</h1>
          <p>Sign in to access your curated collections and account.</p>
        </header>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`login-alert ${statusMessage.type}`} role="alert">
            {statusMessage.text}
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">Email or Username</label>
            <div className="login-input-wrap">
              <input
                id="login-email"
                type="text"
                name="email"
                className="login-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="login-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-remember-wrap">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot-password"
              className="login-forgot-link"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset instructions will be sent to your email.');
              }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/products">Explore Collections</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
