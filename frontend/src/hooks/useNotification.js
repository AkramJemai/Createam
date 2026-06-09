import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }

    return {
        success: (message, duration = 5000) => context.showNotification(message, 'success', duration),
        error: (message, duration = 5000) => context.showNotification(message, 'error', duration),
        info: (message, duration = 5000) => context.showNotification(message, 'info', duration),
        confirm: (message) => context.showConfirmDialog(message)
    };
}
