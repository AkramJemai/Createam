import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, RefreshCw, Save } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import * as api from '../../services/api';
export default function AgencyManagement() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', error: false });
    const [editingTimeline, setEditingTimeline] = useState(null);
    const [editingTeam, setEditingTeam] = useState(null);
    const notification = useNotification();
    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        if (!message.text || message.error) return;
        const timer = setTimeout(() => {
            setMessage({ text: '', error: false });
        }, 5000);
        return () => clearTimeout(timer);
    }, [message.text, message.error]);
    const loadData = async () => {
        setLoading(true);
        const res = await api.getAgencyData();
        if (res) setData(res);
        setLoading(false);
    };
    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            tagline: formData.get('tagline'),
            about_text: formData.get('about_text'),
            founded_year: formData.get('founded_year'),
        };
        try {
            await api.authenticatedPut('agency/info', payload);
            setMessage({ text: 'Agency info updated successfully!', error: false });
            loadData();
        } catch (err) {
            setMessage({ text: 'Update failed.', error: true });
        }
    };
    const handleAddStat = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            label: formData.get('label'),
            value: formData.get('value'),
        };
        try {
            await api.authenticatedPost('agency/stats', payload);
            e.target.reset();
            loadData();
        } catch (err) {
            setMessage({ text: 'Failed to add stat.', error: true });
        }
    };
    const handleDeleteStat = async (id) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this agency stat? This action cannot be undone.');
        if (!confirmed) return;
        await api.authenticatedDelete(`agency/stats/${id}`);
        loadData();
    };
    const handleAddTimeline = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            year: formData.get('year'),
            title: formData.get('title'),
            description: formData.get('description'),
        };
        try {
            await api.authenticatedPost('agency/timeline', payload);
            e.target.reset();
            setMessage({ text: 'Milestone added successfully!', error: false });
            loadData();
        } catch (err) {
            setMessage({ text: 'Failed to add milestone.', error: true });
        }
    };
    const handleDeleteTimeline = async (id) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this milestone? This action cannot be undone.');
        if (!confirmed) return;
        await api.authenticatedDelete(`agency/timeline/${id}`);
        notification.success('Milestone deleted.');
        loadData();
    };
    const handleAddTeam = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            name: formData.get('name'),
            role: formData.get('role'),
        };
        try {
            await api.authenticatedPost('agency/team', payload);
            e.target.reset();
            setMessage({ text: 'Team member added successfully!', error: false });
            loadData();
        } catch (err) {
            setMessage({ text: 'Failed to add team member.', error: true });
        }
    };
    const handleDeleteTeam = async (id) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this team member? This action cannot be undone.');
        if (!confirmed) return;
        await api.authenticatedDelete(`agency/team/${id}`);
        notification.success('Team member deleted.');
        loadData();
    };
    if (loading) return <div>Loading agency management...</div>;
    return (
        <div className="agency-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Agency Profile Management</h2>
                <button onClick={loadData} className="btn" style={{ background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} /> Refresh Data
                </button>
            </div>
            {message.text && (
                <div style={{ 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '20px', 
                    background: message.error ? '#fee2e2' : '#dcfce7',
                    color: message.error ? '#991b1b' : '#166534'
                }}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-2" style={{ gap: '40px' }}>
                {}
                <div className="card animate-slide-up" style={{ borderTop: '6px solid var(--primary)', padding: '40px' }}>
                    <h3 style={{ marginBottom: '30px', fontWeight: '800' }}>General Agency Profile</h3>
                    <form onSubmit={handleInfoUpdate} className="flex-column" style={{ gap: '20px' }}>
                        <div className="flex-column">
                            <label className="label">Main Tagline</label>
                            <input name="tagline" className="input-field" defaultValue={data.info?.tagline} required />
                        </div>
                        <div className="flex-column">
                            <label className="label">Founded Year</label>
                            <input name="founded_year" type="number" className="input-field" defaultValue={data.info?.founded_year} required />
                        </div>
                        <div className="flex-column">
                            <label className="label">Public About Text</label>
                            <textarea name="about_text" className="input-field" style={{ minHeight: '140px' }} defaultValue={data.info?.about_text} required />
                        </div>
                        <button className="btn full-width" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Save size={18} /> Confirm Profile Updates
                        </button>
                    </form>
                </div>
                {}
                <div className="card animate-slide-up" style={{ borderTop: '6px solid var(--primary)', padding: '40px' }}>
                    <h3 style={{ marginBottom: '30px', fontWeight: '800' }}>Key Performance Stats</h3>
                    <div style={{ marginBottom: '30px' }}>
                        {data.stats?.map(stat => (
                            <div key={stat.id} className="flex align-center justify-between" style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                <div>
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>{stat.value}</span>
                                    <span style={{ marginLeft: '10px', color: '#666', fontWeight: '600' }}>{stat.label}</span>
                                </div>
                                <button 
                                    onClick={() => handleDeleteStat(stat.id)} 
                                    style={{ color: '#38a169', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}
                                >
                                    <Trash2 size={14} /> DELETE
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddStat} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                        <p style={{ fontWeight: '800', marginBottom: '20px', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>Add New Statistic</p>
                        <div className="flex-column" style={{ gap: '15px' }}>
                            <div className="grid grid-2" style={{ gap: '15px' }}>
                                <div className="flex-column">
                                    <label className="label">Value (e.g. 10+)</label>
                                    <input name="value" className="input-field" required />
                                </div>
                                <div className="flex-column">
                                    <label className="label">Label (e.g. Years)</label>
                                    <input name="label" className="input-field" required />
                                </div>
                            </div>
                            <button className="btn full-width">Register Stat</button>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ marginTop: '40px' }} className="card animate-slide-up">
                <div style={{ padding: '40px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0, fontWeight: '800' }}>Agency Timeline & Milestones</h3>
                </div>
                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        {data.timeline?.map(item => (
                            <div key={item.id} className="flex align-center justify-between" style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.4rem' }}>{item.year}</div>
                                    <div style={{ fontWeight: '700', marginTop: '5px', fontSize: '1.1rem' }}>{item.title}</div>
                                    <p style={{ color: '#666', fontSize: '0.95rem', margin: '8px 0', lineHeight: '1.5' }}>{item.description}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteTimeline(item.id)} 
                                    style={{ color: '#38a169', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: '30px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}
                                >
                                    <Trash2 size={14} /> REMOVE
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddTimeline} style={{ background: '#fafafa', padding: '35px', borderRadius: '15px', border: '1px solid #eee' }}>
                        <h4 style={{ margin: '0 0 25px 0', fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>Log New Milestone</h4>
                        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                            <div className="flex-column">
                                <label className="label">Year</label>
                                <input name="year" type="number" placeholder="2025" className="input-field" required />
                            </div>
                            <div className="flex-column">
                                <label className="label">Milestone Title</label>
                                <input name="title" placeholder="e.g. Agency Founded" className="input-field" required />
                            </div>
                        </div>
                        <div className="flex-column" style={{ marginBottom: '20px' }}>
                            <label className="label">Full Description</label>
                            <textarea name="description" placeholder="Explain the significance of this milestone..." className="input-field" style={{ minHeight: '100px' }} required />
                        </div>
                        <button className="btn" style={{ background: 'var(--primary)', padding: '15px 40px' }}>Publish Milestone</button>
                    </form>
                </div>
            </div>
            <div style={{ marginTop: '40px' }} className="card animate-slide-up">
                <div style={{ padding: '40px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0, fontWeight: '800' }}>Core Agency Team</h3>
                </div>
                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {data.team?.map(member => (
                            <div key={member.id} className="card" style={{ padding: '20px', background: '#fcfcfc', border: '1px solid #eee', position: 'relative' }}>
                                <div>
                                    <div style={{ fontWeight: '800' }}>{member.name}</div>
                                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}>{member.role}</div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteTeam(member.id)} 
                                    style={{ position: 'absolute', top: '15px', right: '15px', color: '#38a169', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <Trash2 size={14} /> REMOVE
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddTeam} style={{ background: '#fafafa', padding: '35px', borderRadius: '15px', border: '1px solid #eee' }}>
                        <h4 style={{ margin: '0 0 25px 0', fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>Add New Member</h4>
                        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                            <div className="flex-column">
                                <label className="label">Full Name</label>
                                <input name="name" placeholder="Member Name" className="input-field" required />
                            </div>
                            <div className="flex-column">
                                <label className="label">Agency Role</label>
                                <input name="role" placeholder="e.g. Creative Director" className="input-field" required />
                            </div>
                        </div>
                        <button className="btn" style={{ background: 'var(--primary)', padding: '15px 40px' }}>Enrol Member</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
