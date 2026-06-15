import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPartnership } from '../services/api';
export default function PartnershipDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const loadProject = async () => {
      const data = await getPartnership(id);
      if (data) setProject(data);
      setLoading(false);
    };
    loadProject();
    window.scrollTo(0, 0);
  }, [id]);
  const media = project ? [
    ...(project.img ? [{ type: 'photo', url: project.img }] : []),
    ...(project.video ? [{ type: 'video', url: project.video }] : []),
    ...((project.media || []).map((item) => (
      typeof item === 'string' ? { type: 'photo', url: item } : item
    )))
  ].filter((item) => item?.url) : [];
  useEffect(() => {
    if (media.length && currentIndex >= media.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, media.length]);
  if (loading) return <div className="container section">Loading details...</div>;
  if (!project) return <div className="container section">Project not found.</div>;
  const currentMedia = media[currentIndex];
  const next = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  return (
    <div className="partnership-detail-page animate-slide-up" style={{ minHeight: '100vh', background: '#000', color: 'white', paddingBottom: '100px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        <Link to="/partnership" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '10px', 
          color: '#888', 
          marginBottom: '40px',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'color 0.3s'
        }} className="back-link">
          Back to Partnerships
        </Link>
        <div className="detail-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '60px',
          alignItems: 'start'
        }}>
          <div className="media-section notranslate" translate="no">
            <div className="media-container" style={{
              width: '100%',
              aspectRatio: '16/9',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
              background: '#111',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
            }}>
              {!currentMedia ? (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#777' }}>
                  No media available
                </div>
              ) : currentMedia.type === 'video' ? (
                <video 
                  key={`video-${currentMedia.url}`}
                  src={currentMedia.url} 
                  autoPlay 
                  loop
                  muted
                  controls 
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                />
              ) : (
                <img 
                  key={`image-${currentMedia.url}`}
                  src={currentMedia.url} 
                  alt={project.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} 
                />
              )}
              {media.length > 1 && (
                <>
                  <button className="nav-btn prev" onClick={prev} style={{ left: '25px', width: '60px', height: '60px', fontSize: '30px' }}>‹</button>
                  <button className="nav-btn next" onClick={next} style={{ right: '25px', width: '60px', height: '60px', fontSize: '30px' }}>›</button>
                </>
              )}
            </div>
            {media.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', overflowX: 'auto', paddingBottom: '6px' }}>
                {media.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    style={{
                      flexShrink: 0,
                      width: '120px',
                      height: '80px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: i === currentIndex ? '3px solid var(--accent)' : '3px solid rgba(255,255,255,0.1)',
                      opacity: i === currentIndex ? 1 : 0.55,
                      transition: 'all 0.3s',
                      background: '#111'
                    }}
                  >
                    {item.type === 'video'
                      ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <span style={{ color: 'white', fontSize: '1.6rem' }}>▶</span>
                          <span style={{ color: '#aaa', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Video</span>
                        </div>
                      )
                      : <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="info-section">
            <p className="label" style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', display: 'block' }}>{project.cat}</p>
            <h1 className="notranslate" translate="no" style={{ fontSize: '5rem', marginBottom: '30px', lineHeight: '0.9', fontWeight: 900, letterSpacing: '-2px' }}>{project.title}</h1>
            <div style={{ width: '80px', height: '4px', background: 'var(--primary)', marginBottom: '40px' }}></div>
            <p style={{ 
              color: '#bbb', 
              fontSize: '1.3rem', 
              lineHeight: '1.7', 
              marginBottom: '50px',
              fontWeight: 300
            }}>
              {project.description}
            </p>
            <div className="details-card" style={{ 
              background: '#0a0a0a', 
              padding: '40px', 
              borderRadius: '16px', 
              border: '1px solid #222',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}>
               <div>
                  <p className="label" style={{ color: '#555', marginBottom: '8px' }}>Timeline</p>
                  <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>{project.year}</p>
               </div>
               <div>
                  <p className="label" style={{ color: '#555', marginBottom: '8px' }}>Client</p>
                  <p className="notranslate" translate="no" style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>{project.title.split(' ')[0]}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
