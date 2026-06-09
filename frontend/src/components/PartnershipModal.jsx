import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientPartnerships } from '../services/api';

export default function PartnershipModal({ client, isOpen, onClose }) {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      loadPartnerships();
    }
  }, [isOpen, client]);

  const loadPartnerships = async () => {
    setLoading(true);
    try {
      const data = await getClientPartnerships(client.id);
      setPartnerships(data || []);
    } catch (error) {
      console.error('Failed to load partnerships:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '40px 20px 20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '85vh',
        overflow: 'auto',
        padding: '40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#333' }}>
            {client?.name} — Partnerships
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            Close
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p className="label animate-pulse">Loading partnerships...</p>
          </div>
        ) : partnerships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>No partnerships found for this client.</p>
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: '30px' }}>
            {partnerships.map((partnership) => (
              <div
                key={partnership.id}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease'
                }}
                className="partnership-card"
              >
                <div style={{
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  background: '#f0f0f0'
                }}>
                  {partnership.img ? (
                    <img
                      src={partnership.img}
                      alt={partnership.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : partnership.video ? (
                    <video
                      src={partnership.video}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        background: '#000'
                      }}
                      muted
                      onMouseOver={e => e.target.play()}
                      onMouseOut={e => e.target.pause()}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#ccc', fontSize: '2rem' }}>🖼️</div>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 10px 0', color: '#333' }}>
                    {partnership.title}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', color: '#8B2D7C', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>
                    {partnership.cat?.toUpperCase() || 'UNCATEGORIZED'}
                  </p>
                  {partnership.description && (
                    <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {partnership.description}
                    </p>
                  )}
                  <Link
                    to={`/partnership/${partnership.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: '#333',
                      color: '#fff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'var(--primary)'}
                    onMouseOut={(e) => e.target.style.background = '#333'}
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
