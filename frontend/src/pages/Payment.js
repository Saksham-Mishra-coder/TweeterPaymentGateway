import React, { useState } from 'react';
import { createOrder, verifyPayment } from '../services/paymentService.js';

const Payment = ({ user, plan, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await createOrder({ userId: user.userId, planName: plan.name });
      const { order, subscriptionId } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_Sa6bsk7sWAecIB', 
        amount: order.amount,
        currency: order.currency,
        name: 'Tweeter',
        description: `Subscription to ${plan.name} plan`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              subscriptionId
            });
            if (verifyRes.data.success) {
              alert('Payment successful! Your plan is updated.');
              onBack(); // Go back after successful payment
            }
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "coder7963@gmail.com",
        },
        theme: {
          color: "#1da1f2"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment Failed');
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container glass-panel" style={{ maxWidth: '500px', margin: '40px auto', padding: '30px' }}>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Plans</button>
      <h2>Checkout</h2>
      <div className="plan-summary" style={{ margin: '20px 0', padding: '20px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <h3>{plan.name} Plan</h3>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Total to pay: <strong>₹{plan.price}</strong></p>
        <p>Limit: {plan.limit === 'unlimited' ? 'Unlimited' : plan.limit} Tweets</p>
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} 
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Pay ₹${plan.price}`}
      </button>
    </div>
  );
};

export default Payment;
