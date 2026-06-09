const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (response.status === 429) {
        throw new Error('Too many login attempts. Please try again in 1 minute.');
    }

    const rawText = await response.text();
    let data;
    try {
        data = JSON.parse(rawText);
    } catch (e) {
        console.error('Server returned non-JSON:', rawText);
        throw new Error('Server error. Please try again later.');
    }

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    if (data.token_expires_at) {
        localStorage.setItem('token_expires_at', data.token_expires_at);
    }

    return data;
};

export const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (e) {
            console.error('Logout API call failed:', e);
        }
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_at');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt && new Date(expiresAt) <= new Date()) {
        logout();
        return false;
    }

    return true;
};

export const sendInvitation = async (email, role, project_id = null, job_title = null) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, role, project_id, job_title }),
        });

        const rawText = await response.text();
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.error('Server returned non-JSON:', rawText);
            throw new Error(`Server Error: ${rawText.substring(0, 100)}...`);
        }

        if (!response.ok) {
            throw new Error(data.message || 'Invitation failed');
        }
        return data;
    } catch (error) {
        console.error('Error in sendInvitation:', error);
        throw error;
    }
};

export const verifySession = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');

    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        if (!response.ok) {
            logout();
            throw new Error(data.message || 'Session expired');
        }
        return data;
    } catch (error) {
        logout();
        throw error;
    }
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
};

export const resetPassword = async (token, email, password, password_confirmation) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ token, email, password, password_confirmation }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
    }
    return data;
};
