import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Neurology', 'Gynecology', 'ENT', 'Ophthalmology', 'Psychiatry'];
const DESIGNATIONS = ['Junior Doctor', 'Senior Doctor', 'Consultant', 'HOD'];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [feedbackPage, setFeedbackPage] = useState(1);
    const FEEDBACK_PER_PAGE = 10;

    // Doctor form state
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [doctorForm, setDoctorForm] = useState({ name: '', email: '', phone: '', department: '', designation: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            api.get('/analytics').catch(() => ({ data: { data: null } })),
            api.get('/admin/feedback').catch(() => ({ data: { data: [] } })),
            api.get('/doctors').catch(() => ({ data: { data: [] } })),
        ])
            .then(([analyticsRes, feedbackRes, doctorsRes]) => {
                setAnalytics(analyticsRes.data.data);
                setFeedbacks(feedbackRes.data.data || []);
                setDoctors(doctorsRes.data.data || []);
            })
            .finally(() => setLoading(false));
    };

    const openAddDoctor = () => {
        setEditingDoctor(null);
        setDoctorForm({ name: '', email: '', phone: '', department: '', designation: '' });
        setFormError('');
        setShowDoctorForm(true);
    };

    const openEditDoctor = (doc) => {
        setEditingDoctor(doc);
        setDoctorForm({
            name: doc.name || '',
            email: doc.email || '',
            phone: doc.phone || '',
            department: doc.department || '',
            designation: doc.designation || '',
        });
        setFormError('');
        setShowDoctorForm(true);
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            if (editingDoctor) {
                await api.put(`/doctors/${editingDoctor._id}`, doctorForm);
            } else {
                await api.post('/doctors', doctorForm);
            }
            setShowDoctorForm(false);
            loadData();
        } catch (err) {
            setFormError(err.response?.data?.message || err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteDoctor = async (doc) => {
        if (!confirm(`Delete Dr. ${doc.name}? This cannot be undone.`)) return;
        try {
            await api.delete(`/doctors/${doc._id}`);
            loadData();
        } catch (err) {
            alert('Failed to delete: ' + (err.response?.data?.message || err.message));
        }
    };

    // CSV Export
    const exportCSV = () => {
        const headers = ['Date', 'Patient', 'Doctor', 'Department', 'Rating', 'Comment'];
        const rows = feedbacks.map(fb => [
            new Date(fb.createdAt).toLocaleDateString(),
            fb.patient?.name || 'Anonymous',
            fb.doctor?.name || '—',
            fb.doctor?.department || '—',
            fb.rating,
            `"${(fb.comment || '').replace(/"/g, '""')}"`
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healback-feedback-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Pagination for feedback
    const feedbackTotalPages = Math.ceil(feedbacks.length / FEEDBACK_PER_PAGE);
    const paginatedFeedbacks = feedbacks.slice((feedbackPage - 1) * FEEDBACK_PER_PAGE, feedbackPage * FEEDBACK_PER_PAGE);

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < full; i++) stars.push(<span key={i} className="material-symbols-outlined text-amber-400 text-sm">star</span>);
        if (half) stars.push(<span key="half" className="material-symbols-outlined text-amber-400 text-sm">star_half</span>);
        while (stars.length < 5) stars.push(<span key={`e${stars.length}`} className="material-symbols-outlined text-amber-400 text-sm">star_outline</span>);
        return stars;
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-slate-900">
                <div className="text-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl animate-spin">progress_activity</span>
                    <p className="mt-4 font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 transition-colors">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined text-slate-900">local_hospital</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">Healback</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary/10 border-l-4 border-primary text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-semibold">Overview</span>
                    </button>
                    <button onClick={() => setActiveTab('doctors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'doctors' ? 'bg-primary/10 border-l-4 border-primary text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined">person_check</span>
                        <span className="text-sm font-semibold">Manage Doctors</span>
                    </button>
                    <button onClick={() => setActiveTab('feedback')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'feedback' ? 'bg-primary/10 border-l-4 border-primary text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined">rate_review</span>
                        <span className="text-sm font-semibold">Feedback</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-lg">account_circle</span>
                        <span className="truncate">{user?.email}</span>
                    </div>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                    <h2 className="text-xl font-bold tracking-tight capitalize">{activeTab === 'overview' ? 'Overview Dashboard' : activeTab === 'doctors' ? 'Manage Doctors' : 'All Feedback'}</h2>
                    <div className="flex items-center gap-3">
                        {activeTab === 'feedback' && feedbacks.length > 0 && (
                            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                        )}
                        {activeTab === 'doctors' && (
                            <button onClick={openAddDoctor} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-slate-900 font-bold text-sm rounded-lg hover:brightness-105 transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-lg">person_add</span>
                                Add Doctor
                            </button>
                        )}
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* ─── Overview Tab ─── */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary inline-block mb-4">
                                        <span className="material-symbols-outlined">feedback</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Feedbacks</p>
                                    <h3 className="text-3xl font-black mt-1">{analytics?.totalFeedbacks ?? 0}</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="p-2 bg-amber-400/20 rounded-lg text-amber-500 inline-block mb-4">
                                        <span className="material-symbols-outlined">star</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Hospital Rating</p>
                                    <h3 className="text-3xl font-black mt-1">{analytics?.averageHospitalRating ?? 0}<span className="text-lg text-slate-400 font-normal">/5.0</span></h3>
                                    <div className="flex gap-0.5 mt-2">{renderStars(analytics?.averageHospitalRating ?? 0)}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary inline-block mb-4">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Doctors</p>
                                    <h3 className="text-3xl font-black mt-1">{doctors.length}</h3>
                                </div>
                            </div>

                            {/* Department Chart */}
                            {analytics?.departmentWiseSummary?.length > 0 && (
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-lg font-bold mb-6">Department Ratings</h4>
                                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                                        {analytics.departmentWiseSummary.map(dept => (
                                            <div key={dept.department} className="flex-1 flex flex-col items-center gap-3 group">
                                                <div className="w-full bg-primary rounded-t-lg transition-colors" style={{ height: `${(dept.averageRating / 5) * 100}%` }}></div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center">{dept.department}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ─── Doctors Tab ─── */}
                    {activeTab === 'doctors' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Designation</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Feedbacks</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {doctors.map(doc => (
                                            <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-sm">{doc.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{doc.email || '—'}</td>
                                                <td className="px-6 py-4 text-sm">{doc.department}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{doc.designation}</td>
                                                <td className="px-6 py-4"><div className="flex">{renderStars(doc.averageRating || 0)}</div></td>
                                                <td className="px-6 py-4 text-sm font-bold">{doc.totalFeedbacks || 0}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditDoctor(doc)} className="p-2 rounded-lg hover:bg-primary/10 text-slate-500 hover:text-primary transition-colors" title="Edit">
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDeleteDoctor(doc)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors" title="Delete">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {doctors.length === 0 && (
                                            <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">No doctors yet. Click "Add Doctor" to get started.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ─── Feedback Tab ─── */}
                    {activeTab === 'feedback' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Patient</th>
                                            <th className="px-6 py-4">Doctor</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {paginatedFeedbacks.map(fb => (
                                            <tr key={fb._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 text-xs font-medium">{new Date(fb.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-sm font-bold">{fb.patient?.name || 'Anonymous'}</td>
                                                <td className="px-6 py-4 text-sm">{fb.doctor?.name || '—'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{fb.doctor?.department || '—'}</td>
                                                <td className="px-6 py-4"><div className="flex">{renderStars(fb.rating)}</div></td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{fb.comment || '—'}</td>
                                            </tr>
                                        ))}
                                        {feedbacks.length === 0 && (
                                            <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No feedback submissions yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            {feedbackTotalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Page {feedbackPage} of {feedbackTotalPages} ({feedbacks.length} total)</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setFeedbackPage(p => Math.max(1, p - 1))} disabled={feedbackPage === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Previous</button>
                                        <button onClick={() => setFeedbackPage(p => Math.min(feedbackTotalPages, p + 1))} disabled={feedbackPage === feedbackTotalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ─── Doctor Add/Edit Modal ─── */}
            {showDoctorForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                            <button onClick={() => setShowDoctorForm(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleDoctorSubmit} className="p-6 space-y-5">
                            {formError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{formError}</div>
                            )}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                                <input className="rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-primary focus:border-primary" placeholder="Dr. John Doe" required value={doctorForm.name} onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Email *</label>
                                <input className="rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-primary focus:border-primary" placeholder="doctor@hospital.com" type="email" required value={doctorForm.email} onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-slate-700">Phone</label>
                                <input className="rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-primary focus:border-primary" placeholder="9876543210" value={doctorForm.phone} onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Department *</label>
                                    <select className="rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-primary focus:border-primary" required value={doctorForm.department} onChange={e => setDoctorForm({ ...doctorForm, department: e.target.value })}>
                                        <option value="">Select</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Designation *</label>
                                    <select className="rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-primary focus:border-primary" required value={doctorForm.designation} onChange={e => setDoctorForm({ ...doctorForm, designation: e.target.value })}>
                                        <option value="">Select</option>
                                        {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowDoctorForm(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={formLoading} className="px-6 py-2.5 bg-primary text-slate-900 rounded-lg font-bold text-sm hover:brightness-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                                    {formLoading ? 'Saving...' : (editingDoctor ? 'Update Doctor' : 'Add Doctor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
