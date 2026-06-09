import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminMeetingsTable({ items, openEdit, handleDelete }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Meeting Date</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Client & Title</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Assigned Chef</th>
                        <th style={{ textAlign: 'right', padding: '15px' }} className="label">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(meeting => (
                        <tr key={meeting.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontSize: '12px' }}>{new Date(meeting.meeting_date).toLocaleDateString()}</div>
                                <div style={{ fontSize: '10px', color: '#999' }}>{new Date(meeting.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: '700' }}>{meeting.client_name}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>{meeting.title}</div>
                            </td>
                            <td style={{ padding: '15px' }}>
                                {meeting.chef ? (
                                    <div className="role-badge" style={{ background: '#f0f4ff', color: '#1a365d' }}>
                                        {meeting.chef.name}
                                    </div>
                                ) : (
                                    <span style={{ color: '#ff4d4d' }}>Unassigned</span>
                                )}
                            </td>
                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                <div className="flex justify-end gap-10" style={{ gap: '15px' }}>
                                    <button
                                        onClick={() => openEdit(meeting)}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <Pencil size={14} /> UPDATE
                                    </button>
                                    <button
                                        onClick={() => handleDelete(meeting.id)}
                                        style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <Trash2 size={14} /> DELETE
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>No meetings logged yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
