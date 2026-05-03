import React, { useState } from 'react';
import { createTweet } from '../services/tweetService.js';

const TweetForm = ({ user, onTweetPosted }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    
    try {
      await createTweet({ userId: user.userId, content });
      setContent('');
      if (onTweetPosted) onTweetPosted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post tweet');
    }
  };

  return (
    <div className="tweet-form-container glass-panel">
      <h2 className="tweet-form-title">Create a Tweet</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows="4"
            required
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }}>
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;
