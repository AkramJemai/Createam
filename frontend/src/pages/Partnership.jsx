import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { getPartnerships, getPartnershipCategories, trackPartnershipClick, getNearbyPartnerships } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
export default function Partnership() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [userLocation, setUserLocation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [showNearby, setShowNearby] = useState(false);
    const [nearbyProjects, setNearbyProjects] = useState([]);
    const [loadingNearby, setLoadingNearby] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const notification = useNotification();
    useEffect(() => {
        const load = async () => {
            const [pData, cData] = await Promise.all([
                getPartnerships(),
                getPartnershipCategories()
            ]);
            setProjects(pData || []);
            if (cData && cData.length > 0) {
                setCategories(['All', ...cData.map(c => c.name)]);
            } else {
                setCategories(['All', ...new Set((pData || []).map(p => p.cat))]);
            }
            setLoading(false);
        };
        load();
    }, []);
    const filtered = filter === 'All'
        ? projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : projects.filter(p => p.cat === filter && p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'popular') {
            return (b.clicks || 0) - (a.clicks || 0);
        } else if (sortBy === 'year') {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        return 0;
    });
    const handleTrackClick = (id) => {
        trackPartnershipClick(id);
    };
    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await response.json();
            return data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.county || data.address?.state || 'your location';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'your location';
        }
    };
    const handleGetNearby = async () => {
        setLoadingNearby(true);
        try {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    const city = await reverseGeocode(latitude, longitude);
                    setUserCity(city);
                    const nearby = await getNearbyPartnerships(latitude, longitude);
                    setNearbyProjects(nearby || []);
                    setShowNearby(true);
                }, (error) => {
                    console.error('Geolocation error:', error);
                    notification.error('Unable to access your location. Please enable location services.');
                    setLoadingNearby(false);
                });
            } else {
                notification.error('Geolocation is not supported by your browser.');
                setLoadingNearby(false);
            }
        } finally {
            setLoadingNearby(false);
        }
    };
    return (
        <div className="animate-slide-up">
            <section className="section" style={{ background: '#000', color: '#fff', paddingTop: '80px', paddingBottom: '90px', textAlign: 'center' }}>
                <div className="container">
                    <p className="label" style={{ color: 'var(--accent)', marginBottom: '15px' }}>Our Solutions</p>
                    <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>Partnerships<span style={{ color: 'var(--primary)' }}>.</span></h1>
                    <p style={{ maxWidth: '600px', margin: '20px auto', fontSize: '1.1rem', color: '#888', fontWeight: '300', lineHeight: '1.5' }}>
                        Architecting digital excellence through strategic collaboration and innovative design. Explore our selected case studies.
                    </p>
                </div>
            </section>
            <section className="section" style={{ background: '#fff', marginTop: '-60px', borderRadius: '40px 40px 0 0', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div style={{ display: 'flex', gap: '40px' }}>
                            {}
                            <div style={{ width: '200px', flexShrink: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: '20px' }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            style={{
                                                padding: '12px 20px',
                                                borderRadius: '50px',
                                                border: '1px solid #eee',
                                                background: filter === cat ? 'var(--primary)' : 'transparent',
                                                color: filter === cat ? 'white' : '#666',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {}
                            <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Search partnerships by title..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '15px 20px',
                                                borderRadius: '50px',
                                                border: '1px solid #eee',
                                                fontSize: '1rem',
                                                fontWeight: '400',
                                                outline: 'none',
                                                transition: 'all 0.3s ease',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                            onBlur={(e) => e.target.style.borderColor = '#eee'}
                                        />
                                        {}
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                                style={{
                                                    padding: '15px 20px',
                                                    borderRadius: '50px',
                                                    border: '1px solid #eee',
                                                    background: 'transparent',
                                                    color: '#666',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
                                                onMouseLeave={(e) => e.target.style.borderColor = '#eee'}
                                            >
                                                Sort ▼
                                            </button>
                                            {showSortDropdown && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    marginTop: '5px',
                                                    background: 'white',
                                                    border: '1px solid #eee',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                    zIndex: 100,
                                                    minWidth: '180px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('default');
                                                            setShowSortDropdown(false);
                                                        }}
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '12px 16px',
                                                            border: 'none',
                                                            background: sortBy === 'default' ? '#f0f0f0' : 'transparent',
                                                            color: '#333',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                        onMouseLeave={(e) => e.target.style.background = sortBy === 'default' ? '#f0f0f0' : 'transparent'}
                                                    >
                                                        Default
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('popular');
                                                            setShowSortDropdown(false);
                                                        }}
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '12px 16px',
                                                            border: 'none',
                                                            background: sortBy === 'popular' ? '#f0f0f0' : 'transparent',
                                                            color: '#333',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                        onMouseLeave={(e) => e.target.style.background = sortBy === 'popular' ? '#f0f0f0' : 'transparent'}
                                                    >
                                                        Most Popular
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortBy('year');
                                                            setShowSortDropdown(false);
                                                        }}
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '12px 16px',
                                                            border: 'none',
                                                            background: sortBy === 'year' ? '#f0f0f0' : 'transparent',
                                                            color: '#333',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                        onMouseLeave={(e) => e.target.style.background = sortBy === 'year' ? '#f0f0f0' : 'transparent'}
                                                    >
                                                        Newest First
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {}
                                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                                    <button
                                        onClick={handleGetNearby}
                                        disabled={loadingNearby}
                                        style={{
                                            padding: '12px 30px',
                                            borderRadius: '50px',
                                            border: '2px solid var(--primary)',
                                            background: 'transparent',
                                            color: 'var(--primary)',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            cursor: loadingNearby ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            opacity: loadingNearby ? 0.6 : 1
                                        }}
                                    >
                                        {loadingNearby ? 'Getting your location...' : 'Find Partnerships Near Me'}
                                    </button>
                                    {userLocation && <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666' }}>Since you are from <span className="notranslate" translate="no">{userCity}</span>, here are your nearest partnerships</p>}
                                </div>
                                {}
                                {showNearby && nearbyProjects.length > 0 && (
                                    <div style={{ marginBottom: '60px', padding: '30px', background: '#f5f5f5', borderRadius: '20px' }}>
                                        <h2 style={{ marginBottom: '30px', color: '#333' }}>Nearby Partnerships ({nearbyProjects.length})</h2>
                                        <div className="grid grid-2" style={{ gap: '40px' }}>
                                            {nearbyProjects.map(p => (
                                                <Link
                                                    to={`/partnership/${p.id}`}
                                                    key={p.id}
                                                    className="partnership-card"
                                                    onClick={() => handleTrackClick(p.id)}
                                                    style={{
                                                        display: 'block',
                                                        position: 'relative',
                                                        borderRadius: '20px',
                                                        overflow: 'hidden',
                                                        aspectRatio: '16/10',
                                                        background: '#f9f9f9',
                                                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                >
                                                    {p.video ? (
                                                        <video
                                                            src={p.video}
                                                            autoPlay
                                                            muted
                                                            loop
                                                            playsInline
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={(p.media && p.media.length > 0 && typeof p.media[0] === 'string') ? p.media[0] : (p.media && p.media.length > 0 && p.media[0].url) ? p.media[0].url : p.img}
                                                            alt={p.title}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                                            }}
                                                        />
                                                    )}
                                                    <div className="partnership-overlay" style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'rgba(117, 2, 80, 0.85)',
                                                        backdropFilter: 'blur(10px)',
                                                        opacity: 0,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        padding: '40px',
                                                        transition: 'opacity 0.4s ease'
                                                    }}>
                                                        <p className="label" style={{ color: 'var(--accent)', marginBottom: '15px' }}>{p.cat}</p>
                                                        <h3 className="notranslate" translate="no" style={{ color: 'white', fontSize: '3.5rem', fontWeight: '900', marginBottom: '25px', lineHeight: '1', letterSpacing: '-2px' }}>{p.title}</h3>
                                                        <span className="btn see-more-btn" style={{
                                                            background: 'transparent',
                                                            border: '1px solid white',
                                                            borderRadius: '50px',
                                                            padding: '12px 30px',
                                                            fontSize: '12px'
                                                        }}>
                                                            View Details
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {showNearby && nearbyProjects.length === 0 && (
                                    <div style={{ marginBottom: '60px', padding: '30px', background: '#f5f5f5', borderRadius: '20px', textAlign: 'center' }}>
                                        <p style={{ color: '#999', fontSize: '1rem' }}>No partnerships found near your location</p>
                                    </div>
                                )}
                                {}
                                <div className="grid grid-2" style={{ gap: '40px' }}>
                                    {sorted.map(p => (
                                        <Link
                                            to={`/partnership/${p.id}`}
                                            key={p.id}
                                            className="partnership-card"
                                            onClick={() => handleTrackClick(p.id)}
                                            style={{
                                                display: 'block',
                                                position: 'relative',
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                aspectRatio: '16/10',
                                                background: '#f9f9f9',
                                                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                        >
                                            {p.video ? (
                                                <video
                                                    src={p.video}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={(p.media && p.media.length > 0 && typeof p.media[0] === 'string') ? p.media[0] : (p.media && p.media.length > 0 && p.media[0].url) ? p.media[0].url : p.img}
                                                    alt={p.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                />
                                            )}
                                            <div className="partnership-overlay" style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'rgba(117, 2, 80, 0.85)',
                                                backdropFilter: 'blur(10px)',
                                                opacity: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                padding: '40px',
                                                transition: 'opacity 0.4s ease'
                                            }}>
                                                <p className="label" style={{ color: 'var(--accent)', marginBottom: '15px' }}>{p.cat}</p>
                                                <h3 className="notranslate" translate="no" style={{ color: 'white', fontSize: '3.5rem', fontWeight: '900', marginBottom: '25px', lineHeight: '1', letterSpacing: '-2px' }}>{p.title}</h3>
                                                <span className="btn see-more-btn" style={{
                                                    background: 'transparent',
                                                    border: '1px solid white',
                                                    borderRadius: '50px',
                                                    padding: '12px 30px',
                                                    fontSize: '12px'
                                                }}>
                                                    View Details
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {sorted.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                        <h2 style={{ color: '#ccc' }}>No projects found in this category.</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
