import React, { useState, useEffect } from 'react';
import { Rocket, X, Check, Trash2 } from 'lucide-react';
import * as api from '../../services/api';

export default function PartnershipForm({ formData, setFormData, handleSave, setShowForm, editItem, roleColor }) {
    const [partnershipCategories, setPartnershipCategories] = useState([]);
    const [clients, setClients] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const [categoriesData, clientsData] = await Promise.all([
                api.getPartnershipCategories(),
                api.getClients()
            ]);
            setPartnershipCategories(categoriesData || []);
            setClients(clientsData || []);
        };
        loadData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation: At least one media item must be present
        const hasImg = formData.img || (editItem && !formData.removeImg);
        const hasVideo = formData.video || (editItem && !formData.removeVideo);

        if (!hasImg && !hasVideo) {
            setError('Please upload at least one media item (Project Showcase Image or Video).');
            return;
        }

        setError('');
        handleSave(e);
    };

    return (
        <div className="card" style={{ padding: '40px', borderTop: `6px solid ${roleColor}` }}>
            {error && (
                <div style={{ padding: '15px', background: '#fff5f5', color: '#e53e3e', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', border: '1px solid #feb2b2' }}>
                    {error}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Rocket size={24} /> {editItem ? 'Update Partnership' : 'Add New Partnership'}
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-2">
                <div className="flex-column">
                    <label className="label">Project Title</label>
                    <input
                        className="input-field"
                        required
                        placeholder="e.g. Modern Rebranding"
                        value={formData.title || ''}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="flex-column">
                    <label className="label">Client</label>
                    <select
                        className="input-field"
                        value={formData.client_id || ''}
                        onChange={e => setFormData({ ...formData, client_id: e.target.value ? parseInt(e.target.value) : null })}
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-column">
                    <label className="label">Branding Category</label>
                    <select
                        className="input-field"
                        required
                        value={formData.cat || ''}
                        onChange={e => setFormData({ ...formData, cat: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {partnershipCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-column">
                    <label className="label">Industry Tags</label>
                    <input
                        className="input-field"
                        placeholder="Tech, Fashion, Crypto..."
                        required
                        value={formData.tags || ''}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>
                <div className="flex-column">
                    <label className="label">Completion Year</label>
                    <input
                        className="input-field"
                        type="number"
                        placeholder="2026"
                        required
                        value={formData.year || ''}
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                </div>
                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Project Description</label>
                    <textarea
                        className="input-field"
                        placeholder="Detail the challenges, solutions, and impact of the partnership..."
                        style={{ minHeight: '120px' }}
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Project Showcase Image (Obligatory if no video)</label>
                    {editItem && formData.img && typeof formData.img === 'string' && (
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <img src={formData.img} alt="Current" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, img: null, removeImg: true })}
                                style={{
                                    padding: '6px 12px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Trash2 size={14} /> Remove Image
                            </button>
                        </div>
                    )}
                    <input
                        className="input-field"
                        type="file"
                        accept="image/*"
                        required={false}
                        onChange={e => setFormData({ ...formData, img: e.target.files[0], removeImg: false })}
                    />
                    {editItem && <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Leave empty to keep existing artwork.</p>}
                </div>

                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Additional Project Media (Optional)</label>
                    <input
                        className="input-field"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => setFormData({ ...formData, media: e.target.files })}
                    />
                    {editItem && formData.media && Array.isArray(formData.media) && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {formData.media.map((url, index) => (
                                <img key={index} src={url} alt={`Media ${index + 1}`} style={{ height: '60px', borderRadius: '4px' }} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Project Showcase Video (Obligatory if no image)</label>
                    {editItem && formData.video && typeof formData.video === 'string' && (
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <video width="200" height="150" style={{ borderRadius: '4px', backgroundColor: '#f0f0f0' }} controls>
                                    <source src={formData.video} />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, video: null, removeVideo: true })}
                                style={{
                                    padding: '6px 12px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Trash2 size={14} /> Remove Video
                            </button>
                        </div>
                    )}
                    <input
                        className="input-field"
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={e => setFormData({ ...formData, video: e.target.files[0], removeVideo: false })}
                    />
                    <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#999' }}>Supported formats: MP4, WebM, OGG, MOV (Max 50MB)</p>
                    {editItem && <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Leave empty to keep existing video.</p>}
                </div>

                <div className="flex" style={{ gap: '15px', marginTop: '20px', gridColumn: 'span 2' }}>
                    <button type="submit" className="btn" style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {editItem ? <Check size={18} /> : <Rocket size={18} />}
                        {editItem ? 'Confirm Changes' : 'Publish Partnership'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#eee', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <X size={18} /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
