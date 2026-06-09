import React from 'react';
import { LogOut, Plus } from 'lucide-react';

export default function AdminHeader({ activeTab, openCreate, showForm, roleColor, handleLogout }) {
    return (
        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={{ fontWeight: '800', fontSize: '3.5rem', margin: 0 }}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => { e.target.style.background = `${roleColor}11`; }}
                    onMouseLeave={e => { e.target.style.background = 'none'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={16} /> SIGN OUT
                    </div>
                </button>
                {activeTab !== 'dashboard' && activeTab !== 'contacts' && activeTab !== 'categories' && activeTab !== 'invites' && activeTab !== 'jobs' && activeTab !== 'tasks' && activeTab !== 'clients' && activeTab !== 'agency' && !showForm && (
                    <button onClick={openCreate} className="btn" style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add New
                    </button>
                )}
            </div>
        </header>
    );
}
