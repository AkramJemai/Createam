import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';
import * as api from '../services/api';
import * as auth from '../services/auth';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminStats from '../components/admin/AdminStats';
import AdminInviteForm from '../components/admin/AdminInviteForm';
import AdminItemsTable from '../components/admin/AdminItemsTable';
import AdminContactsTable from '../components/admin/AdminContactsTable';
import AdminItemForm from '../components/admin/AdminItemForm';
import AdminInvitationsTable from '../components/admin/AdminInvitationsTable';
import AdminMembersTable from '../components/admin/AdminMembersTable';
import AdminMeetingsTable from '../components/admin/AdminMeetingsTable';
import MeetingForm from '../components/admin/MeetingForm';
import JobManagement from '../components/admin/JobManagement';
import AdminTaskBoard from '../components/admin/AdminTaskBoard';
import AgencyManagement from '../components/admin/AgencyManagement';
import ClientManagement from '../components/admin/ClientManagement';
import PopularPartnerships from '../components/admin/PopularPartnerships';
import LoadingSpinner from '../components/LoadingSpinner';

// JOB_TITLES constant removed - now fetched dynamically

export default function Admin() {
    const [stats, setStats] = useState({ projects: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [items, setItems] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    const [inviteForm, setInviteForm] = useState({ email: '', role: 'chef', job_title: 'Project Manager' });
    const [inviteStatus, setInviteStatus] = useState({ message: '', error: false });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [members, setMembers] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [partnershipItems, setPartnershipItems] = useState([]);
    const [popularProjects, setPopularProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [categoryType, setCategoryType] = useState('contact'); // 'contact' or 'partnership'
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const notification = useNotification();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await auth.verifySession();
                if (user.role !== 'admin') {
                    navigate('/login');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const loadTabData = async () => {
        setLoading(true);

        // Load stats on dashboard tab only
        if (activeTab === 'dashboard') {
            const [projects, contacts, users, meetings, clientsList] = await Promise.all([
                api.getPartnerships(),
                api.getContacts(),
                api.getUsers(),
                api.getMeetings(),
                api.getClients()
            ]);

            const currentYear = new Date().getFullYear().toString();

            const yearlyProjects = projects?.filter(p => p.year === currentYear).length || 0;

            setStats({
                projects: projects?.length || 0,
                contacts: contacts?.length || 0,
                pendingContacts: contacts?.filter(c => (c.status || c.Status) === 'Pending').length || 0,
                resolvedContacts: contacts?.filter(c => (c.status || c.Status) === 'Resolved').length || 0,
                members: Math.max(0, (users?.length || 0) - 1),
                meetings: meetings?.length || 0,
                yearlyProjects: yearlyProjects
            });

            if (projects) {
                const topProjects = await api.getTopClickedProjectsLast3Months();
                setPopularProjects(topProjects || []);
            }

            setMembers(users?.filter(u => u.role !== 'admin') || []);
            setClients(clientsList || []);
            setItems(users || []);
        } else {
            // Load specific tab data
            let data = [];
            if (activeTab === 'partnership') data = await api.getPartnerships();
            else if (activeTab === 'contacts') data = await api.getContacts();
            else if (activeTab === 'categories') {
                const pships = await api.getPartnershipCategories();
                setPartnershipItems(pships || []);
                setLoading(false);
                return;
            }
            else if (activeTab === 'meetings') {
                const [meetings, clientsList] = await Promise.all([
                    api.getMeetings(),
                    api.getClients()
                ]);
                data = meetings;
                setClients(clientsList || []);
            }
            else if (activeTab === 'invites') {
                const users = await api.getUsers();
                setMembers(users?.filter(u => u.role !== 'admin') || []);
                setLoading(false);
                return;
            }
            else if (activeTab === 'jobs') { setLoading(false); return; }
            else if (activeTab === 'clients') { setLoading(false); return; }
            else if (activeTab === 'agency') { setLoading(false); return; }
            else if (activeTab === 'tasks') data = await api.getPartnerships();

            if (activeTab === 'tasks') {
                setAllProjects(data || []);
            } else {
                setItems(data || []);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        loadTabData();
    }, [activeTab]);

    const handleLogout = () => {
        api.clearAllCaches();
        auth.logout();
        navigate('/login');
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setInviteStatus({ message: 'Sending...', error: false });
        try {
            await auth.sendInvitation(inviteForm.email, inviteForm.role, null, inviteForm.job_title);
            setInviteStatus({ message: 'Invitation sent successfully!', error: false });
            setInviteForm({ email: '', role: 'chef', job_title: 'Project Manager' });
            if (activeTab === 'invites') loadTabData(); // Reload if on invites tab
        } catch (err) {
            setInviteStatus({ message: err.message, error: true });
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName) return;

        let result;
        result = editCategory
            ? await api.updatePartnershipCategory(editCategory.id, { name: newCategoryName })
            : await api.createPartnershipCategory({ name: newCategoryName });

        if (result) {
            setNewCategoryName('');
            setEditCategory(null);
            setShowCategoryModal(false);
            loadTabData();
        } else {
            notification.error('Failed to save category or it already exists.');
        }
    };

    const handleOpenCategoryEdit = (cat) => {
        setCategoryType('partnership');
        setEditCategory(cat);
        setNewCategoryName(cat.name);
        setShowCategoryModal(true);
    };

    const handleDelete = async (id, type = null) => {
        const targetType = type || activeTab;

        // Create specific confirmation message based on type
        const messages = {
            'partnership': 'Are you sure you want to delete this partnership? This action cannot be undone.',
            'contacts': 'Are you sure you want to delete this contact? This action cannot be undone.',
            'pship_categories': 'Are you sure you want to delete this partnership category? This action cannot be undone.',
            'invites': 'Are you sure you want to delete this invitation? This action cannot be undone.',
            'meetings': 'Are you sure you want to delete this meeting? This action cannot be undone.',
            'members': 'Are you sure you want to delete this team member? This action cannot be undone.',
            'clients': 'Are you sure you want to delete this client? This action cannot be undone.',
            'dashboard': 'Are you sure you want to delete this item? This action cannot be undone.'
        };

        const message = messages[targetType] || 'Are you sure you want to delete this item? This action cannot be undone.';
        const confirmed = await notification.confirm(message);
        if (!confirmed) return;

        let success = false;

        if (targetType === 'partnership') success = await api.deletePartnership(id);
        else if (targetType === 'contacts') success = await api.deleteContact(id);
        else if (targetType === 'pship_categories') success = await api.deletePartnershipCategory(id);
        else if (targetType === 'invites') success = await api.deleteInvitation(id);
        else if (targetType === 'meetings') success = await api.deleteMeeting(id);
        else if (targetType === 'dashboard' || targetType === 'members') success = await api.deleteUser(id);
        else if (targetType === 'clients') success = await api.deleteClient(id);

        if (success) {
            setItems(items.filter(item => item.id !== id));
            setMembers(members.filter(m => m.id !== id));
            setPartnershipItems(partnershipItems.filter(p => p.id !== id));
        } else {
            notification.error('Action failed or unauthorized.');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const result = await api.updateContact(id, { status: newStatus });
            if (result && result.contact) {
                // Keep both fields in sync for compatibility
                setItems(items.map(item => item.id === id ? { ...item, status: result.contact.status, Status: result.contact.status } : item));
            } else {
                notification.error('Failed to update status.');
            }
        } catch (err) {
            notification.error('Failed to update status: ' + (err.message || 'Unknown error'));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let result = null;
        if (activeTab === 'partnership') {
            result = editItem ? await api.updatePartnership(editItem.id, formData) : await api.createPartnership(formData);
        } else if (activeTab === 'meetings') {
            result = editItem ? await api.updateMeeting(editItem.id, formData) : await api.createMeeting(formData);
        }

        if (result) {
            setShowForm(false);
            setEditItem(null);
            loadTabData();
        } else {
            notification.error('Failed to save changes.');
        }
    };

    const openCreate = () => {
        setEditItem(null);
        setFormData({});
        setShowForm(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setFormData({ ...item });
        setShowForm(true);
    };

    const roleColor = 'var(--role-admin)';

    // Global fallback for initial system boot only
    if (loading && !stats.projects && activeTab === 'dashboard') {
        return <LoadingSpinner />;
    }

    return (
        <div className="dashboard-container" style={{ '--role-color': roleColor }}>
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowForm={setShowForm}
                handleLogout={handleLogout}
                roleColor={roleColor}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            <main className="dashboard-main animate-slide-up">
                <AdminHeader
                    activeTab={activeTab}
                    openCreate={openCreate}
                    showForm={showForm}
                    roleColor={roleColor}
                    handleLogout={handleLogout}
                />

                {activeTab === 'dashboard' && (
                    <>
                        <AdminStats stats={stats} />
                        <PopularPartnerships projects={popularProjects} />
                    </>
                )}

                {!showForm && activeTab === 'invites' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <AdminInviteForm
                            inviteForm={inviteForm}
                            setInviteForm={setInviteForm}
                            handleInviteSubmit={handleInviteSubmit}
                            inviteStatus={inviteStatus}
                            roleColor={roleColor}
                        />
                        <AdminMembersTable
                            users={members}
                            handleDelete={(id) => handleDelete(id, 'members')}
                        />
                    </div>
                )}

                {!showForm && activeTab === 'jobs' && (
                    <JobManagement
                        refreshData={loadTabData}
                        roleColor={roleColor}
                    />
                )}

                {!showForm && activeTab === 'tasks' && (
                    <AdminTaskBoard
                        projects={allProjects}
                        roleColor={roleColor}
                    />
                )}

                {!showForm && activeTab === 'clients' && (
                    <ClientManagement />
                )}

                {!showForm && activeTab === 'agency' && (
                    <AgencyManagement />
                )}

                {!showForm && activeTab !== 'dashboard' && activeTab !== 'contacts' && activeTab !== 'invites' && activeTab !== 'meetings' && activeTab !== 'categories' && activeTab !== 'tasks' && activeTab !== 'jobs' && activeTab !== 'agency' && activeTab !== 'clients' && (
                    <AdminItemsTable
                        items={items}
                        activeTab={activeTab}
                        openEdit={openEdit}
                        handleDelete={handleDelete}
                    />
                )}

                {!showForm && activeTab === 'meetings' && (
                    <AdminMeetingsTable
                        items={items}
                        openEdit={openEdit}
                        handleDelete={handleDelete}
                    />
                )}

                {!showForm && activeTab === 'contacts' && (
                    <AdminContactsTable
                        items={items}
                        handleStatusUpdate={handleStatusUpdate}
                        handleDelete={handleDelete}
                    />
                )}

                {!showForm && activeTab === 'categories' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Partnership Categories Table */}
                        <div className="card animate-slide-up">
                            <div className="flex align-center justify-between" style={{ marginBottom: '30px' }}>
                                <h3 style={{ margin: 0 }}>Partnership Categories</h3>
                                <button onClick={() => { setCategoryType('partnership'); setShowCategoryModal(true); }} className="btn" style={{ background: roleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={18} /> Add New
                                </button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ textAlign: 'left', padding: '15px' }}>Category Name</th>
                                        <th style={{ textAlign: 'right', padding: '15px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partnershipItems.map(cat => (
                                        <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '15px', fontWeight: '600' }}>{cat.name}</td>
                                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                                    <button
                                                        onClick={() => handleOpenCategoryEdit(cat, 'partnership')}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                    >
                                                        <Pencil size={14} /> UPDATE
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, 'pship_categories')}
                                                        style={{ background: 'none', border: 'none', color: '#38a169', cursor: 'pointer', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                    >
                                                        <Trash2 size={14} /> DELETE
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content tables below */}


                {showForm && (
                    <AdminItemForm
                        activeTab={activeTab}
                        editItem={editItem}
                        formData={formData}
                        setFormData={setFormData}
                        handleSave={handleSave}
                        setShowForm={setShowForm}
                        roleColor={roleColor}
                        members={members}
                        clients={clients}
                    />
                )}

                {/* Dynamic Category Modal */}
                {showCategoryModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000
                    }} onClick={() => { setShowCategoryModal(false); setEditCategory(null); setNewCategoryName(''); }}>
                        <div className="card animate-slide-up" style={{
                            width: '400px',
                            padding: '40px',
                            borderTop: `6px solid ${roleColor}`,
                            background: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.35)',
                            borderRadius: '24px'
                        }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: '30px', fontWeight: '800', color: '#111' }}>
                                {editCategory ? 'Edit' : 'Add New'} Category
                            </h3>
                            <form onSubmit={handleCategorySubmit}>
                                <div className="flex-column" style={{ marginBottom: '30px' }}>
                                    <label className="label" style={{ color: 'rgba(255, 255, 255, 0.72)' }}>Category Title</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. Digital Design"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        autoFocus
                                        required
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.12)',
                                            border: '1px solid #000',
                                            color: '#111'
                                        }}
                                    />
                                </div>
                                <div className="flex gap-10">
                                    <button type="submit" className="btn" style={{ background: roleColor, flex: 1 }}>
                                        {editCategory ? 'Save Changes' : 'Create Category'}
                                    </button>
                                    <button type="button" onClick={() => { setShowCategoryModal(false); setEditCategory(null); setNewCategoryName(''); }} className="btn" style={{ background: 'transparent', color: '#111', border: '1px solid #ddd', flex: 1 }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
