/**
 * authSlice — Redux slice for authentication state
 * Manages user login, logout, token storage, and auth state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';

// ─── Local Storage Keys ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  ACCESS_TOKEN:  'shopindia_access_token',
  REFRESH_TOKEN: 'shopindia_refresh_token',
  USER:          'shopindia_user',
};

// ─── Helper: Load state from localStorage ──────────────────────────────────────
const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

// ─── Helper: Save state to localStorage ────────────────────────────────────────
const saveToStorage = (key, value) => {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Silently fail if localStorage is not available
  }
};

// ─── Initial State ─────────────────────────────────────────────────────────────
const getInitialState = () => {
  const storedUser = loadFromStorage(STORAGE_KEYS.USER);
  const accessToken = loadFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = loadFromStorage(STORAGE_KEYS.REFRESH_TOKEN);

  return {
    user:         storedUser,
    accessToken:  accessToken,
    refreshToken: refreshToken,
    isAuthenticated: !!accessToken && !!storedUser,
    status:       'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error:        null,
  };
};

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (refreshToken, { rejectWithValue }) => {
    try {
      await authService.logout(refreshToken);
      return true;
    } catch (error) {
      // Even if the logout API fails, we clear local state
      return true;
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.sendOtp(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOtp(email, otp);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual logout (clear local state without API call)
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      saveToStorage(STORAGE_KEYS.USER, null);
      saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, null);
      saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, null);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('🔑 [AuthSlice] Login fulfilled!');
        console.log('   Full response:', action.payload);
        console.log('   accessToken:', action.payload.accessToken);
        console.log('   refreshToken:', action.payload.refreshToken);
        
        state.status = 'succeeded';
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        // Persist to localStorage
        saveToStorage(STORAGE_KEYS.USER, {
          email: action.payload.email || state.user.email,
          username: action.payload.username,
          role: action.payload.role,
        });
        saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
        saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
        saveToStorage(STORAGE_KEYS.USER, null);
        saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, null);
        saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, null);
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          email: action.payload.email,
          username: action.payload.username,
          role: action.payload.role,
        };
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        saveToStorage(STORAGE_KEYS.USER, state.user);
        saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
        saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAuthState } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;