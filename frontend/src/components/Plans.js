import React from 'react';
import { plans } from '../utils/plans.js';
const Plans = ({ user, onSelectPlan }) => {

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
            
            <button className="btn btn-primary mt-4" onClick={() => onSelectPlan(plan)}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
