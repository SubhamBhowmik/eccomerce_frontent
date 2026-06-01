/**
 * cartService — All cart-related API calls
 * Handles add to cart, remove from cart, fetch cart, checkout
 */

import httpClient from './httpClient';

// Cart API endpoints
const CART_API = 'https://eccomerce-orderhandling.onrender.com';

const cartService = {
  /**
   * Add product to cart
   * @param {string} userId 
   * @param {object} cartItem - { productId, quantity, price }
   * @returns {Promise<CartResponse>}
   */
  async addToCart(cartItem) {
    console.log('🛒 [CartService] Adding to cart...');
    console.log('   Cart Item:', cartItem);

    try {
      // Backend extracts userId from JWT token, not from request body
      const payload = {
        productId: cartItem.productId || cartItem.id,
        quantity: cartItem.qty || cartItem.quantity || 1,
        price: cartItem.price,
        productName: cartItem.name || cartItem.productName,
        productImage: cartItem.thumbnail || cartItem.image,
      };

      console.log('   Payload:', payload);

      const response = await httpClient.post(
        `${CART_API}/api/cart/add`,
        payload
      );

      console.log('✅ [CartService] Add to cart successful!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [CartService] Add to cart failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },

  /**
   * Remove product from cart
   * @param {string} productId
   * @returns {Promise}
   */
  async removeFromCart(productId) {
    console.log('🗑️ [CartService] Removing from cart...');
    console.log('   Product ID:', productId);

    try {
      // Backend extracts userId from JWT token
      const response = await httpClient.delete(
        `${CART_API}/api/cart/remove`,
        { productId }
      );

      console.log('✅ [CartService] Remove from cart successful!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [CartService] Remove from cart failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },

  /**
   * Get user's cart
   * @returns {Promise<CartItem[]>}
   */
  async getCart() {
    console.log('📋 [CartService] Fetching cart...');

    try {
      // Backend extracts userId from JWT token, endpoint is /api/cart
      const response = await httpClient.get(
        `${CART_API}/api/cart`
      );

      console.log('✅ [CartService] Fetch cart successful!');
      console.log('   Cart items:', response);

      return Array.isArray(response) ? response : response.items || [];
    } catch (error) {
      console.error('❌ [CartService] Fetch cart failed!');
      console.error('   Error:', error.message);
      return [];
    }
  },

  /**
   * Update cart item quantity
   * @param {string} productId
   * @param {number} quantity
   * @returns {Promise}
   */
  async updateCartItem(productId, quantity) {
    console.log('🔄 [CartService] Updating cart item...');
    console.log('   Product ID:', productId);
    console.log('   New Quantity:', quantity);

    try {
      // Backend extracts userId from JWT token
      const response = await httpClient.put(
        `${CART_API}/api/cart/update`,
        { productId, quantity }
      );

      console.log('✅ [CartService] Update cart item successful!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [CartService] Update cart item failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },

  /**
   * Clear entire cart
   * @returns {Promise}
   */
  async clearCart() {
    console.log('🧹 [CartService] Clearing cart...');

    try {
      // Backend extracts userId from JWT token
      const response = await httpClient.delete(
        `${CART_API}/api/cart/clear`
      );

      console.log('✅ [CartService] Clear cart successful!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [CartService] Clear cart failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },
};

export default cartService;
