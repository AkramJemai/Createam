import React from 'react';
import {
    Rocket,
    Sparkles,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function MemberSidebar({ activeTab, setActiveTab, handleLogout, roleColor, isCollapsed, setIsCollapsed }) {
    return (
        <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ position: 'relative', '--role-color': '#38a169' }}>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '38px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                }}>
                    <img src="/logo.jpg" alt="Createam" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </span>
                <div style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <p className="label" style={{ color: roleColor, margin: 0 }}>Team Member</p>
                    <h2 className="notranslate" translate="no" style={{ fontSize: '1.2rem', margin: 0, fontWeight: '800' }}>
                        Createam<span style={{ color: '#38a169' }}>.</span>
                    </h2>
                </div>
            </div>

            <nav className="sidebar-nav">
                 <button
                    onClick={() => setActiveTab('projects')}
                    className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                    title={isCollapsed ? 'My Active Projects' : ''}
                >
                    <Rocket size={20} />
                    <span style={{ display: isCollapsed ? 'none' : 'block' }}>My Active Projects</span>
                </button>
                <button
                    onClick={() => setActiveTab('prompt')}
                    className={`nav-item ${activeTab === 'prompt' ? 'active' : ''}`}
                    title={isCollapsed ? 'Genius Prompt' : ''}
                >
                    <Sparkles size={20} />
                    <span style={{ display: isCollapsed ? 'none' : 'block' }}>Genius Prompt</span>
                </button>
            </nav>

            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.03)'
                }}
            >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
        </aside>
    );
}
