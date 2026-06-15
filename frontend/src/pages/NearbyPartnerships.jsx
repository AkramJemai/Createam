import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import * as auth from '../services/auth';
import { useNavigate } from 'react-router-dom';
export default function NearbyPartnerships() {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [partnerships, setPartnerships] = useState([]);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(10);
    const radiusRef = React.useRef(10);
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await auth.verifySession();
                detectLocation();
            } catch (err) {
                navigate('/login');
            }
        };
        const detectLocation = () => {
            if (!navigator.geolocation) {
                setError("Geolocation is not supported by your browser.");
                setLoading(false);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setLocation(coords);
                    fetchNearby(coords.lat, coords.lng, radiusRef.current);
                },
                (err) => {
                    setError("Location access denied. Please enable location to find nearby partnerships.");
                    setLoading(false);
                }
            );
        };
        checkAuth();
    }, [navigate]);
    const fetchNearby = async (lat, lng, r = radius) => {
        setLoading(true);
try {
            const data = await api.authenticatedGet(`partnerships/nearby?lat=${lat}&lng=${lng}&radius=${r}`);
            setPartnerships(data || []);
            if (data && data.length > 0) {
                const aiResponse = await api.authenticatedPost('ai/summarize-nearby', {
                    partnerships: data,
                    city: 'your current area'
                });
                setSummary(aiResponse?.summary || 'No summary available.');
            } else {
                setSummary('No partnerships found within this radius.');
            }
        } catch (err) {
            setError("Failed to fetch nearby partnerships.");
        } finally {
            setLoading(false);
        }
    };
    const handleRadiusChange = (e) => {
        const newRadius = Number(e.target.value);
        radiusRef.current = newRadius;
        setRadius(newRadius);
        if (location.lat) {
            fetchNearby(location.lat, location.lng, newRadius);
        }
    };
    if (error) {
        return (
            <div className="container section">
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Location Required</h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn">Retry Detection</button>
                </div>
            </div>
        );
    }
    if (loading) {
        return (
            <div className="container section">
                <div className="animate-pulse" style={{ textAlign: 'center', padding: '100px' }}>
                    <p className="label">Geolocating...</p>
                    <h3>Scanning Orbital Data for Local Connections</h3>
                </div>
            </div>
        );
    }
    return (
        <div className="container section">
            <header style={{ marginBottom: '40px' }}>
                <p className="label">Proximity Analysis</p>
                <h1>Nearby Partnerships<span style={{ color: 'var(--primary)' }}>.</span></h1>
            </header>
            <div className="grid grid-3" style={{ gap: '30px', alignItems: 'start' }}>
                <div className="card" style={{ gridColumn: 'span 1', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>AI Insights</h3>
                    <div style={{
                        background: 'rgba(255, 62, 0, 0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--primary)',
                        lineHeight: '1.6',
                        fontSize: '0.95rem'
                    }}>
                        {summary}
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <label className="label">Search Radius: {radius}km</label>
                        <input
                            type="range"
                            min="5"
                            max="500"
                            value={radius}
                            onChange={handleRadiusChange}
                            style={{ width: '100%', marginTop: '10px', accentColor: 'var(--primary)' }}
                        />
                        <div className="flex justify-between" style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
                            <span>5km</span>
                            <span>500km</span>
                        </div>
                    </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    {partnerships.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {partnerships.map(pship => (
                                <div key={pship.id} className="card animate-slide-up" style={{
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    transition: 'var(--transition-smooth)'
                                }}>
                                    {pship.img ? (
                                        <img
                                            src={pship.img}
                                            alt={pship.title}
                                            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                                        />
                                    ) : pship.video ? (
                                        <video
                                            src={pship.video}
                                            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', background: '#000' }}
                                            muted
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#f0f0f0', display: 'grid', placeItems: 'center', fontSize: '20px' }}>🖼️</div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div className="flex justify-between align-center">
                                            <h3 className="notranslate" translate="no" style={{ margin: 0, fontSize: '1.2rem' }}>{pship.title}</h3>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                color: 'var(--primary)',
                                                background: 'rgba(255, 62, 0, 0.1)',
                                                padding: '4px 10px',
                                                borderRadius: '20px'
                                            }}>
                                                {parseFloat(pship.distance).toFixed(1)} km away
                                            </span>
                                        </div>
                                        <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>{pship.city}, {pship.client?.country}</p>
                                        <div className="label" style={{ fontSize: '0.7rem' }}>{pship.cat} - {pship.year}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                            <p style={{ color: '#999' }}>No partnerships found within {radius}km of your location.</p>
                            <button onClick={() => setRadius(r => r + 50)} className="btn btn-small" style={{ marginTop: '20px' }}>Increase Radius</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
