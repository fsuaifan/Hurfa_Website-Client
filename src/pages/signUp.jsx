import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../css/login.css';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (formData.password.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }

    if (!formData.agreeTerms) {
      setStatusMessage({
        type: 'error',
        text: 'Please accept the terms of service and privacy policy to continue.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.signup({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'customer',
      });

      const newUser = res.user || {
        role: 'customer',
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      sessionStorage.setItem('hurfa_customer_authenticated', 'true');
      sessionStorage.setItem('hurfa_user', JSON.stringify(newUser));
      localStorage.setItem('hurfa_customer_authenticated', 'true');
      localStorage.setItem('hurfa_user', JSON.stringify(newUser));

      setStatusMessage({
        type: 'success',
        text: 'Account created successfully! Welcome to Hurfa.',
      });

      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 600);
    } catch (err) {
      console.error('Signup error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not create account. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <header className="login-header">
          <span className="login-eyebrow">Hurfa Membership</span>
          <h1>Create Your Account</h1>
          <p className="login-subtitle">
            Join Hurfa Studio to save custom palettes, request architectural consultations, and track bespoke orders.
          </p>
        </header>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`login-status-message ${statusMessage.type}`}
            role="alert"
          >
            {statusMessage.type === 'error' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sarah Al-Ahmad"
              autoComplete="name"
              required
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+962 7 9000 0000"
              autoComplete="tel"
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password (min. 6 characters)</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="login-options-row">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span>
                I agree to the Hurfa{' '}
                <a
                  href="#terms"
                  className="login-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Hurfa Terms: Crafted bespoke furniture with architectural warranty.');
                  }}
                >
                  Terms of Service
                </a>{' '}
                and Privacy Policy.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner">Creating Account...</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <footer className="login-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default SignUp;
