import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  placeOrderAPI,
  verifyPaymentAPI,
  clearOrderState,
  resetVerificationStatus,
  selectOrderStatus,
  selectOrderError,
  selectRazorpayOrderId,
  selectOrderId,
  selectOrderAmount,
  selectOrderCurrency,
  selectVerificationStatus,
  selectVerificationError,
  selectTransactionId,
  selectPaymentMessage,
} from '../../store/slices/orderSlice';
import { clearCartAPI } from '../../store/slices/cartSlice';
import { LOAD_STATUS } from '../../constants/app.constants';
import { formatINR } from '../../utils/helpers';
import styles from './PaymentPage.module.css';

// Razorpay test key — from Razorpay Dashboard API Keys
const RAZORPAY_KEY_ID = 'rzp_test_SqLWXk9mpvW2VX';

export default function PaymentPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const orderStatus = useSelector(selectOrderStatus);
  const orderError = useSelector(selectOrderError);
  const razorpayOrderId = useSelector(selectRazorpayOrderId);
  const orderId = useSelector(selectOrderId);
  const amount = useSelector(selectOrderAmount);
  const currency = useSelector(selectOrderCurrency);
  const verificationStatus = useSelector(selectVerificationStatus);
  const verificationError = useSelector(selectVerificationError);
  const transactionId = useSelector(selectTransactionId);
  const paymentMessage = useSelector(selectPaymentMessage);

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayError, setRazorpayError] = useState(null);
  const [paymentStep, setPaymentStep] = useState('placing'); // placing | popup | verifying | success | error
  const razorpayRef = useRef(null);

  // Step 1: Place order on mount
  useEffect(() => {
    dispatch(clearOrderState());
    dispatch(placeOrderAPI());
  }, [dispatch]);

  // Step 2: Once order placed, load Razorpay script
  useEffect(() => {
    if (orderStatus === LOAD_STATUS.SUCCESS && razorpayOrderId) {
      setPaymentStep('popup');
      loadRazorpayScript();
    }
  }, [orderStatus, razorpayOrderId]);

  // Open Razorpay checkout popup (hoisted - function declaration)
  function openRazorpayCheckout() {
    if (!window.Razorpay) {
      setRazorpayError('Payment gateway not loaded. Please try again.');
      setPaymentStep('error');
      return;
    }

    // Backend returns amount in PAISE (e.g. 144998 = Rs.1,449.98)
    // Razorpay popup expects amount in PAISE - pass directly
    console.log('Opening Razorpay popup with amount (paise):', amount);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount),
      currency: currency || 'INR',
      name: 'ShopIndia',
      description: 'Order #' + (orderId ? orderId.slice(-8) : ''),
      order_id: razorpayOrderId,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: 'ShopIndia User',
        email: '',
        contact: '',
      },
      theme: {
        color: '#1e293b',
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay popup closed by user');
          handlePaymentError({ description: 'Payment cancelled. You can retry.' });
        },
      },
    };

    razorpayRef.current = new window.Razorpay(options);
    razorpayRef.current.on('payment.failed', function (response) {
      handlePaymentError(response.error);
    });
    razorpayRef.current.open();
  }

  // Step 3: Script loaded - show Pay Now button (user triggers popup)
  useEffect(() => {
    if (razorpayLoaded) {
      // User will click "Pay Now" button to open the popup
    }
  }, [razorpayLoaded]);

  // Step 4: Verify payment on Razorpay callback
  function handlePaymentSuccess(paymentResponse) {
    console.log('Razorpay success:', paymentResponse);
    setPaymentStep('verifying');
    dispatch(verifyPaymentAPI({
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
    }));
  }

  // Step 4b: Payment failed / popup closed
  function handlePaymentError(error) {
    console.error('Razorpay error:', error);
    setRazorpayError(error?.description || error?.message || 'Payment was cancelled or failed');
    setPaymentStep('error');
  }

  // Step 5: Verification success -> clear cart, show confirmation
  useEffect(() => {
    if (verificationStatus === LOAD_STATUS.SUCCESS) {
      setPaymentStep('success');
      dispatch(clearCartAPI());
    }
  }, [verificationStatus, dispatch]);

  // Step 5b: Verification failed
  useEffect(() => {
    if (verificationStatus === LOAD_STATUS.ERROR) {
      setPaymentStep('error');
    }
  }, [verificationStatus]);

  // Load Razorpay checkout.js dynamically
  function loadRazorpayScript() {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setRazorpayError('Failed to load payment gateway. Please try again.');
      setPaymentStep('error');
    };
    document.body.appendChild(script);
  }

  // Retry from error state
  const handleRetry = () => {
    setRazorpayError(null);
    setPaymentStep('placing');
    dispatch(resetVerificationStatus());
    dispatch(clearOrderState());
    dispatch(placeOrderAPI());
  };

  // Go back to cart
  const handleBackToCart = () => {
    dispatch(clearOrderState());
    history.push('/cart');
  };

  // Go to home
  const handleGoHome = () => {
    dispatch(clearOrderState());
    history.push('/');
  };

  // Render helpers

  const renderPlacing = () => (
    <div className={styles.statusCard}>
      <div className={styles.spinner} />
      <h2 className={styles.statusTitle}>Placing your order...</h2>
      <p className={styles.statusText}>Please wait while we create your order.</p>
    </div>
  );

  const renderPopupPhase = () => (
    <div className={styles.statusCard}>
      {!razorpayLoaded ? (
        <>
          <div className={styles.spinner} />
          <h2 className={styles.statusTitle}>Loading payment gateway...</h2>
          <p className={styles.statusText}>Please wait while we load the payment module.</p>
        </>
      ) : (
        <>
          <div className={styles.payIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 className={styles.statusTitle}>Complete Payment</h2>
          <p className={styles.statusText}>
            Pay securely via Razorpay. Use the test details below.
          </p>

          <div className={styles.testInfo}>
            <p className={styles.testInfoTitle}>Test Mode</p>

            <p className={styles.testInfoSub}>RuPay card (recommended):</p>
            <div className={styles.testInfoRow}>
              <span className={styles.testInfoLabel}>Card:</span>
              <span className={styles.testInfoValue}>6069 0000 0000 0001</span>
            </div>
            <div className={styles.testInfoRow}>
              <span className={styles.testInfoLabel}>Expiry:</span>
              <span className={styles.testInfoValue}>12/28</span>
            </div>
            <div className={styles.testInfoRow}>
              <span className={styles.testInfoLabel}>CVV:</span>
              <span className={styles.testInfoValue}>123</span>
            </div>
            <div className={styles.testInfoRow}>
              <span className={styles.testInfoLabel}>Name:</span>
              <span className={styles.testInfoValue}>Test User</span>
            </div>

            <p className={styles.testInfoSub}>Netbanking (auto-succeeds):</p>
            <div className={styles.testInfoNote}>Select any listed bank, click Pay</div>
          </div>

          <button className={styles.payNowBtn} onClick={openRazorpayCheckout}>
            Pay Rs.{amount ? (amount / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '...'}
          </button>
        </>
      )}
    </div>
  );

  const renderVerifying = () => (
    <div className={styles.statusCard}>
      <div className={styles.spinner} />
      <h2 className={styles.statusTitle}>Verifying payment...</h2>
      <p className={styles.statusText}>
        Please wait while we confirm your payment. Do not close this page.
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className={`${styles.statusCard} ${styles.successCard}`}>
      <div className={styles.successIcon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className={styles.statusTitle}>Payment Successful!</h2>
      <p className={styles.statusText}>{paymentMessage || 'Your order has been confirmed.'}</p>

      <div className={styles.orderDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Order ID</span>
          <span className={styles.detailValue}>{orderId}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Transaction ID</span>
          <span className={styles.detailValue}>{transactionId}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Amount</span>
          <span className={styles.detailValue}>{formatINR(amount / 100)}</span>
        </div>
      </div>

      <p className={styles.statusHint}>
        A confirmation email will be sent to your registered email address.
      </p>

      <div className={styles.actionButtons}>
        <button className={styles.primaryBtn} onClick={handleGoHome}>
          Continue Shopping
        </button>
        <button className={styles.secondaryBtn} onClick={handleBackToCart}>
          Back to Cart
        </button>
      </div>
    </div>
  );

  const renderError = () => {
    const errorMsg = verificationError || razorpayError || orderError || 'Something went wrong.';
    return (
      <div className={`${styles.statusCard} ${styles.errorCard}`}>
        <div className={styles.errorIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className={styles.statusTitle}>Payment Failed</h2>
        <p className={styles.statusText}>{errorMsg}</p>

        <div className={styles.actionButtons}>
          <button className={styles.primaryBtn} onClick={handleRetry}>
            Try Again
          </button>
          <button className={styles.secondaryBtn} onClick={handleBackToCart}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  };

  // Determine what to render
  const renderContent = () => {
    if (verificationStatus === LOAD_STATUS.SUCCESS) {
      return renderSuccess();
    }

    switch (paymentStep) {
      case 'placing':
        return renderPlacing();
      case 'popup':
        return renderPopupPhase();
      case 'verifying':
        return renderVerifying();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      default:
        return renderPlacing();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}