import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import * as auth from '../../services/auth';
import * as api from '../../services/api';
import MemberSidebar from './MemberSidebar';
import MemberHeader from './MemberHeader';
import AIPromptGenerator from './AIPromptGenerator';
import LoadingSpinner from '../LoadingSpinner';
import NotificationBell from '../common/NotificationBell';

export default function MemberDashboard() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const notification = useNotification();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await auth.verifySession();
                setUser(userData);
                await loadData();
                setLoading(false);
            } catch (err) {
                navigate('/login');
            }
        };

        const loadData = async () => {
            const [projData, taskData, notifData] = await Promise.all([
                api.getPartnerships(),
                api.getTasks(),
                api.getNotifications()
            ]);
            setProjects(projData || []);
            setTasks(taskData || []);
            setNotifications(notifData || []);
        };

        checkAuth();
    }, [navigate]);

    const handleUpdateTask = async (id, updates) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        try {
            const res = await api.updateTask(id, updates);
            if (!res) {
                // If failed, refresh from server to revert
                const latest = await api.getTasks();
                setTasks(latest || []);
            }
        } catch (err) {
            console.error('Update failed:', err);
            const latest = await api.getTasks();
            setTasks(latest || []);
        }
    };



    const handleLogout = () => {
        api.clearAllCaches();
        auth.logout();
        navigate('/login');
    };

    if (loading) return <LoadingSpinner />;

    const roleColor = 'var(--role-member)';

    const getProjectTasks = (projectId) => {
        return tasks.filter(task => task.partnership_id === projectId || task.partnership?.id === projectId);
    };

    return (
        <div className="dashboard-container" style={{ '--role-color': roleColor }}>
            <MemberSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                roleColor={roleColor}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            <main className="dashboard-main animate-fade-in" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', right: '40px', zIndex: 1100 }}>
                    <NotificationBell
                        notifications={notifications}
                        setNotifications={setNotifications}
                        roleColor={roleColor}
                        onDeleteNotification={() => notification.confirm('Are you sure you want to delete this notification? This action cannot be undone.')}
                    />
                </div>

                <MemberHeader
                    activeTab={activeTab}
                    roleColor={roleColor}
                    handleLogout={handleLogout}
                />

                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
                        Welcome, <span style={{ color: roleColor }}>{user?.name}</span>.
                    </h2>
                    <p style={{ color: '#999', marginTop: '5px', fontSize: '1.1rem' }}>Track your active tasks and studio assignments.</p>
                </div>

                {activeTab === 'projects' && (
                    <div className="grid grid-2">
                        {projects.length > 0 ? projects.map(project => (
                            <div key={project.id} className="card animate-slide-up" style={{ textAlign: 'left', padding: '30px', borderLeft: `8px solid ${project.status === 'active' ? '#38A169' : '#CBD5E0'}` }}>
                                <div className="flex justify-between align-center" style={{ marginBottom: '15px' }}>
                                    <span className="label">{project.year}</span>
                                    <span className={`role-badge ${project.status === 'active' ? 'status-active' : 'status-pending'}`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="notranslate" translate="no" style={{ fontSize: '1.4rem' }}>{project.title}</h3>
                                <p style={{ color: '#666', marginBottom: '20px' }}>{project.cat}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setSelectedProject(project)}
                                        style={{
                                            background: '#38A169',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 10px 20px rgba(56, 161, 105, 0.18)'
                                        }}
                                    >
                                        View assigned tasks
                                    </button>
                                    <span style={{ color: '#718096', fontSize: '0.85rem', fontWeight: '700' }}>
                                        {getProjectTasks(project.id).length} assigned task{getProjectTasks(project.id).length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {project.status === 'active' && (
                                    <p style={{ color: '#38A169', fontWeight: '600', fontSize: '0.9rem', marginTop: 0 }}>Project is Live</p>
                                )}
                            </div>
                        )) : (
                            <div className="card" style={{ padding: '60px', textAlign: 'center', gridColumn: 'span 2' }}>
                                <p style={{ color: '#999' }}>No projects assigned to you for review.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'prompt' && (
                    <AIPromptGenerator roleColor={roleColor} />
                )}

                {selectedProject && (
                    <div
                        onClick={() => setSelectedProject(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px',
                            zIndex: 2000
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: 'min(900px, 100%)',
                                maxHeight: '85vh',
                                overflow: 'auto',
                                background: '#ffffff',
                                borderRadius: '28px',
                                padding: '28px',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.25)'
                            }}
                        >
                            <div className="flex justify-between align-center" style={{ gap: '20px', marginBottom: '22px' }}>
                                <div>
                                    <p className="label" style={{ color: '#38A169', marginBottom: '6px' }}>Assigned Tasks</p>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{selectedProject.title}</h3>
                                    <p style={{ margin: '8px 0 0', color: '#718096' }}>{getProjectTasks(selectedProject.id).length} task{getProjectTasks(selectedProject.id).length !== 1 ? 's' : ''} in this project</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    style={{
                                        background: '#EDF2F7',
                                        color: '#1A202C',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '10px 14px',
                                        cursor: 'pointer',
                                        fontWeight: '800'
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {getProjectTasks(selectedProject.id).length > 0 ? getProjectTasks(selectedProject.id).map(task => (
                                    <div key={task.id} style={{ padding: '20px', borderRadius: '20px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                        <div className="flex justify-between align-start" style={{ gap: '12px', marginBottom: '10px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem' }}>{task.title}</h4>
                                                <p style={{ margin: 0, color: '#4A5568', fontSize: '0.9rem', lineHeight: 1.5 }}>{task.description}</p>
                                            </div>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '999px',
                                                fontSize: '0.72rem',
                                                fontWeight: '900',
                                                background: task.status === 'done' ? '#F0FFF4' : (task.status === 'in_progress' ? '#FFF9E5' : '#F7FAFC'),
                                                color: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#D69E2E' : '#718096')
                                            }}>
                                                {(task.status === 'in_progress' ? 'Active' : task.status).toUpperCase()}
                                            </span>
                                        </div>

                                        <div style={{ marginTop: '14px' }}>
                                            <div className="flex justify-between align-center" style={{ marginBottom: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#718096' }}>PROGRESS</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1A202C' }}>{task.progress}%</span>
                                            </div>
                                            <div style={{ position: 'relative', width: '100%', height: '10px', background: '#EDF2F7', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${task.progress}%`, height: '100%', background: '#38A169', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={task.progress}
                                                    onChange={e => {
                                                        const val = parseInt(e.target.value, 10);
                                                        let newStatus = task.status;
                                                        if (task.status === 'done' && val < 100) {
                                                            newStatus = 'in_progress';
                                                        } else if (val > 0) {
                                                            newStatus = 'in_progress';
                                                        } else {
                                                            newStatus = 'todo';
                                                        }
                                                        handleUpdateTask(task.id, { progress: val, status: newStatus });
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        opacity: 0,
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '18px' }}>
                                            <button
                                                onClick={() => {
                                                    if (task.status !== 'done' && task.progress < 100) {
                                                        return;
                                                    }

                                                    const newStatus = task.status === 'done' ? 'in_progress' : 'done';
                                                    const newProgress = task.status === 'done' ? 0 : 100;
                                                    handleUpdateTask(task.id, { status: newStatus, progress: newProgress });
                                                }}
                                                disabled={task.status !== 'done' && task.progress < 100}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    background: task.status === 'done' ? '#EDF2F7' : (task.progress >= 100 ? '#38A169' : '#C6F6D5'),
                                                    color: task.status === 'done' ? '#718096' : (task.progress >= 100 ? '#ffffff' : '#2F855A'),
                                                    border: 'none',
                                                    padding: '12px 16px',
                                                    borderRadius: '14px',
                                                    cursor: task.status !== 'done' && task.progress < 100 ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '800',
                                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                    opacity: task.status !== 'done' && task.progress < 100 ? 0.75 : 1
                                                }}
                                            >
                                                {task.status === 'done' ? 'Restore to Active' : (task.progress >= 100 ? 'Confirm Completion' : 'Reach 100% to Confirm')}
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '20px', borderRadius: '18px', background: '#F8FAFC', border: '1px dashed #CBD5E0', color: '#718096' }}>
                                        No tasks are assigned to this project yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
