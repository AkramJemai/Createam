import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, ChevronLeft } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import * as api from '../../services/api';

export default function AdminTaskBoard({ projects, roleColor }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const notification = useNotification();
    
    const [taskFormData, setTaskFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        status: 'todo',
        due_date: ''
    });

    useEffect(() => {
        if (selectedProject) {
            loadProjectData();
        }
    }, [selectedProject]);

    const loadProjectData = async () => {
        const [tasksData, usersData] = await Promise.all([
            api.getTasks({ partnership_id: selectedProject.id }),
            api.getUsers()
        ]);

        setTasks(tasksData || []);
        setAllUsers(usersData || []);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        const result = await api.createTask({
            ...taskFormData,
            partnership_id: selectedProject.id
        });
        if (result) {
            setShowTaskForm(false);
            setTaskFormData({ title: '', description: '', assigned_to: '', priority: 'medium', status: 'todo', due_date: '' });
            loadProjectData();
        }
    };



    const handleDeleteTask = async (taskId) => {
        const confirmed = await notification.confirm('Are you sure you want to delete this task? This action cannot be undone.');
        if (!confirmed) return;
        await api.deleteTask(taskId);
        loadProjectData();
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        await api.updateTask(taskId, { status: newStatus });
        loadProjectData();
    };

    if (!selectedProject) {
        return (
            <div className="card animate-slide-up" style={{ padding: '60px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>Task Board</h2>
                <p style={{ color: '#666', marginBottom: '40px' }}>Select a project to manage its team and tasks.</p>
                <div className="grid grid-3">
                    {projects.filter(p => p.status !== 'archived').map(proj => (
                        <div 
                            key={proj.id} 
                            onClick={() => setSelectedProject(proj)}
                            className="stat-card" 
                            style={{ 
                                cursor: 'pointer', 
                                borderLeft: `8px solid ${proj.status === 'ready_to_deploy' ? '#38A169' : roleColor}`,
                                position: 'relative',
                                background: proj.status === 'ready_to_deploy' ? '#f0fff4' : '#fff'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                                {proj.status === 'ready_to_deploy' && (
                                    <div style={{
                                        background: '#38A169',
                                        color: 'white',
                                        fontSize: '0.6rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.5px'
                                    }}>
                                        READY TO DEPLOY
                                    </div>
                                )}
                                {proj.status === 'ready_to_deploy' && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const confirmed = await notification.confirm("Archive this project? it will move from production to the showcase directory.");
                                            if (!confirmed) return;
                                            await api.updatePartnership(proj.id, { status: 'archived' });
                                            window.location.reload(); // Refresh to clear from view
                                        }}
                                        style={{ background: '#333', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '4px 8px' }}
                                        title="Archive Project"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <h2 className="notranslate" translate="no" style={{ fontSize: '1.2rem', margin: '5px 0 0 0' }}>{proj.title}</h2>
                            <p className="label" style={{ marginTop: '10px', fontSize: '0.7rem' }}>{proj.cat}</p>
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
                                    <div className="flex justify-between align-start" style={{ marginBottom: '10px' }}>
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
                                        <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '800', 
                                            color: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#FEA624' : '#718096'),
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
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

            {/* Task Modal */}
            {showTaskForm && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, backdropFilter: 'blur(5px)'
                }} onClick={() => setShowTaskForm(false)}>
                    <div className="card animate-scale-in" style={{ width: '500px', padding: '40px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '30px' }}>Add New Task</h2>
                        <form onSubmit={handleTaskSubmit}>
                            <div className="flex-column" style={{ marginBottom: '20px' }}>
                                <label className="label">Task Title</label>
                                <input 
                                    className="input-field" 
                                    required 
                                    value={taskFormData.title}
                                    onChange={e => setTaskFormData({ ...taskFormData, title: e.target.value })}
                                />
                            </div>
                            <div className="flex-column" style={{ marginBottom: '20px' }}>
                                <label className="label">Description</label>
                                <textarea 
                                    className="input-field" 
                                    style={{ height: '100px', resize: 'none' }}
                                    value={taskFormData.description}
                                    onChange={e => setTaskFormData({ ...taskFormData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label className="label">Assign To</label>
                                    <select 
                                        className="input-field" 
                                        required
                                        value={taskFormData.assigned_to}
                                        onChange={e => setTaskFormData({ ...taskFormData, assigned_to: e.target.value })}
                                    >
                                        <option value="">Select Member</option>
                                        {allUsers.filter(u => u.role === 'member').map(member => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Priority</label>
                                    <select 
                                        className="input-field"
                                        value={taskFormData.priority}
                                        onChange={e => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-column" style={{ marginBottom: '30px' }}>
                                <label className="label">Due Date</label>
                                <input 
                                    type="date"
                                    className="input-field" 
                                    value={taskFormData.due_date}
                                    onChange={e => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-10">
                                <button type="submit" className="btn" style={{ background: roleColor, flex: 1 }}>Assign Task</button>
                                <button type="button" onClick={() => setShowTaskForm(false)} className="btn" style={{ background: '#eee', color: '#666', flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
