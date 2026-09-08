import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../css/login.css';

function Login() {
  const { t } = useLanguage();
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

  const handleSubmit = async (e) => {
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

    try {
      const res = await api.auth.login({
        email: formData.email.trim(),
        password: formData.password,
        role: loginRole,
      });

      const user = res.user || {
        role: loginRole,
        email: formData.email,
        name: formData.email.split('@')[0] || 'Valued User',
      };

      const storage = formData.rememberMe ? localStorage : sessionStorage;

      if (user.role === 'admin' || loginRole === 'admin') {
        sessionStorage.setItem('hurfa_admin_authenticated', 'true');
        sessionStorage.setItem('hurfa_user', JSON.stringify({ ...user, role: 'admin' }));
        storage.setItem('hurfa_admin_authenticated', 'true');
        storage.setItem('hurfa_user', JSON.stringify({ ...user, role: 'admin' }));

        setStatusMessage({
          type: 'success',
          text: 'Admin authorization verified. Redirecting to Studio Dashboard...',
        });

        setTimeout(() => {
          const destination = redirectTarget.includes('/admin') ? redirectTarget : '/admin';
          navigate(destination, { replace: true });
        }, 600);
      } else {
        sessionStorage.setItem('hurfa_customer_authenticated', 'true');
        sessionStorage.setItem('hurfa_user', JSON.stringify({ ...user, role: 'customer' }));
        storage.setItem('hurfa_customer_authenticated', 'true');
        storage.setItem('hurfa_user', JSON.stringify({ ...user, role: 'customer' }));

        setStatusMessage({
          type: 'success',
          text: 'Welcome back! Redirecting to your account...',
        });

        setTimeout(() => {
          const destination = redirectTarget && !redirectTarget.includes('/admin') ? redirectTarget : '/account';
          navigate(destination, { replace: true });
        }, 600);
      }
    } catch (err) {
      console.error('Login error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Invalid credentials. Please verify and try again.',
      });
    } finally {
      setLoading(false);
    }
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
            <span>{t('customerPortal', 'Customer Portal')}</span>
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span>{t('studioAdmin', 'Studio Admin')}</span>
          </button>
        </div>

        {/* Header */}
        <header className="login-header">
          <span className="login-eyebrow">
            {isAdmin
              ? t('managementConsole', 'Management Console')
              : t('hurfaClientAccess', 'Hurfa Client Access')}
          </span>
          <h1>{isAdmin ? t('studioPortal', 'Studio Portal') : t('welcomeBack', 'Welcome Back')}</h1>
          <p className="login-subtitle">
            {isAdmin
              ? t(
                  'adminLoginSubtitle',
                  'Sign in with studio credentials to manage furniture catalog, customer orders, and client inquiries.'
                )
              : t(
                  'customerLoginSubtitle',
                  'Sign in to access your bespoke orders, saved palettes, and consultation requests.'
                )}
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
            <label htmlFor="email">
              {isAdmin
                ? t('adminUsernameOrEmail', 'Admin Username or Email')
                : t('emailAddress', 'Email Address')}
            </label>
            <input
              type={isAdmin ? 'text' : 'email'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                isAdmin
                  ? 'admin or admin@hurfa.com'
                  : 'sarah@example.com'
              }
              autoComplete={isAdmin ? 'username' : 'email'}
              required
            />
          </div>

          <div className="login-input-group">
            <div className="login-password-label-row">
              <label htmlFor="password">{t('password', 'Password')}</label>
              {!isAdmin && (
                <a
                  href="#forgot"
                  className="login-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to your registered email.');
                  }}
                >
                  {t('forgot', 'Forgot?')}
                </a>
              )}
            </div>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
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

          <div className="login-options-row">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>{t('rememberSession', 'Remember session on this device')}</span>
            </label>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner">Authenticating...</span>
            ) : (
              <span>
                {isAdmin
                  ? t('signInToStudio', 'Sign In to Studio Console')
                  : t('signIn', 'Sign In')}
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <footer className="login-footer">
          {isAdmin ? (
            <p>
              Restricted management console. Authorized Hurfa studio staff only.
            </p>
          ) : (
            <p>
              {t('newToHurfa', 'New to Hurfa Studio?')}{' '}
              <Link to="/signup" className="login-link">
                {t('createAccount', 'Create an account')}
              </Link>
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default Login;
