import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
export default function Footer() {
  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Partnerships', to: '/partnership' },
    { name: 'Agency', to: '/agency' },
    { name: 'Contact', to: '/contact' }
  ];
  const legalLinks = [
    { name: 'Privacy Policy', to: '/privacy-policy' },
    { name: 'Terms of Service', to: '/terms-of-service' },
    { name: 'Staff Login', to: '/login' }
  ];
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      borderTop: '1px solid rgba(254, 166, 36, 0.2)',
      color: '#fff',
      padding: 'clamp(30px, 5vw, 40px) clamp(16px, 4vw, 64px)'
    }}>
      {}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 32,
        marginBottom: 30,
        maxWidth: '1400px',
        margin: '0 auto 30px'
      }}>
        {}
        <div>
          <Link to="/" className="notranslate" translate="no" style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <img src="/logo1.jpg" alt="Createam" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
            Createam<span style={{ color: 'var(--primary)' }}>.</span>
          </Link>
          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.5,
            marginBottom: 0,
            fontWeight: 300
          }}>
            Interdisciplinary design studio crafting brands for the digital age.
          </p>
        </div>
        {}
        <div>
          <p style={{
            fontSize: 10,
            fontWeight: 900,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 12,
            margin: 0
          }}>Navigation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {navLinks.map(l => (
              <Link key={l.name} to={l.to}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'var(--transition-smooth)',
                  textDecoration: 'none',
                  padding: '4px 0',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
              >{l.name}</Link>
            ))}
          </div>
        </div>
        {}
        <div>
          <p style={{
            fontSize: 10,
            fontWeight: 900,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 12,
            margin: 0
          }}>Connect</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/createam.tunisie/',
                icon: <FaInstagram size={20} />
              },
              {
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/company/createam-tunisie/',
                icon: <FaLinkedin size={20} />
              },
              {
                name: 'Facebook',
                url: 'https://www.facebook.com/Createam.Tunisie',
                icon: <FaFacebook size={20} />
              }
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'rgba(254, 166, 36, 0.05)',
                  border: '1px solid rgba(254, 166, 36, 0.1)',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'rgba(254, 166, 36, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(254, 166, 36, 0.1)';
                  e.currentTarget.style.background = 'rgba(254, 166, 36, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label={s.name}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      {}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: 15,
        marginBottom: 0,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <p style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 300,
            marginBottom: 0,
            letterSpacing: 0.5
          }}>
            © 2026 <span className="notranslate" translate="no">Createam Agency</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {legalLinks.map(l => (
              <Link key={l.name} to={l.to} style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 300,
                textDecoration: 'none',
                transition: 'var(--transition-smooth)',
                padding: '4px 0',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
              >{l.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
