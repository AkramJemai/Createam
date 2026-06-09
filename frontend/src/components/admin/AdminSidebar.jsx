import React from 'react';
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    Calendar, 
    Mail, 
    Grid, 
    Award, 
    CheckSquare, 
    UserPlus, 
    Building,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, setShowForm, handleLogout, roleColor, isCollapsed, setIsCollapsed }) {
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'partnership', label: 'Partnerships', icon: Briefcase },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'meetings', label: 'Meetings', icon: Calendar },
        { id: 'contacts', label: 'Contacts', icon: Mail },
        { id: 'categories', label: 'Categories', icon: Grid },
        { id: 'jobs', label: 'Job Titles', icon: Award },
        { id: 'tasks', label: 'Task Board', icon: CheckSquare },
        { id: 'invites', label: 'Invites', icon: UserPlus },
        { id: 'agency', label: 'Agency', icon: Building }
    ];

    return (
        <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                    <p className="label" style={{ color: roleColor, margin: 0 }}>Admin Panel</p>
                    <h2 className="notranslate" translate="no" style={{ fontSize: '1.2rem', margin: 0, fontWeight: '800' }}>
                        Createam<span style={{ color: 'var(--accent)' }}>.</span>
                    </h2>
                </div>
            </div>

            <nav className="sidebar-nav">
                {sidebarItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setShowForm(false); }}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={20} />
                        <span style={{ display: isCollapsed ? 'none' : 'block' }}>{item.label}</span>
                    </button>
                ))}
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
