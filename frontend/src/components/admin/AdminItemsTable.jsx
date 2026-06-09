import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminItemsTable({ items, activeTab, openEdit, handleDelete }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Title / Reference</th>
                        <th style={{ textAlign: 'left', padding: '15px' }} className="label">Category / Meta</th>
                        {activeTab === 'partnership' && (
                            <th style={{ textAlign: 'center', padding: '15px' }} className="label">Recent (3m)</th>
                        )}
                        <th style={{ textAlign: 'right', padding: '15px' }} className="label">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: '700' }}>{item.title || item.num}</div>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <div>{item.cat || item.category || item.guest}</div>
                            </td>
                            {activeTab === 'partnership' && (
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: '#f0f7ff',
                                        color: '#3182ce',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}>
                                        Recent: {item.recent_clicks || 0}
                                    </span>
                                </td>
                            )}
                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                    <button 
                                        onClick={() => openEdit(item)} 
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '11px' }}
                                    >
                                        <Pencil size={14} /> UPDATE
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)} 
                                        style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '11px' }}
                                    >
                                        <Trash2 size={14} /> DELETE
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={activeTab === 'partnership' ? '4' : '3'} style={{ padding: '60px', textAlign: 'center', color: '#999' }}>No data found in this module.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

