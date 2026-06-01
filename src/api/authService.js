/**
 * authService — API calls for authentication
 * Communicates with Spring Boot backend /api/auth endpoints
 */

import httpClient from './httpClient';
import { AUTH_ENDPOINTS } from '../constants/api.constants';

const authService = {
  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{accessToken: string, refreshToken: string, role: string, username: string}>}
   */
  login: async (email, password) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    return response;
  },

  /**
   * Register a new user
   * @param {Object} userData - { email, password, username, phone? }
   * @returns {Promise<{message: string}>}
   */
  register: async (userData) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.SIGNUP, userData);
    return response;
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  refresh: async (refreshToken) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.REFRESH, { refreshToken });
    return response;
  },

  /**
   * Logout user
   * @param {string} refreshToken
   * @returns {Promise<{message: string}>}
   */
  logout: async (refreshToken) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
    return response;
  },

  /**
   * Send OTP to user's email
   * @param {string} email
   * @returns {Promise<{message: string, expiresIn: string}>}
   */
  sendOtp: async (email) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.SEND_OTP, { email });
    return response;
  },

  /**
   * Verify OTP and get tokens
   * @param {string} email
   * @param {string} otp
   * @returns {Promise<{accessToken: string, refreshToken: string, role: string, username: string}>}
   */
  verifyOtp: async (email, otp) => {
    const response = await httpClient.post(AUTH_ENDPOINTS.VERIFY_OTP, { email, otp });
    return response;
  },
};

export default authService;