import React from 'react';
import { Calendar, X, Send, Save } from 'lucide-react';

export default function MeetingForm({ formData, setFormData, handleSave, setShowForm, editItem, roleColor, members, clients }) {
    return (
        <div className="card animate-slide-up" style={{ padding: '40px', borderTop: `6px solid ${roleColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={24} /> {editItem ? 'Update Meeting Notes' : 'Add New Meeting'}
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSave} className="grid grid-2">
                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Meeting Title</label>
                    <input
                        className="input-field"
                        required
                        placeholder="e.g. Introductory Meeting with Nike"
                        value={formData.title || ''}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="flex-column">
                    <label className="label">Client / Prospective Partner</label>
                    <select
                        className="input-field"
                        required
                        value={formData.client_id || ''}
                        onChange={e => {
                            const selectedClient = clients?.find(c => c.id === parseInt(e.target.value));
                            setFormData({ 
                                ...formData, 
                                client_id: e.target.value,
                                client_name: selectedClient?.name || ''
                            });
                        }}
                    >
                        <option value="">Select a Client</option>
                        {clients?.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-column">
                    <label className="label">Meeting Date</label>
                    <input
                        className="input-field"
                        type="datetime-local"
                        required
                        value={formData.meeting_date ? formData.meeting_date.substring(0, 16) : ''}
                        onChange={e => setFormData({ ...formData, meeting_date: e.target.value })}
                    />
                </div>
                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Assign to Project Manager</label>
                    <select
                        className="input-field"
                        required
                        value={formData.chef_id || ''}
                        onChange={e => setFormData({ ...formData, chef_id: e.target.value })}
                    >
                        <option value="">Select a Project Manager</option>
                        {members.filter(m => m.role === 'chef').map(chef => (
                            <option key={chef.id} value={chef.id}>
                                {chef.name} {chef.job_title ? `(${chef.job_title})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-column" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Meeting Notes (What they spoke about & next steps)</label>
                    <textarea
                        className="input-field"
                        required
                        rows="6"
                        placeholder="Detail the discussion and what the project leans into..."
                        value={formData.notes || ''}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div className="flex" style={{ gap: '15px', marginTop: '20px', gridColumn: 'span 2' }}>
                    <button type="submit" className="btn" style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {editItem ? <Save size={18} /> : <Send size={18} />}
                        {editItem ? 'Update Meeting' : 'Add Meeting'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ background: '#eee', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <X size={18} /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
