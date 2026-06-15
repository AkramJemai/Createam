const API_BASE_URL = 'http://127.0.0.1:8000/api';
const inFlightRequests = new Map();
export const fetchData = async (endpoint, defaultVal = []) => {
    const requestKey = `fetch:${endpoint}`;
    if (inFlightRequests.has(requestKey)) {
        return inFlightRequests.get(requestKey);
    }
    const fetchPromise = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                console.error(`Error fetching ${endpoint}: ${response.statusText}`);
                return defaultVal;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Critical Connection Error for ${endpoint}:`, error);
            return defaultVal;
        } finally {
            inFlightRequests.delete(requestKey);
        }
    })();
    inFlightRequests.set(requestKey, fetchPromise);
    return fetchPromise;
};
export const getTeam = () => fetchData('team');
export const getValues = () => fetchData('values');
export const getPartnershipCategories = () => authenticatedGet('partnership-categories');
export const getAgencyData = () => fetchData('agency', null);
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});
export const authenticatedMultipart = async (endpoint, data, method = 'POST') => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'removeImg' || key === 'removeVideo') {
            formData.append(key, data[key]);
        } else if (Array.isArray(data[key])) {
            data[key].forEach(item => formData.append(`${key}[]`, item));
        } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    if (method === 'PUT') {
        formData.append('_method', 'PUT');
        method = 'POST';
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            },
            body: formData,
        });
        const rawText = await response.text();
        let result;
        try {
            result = JSON.parse(rawText);
        } catch (e) {
            console.error('Multipart Server Error:', rawText);
            throw new Error(`Server Error: ${rawText.substring(0, 150)}...`);
        }
        if (!response.ok) throw new Error(result.message || 'Action failed');
        return result;
    } catch (error) {
        console.error('Error in authenticatedMultipart:', error);
        throw error;
    }
};
export const authenticatedDelete = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const rawText = await response.text();
        if (!response.ok) {
            console.error('Delete failed:', rawText);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`DELETE error for ${endpoint}:`, error);
        return false;
    }
};
export const authenticatedPost = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const rawText = await response.text();
        if (!response.ok) {
            console.error('POST failed:', rawText);
            return null;
        }
        try {
            const result = JSON.parse(rawText);
            return result;
        } catch (e) {
            console.error('POST non-JSON:', rawText);
            return null;
        }
    } catch (error) {
        console.error(`POST error for ${endpoint}:`, error);
        return null;
    }
};
export const authenticatedGet = async (endpoint) => {
    const requestKey = `auth:${endpoint}`;
    if (inFlightRequests.has(requestKey)) {
        return inFlightRequests.get(requestKey);
    }
    const fetchPromise = (async () => {
        try {
            const separator = endpoint.includes('?') ? '&' : '?';
            const response = await fetch(`${API_BASE_URL}/${endpoint}${separator}_t=${Date.now()}`, {
                headers: getAuthHeaders(),
            });
            const data = response.ok ? await response.json() : [];
            return data;
        } catch (error) {
            console.error(`Fetch error for ${endpoint}:`, error);
            return [];
        } finally {
            inFlightRequests.delete(requestKey);
        }
    })();
    inFlightRequests.set(requestKey, fetchPromise);
    return fetchPromise;
};
export const authenticatedPut = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const result = response.ok ? await response.json() : null;
        return result;
    } catch (error) {
        console.error(`PUT error for ${endpoint}:`, error);
        return null;
    }
};
export const getPartnerships = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authenticatedGet(`partnerships${query ? `?${query}` : ''}`);
};
export const getPartnership = (id) => fetchData(`partnerships/${id}`, null);
export const createPartnership = (data) => authenticatedMultipart('partnerships', data);
export const updatePartnership = (id, data) => authenticatedMultipart(`partnerships/${id}`, data, 'PUT');
export const deletePartnership = (id) => authenticatedDelete(`partnerships/${id}`);
export const getTopClickedProjectsLast3Months = () => authenticatedGet('partnerships/trending/top-3-months');
export const trackPartnershipClick = async (id) => {
    if (localStorage.getItem('token')) return null;
    try {
        const response = await fetch(`${API_BASE_URL}/partnerships/${id}/click`, { method: 'POST' });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Failed to track click:', error);
        return null;
    }
};
export const getContacts = () => authenticatedGet('contacts');
export const updateContact = (id, data) => authenticatedPut(`contacts/${id}`, data);
export const deleteContact = (id) => authenticatedDelete(`contacts/${id}`);
export const createPartnershipCategory = (data) => authenticatedPost('partnership-categories', data);
export const updatePartnershipCategory = (id, data) => authenticatedPut(`partnership-categories/${id}`, data);
export const deletePartnershipCategory = (id) => authenticatedDelete(`partnership-categories/${id}`);
export const validateInvitation = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invite/validate/${token}`, {
            headers: { 'Accept': 'application/json' }
        });
        const rawText = await response.text();
        if (!response.ok) return null;
        try {
            return JSON.parse(rawText);
        } catch (e) {
            console.error('Validation return non-JSON:', rawText);
            return null;
        }
    } catch (error) {
        console.error('Error validating invitation:', error);
        return null;
    }
};
export const acceptInvitation = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/invite/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const rawText = await response.text();
        let result;
        try {
            result = JSON.parse(rawText);
        } catch (e) {
            console.error('Server returned non-JSON:', rawText);
            throw new Error(`Server Error: ${rawText.substring(0, 150)}...`);
        }
        if (!response.ok) throw new Error(result.message || 'Failed to create account');
        return result;
    } catch (error) {
        console.error('Error accepting invitation:', error);
        throw error;
    }
};
export const getInvitations = () => authenticatedGet('invitations');
export const deleteInvitation = (id) => authenticatedDelete(`invitations/${id}`);
export const getUsers = () => authenticatedGet('members');
export const deleteUser = (id) => authenticatedDelete(`members/${id}`);
export const getMeetings = () => authenticatedGet('meetings');
export const createMeeting = (data) => authenticatedPost('meetings', data);
export const updateMeeting = (id, data) => authenticatedPut(`meetings/${id}`, data);
export const deleteMeeting = (id) => authenticatedDelete(`meetings/${id}`);
export const convertMeetingToProject = (id) => authenticatedPost(`meetings/${id}/convert`, {});
export const getNotifications = () => authenticatedGet('notifications');
export const markNotificationAsRead = (id) => authenticatedPut(`notifications/${id}/read`);
export const markAllNotificationsAsRead = () => authenticatedPut('notifications/read-all');
export const deleteNotification = (id) => authenticatedDelete(`notifications/${id}`);
export const getJobTitles = () => authenticatedGet('jobs/titles');
export const createJobTitle = (data) => authenticatedPost('jobs/titles', data);
export const updateJobTitle = (id, data) => authenticatedPut(`jobs/titles/${id}`, data);
export const deleteJobTitle = (id) => authenticatedDelete(`jobs/titles/${id}`);
export const getClients = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authenticatedGet(`clients${query ? `?${query}` : ''}`);
};
export const getClient = (id) => fetchData(`clients/${id}`, null);
export const createClient = (data) => authenticatedMultipart('clients', data);
export const updateClient = (id, data) => authenticatedMultipart(`clients/${id}`, data, 'PUT');
export const deleteClient = (id) => authenticatedDelete(`clients/${id}`);
export const getClientPartnerships = (clientId) => fetchData(`clients/${clientId}/partnerships`, []);
export const getNearbyPartnerships = (lat, lng, radius = 10) => {
    const params = new URLSearchParams({ lat, lng, radius }).toString();
    return fetchData(`partnerships/nearby?${params}`, []);
};
export const getTasks = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authenticatedGet(`tasks${query ? `?${query}` : ''}`);
};
export const createTask = (data) => authenticatedPost('tasks', data);
export const updateTask = (id, data) => authenticatedPut(`tasks/${id}`, data);
export const deleteTask = (id) => authenticatedDelete(`tasks/${id}`);
export const postContact = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit form');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to submit contact form:', error);
        throw error;
    }
};
export const clearAllCaches = () => {
    inFlightRequests.clear();
};
