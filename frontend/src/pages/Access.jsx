import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Access() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="container section" style={{ maxWidth: '400px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="label" style={{ color: 'var(--primary)' }}>Recovery</p>
        <h1>Access<span style={{ color: 'var(--primary)' }}>.</span></h1>
      </header>

      <div className="card">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p style={{ marginBottom: '30px' }}>
              Enter your professional email to receive a secure access link.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label className="label" style={{ color: 'var(--primary)' }}>Email Address</label>
              <input
                type="email"
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', cursor: 'pointer' }}>
              {loading ? 'Requesting...' : 'Request Link'}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/login" style={{ fontSize: '12px', color: '#666', textDecoration: 'underline' }}>Return to login</Link>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '30px' }}>
              If an account exists for <strong>{email}</strong>, you will receive recovery instructions shortly.
            </p>
            <Link to="/login" className="btn" style={{ textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
