/**
 * uiSlice — global UI state (toast, overlay loader, mobile menu).
 */

import { createSlice } from '@reduxjs/toolkit';

let toastTimer = null;

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast:          null,   // { message, type: 'success'|'error'|'info' }
    mobileMenuOpen: false,
  },
  reducers: {
    showToast(state, action) {
      state.toast = action.payload;
    },
    hideToast(state) {
      state.toast = null;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
  },
});

export const { showToast, hideToast, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;

/** Thunk: show a toast that auto-dismisses */
export const toast = (message, type = 'success', duration = 3200) => (dispatch) => {
  if (toastTimer) clearTimeout(toastTimer);
  dispatch(showToast({ message, type }));
  toastTimer = setTimeout(() => dispatch(hideToast()), duration);
};

export const selectToast          = (s) => s.ui.toast;
export const selectMobileMenuOpen = (s) => s.ui.mobileMenuOpen;
