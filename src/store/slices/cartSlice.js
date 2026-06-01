/**
 * cartSlice — Cart state with API integration
 *
 * State shape:
 * {
 *   items: CartItem[],
 *   totalItems: number,
 *   totalPrice: number,
 *   status: 'idle' | 'loading' | 'success' | 'error',
 *   error: string | null,
 *   userId: string | null,
 *   hasUnsavedChanges: boolean
 * }
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../api/cartService';
import { LOAD_STATUS } from '../../constants/app.constants';

// ─── Local Storage Keys ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  CART_USER_ID: 'shopindia_cart_userId',
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

// ─── Thunks ───────────────────────────────────────────────────────────────

export const addToCartAPI = createAsyncThunk(
  'cart/addToCart',
  async ({ product }, { rejectWithValue, getState }) => {
    console.log('🎯 [Redux Thunk] addToCartAPI called');
    console.log('   Product:', product);

    try {
      // Check if user is authenticated (userId should be in state)
      const state = getState();
      const userId = state.cart.userId;
      if (!userId) {
        throw new Error('User ID is required. Please login first.');
      }

      const cartItem = {
        productId: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        qty: 1,
        quantity: 1,
      };

      console.log('   Cart Item Prepared:', cartItem);

      // Backend extracts userId from JWT token, not from request body
      const response = await cartService.addToCart(cartItem);

      console.log('✅ [Redux Thunk] addToCartAPI success!');
      console.log('   Response:', response);

      return {
        product,
        cartItem,
        response,
      };
    } catch (err) {
      console.error('❌ [Redux Thunk] addToCartAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId }, { rejectWithValue }) => {
    console.log('🎯 [Redux Thunk] removeFromCartAPI called');
    console.log('   Product ID:', productId);

    try {
      // Backend extracts userId from JWT token
      await cartService.removeFromCart(productId);

      console.log('✅ [Redux Thunk] removeFromCartAPI success!');

      return productId;
    } catch (err) {
      console.error('❌ [Redux Thunk] removeFromCartAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to remove from cart');
    }
  }
);

export const fetchCartAPI = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    console.log('🎯 [Redux Thunk] fetchCartAPI called');

    try {
      // Backend extracts userId from JWT token
      const items = await cartService.getCart();

      console.log('✅ [Redux Thunk] fetchCartAPI success!');
      console.log('   Items:', items);

      return items;
    } catch (err) {
      console.error('❌ [Redux Thunk] fetchCartAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to fetch cart');
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    console.log('🧹 [Redux Thunk] clearCartAPI called');

    try {
      // Backend extracts userId from JWT token
      const response = await cartService.clearCart();

      console.log('✅ [Redux Thunk] clearCartAPI success!');
      return response;
    } catch (err) {
      console.error('❌ [Redux Thunk] clearCartAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to clear cart');
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  'cart/updateCartItem',
  async ({ changes }, { rejectWithValue }) => {
    console.log('🔄 [Redux Thunk] updateCartItemAPI called');
    console.log('   Changes:', changes);

    try {
      const results = [];
      for (const { productId, quantity } of changes) {
        console.log(`   Updating product ${productId} to qty ${quantity}`);
        const response = await cartService.updateCartItem(productId, quantity);
        results.push(response);
      }
      console.log('✅ [Redux Thunk] updateCartItemAPI success!');
      return results;
    } catch (err) {
      console.error('❌ [Redux Thunk] updateCartItemAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to update cart');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────

const getInitialState = () => {
  const storedUserId = loadFromStorage(STORAGE_KEYS.CART_USER_ID);
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    status: LOAD_STATUS.IDLE,
    error: null,
    userId: storedUserId,
    lastAddedProduct: null,
    hasUnsavedChanges: false,
  };
};

const initialState = getInitialState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserId(state, action) {
      console.log('📌 [CartSlice] setUserId:', action.payload);
      state.userId = action.payload;
      saveToStorage(STORAGE_KEYS.CART_USER_ID, action.payload);
    },
    clearError(state) {
      console.log('🧹 [CartSlice] clearError');
      state.error = null;
    },
    // Optimistic update - add locally before API call
    addItemLocal(state, action) {
      console.log('📌 [CartSlice] addItemLocal:', action.payload);
      const product = action.payload;
      const exists = state.items.find(i => i.id === product.id);

      if (exists) {
        console.log('   Item already exists, incrementing qty');
        exists.qty = (exists.qty || 1) + 1;
      } else {
        console.log('   Adding new item');
        state.items.push({ ...product, qty: 1 });
      }

      state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
        0
      );
      state.hasUnsavedChanges = true;

      console.log('   Updated totalItems:', state.totalItems);
      console.log('   Updated totalPrice:', state.totalPrice);
    },
    removeItemLocal(state, action) {
      console.log('📌 [CartSlice] removeItemLocal:', action.payload);
      state.items = state.items.filter(i => i.id !== action.payload);
      state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
        0
      );
      console.log('   Updated totalItems:', state.totalItems);
    },
    updateItemQtyLocal(state, action) {
      console.log('📌 [CartSlice] updateItemQtyLocal:', action.payload);
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && qty >= 1) {
        item.qty = qty;
        state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
        state.totalPrice = state.items.reduce(
          (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
          0
        );
        state.hasUnsavedChanges = true;
        console.log('   Updated totalItems:', state.totalItems);
        console.log('   Updated totalPrice:', state.totalPrice);
        console.log('   hasUnsavedChanges set to true');
      }
    },
  },
  extraReducers: (builder) => {
    // ── addToCartAPI ──────────────────────────────────────────────────────
    builder
      .addCase(addToCartAPI.pending, (state) => {
        console.log('⏳ [CartSlice] addToCartAPI.pending');
        state.status = LOAD_STATUS.LOADING;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        console.log('✅ [CartSlice] addToCartAPI.fulfilled');
        console.log('   Payload:', action.payload);

        const product = action.payload.product;
        const exists = state.items.find(i => i.id === product.id);

        if (exists) {
          console.log('   Item exists, incrementing qty');
          exists.qty = (exists.qty || 1) + 1;
        } else {
          console.log('   Adding new item to state');
          state.items.push({ ...product, qty: 1 });
        }

        state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
        state.totalPrice = state.items.reduce(
          (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
          0
        );
        state.status = LOAD_STATUS.SUCCESS;
        state.lastAddedProduct = product;

        console.log('   Cart updated. Total items:', state.totalItems);
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        console.error('❌ [CartSlice] addToCartAPI.rejected');
        console.error('   Error:', action.payload);

        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── removeFromCartAPI ─────────────────────────────────────────────────
    builder
      .addCase(removeFromCartAPI.pending, (state) => {
        console.log('⏳ [CartSlice] removeFromCartAPI.pending');
        state.status = LOAD_STATUS.LOADING;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        console.log('✅ [CartSlice] removeFromCartAPI.fulfilled');
        console.log('   Removed product ID:', action.payload);

        state.items = state.items.filter(i => i.id !== action.payload);
        state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
        state.totalPrice = state.items.reduce(
          (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
          0
        );
        state.status = LOAD_STATUS.SUCCESS;

        console.log('   Updated totalItems:', state.totalItems);
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        console.error('❌ [CartSlice] removeFromCartAPI.rejected');
        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── fetchCartAPI ──────────────────────────────────────────────────────
    builder
      .addCase(fetchCartAPI.pending, (state) => {
        console.log('⏳ [CartSlice] fetchCartAPI.pending');
        state.status = LOAD_STATUS.LOADING;
      })
      .addCase(fetchCartAPI.fulfilled, (state, action) => {
        console.log('✅ [CartSlice] fetchCartAPI.fulfilled');
        console.log('   Items:', action.payload);

        // Normalise items: ensure every item has an `id` field (use productId as fallback)
        const rawItems = action.payload || [];
        state.items = rawItems.map(item => ({
          ...item,
          id: item.id || item.productId,
        }));
        state.totalItems = state.items.reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0);
        state.totalPrice = state.items.reduce(
          (sum, i) => sum + (i.price * (i.qty || i.quantity || 1)),
          0
        );
        state.status = LOAD_STATUS.SUCCESS;
        state.hasUnsavedChanges = false;

        console.log('   Loaded cart. Total items:', state.totalItems);
        console.log('   Normalised items:', state.items);
      })
      .addCase(fetchCartAPI.rejected, (state, action) => {
        console.error('❌ [CartSlice] fetchCartAPI.rejected');
        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── clearCartAPI ─────────────────────────────────────────────────────
    builder
      .addCase(clearCartAPI.pending, (state) => {
        console.log('⏳ [CartSlice] clearCartAPI.pending');
        state.status = LOAD_STATUS.LOADING;
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        console.log('✅ [CartSlice] clearCartAPI.fulfilled');
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.hasUnsavedChanges = false;
        state.status = LOAD_STATUS.SUCCESS;
        console.log('   Cart cleared');
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        console.error('❌ [CartSlice] clearCartAPI.rejected');
        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── updateCartItemAPI ─────────────────────────────────────────────────
    builder
      .addCase(updateCartItemAPI.pending, (state) => {
        console.log('⏳ [CartSlice] updateCartItemAPI.pending');
        state.status = LOAD_STATUS.LOADING;
      })
      .addCase(updateCartItemAPI.fulfilled, (state) => {
        console.log('✅ [CartSlice] updateCartItemAPI.fulfilled');
        state.hasUnsavedChanges = false;
        state.status = LOAD_STATUS.SUCCESS;
        console.log('   hasUnsavedChanges reset to false');
      })
      .addCase(updateCartItemAPI.rejected, (state, action) => {
        console.error('❌ [CartSlice] updateCartItemAPI.rejected');
        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });
  },
});

export const { setUserId, clearError, addItemLocal, removeItemLocal, updateItemQtyLocal } = cartSlice.actions;
export default cartSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────

export const selectCartItems = (s) => s.cart.items;
export const selectCartTotal = (s) => s.cart.totalItems;
export const selectCartPrice = (s) => s.cart.totalPrice;
export const selectCartStatus = (s) => s.cart.status;
export const selectCartError = (s) => s.cart.error;
export const selectCartUserId = (s) => s.cart.userId;
export const selectLastAddedProduct = (s) => s.cart.lastAddedProduct;
export const selectCartHasUnsavedChanges = (s) => s.cart.hasUnsavedChanges;