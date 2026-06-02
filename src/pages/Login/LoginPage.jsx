import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login, register, clearError, selectIsAuthenticated, selectAuthStatus, selectAuthError } from '../../store/slices/authSlice';
import { setUserId, fetchCartAPI } from '../../store/slices/cartSlice';
import styles from './LoginPage.module.css';

const LOGIN = 'login';
const REGISTER = 'register';

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ShopIcon = () => (
  <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AlertIcon = () => (
  <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [mode, setMode] = useState(LOGIN);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  // Clear errors when switching modes
  useEffect(() => {
    dispatch(clearError());
    setValidationErrors({});
  }, [mode, dispatch]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (mode === REGISTER) {
      if (!formData.username) {
        errors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (mode === LOGIN) {
      const result = await dispatch(login({ email: formData.email, password: formData.password }));
      if (login.fulfilled.match(result)) {
        // Set userId in cart slice using email as the unique identifier
        dispatch(setUserId(formData.email));
        // Fetch existing cart items from the backend for this user
        dispatch(fetchCartAPI());
        history.push('/');
      }
    } else {
      const result = await dispatch(register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      }));
      if (register.fulfilled.match(result)) {
        // Switch to login mode after successful registration
        setMode(LOGIN);
        setFormData({ email: formData.email, password: '', username: '', confirmPassword: '' });
      }
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <ShopIcon />
          </div>
          <h1 className={styles.title}>
            Shop<span className={styles.titleAccent}>India</span>
          </h1>
          <p className={styles.subtitle}>
            {mode === LOGIN ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleBtn} ${mode === LOGIN ? styles.active : ''}`}
            onClick={() => setMode(LOGIN)}
            type="button"
          >
            Login
          </button>
          <button
            className={`${styles.toggleBtn} ${mode === REGISTER ? styles.active : ''}`}
            onClick={() => setMode(REGISTER)}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Global Error */}
          {error && (
            <div className={styles.errorGlobal}>
              <AlertIcon />
              {error}
            </div>
          )}

          {/* Username (Register only) */}
          {mode === REGISTER && (
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <div className={styles.inputWrapper}>
                <UserIcon />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${styles.input} ${validationErrors.username ? styles.inputError : ''}`}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.username && (
                <span className={styles.errorText}>
                  <span className={styles.errorDot} />
                  {validationErrors.username}
                </span>
              )}
            </div>
          )}

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <EmailIcon />
              <input
                type="email"
                id="email"
                name="email"
                className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            {validationErrors.email && (
              <span className={styles.errorText}>
                <span className={styles.errorDot} />
                {validationErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <LockIcon />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={mode === LOGIN ? 'current-password' : 'new-password'}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {validationErrors.password && (
              <span className={styles.errorText}>
                <span className={styles.errorDot} />
                {validationErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {mode === REGISTER && (
            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.inputWrapper}>
                <LockIcon />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`${styles.input} ${validationErrors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className={styles.errorText}>
                  <span className={styles.errorDot} />
                  {validationErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner} />
            ) : mode === LOGIN ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          {mode === LOGIN ? (
            <p>
              Don't have an account?{' '}
              <button
                className={styles.linkBtn}
                onClick={() => setMode(REGISTER)}
                type="button"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                className={styles.linkBtn}
                onClick={() => setMode(LOGIN)}
                type="button"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}