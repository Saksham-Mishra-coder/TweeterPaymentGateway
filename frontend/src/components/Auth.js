import React, { useState } from 'react';
import { login, register } from '../services/authService.js';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login({ email, password });
        onLogin(res.data);
      } else {
        const res = await register({ name, email, password });
        // Auto-login after register for simplicity, or just set user directly
        onLogin({ userId: res.data.user._id, plan: 'Free', name: res.data.user.name }); 
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card">
        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join Tweeter'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-switch">
          {isLogin ? (
            <p>New to Tweeter? <span onClick={() => setIsLogin(false)}>Sign up now</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Log in here</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
