import React from 'react';
import { plans } from '../utils/plans.js';
import { createOrder, verifyPayment } from '../services/paymentService.js';

const Plans = ({ user }) => {
  const handleSubscribe = async (plan) => {
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
            }
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: "User",
          email: "coder7963@gmail.com",
        },
        theme: {
          color: "#1da1f2"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate payment.');
    }
  };

  return (
    <div className="plans-container container">
      <h2 className="plans-title">Subscription Plans</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-panel plan-card">
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">
              ₹{plan.price}<span>/month</span>
            </div>
            
            <div className="plan-features">
              <div className="plan-feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {plan.limit === 'unlimited' ? 'Unlimited' : plan.limit} Tweets
              </div>
            </div>
            
            <button className="btn btn-primary mt-4" onClick={() => handleSubscribe(plan)}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
