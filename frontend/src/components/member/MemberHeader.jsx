import React from 'react';
import { LogOut } from 'lucide-react';

export default function MemberHeader({ activeTab, roleColor, handleLogout }) {

    return (
        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p className="label" style={{ color: roleColor }}>Collaborative Area</p>
                <h1 style={{ fontWeight: '800', fontSize: '3rem', margin: 0 }}>
                    {activeTab === 'prompt' ? 'Genius Prompt' : 'My Active Projects'}
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'none',
                        border: `1px solid ${roleColor}22`,
                        padding: '10px 20px',
                        borderRadius: '8px',
                        color: roleColor,
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={e => { e.target.style.background = `${roleColor}11`; }}
                    onMouseLeave={e => { e.target.style.background = 'none'; }}
                >
                    <LogOut size={16} /> LEAVE STUDIO
                </button>
            </div>
        </header>
    );
}
