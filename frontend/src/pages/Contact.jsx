import React, { useState, useEffect, useRef } from 'react';
import { postContact, getLeadCategories } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Contact() {
  const [form, setForm] = useState({ FullName: '', email: '', subject: '', message: '', Status: 'Pending' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showForm, setShowForm] = useState(true);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const notification = useNotification();

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { scrollWheelZoom: false }).setView([36.8185, 10.1820], 16);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstance.current);
      L.marker([36.8185, 10.1820]).addTo(mapInstance.current).bindPopup('<span class="notranslate" translate="no">Createam Agency</span>').openPopup();

      // Ensure the map container is correctly sized
      setTimeout(() => {
        if (mapInstance.current) mapInstance.current.invalidateSize();
      }, 250);
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await postContact(form);
      if (response?.referenceNumber) {
        setReferenceNumber(response.referenceNumber);
        setShowForm(false);
        setTimeout(() => setSent(true), 300); // Wait for form fade-out
      } else {
        notification.error('Something went wrong.');
      }
    } catch (error) {
      notification.error('Failed to submit form: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setSent(false);
    setShowForm(true);
    setForm({ FullName: '', email: '', subject: '', message: '', Status: 'Pending' });
    setReferenceNumber('');
  };

  return (
    <div className="container section">
      <h1 style={{ marginBottom: '10px' }}>Support & Help</h1>
      <p style={{ maxWidth: '600px', marginBottom: '40px' }}>
        Found a bug? Have a specific question about our services or your account?
        Tell us what's on your mind and we'll get back to you as soon as possible.
      </p>

      <div className="grid grid-2">
        <div>
          <h3>Direct Channels</h3>
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 62, 0, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary)', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="label" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>SUPPORT EMAIL</span>
                <a href="mailto:contact@createam.tn" style={{ color: 'var(--text)', fontWeight: '600', fontSize: '16px', textDecoration: 'none', transition: 'var(--transition-smooth)' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text)'}>contact@createam.tn</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 62, 0, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary)', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="label" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', marginBottom: '2px' }}>PHONE</span>
                <a href="tel:+21671900602" style={{ color: 'var(--text)', fontWeight: '600', fontSize: '16px', textDecoration: 'none', transition: 'var(--transition-smooth)' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text)'}>71 900 602</a>
              </div>
            </div>
          </div>
          <div ref={mapRef} style={{ height: '450px', borderRadius: '8px', marginTop: '20px', position: 'relative', overflow: 'hidden' }}></div>
        </div>

        <div>
          {/* Informational note about form purpose */}
          <div style={{
            marginBottom: '18px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#fff',
            border: '1px solid rgba(117,2,80,0.08)',
            color: '#333'
          }} role="note" aria-label="Support form information">
            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>Please note — Technical issues only</strong>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.4 }}>
              This form is intended for reporting technical problems with the website. We appreciate your concern, but please do not expect an immediate reply — we will work on improving the site and will reach out when necessary. For urgent matters, contact us at <a href="mailto:contact@createam.tn" style={{ color: 'var(--primary)', fontWeight: 600 }}>contact@createam.tn</a>.
            </div>
          </div>

          {sent && !showForm ? (
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              background: '#fff',
              animation: 'fadeIn 0.6s ease-out',
              borderTop: '4px solid var(--primary)'
            }}>
              {/* Checkmark Icon */}
              <div style={{ 
                background: 'rgba(117, 2, 80, 0.08)', 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 30px', 
                color: 'var(--primary)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              {/* Title */}
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 900, 
                color: 'var(--primary)',
                marginBottom: '15px',
                marginTop: 0
              }}>Message received!</h2>

              {/* Thank you message with name and email */}
              <p style={{ 
                fontSize: '15px', 
                color: '#333',
                lineHeight: '1.6',
                marginBottom: '25px',
                maxWidth: '500px',
                margin: '0 auto 25px'
              }}>
                Thank you, <strong>{form.FullName.split(' ')[0]}</strong>! We've received your message at <strong>{form.email}</strong>. Our team will reply within 24 hours.
              </p>

              {/* Reference number */}
              <div style={{ 
                background: 'rgba(117, 2, 80, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                borderLeft: '3px solid var(--primary)'
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: '8px',
                  margin: 0
                }}>Your Reference Number</p>
                <p style={{ 
                  fontSize: '28px', 
                  fontWeight: 900,
                  color: 'var(--primary)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>{referenceNumber}</p>
              </div>

              {/* Urgent matters contact */}
              <p style={{ 
                fontSize: '13px', 
                color: '#999',
                marginBottom: '30px'
              }}>
                For urgent matters, reach us directly at <a href="mailto:contact@createam.tn" style={{ 
                  color: 'var(--primary)', 
                  fontWeight: 600,
                  textDecoration: 'none'
                }}>contact@createam.tn</a>
              </p>

              {/* Action button */}
              <button 
                onClick={handleSendAnother}
                className="btn" 
                style={{ 
                  marginTop: '20px',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)'
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{
              animation: showForm ? 'fadeIn 0.6s ease-out' : 'fadeOut 0.3s ease-out forwards'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label className="label" style={{ color: 'var(--primary)' }}>Full Name</label>
                <input style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border)' }} type="text" name="FullName" placeholder="How should we call you?" value={form.FullName} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label className="label" style={{ color: 'var(--primary)' }}>Email</label>
                <input style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border)' }} type="email" name="email" placeholder="Where can we reach you?" value={form.email} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label className="label" style={{ color: 'var(--primary)' }}>Subject</label>
                <input style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border)' }} type="text" name="subject" placeholder="What is this about?" value={form.subject} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label className="label" style={{ color: 'var(--primary)' }}>Message</label>
                <textarea style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border)' }} name="message" placeholder="Please describe the issue or your question in detail..." value={form.message} onChange={handleChange} required rows={5}></textarea>
              </div>
              <button type="submit" className="btn" disabled={submitting} style={{ width: '100%', padding: '15px' }}>
                {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}


