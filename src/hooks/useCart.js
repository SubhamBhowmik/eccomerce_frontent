/**
 * useCart — Hook for all cart operations
 * Handles add to cart, remove, fetch, with API calls
 */

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  addToCartAPI,
  removeFromCartAPI,
  fetchCartAPI,
  setUserId,
  selectCartItems,
  selectCartTotal,
  selectCartPrice,
  selectCartStatus,
  selectCartError,
  selectCartUserId,
  selectLastAddedProduct,
} from '../store/slices/cartSlice';
import { toast } from '../store/slices/uiSlice';
import { LOAD_STATUS } from '../constants/app.constants';
import { ROUTES } from '../constants/app.constants';

export function useCart() {
  const dispatch = useDispatch();
  const history = useHistory();

  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotal);
  const totalPrice = useSelector(selectCartPrice);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const userId = useSelector(selectCartUserId);
  const lastAddedProduct = useSelector(selectLastAddedProduct);

  console.log('🛒 [useCart] Hook state:', {
    totalItems,
    totalPrice,
    status,
    itemsCount: items.length,
    userId,
  });

  // ── Add to cart ─────────────────────────────────────────
  const addToCart = async (product) => {
    console.log('🛒 [useCart] addToCart called');
    console.log('   Product:', product);
    console.log('   Current userId:', userId);

    if (!userId) {
      console.warn('⚠️ [useCart] No userId found. User must be logged in.');
      dispatch(toast('Please login first to add items to cart', 'error'));
      console.log('🔀 [useCart] Redirecting to login page...');
      history.push(ROUTES.LOGIN);
      return;
    }

    try {
      console.log('   Dispatching addToCartAPI...');
      const result = await dispatch(addToCartAPI({ userId, product }));

      console.log('   Dispatch result:', result);

      if (result.type === addToCartAPI.fulfilled.type) {
        console.log('✅ [useCart] Product added successfully!');
        const productName = product.shortName || product.name || 'Product';
        dispatch(toast(`"${productName}" added to cart!`, 'success'));
        return true;
      } else {
        console.error('❌ [useCart] Failed to add to cart');
        console.error('   Payload:', result.payload);
        // Check if it's an auth error (401/403) — redirect to login
        if (result.payload && (result.payload.includes('401') || result.payload.includes('403') || result.payload.includes('Session') || result.payload.includes('login'))) {
          dispatch(toast('Session expired. Redirecting to login...', 'error'));
          console.log('🔀 [useCart] Redirecting to login due to auth error');
          history.push(ROUTES.LOGIN);
        } else {
          dispatch(toast('Failed to add to cart. Try again.', 'error'));
        }
        return false;
      }
    } catch (err) {
      console.error('❌ [useCart] Exception:', err);
      // Check if it's an auth error — redirect to login
      if (err.message && (err.message.includes('401') || err.message.includes('403') || err.message.includes('Session'))) {
        dispatch(toast('Session expired. Redirecting to login...', 'error'));
        console.log('🔀 [useCart] Redirecting to login due to auth error');
        history.push(ROUTES.LOGIN);
      } else {
        dispatch(toast('Error adding to cart', 'error'));
      }
      return false;
    }
  };

  // ── Remove from cart ────────────────────────────────────
  const removeFromCart = async (productId) => {
    console.log('🛒 [useCart] removeFromCart called');
    console.log('   Product ID:', productId);

    try {
      console.log('   Dispatching removeFromCartAPI...');
      // Backend extracts userId from JWT token
      const result = await dispatch(removeFromCartAPI({ productId }));

      if (result.type === removeFromCartAPI.fulfilled.type) {
        console.log('✅ [useCart] Product removed successfully!');
        dispatch(toast('Item removed from cart', 'success'));
        return true;
      } else {
        console.error('❌ [useCart] Failed to remove from cart');
        dispatch(toast('Failed to remove item', 'error'));
        return false;
      }
    } catch (err) {
      console.error('❌ [useCart] Exception:', err);
      dispatch(toast('Error removing item', 'error'));
      return false;
    }
  };

  // ── Fetch cart ──────────────────────────────────────────
  const fetchCart = async () => {
    console.log('🛒 [useCart] fetchCart called');

    try {
      console.log('   Dispatching fetchCartAPI...');
      // Backend extracts userId from JWT token
      const result = await dispatch(fetchCartAPI());

      if (result.type === fetchCartAPI.fulfilled.type) {
        console.log('✅ [useCart] Cart fetched successfully!');
        console.log('   Items in cart:', result.payload);
        return result.payload;
      } else {
        console.error('❌ [useCart] Failed to fetch cart');
        return [];
      }
    } catch (err) {
      console.error('❌ [useCart] Exception:', err);
      return [];
    }
  };

  // ── Set user ID when user logs in ───────────────────────
  const setCurrentUser = (uid) => {
    console.log('👤 [useCart] setCurrentUser called');
    console.log('   User ID:', uid);
    dispatch(setUserId(uid));
  };

  // ── Check if product is in cart ─────────────────────────
  const isInCart = (productId) => {
    const inCart = items.some(i => i.id === productId);
    console.log(`📍 [useCart] isInCart(${productId}):`, inCart);
    return inCart;
  };

  // ── Get item from cart ──────────────────────────────────
  const getCartItem = (productId) => {
    const item = items.find(i => i.id === productId);
    console.log(`📍 [useCart] getCartItem(${productId}):`, item);
    return item;
  };

  console.log('✅ [useCart] Returning hook API');

  return {
    // State
    items,
    totalItems,
    totalPrice,
    status,
    error,
    userId,
    isLoading: status === LOAD_STATUS.LOADING,
    lastAddedProduct,

    // Methods
    addToCart,
    removeFromCart,
    fetchCart,
    setCurrentUser,
    isInCart,
    getCartItem,
  };
}