import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as auth from '../services/auth';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid password reset link.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await auth.resetPassword(token, email, password, passwordConfirmation);
      
      setMessage(response.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
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
          Reset Password<span style={{ color: 'var(--primary)' }}>.</span>
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
            <p style={{ fontSize: '13px', color: '#666' }}>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label className="label" style={{ color: 'var(--primary)' }}>New Password</label>
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  outline: 'none',
                }}
                value={password}
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label className="label" style={{ color: 'var(--primary)' }}>Confirm New Password</label>
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  outline: 'none',
                }}
                value={passwordConfirmation}
                placeholder="Confirm Password"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength="8"
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
              disabled={loading || !token || !email}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
