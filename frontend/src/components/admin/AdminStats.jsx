import React from 'react';

export default function AdminStats({ stats }) {
    return (
        <div className="grid grid-4" style={{ marginBottom: '60px' }}>
            <div className="stat-card">
                <p className="label">Total Projects</p>
                <h2 className="stat-value">{stats.projects}</h2>
                <span className="role-badge" style={{ background: '#f0f0f0', color: '#666' }}>All Time</span>
            </div>
            <div className="stat-card">
                <p className="label">Inquiries</p>
                <h2 className="stat-value">{stats.pendingContacts || 0}</h2>
                <span className="role-badge" style={{ background: '#fff0f0', color: 'var(--primary)' }}>Action Required</span>
            </div>
            <div className="stat-card">
                <p className="label">Recent Meetings</p>
                <h2 className="stat-value">{stats.meetings || 0}</h2>
                <span className="role-badge" style={{ background: '#f0f4ff', color: '#1a365d' }}>Notes Logged</span>
            </div>
            <div className="stat-card">
                <p className="label">Traffic-Resolved</p>
                <h2 className="stat-value">{stats.resolvedContacts || 0}</h2>
                <span className="role-badge" style={{ background: '#f0fff0', color: '#38A169' }}>Total Handled</span>
            </div>
        </div>
    );
}
