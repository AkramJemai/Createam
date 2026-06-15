import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPartnerships, getPartnershipCategories } from '../services/api';
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);
  const [filter, setFilter] = useState('All');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const loadData = async () => {
      const [pData, cData] = await Promise.all([
        getPartnerships(),
        getPartnershipCategories()
      ]);
      if (pData) setProjects(pData);
      if (cData) setCategories(['All', ...cData.map(c => c.name)]);
      setLoading(false);
    };
    loadData();
  }, []);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 30, y: y * 30 });
  };
  const filtered = filter === 'All' ? projects : projects.filter(p => p.cat === filter);
  return (
    <div className="home-page" style={{ background: '#f5f5f5', color: '#333', minHeight: '100vh', perspective: '1200px', overflowX: 'hidden' }}>
      {}
      <section
        className="section desktop-hero"
        onMouseMove={handleMouseMove}
        style={{
          paddingTop: 'clamp(120px, 20vw, 200px)',
          paddingBottom: 'clamp(60px, 15vw, 140px)',
          position: 'relative',
          overflow: 'visible',
          minHeight: 'clamp(600px, 80vh, 100vh)',
          display: 'flex',
          alignItems: 'center'
        }}>
        {}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/hero-background.png"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src="/assets/hero-background.mp4" type="video/mp4" />
        </video>
        {}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          zIndex: 1
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 4 }}>
          {}
          <div className="mobile-hero-content" style={{
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              color: '#8B2D7C',
              marginBottom: '20px'
            }}>
              Createam Agency
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
              color: '#555',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Interdisciplinary design studio crafting brands for the digital age
            </p>
          </div>
        </div>
      </section>
      {}
      <section className="section" style={{ paddingBottom: 'clamp(60px, 10vw, 160px)', position: 'relative', borderBottom: 'none' }}>
        <div className="container">
          <div className="flex align-center justify-between" style={{ marginBottom: 'clamp(40px, 8vw, 100px)', flexWrap: 'wrap', gap: '30px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 4rem)', fontWeight: 900, margin: 0, letterSpacing: '-3px', textTransform: 'uppercase', color: '#8B2D7C' }}>Selected Works</h2>
              <span style={{ position: 'absolute', bottom: '-10px', left: 0, width: '80px', height: '3px', background: '#8B2D7C' }}></span>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', flex: 1, minWidth: '200px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '8px',
                    border: '1px solid #8B2D7C',
                    background: filter === cat ? '#8B2D7C' : 'transparent',
                    color: filter === cat ? 'white' : '#8B2D7C',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '1.5px',
                    minHeight: '48px',
                    flexShrink: 0
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-2" style={{ gap: 'clamp(40px, 8vw, 100px) clamp(20px, 4vw, 50px)' }}>
            {filtered.slice(0, 4).map((p) => (
              <Link to={`/partnership/${p.id}`} key={p.id} className="p-3d-card" style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                overflow: 'hidden',
                clipPath: 'inset(0)'
              }}>
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/10',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f0f0f0',
                  transform: 'translateZ(0)',
                }} className="card-container">
                  {}
                  {p.video && (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                      }}
                    >
                      <source src={p.video} type="video/mp4" />
                    </video>
                  )}
                  {!p.video && (
                    <img
                      src={p.img}
                      alt={p.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        opacity: 0.7,
                        filter: 'grayscale(0.5)',
                        zIndex: 0
                      }}
                      className="p-img"
                    />
                  )}
                  {}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#8B2D7C',
                    color: 'white',
                    padding: '8px 16px',
                    fontWeight: 900,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    zIndex: 10,
                    boxShadow: '0 10px 30px rgba(139,45,124,0.3)',
                    transition: 'transform 0.5s ease',
                    borderRadius: '6px'
                  }} className="floating-tag">
                    {p.cat}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 70%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(20px, 5vw, 50px)',
                    zIndex: 2
                  }}>
                    <h3 className="notranslate" translate="no" style={{ fontSize: 'clamp(1.25rem, 5vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', margin: 0, lineHeight: '1.1', letterSpacing: '-1px', color: '#fff' }}>{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'clamp(80px, 15vw, 160px) 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <p className="label animate-pulse" style={{ color: '#444' }}>System Idle 
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 'clamp(60px, 10vw, 120px)' }}>
            <Link to="/partnership" className="btn" style={{
              background: 'transparent',
              color: '#8B2D7C',
              fontSize: '0.8rem',
              fontWeight: 900,
              border: '1px solid #8B2D7C',
              padding: 'clamp(14px, 4vw, 20px) clamp(30px, 8vw, 60px)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              transition: 'all 0.4s ease',
              minWidth: '200px'
            }}>Full Catalog</Link>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes floatReverse {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(30px) rotate(-10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        .float-anim { animation: float 10s ease-in-out infinite; }
        .float-anim-reverse { animation: floatReverse 15s ease-in-out infinite; }
        /* Desktop-only 3D effects */
        @media (min-width: 769px) {
          .p-3d-card:hover .card-container {
              transform: rotateX(8deg) rotateY(-5deg) translateZ(50px);
              box-shadow: 20px 40px 100px rgba(254,166,36,0.1);
          }
          .p-3d-card:hover .p-img {
              transform: scale(1.1);
              filter: grayscale(0);
          }
          .p-3d-card:hover .floating-tag {
              transform: translateZ(100px) translateY(-10px);
          }
          .p-3d-card:hover .view-link {
              opacity: 1;
              transform: translateX(10px);
          }
        }
        /* Hide desktop elements on mobile */
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .desktop-hero {
            min-height: 600px !important;
          }
          .mobile-hero-content {
            display: block !important;
          }
        }
        /* Show mobile hero content only on mobile */
        @media (min-width: 769px) {
          .mobile-hero-content {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
