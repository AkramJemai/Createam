import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

export default function NearbyPartnerships() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [partnerships, setPartnerships] = useState([]);
    const [radius, setRadius] = useState(50); // km

    useEffect(() => {
        getLocationAndFindNearby();
    }, []);

    const getLocationAndFindNearby = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                fetchNearbyPartnerships(latitude, longitude, radius);
            },
            (err) => {
                setError(`Location access denied: ${err.message}. Using default location.`);
                // Use default location (e.g., center of map)
                fetchNearbyPartnerships(35.0, 10.0, radius);
                setLoading(false);
            }
        );
    };

    const fetchNearbyPartnerships = async (lat, lng, rad) => {
        try {
            const data = await api.getNearbyPartnerships(lat, lng, rad);
            
            // Sort by distance
            const sorted = (data || []).sort((a, b) => a.distance - b.distance);
            setPartnerships(sorted);
        } catch (err) {
            setError('Failed to fetch nearby partnerships');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
        if (userLocation) {
            fetchNearbyPartnerships(userLocation.lat, userLocation.lng, newRadius);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px', textAlign: 'center', color: '#999' }}>Getting your location...</div>;

    return (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Header */}
            <div className="card" style={{ padding: '40px', borderTop: '6px solid var(--primary)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 15px 0' }}>
                    Partnerships Near You
                </h2>
                <p style={{ color: '#666', margin: 0 }}>
                    {userLocation 
                        ? `Showing partnerships within ${radius}km of your location (${userLocation.lat.toFixed(2)}°, ${userLocation.lng.toFixed(2)}°)`
                        : 'Finding partnerships near you...'}
                </p>
            </div>

            {error && (
                <div style={{
                    padding: '15px 20px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                }}>
                    Error: {error}
                </div>
            )}

            {/* Radius Selector */}
            <div className="card" style={{ padding: '30px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#999', marginBottom: '15px', display: 'block' }}>
                    Search Radius
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[10, 25, 50, 100, 250].map(r => (
                        <button
                            key={r}
                            onClick={() => handleRadiusChange(r)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: radius === r ? 'none' : '2px solid #ddd',
                                background: radius === r ? 'var(--primary)' : 'transparent',
                                color: radius === r ? 'white' : '#666',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            {r}km
                        </button>
                    ))}
                </div>
            </div>

            {/* Partnerships List */}
            <div className="card" style={{ padding: '30px' }}>
                {partnerships.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 30px', color: '#999' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No partnerships found within {radius}km</p>
                        <p style={{ fontSize: '0.9rem' }}>Try increasing the search radius</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                            Found {partnerships.length} partnership{partnerships.length !== 1 ? 's' : ''}
                        </p>
                        {partnerships.map((p) => (
                            <div key={p.id} style={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #eee',
                                background: '#fafafa',
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '20px',
                                alignItems: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                            >
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '700' }}>
                                        {p.title}
                                    </h4>
                                    <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem' }}>
                                        {p.cat} - {p.tags}
                                    </p>
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#999' }}>
                                        <span><strong>{p.distance?.toFixed(1) || '?'} km away</strong></span>
                                        <span>{p.year}</span>
                                    </div>
                                </div>
                                <div style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '15px 25px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    <div>
                                        View Details
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Distance Info */}
            {userLocation && partnerships.length > 0 && (
                <div className="card" style={{ padding: '20px', background: '#f0f5ff', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                        <strong>Tip:</strong> Distances are calculated from your current location. Click "View Details" to see full partnership information.
                    </p>
                </div>
            )}
        </div>
    );
}
