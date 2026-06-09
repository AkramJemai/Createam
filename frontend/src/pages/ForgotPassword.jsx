import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await auth.forgotPassword(email);
      setMessage(response.message);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: '450px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="label" style={{ color: 'var(--primary)' }}>
          Password Recovery
        </p>
        <h1 style={{ fontSize: '2.5rem' }}>
          Forgot Password<span style={{ color: 'var(--primary)' }}>.</span>
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          padding: '40px',
          boxShadow: `0 10px 40px -10px var(--primary)22`,
          borderTop: `4px solid var(--primary)`,
        }}
      >
        {message ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: '#28a745',
              fontSize: '14px',
              marginBottom: '20px',
              background: '#e6f4ea',
              padding: '15px',
              borderRadius: '4px'
            }}>
              {message}
            </div>
            <Link to="/login" className="btn btn-outline" style={{ display: 'inline-block', marginTop: '10px' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '25px' }}>
              <label className="label" style={{ color: 'var(--primary)' }}>Email Address</label>
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  outline: 'none',
                }}
                value={email}
                placeholder="name@agency.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                color: 'var(--primary)',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center',
                background: '#fff0f0',
                padding: '10px',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                cursor: 'pointer',
                background: 'var(--primary)',
                padding: '18px',
                fontSize: '16px',
                marginTop: '10px',
                boxShadow: `0 4px 14px 0 var(--primary)33`,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link
                to="/login"
                style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
