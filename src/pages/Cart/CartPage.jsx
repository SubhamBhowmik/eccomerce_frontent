import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../../hooks/useCart';
import {
  selectCartItems,
  selectCartTotal,
  selectCartPrice,
  selectCartStatus,
  selectCartUserId,
  selectCartHasUnsavedChanges,
  clearCartAPI,
  removeItemLocal,
  updateCartItemAPI,
  updateItemQtyLocal,
} from '../../store/slices/cartSlice';
import { LOAD_STATUS } from '../../constants/app.constants';
import { formatINR } from '../../utils/helpers';
import styles from './CartPage.module.css';

export default function CartPage() {
  console.log('🛒 [CartPage] Component mounted/rendered');
  
  const dispatch = useDispatch();
  
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotal);
  const totalPrice = useSelector(selectCartPrice);
  const status = useSelector(selectCartStatus);
  const userId = useSelector(selectCartUserId);
  const hasUnsavedChanges = useSelector(selectCartHasUnsavedChanges);
  
  const { fetchCart } = useCart();
  
  // Ref to track if cart has already been fetched
  const hasFetchedRef = React.useRef(false);
  
  console.log('📋 [CartPage] State:', {
    itemsCount: items.length,
    totalItems,
    totalPrice,
    status,
    userId,
  });

  // Fetch cart on mount if userId exists (only once)
  React.useEffect(() => {
    if (userId && !hasFetchedRef.current) {
      console.log('🔄 [CartPage] useEffect - fetching cart (first time only)');
      hasFetchedRef.current = true;
      // Backend extracts userId from JWT token
      fetchCart();
    }
  }, [userId, fetchCart]);

  const handleRemove = async (productId) => {
    console.log('🗑️ [CartPage] Removing product:', productId);
    // Immediately remove from local state (optimistic update)
    console.log('   Removing locally first (optimistic)...');
    dispatch(removeItemLocal(productId));
    console.log('✅ [CartPage] Item removed from local state');

    // Then call update endpoint with quantity 0 to sync backend
    if (userId) {
      console.log('   Calling update endpoint with qty 0...');
      const changes = [{ productId, quantity: 0 }];
      const result = await dispatch(updateCartItemAPI({ changes }));
      if (result.type === updateCartItemAPI.fulfilled.type) {
        console.log('✅ [CartPage] Product removed from backend via update endpoint');
      } else {
        console.error('❌ [CartPage] Failed to remove product from backend');
      }
    }
  };

  const handleUpdateQty = (id, delta) => {
    console.log(`🔢 [CartPage] handleUpdateQty called - id: ${id}, delta: ${delta}`);
    const item = items.find(i => i.id === id);
    if (!item) {
      console.warn('⚠️ [CartPage] Item not found for id:', id);
      return;
    }
    const currentQty = item.qty || item.quantity || 1;
    const newQty = currentQty + delta;
    console.log(`   Current qty: ${currentQty}, New qty: ${newQty}`);
    if (newQty >= 1) {
      console.log('   Dispatching updateItemQtyLocal...');
      dispatch(updateItemQtyLocal({ id, qty: newQty }));
      console.log('✅ [CartPage] Quantity updated locally');
    } else {
      console.log('   Qty would be less than 1, not updating');
    }
  };

  const handleClearCart = async () => {
    console.log('🧹 [CartPage] handleClearCart called');
    console.log('   Calling clearCartAPI...');
    try {
      const result = await dispatch(clearCartAPI());
      console.log('   Result:', result);
      if (result.type === clearCartAPI.fulfilled.type) {
        console.log('✅ [CartPage] Cart cleared successfully');
      } else {
        console.error('❌ [CartPage] Failed to clear cart');
      }
    } catch (err) {
      console.error('❌ [CartPage] Error clearing cart:', err);
    }
  };

  const handleSaveCart = async () => {
    console.log('💾 [CartPage] handleSaveCart called');
    console.log('   Items to sync:', items);
    
    const changes = items.map(item => ({
      productId: item.id || item.productId,
      quantity: item.qty || item.quantity || 1,
    }));
    
    console.log('   Changes payload:', changes);
    
    try {
      const result = await dispatch(updateCartItemAPI({ changes }));
      console.log('   Result:', result);
      if (result.type === updateCartItemAPI.fulfilled.type) {
        console.log('✅ [CartPage] Cart saved successfully');
      } else {
        console.error('❌ [CartPage] Failed to save cart');
      }
    } catch (err) {
      console.error('❌ [CartPage] Error saving cart:', err);
    }
  };

  const handleCheckout = () => {
    console.log('💳 [CartPage] Checkout clicked');
    console.log('   Redirecting to payment...');
    // Navigate to PaymentPage which handles place order + Razorpay flow
    window.location.href = '/payment';
  };

  const isLoading = status === LOAD_STATUS.LOADING;

  console.log('🎨 [CartPage] Rendering with items:', items);

  return (
    <div className={styles.container}>
      <div className="page-container">
        <h1 className={styles.title}>Shopping Cart</h1>
        
        {isLoading ? (
          <div className={styles.loading}>Loading cart...</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.itemsSection}>
              <div className={styles.itemsList}>
                {items.map((item) => {
                  const qty = item.qty || item.quantity || 1;
                  const subtotal = item.price * qty;
                  console.log(`   [CartPage] Rendering item: ${item.id}, qty: ${qty}, price: ${item.price}, subtotal: ${subtotal}`);
                  return (
                    <div key={item.id} className={styles.itemCard}>
                      <img
                        src={item.thumbnail || item.image || 'https://placehold.co/80x80/f3f2ef/888?text=?'}
                        alt={item.name || item.productName}
                        className={styles.itemImage}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/80x80/f3f2ef/888?text=?';
                        }}
                      />
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemName}>
                          {item.name || item.productName || 'Unnamed Product'}
                        </h3>
                        <p className={styles.itemPrice}>{formatINR(item.price)}</p>
                        <div className={styles.itemQtyControls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => handleUpdateQty(item.id, -1)}
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                          <span className={styles.qtyValue}>{qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => handleUpdateQty(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19"/>
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className={styles.itemRight}>
                        <span className={styles.itemSubtotal}>{formatINR(subtotal)}</span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemove(item.id || item.productId)}
                          aria-label="Remove item"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.cartActions}>
                <button
                  className={`${styles.saveCartBtn} ${hasUnsavedChanges ? styles.saveCartBtnActive : ''}`}
                  onClick={handleSaveCart}
                  disabled={!hasUnsavedChanges}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8, verticalAlign: 'middle'}}>
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Cart {hasUnsavedChanges ? '●' : ''}
                </button>
                <button
                  className={styles.clearCartBtn}
                  onClick={handleClearCart}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8, verticalAlign: 'middle'}}>
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className={styles.summarySection}>
              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>
                <div className={styles.summaryRow}>
                  <span>Items ({totalItems})</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery</span>
                  <span className={styles.freeDelivery}>FREE</span>
                </div>
                <hr className={styles.divider} />
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                <Link to="/" className={styles.continueBtn}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}