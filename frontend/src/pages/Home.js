import React, { useState } from 'react';
import Navbar from '../components/Navbar.js';
import TweetForm from '../components/TweetForm.js';
import TweetList from '../components/TweetList.js';
import Plans from '../components/Plans.js';
import Payment from './Payment.js';


const Home = ({ user, onLogout }) => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="container">
        <main className="layout-grid">
          <section>
            <TweetForm user={user} onTweetPosted={() => setRefreshCount(r => r + 1)} />
            <TweetList user={user} refreshKey={refreshCount} />
          </section>
          
          <aside>
            <div className="glass-panel text-center">
              <h3 style={{ marginBottom: '10px' }}>Your Profile</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{user.name || 'User'}</strong>!</p>
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '600' }}>Active User</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={onLogout} 
                style={{ marginTop: '20px', backgroundColor: 'var(--danger)', backgroundImage: 'none', boxShadow: 'none' }}
              >
                Logout
              </button>
            </div>
          </aside>
        </main>
        
        <section className="plans-section">
          {selectedPlan ? (
            <Payment 
              user={user} 
              plan={selectedPlan} 
              onBack={() => setSelectedPlan(null)} 
            />
          ) : (
            <Plans 
              user={user} 
              onSelectPlan={(plan) => setSelectedPlan(plan)} 
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
