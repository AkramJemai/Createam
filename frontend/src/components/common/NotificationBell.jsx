import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2, Check } from 'lucide-react';
import * as api from '../../services/api';
export default function NotificationBell({ notifications, setNotifications, roleColor, onDeleteNotification }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const unreadCount = Array.isArray(notifications) ? (notifications || []).filter(n => !n.read_at).length : 0;
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);
    const handleMarkAsRead = async (id) => {
        try {
            await api.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };
    const handleMarkAllAsRead = async () => {
        try {
            await api.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (onDeleteNotification) {
            const confirmed = await onDeleteNotification();
            if (!confirmed) return;
        } else {
            if (!confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
                return;
            }
        }
        try {
            await api.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };
    const notifArray = Array.isArray(notifications) ? notifications : [];
    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(o => !o)}
                aria-label={`Notifications (${unreadCount} unread)`}
                style={{
                    position: 'relative',
                    background: 'none',
                    border: `1px solid ${roleColor}22`,
                    padding: '10px',
                    borderRadius: '8px',
                    color: roleColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${roleColor}11`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            minWidth: '20px',
                            height: '20px',
                            padding: '0 5px',
                            borderRadius: '10px',
                            background: '#E53E3E',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(229,62,62,0.5)',
                            border: '2px solid #fff',
                            lineHeight: 1
                        }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        width: '380px',
                        maxHeight: '480px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                        border: '1px solid #eef2f6',
                        zIndex: 1500,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.18s ease-out'
                    }}
                >
                    <div
                        style={{
                            padding: '18px 20px',
                            borderBottom: '1px solid #eef2f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f8f9fa'
                        }}
                    >
                        <div>
                            <p className="label" style={{ margin: 0, color: roleColor }}>Inbox</p>
                            <h3 style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: '800' }}>
                                Notifications
                            </h3>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                title="Mark all as read"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: roleColor,
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {notifArray.length === 0 ? (
                            <div style={{ padding: '50px 20px', textAlign: 'center', color: '#999' }}>
                                <Bell size={28} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>No notifications yet. All caught up!</p>
                            </div>
                        ) : (
                            notifArray.map(notif => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.read_at && handleMarkAsRead(notif.id)}
                                    style={{
                                        padding: '14px 20px',
                                        borderBottom: '1px solid #f3f3f3',
                                        borderLeft: `3px solid ${notif.read_at ? '#CBD5E0' : roleColor}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                        cursor: notif.read_at ? 'default' : 'pointer',
                                        background: notif.read_at ? '#fff' : `${roleColor}08`,
                                        transition: 'background 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                        <h4 style={{
                                            margin: 0,
                                            fontSize: '0.95rem',
                                            fontWeight: notif.read_at ? '600' : '800',
                                            color: '#1A202C'
                                        }}>
                                            {notif.title}
                                        </h4>
                                        <button
                                            onClick={(e) => handleDelete(notif.id, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                padding: '2px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexShrink: 0
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#38a169'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#999'}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <p style={{ color: '#666', margin: 0, fontSize: '0.85rem', lineHeight: 1.45 }}>
                                        {notif.message}
                                    </p>
                                    <small style={{ color: '#999', fontSize: '0.7rem' }}>
                                        {new Date(notif.created_at).toLocaleString('fr-FR')}
                                    </small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
