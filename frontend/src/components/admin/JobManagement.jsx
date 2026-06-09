import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import * as api from '../../services/api';

export default function JobManagement({ refreshData, roleColor }) {
    const [titles, setTitles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formName, setFormName] = useState('');
    const notification = useNotification();

    useEffect(() => {
        loadTitles();
    }, []);

    const loadTitles = async () => {
        const data = await api.getJobTitles();
        setTitles(data || []);
    };

    const handleOpenModal = (item = null) => {
        setEditItem(item);
        setFormName(item ? item.name : '');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formName.trim()) return;

        const payload = { name: formName.trim() };
        const success = editItem
            ? await api.updateJobTitle(editItem.id, payload)
            : await api.createJobTitle(payload);

        if (success) {
            setShowModal(false);
            setEditItem(null);
            setFormName('');
            loadTitles();
            refreshData();
        } else {
            notification.error('Failed to save. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this job title?');
        if (!confirmed) return;
        const success = await api.deleteJobTitle(id);
        if (success) {
            loadTitles();
            refreshData();
        } else {
            notification.error('Delete failed.');
        }
    };

    return (
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="card">
                <div className="flex align-center justify-between" style={{ marginBottom: '30px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Job Titles</h2>
                    <button onClick={() => handleOpenModal()} className="btn" style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> New Title
                    </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={{ textAlign: 'left', padding: '15px' }} className="label">Title</th>
                            <th style={{ textAlign: 'right', padding: '15px' }} className="label">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {titles.length === 0 && (
                            <tr>
                                <td colSpan="2" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                    No job titles yet. Click "+ New Title" to add one.
                                </td>
                            </tr>
                        )}
                        {titles.map(title => (
                            <tr key={title.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{title.name}</td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                        <button onClick={() => handleOpenModal(title)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                                            <Pencil size={14} /> UPDATE
                                        </button>
                                        <button onClick={() => handleDelete(title.id)} style={{ background: 'none', border: 'none', color: '#38a169', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                                            <Trash2 size={14} /> DELETE
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000
                }} onClick={() => setShowModal(false)}>
                    <div className="card animate-slide-up" style={{
                        width: '400px',
                        padding: '40px',
                        borderTop: `6px solid ${roleColor}`,
                        background: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.35)',
                        borderRadius: '24px'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '30px', fontWeight: '800', color: '#111' }}>
                            {editItem ? 'Edit' : 'Add New'} Job Title
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="flex-column" style={{ marginBottom: '30px' }}>
                                <label className="label" style={{ color: 'rgba(255, 255, 255, 0.72)' }}>Title Designation</label>
                                <input
                                    id="job-title-name"
                                    className="input-field"
                                    required
                                    placeholder="e.g. Video Editor, Product Designer"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    autoFocus
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.12)',
                                        border: '1px solid #000',
                                        color: '#111'
                                    }}
                                />
                            </div>

                            <div className="flex gap-10">
                                <button type="submit" className="btn" style={{ background: roleColor, flex: 1 }}>
                                    {editItem ? 'Save Changes' : 'Create Title'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', color: '#111', border: '1px solid #ddd', flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
