import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import * as api from '../../services/api';
const API_STORAGE = 'http://127.0.0.1:8000/storage';
export default function ClientManagement() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [message, setMessage] = useState({ text: '', error: false });
    const [formData, setFormData] = useState({
        name: '', address: '',
        industry: '', logo: null
    });
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientProjects, setClientProjects] = useState([]);
    const notification = useNotification();
    useEffect(() => { loadClients(); }, []);
    useEffect(() => {
        if (!message.text || message.error) return;
        const timer = setTimeout(() => {
            setMessage({ text: '', error: false });
        }, 5000);
        return () => clearTimeout(timer);
    }, [message.text, message.error]);
    const loadClients = async (sortBy = 'created_at', sortDir = 'desc') => {
        setLoading(true);
        const data = await api.getClients({ sort_by: sortBy, sort_dir: sortDir });
        const clientsWithCounts = await Promise.all(
            (data || []).map(async (client) => {
                const partnerships = await api.getClientPartnerships(client.id);
                return { ...client, partnerships_count: (partnerships || []).length };
            })
        );
        setClients(clientsWithCounts);
        setLoading(false);
    };
    const resetForm = () => {
        setFormData({
            name: '', address: '',
            industry: '', logo: null
        });
        setEditClient(null);
        setShowForm(false);
    };
    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };
    const openEdit = (client) => {
        setEditClient(client);
        setFormData({
            name: client.name || '',
            address: client.address || '',
            industry: client.industry || '',
            logo: null 
        });
        setShowForm(true);
    };
    const openClientProjects = async (client) => {
        const projects = await api.getClientPartnerships(client.id);
        setSelectedClient(client);
        setClientProjects(projects || []);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', error: false });
        try {
            const payload = { ...formData };
            if (!payload.logo) delete payload.logo; 
            if (editClient) {
                await api.updateClient(editClient.id, payload);
                setMessage({ text: 'Client updated successfully!', error: false });
            } else {
                await api.createClient(payload);
                setMessage({ text: 'Client created successfully!', error: false });
            }
            resetForm();
            loadClients();
        } catch (err) {
            setMessage({ text: err.message || 'Failed to save client.', error: true });
        }
    };
    const handleDelete = async (id) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this client?');
        if (!confirmed) return;
        const success = await api.deleteClient(id);
        if (success) {
            setClients(prev => prev.filter(c => c.id !== id));
            notification.success('Client deleted.');
        } else {
            notification.error('Failed to delete client.');
        }
    };
    if (loading) return <LoadingSpinner />;
    if (selectedClient) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <button
                    onClick={() => setSelectedClient(null)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        padding: 0
                    }}
                >
                    Back to Clients
                </button>
                <div className="card" style={{ padding: '30px', borderTop: '6px solid var(--role-admin)' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontWeight: '800' }}>
                        Projects for {selectedClient.name}
                    </h3>
                    {clientProjects.length === 0 ? (
                        <p style={{ color: '#999', padding: '40px 0', textAlign: 'center' }}>
                            No projects linked to this client yet.
                        </p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                                    <th style={{ textAlign: 'left', padding: '15px' }} className="label">Project Name</th>
                                    <th style={{ textAlign: 'left', padding: '15px' }} className="label">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientProjects.map(project => (
                                    <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '15px', fontWeight: '600' }}>{project.name}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: project.status === 'completed' ? '#dcfce7' : '#fef3c7',
                                                color: project.status === 'completed' ? '#166534' : '#92400e'
                                            }}>
                                                {project.status || 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }
    if (showForm) {
        return (
            <div className="card animate-slide-up" style={{ padding: '40px', borderTop: '6px solid var(--role-admin)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: 0, fontWeight: '800' }}>
                        {editClient ? 'Update Client Profile' : 'Add New Client'}
                    </h3>
                    <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                        <X size={24} />
                    </button>
                </div>
                {message.text && (
                    <div style={{
                        padding: '12px 16px', borderRadius: '10px', marginBottom: '30px',
                        background: message.error ? '#fee2e2' : '#dcfce7',
                        color: message.error ? '#991b1b' : '#166534',
                        fontSize: '0.9rem', fontWeight: '600'
                    }}>{message.text}</div>
                )}
                <form onSubmit={handleSubmit} className="grid grid-2">
                    <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                        <label className="label">Client Corporate Name *</label>
                        <input
                            className="input-field"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Randa"
                            required
                        />
                    </div>
                    <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                        <label className="label">Corporate Address</label>
                        <input
                            className="input-field"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Rue de Marseille"
                        />
                    </div>
                    <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                        <label className="label">Industry Sector</label>
                        <input
                            className="input-field"
                            value={formData.industry}
                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                            placeholder="e.g. Health"
                        />
                    </div>
                    <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                        <label className="label">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-field"
                            onChange={e => setFormData({ ...formData, logo: e.target.files[0] })}
                            style={{ padding: '10px' }}
                        />
                        {editClient?.logo && (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={`${API_STORAGE}/${editClient.logo}`} alt="Current logo" style={{ height: '40px', borderRadius: '6px' }} />
                                <span style={{ fontSize: '12px', color: '#999' }}>Current Asset Enrolled</span>
                            </div>
                        )}
                    </div>
                    <div className="flex" style={{ gap: '15px', marginTop: '30px', gridColumn: 'span 2' }}>
                        <button type="submit" className="btn" style={{ background: 'var(--role-admin)', flex: 1 }}>
                            {editClient ? 'Update Profile' : 'Add Client'}
                        </button>
                        <button type="button" onClick={resetForm} className="btn" style={{ background: '#eee', color: '#666', flex: 1 }}>
                            Discard Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <div>
            {message.text && (
                <div style={{
                    padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                    background: message.error ? '#fee2e2' : '#dcfce7',
                    color: message.error ? '#991b1b' : '#166534',
                    fontSize: '0.9rem', fontWeight: '600'
                }}>{message.text}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>{clients.length} client{clients.length !== 1 ? 's' : ''} registered</p>
                <button onClick={openCreate} className="btn" style={{ background: 'var(--role-admin)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add Client
                </button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                            <th
                                style={{ textAlign: 'left', padding: '15px' }}
                                className="label"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Client
                                </div>
                            </th>
                            <th
                                style={{ textAlign: 'left', padding: '15px' }}
                                className="label"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Location
                                </div>
                            </th>
                            <th
                                style={{ textAlign: 'left', padding: '15px' }}
                                className="label"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Industry
                                </div>
                            </th>
                            <th
                                style={{ textAlign: 'center', padding: '15px' }}
                                className="label"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    # Partnerships
                                </div>
                            </th>
                            <th style={{ textAlign: 'right', padding: '15px' }} className="label">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        {client.logo ? (
                                            <img
                                                src={`${API_STORAGE}/${client.logo}`}
                                                alt={client.name}
                                                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '42px', height: '42px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: '800', fontSize: '16px'
                                            }}>
                                                <Briefcase size={20} />
                                            </div>
                                        )}
                                        <div style={{ fontWeight: '700' }}>{client.name}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '15px', color: '#666' }}>
                                    {client.address || '—'}
                                </td>
                                <td style={{ padding: '15px', color: '#666' }}>{client.industry || '—'}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', borderRadius: '20px', padding: '6px 14px', fontSize: '0.9rem', fontWeight: '700', minWidth: '50px' }}>
                                        {client.partnerships_count || 0}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                        <button onClick={() => openEdit(client)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '11px' }}>
                                            <Pencil size={14} /> UPDATE
                                        </button>
                                        <button onClick={() => handleDelete(client.id)} style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '11px' }}>
                                            <Trash2 size={14} /> DELETE
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                                    No clients yet. Add your first client to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
