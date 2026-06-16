import React from 'react';
import { Trash2 } from 'lucide-react';
export default function AdminContactsTable({ items, handleStatusUpdate, handleDelete }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Received</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Requester</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Inquiry / Message</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Status</th>
                        <th style={{ textAlign: 'right', padding: '15px' }} className="label">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(contact => {
                        const s = contact.status || contact.Status || 'Pending';
                        return (
                            <tr key={contact.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontSize: '12px' }}>{new Date(contact.created_at).toLocaleDateString('fr-FR')}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '700' }}>{contact.full_name || contact.FullName}</div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>{contact.email}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '13px' }}>{contact.subject}</div>
                                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>{contact.message}</div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'left' }}>
                                    <select
                                        value={s}
                                        onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                                        style={{
                                            padding: '6px 10px',
                                            borderRadius: '8px',
                                            border: '1px solid #e6e6e6',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            color: '#333'
                                        }}
                                        aria-label={`Change status for ${contact.full_name || contact.FullName}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(contact.id)}
                                        style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto', fontSize: '11px' }}
                                    >
                                        <Trash2 size={14} /> DELETE
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>No customer inquiries found in the database.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
