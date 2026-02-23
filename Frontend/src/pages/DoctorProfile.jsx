import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

export default function DoctorProfile() {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/doctors/${doctorId}`),
            api.get(`/feedback/doctor/${doctorId}`),
        ])
            .then(([docRes, fbRes]) => {
                setDoctor(docRes.data.data);
                setFeedbacks(fbRes.data.data || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [doctorId]);

    if (loading) {
        return (
            <div className="bg-background-light font-display min-h-screen">
                <Navbar />
                <div className="text-center py-24 text-slate-400">
                    <span className="material-symbols-outlined text-6xl animate-spin">progress_activity</span>
                    <p className="mt-4 font-semibold">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="bg-background-light font-display min-h-screen">
                <Navbar />
                <div className="text-center py-24 text-slate-400">
                    <span className="material-symbols-outlined text-6xl">error</span>
                    <p className="mt-4 font-semibold">Doctor not found.</p>
                    <Link to="/doctors" className="text-primary font-bold mt-2 inline-block">← Back to Directory</Link>
                </div>
            </div>
        );
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`material-symbols-outlined text-sm ${i <= rating ? 'text-primary fill-icon' : 'text-slate-300'}`}>star</span>
            );
        }
        return stars;
    };

    return (
        <div className="bg-background-light font-display text-slate-900 min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-10 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-slate-500 text-sm font-medium">
                    <Link className="hover:text-primary" to="/">Home</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <Link className="hover:text-primary" to="/doctors">Doctors</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 font-semibold">{doctor.name}</span>
                </nav>

                {/* Profile Hero */}
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative">
                            <div className="bg-primary/10 rounded-2xl min-h-40 w-40 flex items-center justify-center">
                                <span className="material-symbols-outlined text-7xl text-primary">person</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">Verified</div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-slate-900 text-3xl font-bold tracking-tight">{doctor.name}</h1>
                                    <p className="text-primary font-semibold text-lg">{doctor.designation} | {doctor.department}</p>
                                </div>
                                <Link to="/feedback" className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-slate-900 text-sm font-bold hover:shadow-lg transition-all">
                                    <span className="material-symbols-outlined mr-2 text-lg">rate_review</span>
                                    <span>Leave Feedback</span>
                                </Link>
                            </div>
                            {doctor.email && <p className="text-slate-600 text-base">{doctor.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl fill-icon">star</span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Average Rating</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-slate-900 text-2xl font-bold">{doctor.averageRating?.toFixed(1) || '0.0'}</p>
                                <p className="text-slate-400 text-sm">/ 5.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">reviews</span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Feedback</p>
                            <p className="text-slate-900 text-2xl font-bold">{doctor.totalFeedbacks || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">local_hospital</span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Department</p>
                            <p className="text-slate-900 text-2xl font-bold">{doctor.department}</p>
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-900 text-lg font-bold">Patient Feedback ({feedbacks.length})</h3>
                    </div>
                    {feedbacks.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl">chat_bubble_outline</span>
                            <p className="mt-2 font-semibold">No feedback yet. Be the first to leave a review!</p>
                        </div>
                    ) : (
                        feedbacks.map(fb => (
                            <div key={fb._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                            {fb.patient?.name ? fb.patient.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 font-bold text-sm">{fb.patient?.name || 'Anonymous'}</h4>
                                            <p className="text-slate-500 text-xs">{new Date(fb.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex">{renderStars(fb.rating)}</div>
                                </div>
                                {fb.comment && <p className="text-slate-600 text-sm leading-relaxed">{fb.comment}</p>}
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
