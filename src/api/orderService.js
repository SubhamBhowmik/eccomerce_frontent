/**
 * orderService — Order & Payment API calls
 * Handles place order, verify payment
 */

import httpClient from './httpClient';
import { ORDER_ENDPOINTS } from '../constants/api.constants';

const orderService = {
  /**
   * Place an order — creates order + Razorpay payment order
   * POST /api/orders/place
   * @param {object} payload - { username, shippingAddress, idempotencyKey }
   * @returns {Promise<{ orderId, razorpayOrderId, amount, currency }>}
   */
  async placeOrder(payload) {
    console.log('📦 [OrderService] Placing order...');
    console.log('   Payload:', payload);

    try {
      const response = await httpClient.post(
        ORDER_ENDPOINTS.PLACE,
        payload
      );

      console.log('✅ [OrderService] Order placed successfully!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [OrderService] Place order failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },

  /**
   * Verify payment after Razorpay checkout
   * POST /api/payment/verify
   * @param {object} payload - { razorpayOrderId, razorpayPaymentId, razorpaySignature }
   * @returns {Promise<{ message, transactionId }>}
   */
  async verifyPayment(payload) {
    console.log('🔐 [OrderService] Verifying payment...');
    console.log('   Payload:', payload);

    try {
      const response = await httpClient.post(
        ORDER_ENDPOINTS.VERIFY_PAYMENT,
        payload
      );

      console.log('✅ [OrderService] Payment verified successfully!');
      console.log('   Response:', response);

      return response;
    } catch (error) {
      console.error('❌ [OrderService] Payment verification failed!');
      console.error('   Error:', error.message);
      throw error;
    }
  },
};

export default orderService;