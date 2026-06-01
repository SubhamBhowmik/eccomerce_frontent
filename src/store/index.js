/**
 * store — Redux Toolkit store configuration.
 * Combines all slices; adds devtools in development.
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer     from './slices/cartSlice';
import uiReducer       from './slices/uiSlice';
import authReducer     from './slices/authSlice';
import orderReducer    from './slices/orderSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart:     cartReducer,
    ui:       uiReducer,
    auth:     authReducer,
    order:    orderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
