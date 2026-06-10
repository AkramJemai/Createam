import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import * as api from '../../services/api';

export default function AdminTaskBoard({ projects, roleColor }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (selectedProject) {
            api.getTasks({ meeting_id: selectedProject.id }).then(data => setTasks(data || []));
        }
    }, [selectedProject]);

    const activeProjects = projects.filter(p => p.is_project);

    if (!selectedProject) {
        return (
            <div className="card animate-slide-up" style={{ padding: '60px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>Task Board</h2>
                <p style={{ color: '#666', marginBottom: '40px' }}>Select a project to manage its tasks.</p>
                {activeProjects.length === 0 && (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No active projects yet. Convert a meeting to a project from the Meetings tab.</p>
                )}
                <div className="grid grid-3">
                    {activeProjects.map(proj => (
                        <div
                            key={proj.id}
                            onClick={() => setSelectedProject(proj)}
                            className="stat-card"
                            style={{
                                cursor: 'pointer',
                                borderLeft: `8px solid ${roleColor}`,
                                position: 'relative',
                                background: '#fff'
                            }}
                        >
                            <h2 className="notranslate" translate="no" style={{ fontSize: '1.2rem', margin: '5px 0 0 0' }}>{proj.title}</h2>
                            <p className="label" style={{ marginTop: '10px', fontSize: '0.7rem' }}>{proj.client_name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                                {new Date(proj.meeting_date).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-slide-up">
            <div className="flex align-center justify-between" style={{ marginBottom: '40px' }}>
                <div>
                    <button
                        onClick={() => setSelectedProject(null)}
                        style={{ background: 'none', border: 'none', color: roleColor, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <ChevronLeft size={18} /> Back to Projects
                    </button>
                    <h1 style={{ margin: '10px 0 0 0', fontSize: '2.5rem' }}><span className="notranslate" translate="no">{selectedProject.title}</span> Board</h1>
                    <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.9rem' }}>{selectedProject.client_name}</p>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="Search by assigned member name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', maxWidth: '400px' }}
                />
            </div>

            <div className="grid grid-3" style={{ gap: '30px' }}>
                {['todo', 'in_progress', 'done'].map(status => {
                    const filteredTasks = tasks.filter(t =>
                        t.status === status &&
                        (searchQuery === '' || (t.assigned_user?.name || 'Unassigned').toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    return (
                    <div key={status} className="card" style={{ background: '#f8f9fa' }}>
                        <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                {status.replace('_', ' ')}
                            </h3>
                            <span className="role-badge" style={{ background: '#ddd', color: '#555' }}>
                                {filteredTasks.length}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {filteredTasks.map(task => (
                                <div key={task.id} className="card" style={{ padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `4px solid ${task.priority === 'high' ? '#ff4d4d' : task.priority === 'medium' ? '#fea624' : '#38a169'}` }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{task.title}</h4>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 15px 0' }}>{task.description}</p>

                                    <div className="flex justify-between align-center">
                                        <div className="flex align-center" style={{ gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: roleColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                                {task.assigned_user?.name?.charAt(0) || '?'}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{task.assigned_user?.name || 'Unassigned'}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#FEA624' : '#718096'), textTransform: 'uppercase' }}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    );
                })}
            </div>

        </div>
    );
}
