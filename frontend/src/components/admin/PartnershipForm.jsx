import React, { useState, useEffect } from 'react';
import { Rocket, X, Check } from 'lucide-react';
import * as api from '../../services/api';

export default function PartnershipForm({ formData, setFormData, handleSave, setShowForm, editItem, roleColor }) {
    const [partnershipCategories, setPartnershipCategories] = useState([]);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');
    const [newFiles, setNewFiles] = useState([]);
    const [removedMediaIndices, setRemovedMediaIndices] = useState([]);

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

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        const mapped = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image'
        }));
        setNewFiles(prev => [...prev, ...mapped]);
        e.target.value = '';
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const images = newFiles.filter(f => f.type === 'image');
        const videos = newFiles.filter(f => f.type === 'video');

        const existingImg = editItem && formData.img && !formData.removeImg;
        const existingVideo = editItem && formData.video && !formData.removeVideo;

        const willHaveImg = images.length > 0 || existingImg;
        const willHaveVideo = videos.length > 0 || existingVideo;

        if (!willHaveImg && !willHaveVideo) {
            setError('Please upload at least one image or video.');
            return;
        }

        const payload = { ...formData };

        if (existingImg) {
            if (images.length > 0) payload.media = images.map(f => f.file);
        } else {
            if (images[0]) payload.img = images[0].file;
            if (images.length > 1) payload.media = images.slice(1).map(f => f.file);
        }

        if (videos[0]) payload.video = videos[0].file;
        if (removedMediaIndices.length > 0) payload.removeMedia = removedMediaIndices;

        setError('');
        handleSave(e, payload);
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
                    <label className="label">Project Media</label>
                    <p style={{ fontSize: '0.8rem', color: '#999', margin: '4px 0 12px' }}>
                        Select multiple images and/or videos. First image = cover, first video = featured.
                    </p>

                    {editItem && (formData.img || formData.video || formData.media?.length > 0) && (
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#555' }}>Current media:</p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {formData.img && !formData.removeImg && (
                                    <div style={{ position: 'relative' }}>
                                        <img src={formData.img} alt="cover" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                        <button type="button" onClick={() => setFormData({ ...formData, img: null, removeImg: true })}
                                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        <p style={{ fontSize: '0.6rem', color: '#888', textAlign: 'center', margin: '2px 0 0' }}>Cover</p>
                                    </div>
                                )}
                                {formData.video && !formData.removeVideo && (
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ background: '#111', borderRadius: '6px', width: '80px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: 'white', fontSize: '0.65rem' }}>▶ Video</span>
                                        </div>
                                        <button type="button" onClick={() => setFormData({ ...formData, video: null, removeVideo: true })}
                                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    </div>
                                )}
                                {(formData.media || []).map((item, i) => (
                                    !removedMediaIndices.includes(i) && (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <img src={item.url || item} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <button type="button" onClick={() => setRemovedMediaIndices(prev => [...prev, i])}
                                                style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {newFiles.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                            {newFiles.map((item, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    {item.type === 'image'
                                        ? <img src={item.preview} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                        : <div style={{ width: '80px', height: '60px', background: '#111', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                            <span style={{ color: 'white', fontSize: '0.6rem', textAlign: 'center', wordBreak: 'break-all' }}>{item.file.name}</span>
                                          </div>
                                    }
                                    <button type="button" onClick={() => removeNewFile(index)}
                                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        className="input-field"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/gif,image/svg+xml,video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={handleMediaChange}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '6px' }}>
                        Images: JPEG, PNG, GIF (max 2MB) · Videos: MP4, WebM, MOV (max 50MB)
                    </p>
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
