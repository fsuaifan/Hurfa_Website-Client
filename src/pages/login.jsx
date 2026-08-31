import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../css/login.css';

function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';
  const urlRole = searchParams.get('mode') === 'admin' || redirectTarget.includes('/admin') ? 'admin' : 'customer';

  const [selectedRole, setSelectedRole] = useState(null);
  const loginRole = selectedRole ?? urlRole; // 'customer' | 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setStatusMessage({ type: '', text: '' });
    // Update the URL query params without full page reload
    const newParams = new URLSearchParams(searchParams);
    if (role === 'admin') {
      newParams.set('mode', 'admin');
    } else {
      newParams.delete('mode');
      if (redirectTarget.includes('/admin')) {
        newParams.delete('redirect');
      }
    }
    setSearchParams(newParams, { replace: true });
  };

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

    if (!formData.email.trim() || !formData.password.trim()) {
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

      if (loginRole === 'admin') {
        // Persist admin session
        sessionStorage.setItem('hurfa_admin_authenticated', 'true');
        sessionStorage.setItem(
          'hurfa_user',
          JSON.stringify({
            role: 'admin',
            email: formData.email,
            name: 'Studio Administrator',
          })
        );

        setStatusMessage({
          type: 'success',
          text: 'Admin authorization verified. Redirecting to Studio Dashboard...',
        });

        setTimeout(() => {
          const destination = redirectTarget.includes('/admin') ? redirectTarget : '/admin';
          navigate(destination, { replace: true });
        }, 700);
      } else {
        // Customer session authentication
        sessionStorage.setItem('hurfa_customer_authenticated', 'true');
        sessionStorage.setItem(
          'hurfa_user',
          JSON.stringify({
            role: 'customer',
            email: formData.email,
            name: formData.email.split('@')[0] || 'Valued Client',
          })
        );

        setStatusMessage({
          type: 'success',
          text: 'Welcome back! Redirecting to Hurfa Collections...',
        });

        setTimeout(() => {
          // If redirected from a non-admin protected page or cart, honor it; otherwise go to products/home
          const destination = redirectTarget && !redirectTarget.includes('/admin') ? redirectTarget : '/products';
          navigate(destination, { replace: true });
        }, 700);
      }
    }, 500);
  };

  const isAdmin = loginRole === 'admin';

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Role Selector Tabs */}
        <div className="login-role-tabs" role="tablist" aria-label="Login account type">
          <button
            type="button"
            role="tab"
            aria-selected={!isAdmin}
            className={`login-role-tab ${!isAdmin ? 'active' : ''}`}
            onClick={() => handleRoleChange('customer')}
          >
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Customer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isAdmin}
            className={`login-role-tab ${isAdmin ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Admin Portal
          </button>
        </div>

        {/* Header */}
        <header className="login-header">
          <span className="login-eyebrow">
            {isAdmin ? 'Management Portal' : 'Hurfa Client Space'}
          </span>
          <h1>{isAdmin ? 'Admin Sign In' : 'Client Sign In'}</h1>
          <p>
            {isAdmin
              ? 'Sign in to access Hurfa studio dashboard, inventory, and catalog.'
              : 'Sign in to access your curated collections, orders, and inquiries.'}
          </p>
        </header>

        {/* Status Alert */}
        {statusMessage.text && (
          <div className={`login-alert ${statusMessage.type}`} role="alert">
            {statusMessage.text}
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">
              {isAdmin ? 'Admin Email / Username' : 'Email Address'}
            </label>
            <div className="login-input-wrap">
              <input
                id="login-email"
                type={isAdmin ? 'text' : 'email'}
                name="email"
                className="login-input"
                placeholder={isAdmin ? 'admin@hurfa.com' : 'name@example.com'}
                value={formData.email}
                onChange={handleChange}
                autoComplete={isAdmin ? 'username' : 'email'}
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
                alert(
                  isAdmin
                    ? 'Please contact Hurfa IT administration to reset administrative credentials.'
                    : 'Password reset instructions will be sent to your email.'
                );
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
            {loading
              ? 'Verifying...'
              : isAdmin
              ? 'Enter Studio Dashboard'
              : 'Sign In to Account'}
          </button>
        </form>

        <footer className="login-footer">
          {isAdmin ? (
            <p>
              Looking for client shopping?{' '}
              <button
                type="button"
                className="login-switch-link"
                onClick={() => handleRoleChange('customer')}
              >
                Switch to Customer Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/products">Explore Collections</Link>
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default Login;
