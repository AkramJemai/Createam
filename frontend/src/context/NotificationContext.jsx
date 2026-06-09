import React, { createContext, useState, useCallback } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const closeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showConfirmDialog = useCallback((message) => {
        return new Promise((resolve) => {
            const id = Date.now();
            setNotifications(prev => [...prev, {
                id,
                message,
                type: 'confirm',
                onConfirm: () => {
                    setNotifications(p => p.filter(n => n.id !== id));
                    resolve(true);
                },
                onCancel: () => {
                    setNotifications(p => p.filter(n => n.id !== id));
                    resolve(false);
                }
            }]);
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, closeNotification, showConfirmDialog }}>
            {children}
            <NotificationContainer notifications={notifications} closeNotification={closeNotification} />
        </NotificationContext.Provider>
    );
}

function NotificationContainer({ notifications, closeNotification }) {
    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            {notifications.map(notif => (
                notif.type === 'confirm' ? (
                    <ConfirmDialog key={notif.id} notification={notif} />
                ) : (
                    <Toast key={notif.id} notification={notif} closeNotification={closeNotification} />
                )
            ))}
        </div>
    );
}

function Toast({ notification, closeNotification }) {
    const bgColor = notification.type === 'error' ? '#fee2e2' : notification.type === 'success' ? '#dcfce7' : '#eff6ff';
    const textColor = notification.type === 'error' ? '#991b1b' : notification.type === 'success' ? '#166534' : '#1e40af';
    const borderColor = notification.type === 'error' ? '#fca5a5' : notification.type === 'success' ? '#86efac' : '#93c5fd';

    const Icon = notification.type === 'error' ? AlertCircle : notification.type === 'success' ? CheckCircle : Info;

    return (
        <div style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <Icon size={20} style={{ color: textColor, flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: textColor, fontSize: '0.9rem', flex: 1, lineHeight: '1.5' }}>
                {notification.message}
            </p>
            <button
                onClick={() => closeNotification(notification.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: textColor,
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.target.style.opacity = '1'}
                onMouseLeave={e => e.target.style.opacity = '0.6'}
            >
                <X size={16} />
            </button>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

function ConfirmDialog({ notification }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '450px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                    <AlertCircle size={24} style={{ color: '#FF6B35', flexShrink: 0, marginTop: '2px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a', fontSize: '1.2rem', fontWeight: 800 }}>Confirm Action</h3>
                </div>
                <p style={{ margin: '0 0 30px 0', color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {notification.message}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={notification.onCancel}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            background: '#f5f5f5',
                            color: '#666',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.background = '#eee'}
                        onMouseLeave={e => e.target.style.background = '#f5f5f5'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={notification.onConfirm}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#FF6B35',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.background = '#E85A2C'}
                        onMouseLeave={e => e.target.style.background = '#FF6B35'}
                    >
                        Confirm
                    </button>
                </div>
                <style>{`
                    @keyframes popIn {
                        from {
                            transform: scale(0.9);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
