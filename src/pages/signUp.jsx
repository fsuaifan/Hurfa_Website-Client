import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e) => {
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

    // Mock registration process
    setTimeout(() => {
      setLoading(false);

      // Save registered customer user session
      const newUser = {
        role: 'customer',
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };
      sessionStorage.setItem('hurfa_customer_authenticated', 'true');
      sessionStorage.setItem('hurfa_user', JSON.stringify(newUser));

      setStatusMessage({
        type: 'success',
        text: 'Account created successfully! Welcome to Hurfa.',
      });

      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 750);
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <header className="login-header">
          <span className="login-eyebrow">Hurfa Membership</span>
          <h1>Create an Account</h1>
          <p>
            Join Hurfa to save curated collections, request architectural consultations, and track orders.
          </p>
        </header>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`login-alert ${statusMessage.type}`} role="alert">
            {statusMessage.text}
          </div>
        )}

        {/* Registration Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="signup-fullName">Full Name</label>
            <div className="login-input-wrap">
              <input
                id="signup-fullName"
                type="text"
                name="fullName"
                className="login-input"
                placeholder="e.g. Sarah Al-Ahmad"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="signup-email">Email Address</label>
            <div className="login-input-wrap">
              <input
                id="signup-email"
                type="email"
                name="email"
                className="login-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="signup-phone">Phone Number (Optional)</label>
            <div className="login-input-wrap">
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                className="login-input"
                placeholder="+962 7 9000 0000"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="signup-password">Password</label>
            <div className="login-input-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="login-input"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          <div className="login-form-group">
            <label htmlFor="signup-confirmPassword">Confirm Password</label>
            <div className="login-input-wrap">
              <input
                id="signup-confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="login-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-remember-wrap">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span>I agree to Hurfa's Terms & Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default SignUp;
