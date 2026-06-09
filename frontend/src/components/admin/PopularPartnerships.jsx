import React from 'react';
import { Eye, Rocket, TrendingUp } from 'lucide-react';

export default function PopularPartnerships({ projects }) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="card animate-slide-up" style={{ 
            marginTop: '40px', 
            padding: '40px',
            background: 'linear-gradient(to bottom right, #ffffff, #fcfcfc)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                        background: 'rgba(235, 68, 90, 0.1)', 
                        padding: '12px', 
                        borderRadius: '15px' 
                    }}>
                        <TrendingUp style={{ color: 'var(--primary)' }} size={28} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Top Performance</h3>
                         <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Performance tracking - Last 3 months</p>
                    </div>
                </div>
                <div className="role-badge" style={{ background: '#f0f0f0', color: '#666', padding: '8px 15px' }}>
                    Live Tracking
                </div>
            </div>
            
            <div className="grid grid-3" style={{ gap: '25px' }}>
                {projects.map((proj, idx) => (
                    <div key={proj.id} style={{ 
                        background: '#fff', 
                        padding: '30px', 
                        borderRadius: '24px', 
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                    }} className="stat-card">
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '25px',
                            background: idx === 0 ? '#FFD700' : (idx === 1 ? '#C0C0C0' : '#CD7F32'),
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '900',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}>
                            {idx + 1}
                        </div>
                        
                        <div>
                            <span className="label" style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)', opacity: 0.8 }}>{proj.cat}</span>
                            <h4 style={{ margin: '10px 0 5px 0', fontSize: '1.3rem', fontWeight: '800', lineHeight: 1.2 }}>{proj.title}</h4>
                        </div>
                        
                        <div style={{ 
                            marginTop: '25px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            padding: '15px 20px',
                            background: '#f8f9fa',
                            borderRadius: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444' }}>
                                <Eye size={18} style={{ color: 'var(--primary)' }} />
                                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{proj.clicks || 0}</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#999', textTransform: 'uppercase' }}>Impressions</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
