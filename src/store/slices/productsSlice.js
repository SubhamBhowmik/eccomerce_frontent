/**
 * productsSlice — Redux Toolkit slice for product state.
 *
 * State shape:
 * {
 *   list:           NormalisedProduct[]   — all products in current category
 *   detail:         NormalisedProduct|null — single product being viewed
 *   activeCategory: string|null
 *   listStatus:     'idle'|'loading'|'success'|'error'
 *   detailStatus:   'idle'|'loading'|'success'|'error'
 *   error:          string|null
 *   searchQuery:    string
 * }
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../api/productService';
import { LOAD_STATUS } from '../../constants/app.constants';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const products = await productService.getByCategory(category);
      return { products, category };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await productService.getById(id);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch product');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getAll();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await productService.create(payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await productService.update(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete product');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  list:           [],
  detail:         null,
  activeCategory: null,
  listStatus:     LOAD_STATUS.IDLE,
  detailStatus:   LOAD_STATUS.IDLE,
  error:          null,
  searchQuery:    '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    clearDetail(state) {
      state.detail       = null;
      state.detailStatus = LOAD_STATUS.IDLE;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    // Optimistic update — patch detail in-place immediately
    patchDetailLocal(state, action) {
      if (state.detail) {
        state.detail = { ...state.detail, ...action.payload };
      }
      const idx = state.list.findIndex(p => p.id === state.detail?.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // ── fetchAllProducts ──────────────────────────────────────────────────────
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.listStatus = LOAD_STATUS.LOADING;
        state.error      = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.listStatus = LOAD_STATUS.SUCCESS;
        state.list       = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.listStatus = LOAD_STATUS.ERROR;
        state.error      = action.payload;
      });

    // ── fetchProductsByCategory ───────────────────────────────────────────────
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.listStatus = LOAD_STATUS.LOADING;
        state.error      = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.listStatus     = LOAD_STATUS.SUCCESS;
        state.list           = action.payload.products;
        state.activeCategory = action.payload.category;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.listStatus = LOAD_STATUS.ERROR;
        state.error      = action.payload;
      });

    // ── fetchProductById ──────────────────────────────────────────────────────
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = LOAD_STATUS.LOADING;
        state.error        = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = LOAD_STATUS.SUCCESS;
        state.detail       = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = LOAD_STATUS.ERROR;
        state.error        = action.payload;
      });

    // ── createProduct ─────────────────────────────────────────────────────────
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });

    // ── updateProduct ─────────────────────────────────────────────────────────
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.detail?.id === action.payload.id) state.detail = action.payload;
      });

    // ── deleteProduct ─────────────────────────────────────────────────────────
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== String(action.payload));
        if (state.detail?.id === String(action.payload)) state.detail = null;
      });
  },
});

export const {
  setActiveCategory,
  clearDetail,
  setSearchQuery,
  clearError,
  patchDetailLocal,
} = productsSlice.actions;

export default productsSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProductList      = (s) => s.products.list;
export const selectProductDetail    = (s) => s.products.detail;
export const selectActiveCategory   = (s) => s.products.activeCategory;
export const selectListStatus       = (s) => s.products.listStatus;
export const selectDetailStatus     = (s) => s.products.detailStatus;
export const selectProductError     = (s) => s.products.error;
export const selectSearchQuery      = (s) => s.products.searchQuery;

/** Filtered product list based on current search query */
export const selectFilteredProducts = (s) => {
  const q   = s.products.searchQuery.trim().toLowerCase();
  const all = s.products.list;
  if (!q) return all;
  return all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q)
  );
};
