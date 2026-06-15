import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
const LINKS = [
  { label: 'Partnerships', to: '/partnership' },
  { label: 'Clients', to: '/clients' },
  { label: 'Agency', to: '/agency' },
  { label: 'Contact', to: '/contact' },
];
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  return (
    <>
      {}
      <nav className="desktop-navbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '15px 40px' : '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? '#ffffff' : '#ffffff',
        borderBottom: '1px solid rgba(117, 2, 80, 0.1)',
        boxShadow: scrolled ? '0 4px 30px rgba(117, 2, 80, 0.1)' : 'none',
        transition: 'var(--transition-smooth)',
      }}>
        {}
        <Link to="/" className="notranslate logo-link" translate="no" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '900',
          fontSize: '20px',
          textTransform: 'uppercase',
          letterSpacing: '-0.6px',
          color: 'var(--text)',
          textDecoration: 'none'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: scrolled ? '42px' : '48px',
            height: scrolled ? '42px' : '48px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            boxShadow: '0 4px 15px rgba(117, 2, 80, 0.3)',
            transition: 'var(--transition-smooth)'
          }}>
            <img src="/logo.jpg" alt="Createam logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </span>
          <span style={{ lineHeight: 1 }}>
            Createam<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </Link>
        {}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              style={({ isActive }) => ({
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: isActive ? '#fff' : 'var(--text)',
                padding: '12px 20px',
                borderRadius: '8px',
                background: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: isActive ? 'none' : '1px solid transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
        </div>
      </nav>
      {}
      <nav className="mobile-navbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? '#ffffff' : '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.06)' : 'none',
        transition: 'var(--transition-smooth)',
      }}>
        <Link to="/" className="notranslate logo-link" translate="no" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '900',
          fontSize: '16px',
          textTransform: 'uppercase',
          letterSpacing: '-0.6px',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          }}>
            <img src="/logo.jpg" alt="Createam logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </span>
          <span style={{ color: 'var(--text)', lineHeight: 1 }}>
            Createam<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>
        {}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(0,0,0,0.06)',
            cursor: 'pointer',
            padding: 0,
            zIndex: 1001
          }}
        >
          {mobileMenuOpen ? (
            <X size={24} color="#333" />
          ) : (
            <Menu size={24} color="#333" />
          )}
        </button>
      </nav>
      {}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
              backdropFilter: 'blur(4px)'
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 'min(320px, 80vw)',
            background: '#fff',
            zIndex: 1000,
            padding: '80px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            {}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <LanguageSwitcher />
            </div>
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: isActive ? '#fff' : '#333',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  textDecoration: 'none',
                  minHeight: '56px',
                  transition: 'all 0.2s ease',
                })}
              >
                {l.label}
              </NavLink>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  background: 'var(--primary-soft)',
                  textDecoration: 'none',
                  border: '1px solid var(--primary)',
                  minHeight: '56px'
                }}
              >
                Staff Login
              </Link>
            </div>
          </div>
        </>
      )}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .desktop-navbar {
          display: flex !important;
        }
        .mobile-navbar {
          display: none !important;
        }
        /* Desktop navbar visible only on desktop */
        @media (max-width: 768px) {
          .desktop-navbar {
            display: none !important;
          }
          .mobile-navbar {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
