import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login, register, clearError, selectIsAuthenticated, selectAuthStatus, selectAuthError } from '../../store/slices/authSlice';
import { setUserId, fetchCartAPI } from '../../store/slices/cartSlice';
import styles from './LoginPage.module.css';

const LOGIN = 'login';
const REGISTER = 'register';

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
          <h1 className={styles.title}>ShopIndia</h1>
          <p className={styles.subtitle}>
            {mode === LOGIN ? 'Welcome back!' : 'Create your account'}
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
          {error && <div className={styles.errorGlobal}>{error}</div>}

          {/* Username (Register only) */}
          {mode === REGISTER && (
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
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
              {validationErrors.username && (
                <span className={styles.errorText}>{validationErrors.username}</span>
              )}
            </div>
          )}

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
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
            {validationErrors.email && (
              <span className={styles.errorText}>{validationErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={mode === LOGIN ? 'current-password' : 'new-password'}
              disabled={isLoading}
            />
            {validationErrors.password && (
              <span className={styles.errorText}>{validationErrors.password}</span>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {mode === REGISTER && (
            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`${styles.input} ${validationErrors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isLoading}
              />
              {validationErrors.confirmPassword && (
                <span className={styles.errorText}>{validationErrors.confirmPassword}</span>
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