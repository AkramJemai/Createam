import React, { useState, useEffect } from 'react';
import { getAgencyData } from '../services/api';
export default function Agency() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadAgency = async () => {
            const agencyData = await getAgencyData();
            if (agencyData) setData(agencyData);
            setLoading(false);
        };
        loadAgency();
        window.scrollTo(0, 0);
    }, []);
    if (loading) return (
        <div className="container section" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <p className="label animate-pulse">Consulting Archives</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300 }}>Assembling Agency Profile...</h2>
        </div>
    );
    if (!data) return <div className="container section">Information currently unavailable.</div>;
    const { info, timeline, team, stats } = data;
    return (
        <div className="animate-slide-up" style={{ background: '#fff' }}>
            {}
            <header className="section" style={{ background: '#000', color: '#fff', paddingTop: '100px', paddingBottom: '90px' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>
                                {info?.tagline || 'Excellence in Motion.'}
                            </h1>
                        </div>
                        <div style={{ flex: 1 }}>
                            <img
                                src="/assets/createam_logo.png"
                                alt="Agency"
                                style={{ width: '60%', borderRadius: '16px', objectFit: 'contain', maxHeight: '220px', display: 'block', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                </div>
            </header>
            {}
            <section className="section" style={{ background: '#fff', marginTop: '-60px', borderRadius: '40px 40px 0 0', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <div className="grid grid-2" style={{ gap: '80px', alignItems: 'start' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '30px' }}>Our Essence<span style={{ color: 'var(--primary)' }}>.</span></h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', fontWeight: '300' }}>
                                {info?.about_text}
                            </p>
                            <p style={{ marginTop: '30px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                Established {info?.founded_year}
                            </p>
                        </div>
                        <div className="grid grid-2" style={{ gap: '20px' }}>
                            {stats?.map(stat => (
                                <div key={stat.id} className="card" style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-soft)', border: 'none' }}>
                                    <h4 className="notranslate" translate="no" style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', margin: '0' }}>{stat.value}</h4>
                                    <p className="label" style={{ marginTop: '10px', fontSize: '0.65rem' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="section" style={{ background: '#fcf8fa' }}>
                <div className="container">
                    <header style={{ marginBottom: '80px', textAlign: 'center' }}>
                        <p className="label">Our Journey</p>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>Milestones</h2>
                    </header>
                    {timeline && timeline.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', maxWidth: '700px', margin: '0 auto' }}>
                            {timeline.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                                    <div style={{ minWidth: '80px' }}>
                                        <p style={{ fontSize: '2rem', fontWeight: '900', color: '#000000', lineHeight: '1', margin: 0 }}>{item.year}</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 8px 0' }}>{item.title}</h3>
                                        <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                            <p>No milestones added yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>
            {}
            <section className="section">
                <div className="container">
                    <header style={{ marginBottom: '60px' }}>
                        <p className="label" style={{ color: 'var(--primary)' }}>Members</p>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>The Creative Force</h2>
                    </header>
                    {team && team.length > 0 ? (
                        <div className="grid grid-3" style={{ gap: '40px' }}>
                            {team.map(member => (
                                <div key={member.id} className="team-card animate-slide-up" style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0' }}>{member.name}</h3>
                                    <p className="label" style={{ color: 'var(--primary)', marginTop: '5px' }}>{member.role}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                            <p>Team members coming soon!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
