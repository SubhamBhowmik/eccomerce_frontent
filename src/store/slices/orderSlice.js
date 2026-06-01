/**
 * orderSlice — Order & Payment state
 * Tracks place order, Razorpay payment data, verify payment
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../api/orderService';
import { LOAD_STATUS } from '../../constants/app.constants';

// ─── Thunks ───────────────────────────────────────────────────────────────

export const placeOrderAPI = createAsyncThunk(
  'order/placeOrder',
  async (_, { rejectWithValue }) => {
    console.log('🎯 [Order Thunk] placeOrderAPI called');

    try {
      // Dummy values until shipping form is built
      const payload = {
        username: 'User',
        shippingAddress: '123 Main St, Mumbai, 400001',
        idempotencyKey: 'order-' + Date.now(),
      };

      console.log('   Payload:', payload);

      const response = await orderService.placeOrder(payload);

      console.log('✅ [Order Thunk] placeOrderAPI success!');
      console.log('   Response:', response);

      return response; // { orderId, razorpayOrderId, amount, currency }
    } catch (err) {
      console.error('❌ [Order Thunk] placeOrderAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Failed to place order');
    }
  }
);

export const verifyPaymentAPI = createAsyncThunk(
  'order/verifyPayment',
  async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }, { rejectWithValue }) => {
    console.log('🎯 [Order Thunk] verifyPaymentAPI called');
    console.log('   razorpayOrderId:', razorpayOrderId);
    console.log('   razorpayPaymentId:', razorpayPaymentId);

    try {
      const response = await orderService.verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      console.log('✅ [Order Thunk] verifyPaymentAPI success!');
      console.log('   Response:', response);

      return {
        transactionId: response.transactionId,
        message: response.message,
      };
    } catch (err) {
      console.error('❌ [Order Thunk] verifyPaymentAPI failed!');
      console.error('   Error:', err.message);
      return rejectWithValue(err.message || 'Payment verification failed');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────

const initialState = {
  status: LOAD_STATUS.IDLE,
  error: null,
  // Razorpay order data from place order
  razorpayOrderId: null,
  orderId: null,
  amount: null,
  currency: null,
  // After payment verification
  transactionId: null,
  paymentMessage: null,
  verificationStatus: LOAD_STATUS.IDLE,
  verificationError: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState(state) {
      console.log('🧹 [OrderSlice] clearOrderState');
      Object.assign(state, initialState);
    },
    clearOrderError(state) {
      console.log('🧹 [OrderSlice] clearOrderError');
      state.error = null;
      state.verificationError = null;
    },
    resetVerificationStatus(state) {
      console.log('🧹 [OrderSlice] resetVerificationStatus');
      state.verificationStatus = LOAD_STATUS.IDLE;
      state.verificationError = null;
    },
  },
  extraReducers: (builder) => {
    // ── placeOrderAPI ────────────────────────────────────────────────────
    builder
      .addCase(placeOrderAPI.pending, (state) => {
        console.log('⏳ [OrderSlice] placeOrderAPI.pending');
        state.status = LOAD_STATUS.LOADING;
        state.error = null;
      })
      .addCase(placeOrderAPI.fulfilled, (state, action) => {
        console.log('✅ [OrderSlice] placeOrderAPI.fulfilled');
        const { orderId, razorpayOrderId, amount, currency } = action.payload;
        state.orderId = orderId;
        state.razorpayOrderId = razorpayOrderId;
        state.amount = amount;
        state.currency = currency;
        state.status = LOAD_STATUS.SUCCESS;
      })
      .addCase(placeOrderAPI.rejected, (state, action) => {
        console.error('❌ [OrderSlice] placeOrderAPI.rejected');
        state.status = LOAD_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── verifyPaymentAPI ─────────────────────────────────────────────────
    builder
      .addCase(verifyPaymentAPI.pending, (state) => {
        console.log('⏳ [OrderSlice] verifyPaymentAPI.pending');
        state.verificationStatus = LOAD_STATUS.LOADING;
        state.verificationError = null;
      })
      .addCase(verifyPaymentAPI.fulfilled, (state, action) => {
        console.log('✅ [OrderSlice] verifyPaymentAPI.fulfilled');
        state.transactionId = action.payload.transactionId;
        state.paymentMessage = action.payload.message;
        state.verificationStatus = LOAD_STATUS.SUCCESS;
      })
      .addCase(verifyPaymentAPI.rejected, (state, action) => {
        console.error('❌ [OrderSlice] verifyPaymentAPI.rejected');
        state.verificationStatus = LOAD_STATUS.ERROR;
        state.verificationError = action.payload;
      });
  },
});

export const { clearOrderState, clearOrderError, resetVerificationStatus } = orderSlice.actions;
export default orderSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────
export const selectOrderStatus = (s) => s.order.status;
export const selectOrderError = (s) => s.order.error;
export const selectRazorpayOrderId = (s) => s.order.razorpayOrderId;
export const selectOrderId = (s) => s.order.orderId;
export const selectOrderAmount = (s) => s.order.amount;
export const selectOrderCurrency = (s) => s.order.currency;
export const selectVerificationStatus = (s) => s.order.verificationStatus;
export const selectVerificationError = (s) => s.order.verificationError;
export const selectTransactionId = (s) => s.order.transactionId;
export const selectPaymentMessage = (s) => s.order.paymentMessage;