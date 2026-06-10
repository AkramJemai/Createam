import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import * as api from '../../services/api';
import * as auth from '../../services/auth';
import ChefSidebar from './ChefSidebar';
import ChefHeader from './ChefHeader';
import AdminInviteForm from '../admin/AdminInviteForm';
import LoadingSpinner from '../LoadingSpinner';
import NotificationBell from '../common/NotificationBell';
import { CheckSquare, Rocket, X, ArrowLeft, Send, Trash2 } from 'lucide-react';

export default function ChefDashboard() {
    const [projects, setProjects] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [globalTasks, setGlobalTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showKanbanModal, setShowKanbanModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [taskSuccess, setTaskSuccess] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        assigned_to: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        progress: 0
    });

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');
    const [inviteForm, setInviteForm] = useState({ email: '', role: 'member', job_title: '' });
    const [inviteStatus, setInviteStatus] = useState({ message: '', error: false });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, taskId: null, taskTitle: '' });
    const [focusAddForm, setFocusAddForm] = useState(false);
    const navigate = useNavigate();
    const notification = useNotification();



    const loadData = async () => {
        const [meetData, notifData, userData, taskData] = await Promise.all([
            api.getMeetings(),
            api.getNotifications(),
            api.getUsers(),
            api.getTasks()
        ]);
        setMeetings(meetData || []);
        setProjects((meetData || []).filter(m => m.is_project));
        setNotifications(notifData || []);
        setAllUsers(userData?.filter(u => u.role === 'member') || []);
        setGlobalTasks(taskData || []);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await auth.verifySession();
                if (user.role !== 'chef' && user.role !== 'admin') {
                    navigate('/login');
                } else {
                    setUser(user);
                    await loadData();
                    setLoading(false);
                }
            } catch (err) {
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleRequestFinalization = async (project) => {
        const confirmed = await notification.confirm("Are you sure? This will notify the Admin that production is finished.");
        if (!confirmed) return;
        try {
            await api.updateMeeting(project.id, { status: 'ready_to_deploy' });
            notification.success("Admin has been notified! The project is now pending final approval.");
            await loadData();
        } catch (err) {
            notification.error("Failed to submit request: " + err.message);
        }
    };

    const handleLogout = () => {
        api.clearAllCaches();
        auth.logout();
        navigate('/login');
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setInviteStatus({ message: 'Sending...', error: false });
        try {
            await auth.sendInvitation(inviteForm.email, 'member', null, inviteForm.job_title);
            setInviteStatus({ message: 'Invitation sent successfully!', error: false });
            setInviteForm({ email: '', role: 'member', job_title: '' });
        } catch (err) {
            setInviteStatus({ message: err.message, error: true });
        }
    };

    const handleConvertToProject = async (meeting) => {
        const confirmed = await notification.confirm(`Convert "${meeting.title}" to an active project? It will appear in the Task Board.`);
        if (!confirmed) return;
        try {
            await api.convertMeetingToProject(meeting.id);
            await loadData();
            notification.success("Meeting converted to active project.");
        } catch (err) {
            notification.error("Failed to convert: " + err.message);
        }
    };

    const openTaskManager = async (project, addTask = false) => {
        setSelectedProject(project);
        const tasks = await api.getTasks({ meeting_id: project.id });
        setProjectTasks(tasks || []);
        setTaskForm({
            title: '',
            description: '',
            assigned_to: '',
            status: 'todo',
            priority: 'medium',
            due_date: '',
            progress: 0
        });
        setTaskSuccess(false);
        if (addTask) {
            setShowAddTaskModal(true);
        } else {
            setShowKanbanModal(true);
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createTask({
                ...taskForm,
                meeting_id: selectedProject.id
            });
            const tasks = await api.getTasks({ meeting_id: selectedProject.id });
            setProjectTasks(tasks || []);
            const allTasks = await api.getTasks();
            setGlobalTasks(allTasks || []);
            setTaskForm({
                title: '',
                description: '',
                assigned_to: '',
                status: 'todo',
                priority: 'medium',
                due_date: '',
                progress: 0
            });
            setTaskSuccess(true);
        } catch (err) {
            notification.error("Failed to add task: " + err.message);
        }
    };

    const updateTaskProgress = async (taskId, delta) => {
        const task = projectTasks.find(t => t.id === taskId);
        const newProgress = Math.min(100, Math.max(0, task.progress + delta));
        await api.updateTask(taskId, {
            progress: newProgress,
            status: newProgress === 100 ? 'done' : (newProgress > 0 ? 'in_progress' : 'todo')
        });
        const tasks = await api.getTasks({ meeting_id: selectedProject.id });
        setProjectTasks(tasks || []);
    };

    const handleDeleteTask = (taskId, taskTitle) => {
        setConfirmDelete({ open: true, taskId, taskTitle });
    };

    const confirmDeleteTask = async () => {
        const { taskId } = confirmDelete;
        setConfirmDelete({ open: false, taskId: null, taskTitle: '' });
        try {
            await api.deleteTask(taskId);
            if (selectedProject) {
                const tasks = await api.getTasks({ meeting_id: selectedProject.id });
                setProjectTasks(tasks || []);
            }
            const allTasks = await api.getTasks();
            setGlobalTasks(allTasks || []);
            notification.success('Task deleted successfully.');
        } catch (err) {
            notification.error('Failed to delete task: ' + err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    const roleColor = 'var(--role-chef)';
    const formatBadgeLabel = (value, fallback = 'pending') => String(value || fallback).toUpperCase();
    const normalizeStatus = (value, fallback = 'pending') => String(value || fallback).toLowerCase();

    return (
        <div className="dashboard-container" style={{ '--role-color': roleColor }}>
            <ChefSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                roleColor={roleColor}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            <main className="dashboard-main animate-slide-up" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20px', right: '40px', zIndex: 1100 }}>
                    <NotificationBell
                        notifications={notifications}
                        setNotifications={setNotifications}
                        roleColor={roleColor}
                        onDeleteNotification={() => notification.confirm('Are you sure you want to delete this notification? This action cannot be undone.')}
                    />
                </div>

                <ChefHeader
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    roleColor={roleColor}
                    handleLogout={handleLogout}
                />

                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
                        Welcome, <span style={{ color: roleColor }}>{user?.name}</span>.
                    </h2>
                    <p style={{ color: '#999', marginTop: '5px', fontSize: '1.1rem' }}>Manage your production pipeline and team deliverables.</p>
                </div>

                {activeTab === 'projects' && (
                    <div className="grid grid-2">
                        {projects.length > 0 ?
                            projects.map(project => {
                                const projTasks = globalTasks.filter(t => t.meeting_id === project.id);
                                const isAllDone = projTasks.length > 0 && projTasks.every(t => t.status === 'done');

                                return (
                                    <div key={project.id} className="stat-card" style={{
                                        textAlign: 'left',
                                        borderLeft: `8px solid ${roleColor}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                    }}>
                                        <div className="flex justify-between align-start">
                                            <div>
                                                <h3 className="notranslate" translate="no" style={{ fontSize: '1.5rem' }}>{project.title}</h3>
                                                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Client: {project.client_name}</p>
                                            </div>
                                            <span
                                                className="role-badge"
                                                style={{
                                                    background: `${roleColor}11`,
                                                    color: roleColor,
                                                    fontSize: '0.6rem'
                                                }}
                                            >
                                                ACTIVE PROJECT
                                            </span>
                                        </div>

                                        <div className="flex gap-10">
                                            <button
                                                onClick={() => openTaskManager(project)}
                                                className="btn btn-small"
                                                style={{ background: '#333', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <CheckSquare size={14} /> View Tasks List
                                            </button>
                                            <button
                                                onClick={() => openTaskManager(project, true)}
                                                className="btn btn-small"
                                                style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <CheckSquare size={14} /> Add Task
                                            </button>

                                            {isAllDone && (
                                                <button
                                                    onClick={() => handleRequestFinalization(project)}
                                                    className="btn btn-small"
                                                    style={{ background: '#38A169', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <Rocket size={14} /> Finalize Project
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: 'span 2' }}>
                                    <p style={{ color: '#999' }}>No active projects in your portfolio yet. (Wait for team member activation)</p>
                                </div>
                            )}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="grid grid-3">
                        {globalTasks.length > 0 ? globalTasks.map(task => (
                            <div key={task.id} className="card animate-slide-up" style={{
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                background: task.status === 'done' ? 'rgba(255,255,255,0.6)' : '#fff',
                                border: '1px solid #eef2f6',
                                borderRadius: '24px',
                                boxShadow: task.status === 'done' ? 'none' : '0 15px 35px rgba(0,0,0,0.05)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Background Accent */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '6px',
                                    background: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#FEA624' : roleColor)
                                }}></div>

                                <div className="flex justify-between align-center">
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '800',
                                        color: '#A0AEC0',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {task.meeting?.title}
                                    </span>

                                    <div className="flex align-center" style={{ gap: '12px' }}>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '50px',
                                            fontSize: '0.65rem',
                                            fontWeight: '900',
                                            letterSpacing: '1px',
                                            background: task.status === 'done' ? '#F0FFF4' : (task.status === 'in_progress' ? '#FFF9E5' : '#F7FAFC'),
                                            color: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#D69E2E' : '#718096'),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#D69E2E' : '#718096')
                                            }}></div>
                                            {formatBadgeLabel(task.status === 'in_progress' ? 'Active' : task.status, 'todo')}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteTask(task.id, task.title)}
                                            title="Delete task"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#E53E3E',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '6px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <h3 style={{
                                    fontSize: '1.35rem',
                                    fontWeight: '800',
                                    margin: '5px 0',
                                    color: task.status === 'done' ? '#718096' : '#1A202C'
                                }}>{task.title}</h3>

                                <p style={{
                                    fontSize: '0.9rem',
                                    color: task.status === 'done' ? '#A0AEC0' : '#4A5568',
                                    lineHeight: '1.6',
                                    margin: 0
                                }}>{task.description}</p>

                                <div style={{ marginTop: '5px' }}>
                                    <div className="flex justify-between align-center" style={{ marginBottom: '12px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#718096' }}>PRODUCTION PROGRESS</span>
                                        <span style={{
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            color: task.status === 'done' ? '#38A169' : roleColor
                                        }}>{task.progress}%</span>
                                    </div>
                                    <div style={{ position: 'relative', width: '100%', height: '10px', background: '#EDF2F7', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${task.progress}%`,
                                            height: '100%',
                                            background: task.status === 'done' ? '#38A169' : (task.status === 'in_progress' ? '#FEA624' : roleColor),
                                            borderRadius: '10px'
                                        }}></div>
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: 'auto',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f9f9f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: '#f8f9fa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            fontWeight: '900',
                                            color: roleColor,
                                            border: '1px solid #eee'
                                        }}>
                                            {task.assigned_user?.name?.charAt(0) || '?'}
                                        </div>
                                        <div style={{ lineHeight: '1.2' }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800 }}>{task.assigned_user?.name || 'Unassigned'}</p>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member</p>
                                        </div>
                                    </div>

                                    {task.due_date && (
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: '#E53E3E', fontWeight: 900, letterSpacing: '0.5px' }}>DUE DATE</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#1A202C' }}>{new Date(task.due_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="card" style={{ padding: '60px', textAlign: 'center', gridColumn: 'span 3', borderStyle: 'dashed', background: 'transparent' }}>
                                <p className="label">Agency Queue</p>
                                <h3 style={{ margin: '20px 0', fontSize: '1.5rem' }}>The Task Board is Empty</h3>
                                <p style={{ color: '#999' }}>Go to My Projects and click "Manage Tasks" to assign tickets to your members.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'meetings' && (
                    <div className="grid grid-2">
                        {meetings.length > 0 ? meetings.map(meeting => {
                            return (
                                <div key={meeting.id} className="card animate-slide-up" style={{ textAlign: 'left', padding: '30px', borderLeft: `8px solid ${roleColor}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="flex justify-between align-center">
                                        <span className="label" style={{ color: roleColor }}>{new Date(meeting.meeting_date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{meeting.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Client: <strong>{meeting.client_name}</strong></p>
                                    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', fontSize: '0.95rem', whiteSpace: 'pre-line', border: '1px solid #eee' }}>
                                        {meeting.notes}
                                    </div>
                                    {meeting.is_project ? (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B46C1', background: '#F3E8FF', padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                                            Active Project
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleConvertToProject(meeting)}
                                            className="btn btn-small"
                                            style={{ background: roleColor, alignSelf: 'flex-start', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Rocket size={14} /> Convert to Project
                                        </button>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="card" style={{ padding: '60px', textAlign: 'center', gridColumn: 'span 2' }}>
                                <p style={{ color: '#999' }}>No meetings or meeting notes assigned to you yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="animate-slide-up">
                        <div style={{ marginBottom: '60px' }}>
                            <div className="flex justify-between align-center" style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Your Studio Members</h2>
                                <span className="role-badge" style={{ background: '#f5f5f5', color: '#666' }}>{allUsers.length} MEMBERS ACTIVE</span>
                            </div>

                            <div className="grid grid-3" style={{ gap: '20px' }}>
                                {allUsers.length > 0 ? allUsers.map(member => (
                                    <div key={member.id} className="card" style={{
                                        padding: '25px',
                                        background: '#fff',
                                        border: '1px solid #eee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'var(--transition-smooth)'
                                    }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '16px',
                                            background: '#f8f9fa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem',
                                            fontWeight: '900',
                                            color: roleColor,
                                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                        }}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{member.name}</h4>
                                            <p className="label" style={{ color: roleColor, fontSize: '0.65rem', marginTop: '2px' }}>{member.job_title || 'MEMBER'}</p>
                                            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#999' }}>{member.email}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: 'span 3', borderStyle: 'dashed', background: 'transparent' }}>
                                        <p style={{ color: '#999', fontSize: '0.9rem' }}>No active team members found. Start by deploying a secure link below.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <AdminInviteForm
                            inviteForm={inviteForm}
                            setInviteForm={setInviteForm}
                            handleInviteSubmit={handleInviteSubmit}
                            inviteStatus={inviteStatus}
                            roleColor={roleColor}
                            isChef={true}
                        />
                    </div>
                )}

                {activeTab !== 'projects' && activeTab !== 'tasks' && activeTab !== 'meetings' && activeTab !== 'team' && (
                    <div className="card" style={{ padding: '100px', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
                        <p className="label">Future Module</p>
                        <h3 style={{ fontSize: '1.5rem', marginTop: '10px' }}>Management tool for <strong>{activeTab}</strong> arriving soon.</h3>
                    </div>
                )}
            </main>


            {/* ── KANBAN MODAL ── */}
            {showKanbanModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(5px)'
                }} onClick={() => setShowKanbanModal(false)}>
                    <div className="card animate-slide-up" style={{ width: '95%', maxWidth: '1400px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="flex align-center justify-between" style={{ marginBottom: '40px' }}>
                            <div>
                                <button 
                                    onClick={() => setShowKanbanModal(false)} 
                                    style={{ background: 'none', border: 'none', color: roleColor, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}
                                >
                                    <ArrowLeft size={18} /> Back to Projects
                                </button>
                                <h1 style={{ margin: 0, fontSize: '2.5rem' }}><span className="notranslate" translate="no">{selectedProject?.title}</span> Board</h1>
                            </div>
                            <button
                                onClick={() => setShowKanbanModal(false)}
                                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-3" style={{ gap: '30px' }}>
                            {['todo', 'in_progress', 'done'].map(status => {
                                const filteredTasks = projectTasks.filter(t => t.status === status);
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
                                                        <button
                                                            onClick={() => handleDeleteTask(task.id, task.title)}
                                                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '2px' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = '#38a169'}
                                                            onMouseLeave={e => e.currentTarget.style.color = '#999'}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
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
                    </div>
                </div>
            )}

            {/* ── ADD TASK MODAL ── */}
            {showAddTaskModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5,5,5,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(16px)', padding: '24px'
                }}>
                    <div className="card animate-scale-in" style={{
                        width: '520px', padding: '40px', borderRadius: '24px', position: 'relative',
                        border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                        maxHeight: 'calc(100vh - 48px)', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => { setShowAddTaskModal(false); setTaskSuccess(false); }}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}
                        >
                            <X size={22} />
                        </button>

                        {taskSuccess ? (
                            /* ── Success State ── */
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '50%', background: '#F0FFF4',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
                                }}>
                                    <CheckSquare size={34} color="#38A169" />
                                </div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 10px', color: '#1A202C' }}>Task Created!</h3>
                                <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 30px' }}>
                                    The task has been successfully added to <strong style={{ color: '#1A202C' }}>{selectedProject?.title}</strong>.
                                </p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setTaskSuccess(false)}
                                        className="btn"
                                        style={{
                                            flex: 1, background: roleColor, padding: '14px', borderRadius: '12px', fontWeight: 800,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            boxShadow: `0 8px 20px ${roleColor}33`
                                        }}
                                    >
                                        <Send size={16} /> Add Another
                                    </button>
                                    <button
                                        onClick={() => { setShowAddTaskModal(false); setTaskSuccess(false); }}
                                        className="btn"
                                        style={{
                                            flex: 1, background: '#f0f0f0', color: '#555', padding: '14px', borderRadius: '12px', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <X size={16} /> Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── Form State ── */
                            <>
                                <div style={{ marginBottom: '28px' }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Send size={22} /> Add Task
                                    </h3>
                                    <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Assign a new production task to your team for <strong className="notranslate" translate="no">{selectedProject?.title}</strong>.</p>
                                </div>

                                <form onSubmit={handleTaskSubmit}>
                                    <div style={{ marginBottom: '18px' }}>
                                        <label className="label">Task Title</label>
                                        <input type="text" className="input-field" placeholder="Briefly name the deliverable..."
                                            style={{ background: '#fcfcfc', border: '1px solid #eee' }}
                                            required value={taskForm.title}
                                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
                                    </div>
                                    <div style={{ marginBottom: '18px' }}>
                                        <label className="label">Description</label>
                                        <textarea className="input-field" rows="3"
                                            placeholder="Describe requirements and expectations..."
                                            style={{ background: '#fcfcfc', border: '1px solid #eee', resize: 'none' }}
                                            value={taskForm.description}
                                            onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}></textarea>
                                    </div>
                                    <div style={{ marginBottom: '18px' }}>
                                        <label className="label">Assigned Members</label>
                                        <select className="input-field" style={{ background: '#fcfcfc', border: '1px solid #eee' }}
                                            required value={taskForm.assigned_to}
                                            onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })}>
                                            <option value="">Select Studio Member</option>
                                            {allUsers.map(u => <option key={u.id} value={u.id}>{u.name} — {u.job_title}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                                        <div>
                                            <label className="label">Priority</label>
                                            <select className="input-field" style={{ background: '#fcfcfc', border: '1px solid #eee' }}
                                                value={taskForm.priority}
                                                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Deadline</label>
                                            <input type="date" className="input-field" style={{ background: '#fcfcfc', border: '1px solid #eee' }}
                                                required
                                                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                                                value={taskForm.due_date}
                                                onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button type="submit" className="btn"
                                            style={{
                                                background: roleColor, padding: '16px', fontWeight: 800, fontSize: '1rem',
                                                borderRadius: '12px', boxShadow: `0 10px 25px ${roleColor}33`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                            }}>
                                            <Send size={18} /> Add Task
                                        </button>
                                        <button type="button" onClick={() => setShowAddTaskModal(false)} className="btn"
                                            style={{
                                                background: '#f5f5f5', color: '#666', padding: '13px', fontSize: '0.9rem',
                                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}>
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {confirmDelete.open && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5,5,5,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, backdropFilter: 'blur(12px)'
                }}>
                    <div className="card animate-scale-in" style={{
                        width: '420px',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '20px',
                            background: '#fff5f5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto'
                        }}>
                            <Trash2 size={28} color="#E53E3E" />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900 }}>Delete Task?</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                You are about to permanently delete{' '}
                                <strong style={{ color: '#1A202C' }}>"{confirmDelete.taskTitle}"</strong>.
                                This action cannot be undone.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setConfirmDelete({ open: false, taskId: null, taskTitle: '' })}
                                className="btn"
                                style={{
                                    flex: 1, background: '#f5f5f5', color: '#555',
                                    padding: '14px', borderRadius: '12px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button
                                onClick={confirmDeleteTask}
                                className="btn"
                                style={{
                                    flex: 1, background: '#E53E3E', color: '#fff',
                                    padding: '14px', borderRadius: '12px', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 8px 20px rgba(229,62,62,0.35)'
                                }}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
