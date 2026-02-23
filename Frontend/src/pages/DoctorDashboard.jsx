import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

export default function DoctorDashboard() {
    const { doctorProfile } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (doctorProfile?._id) {
            api.get(`/feedback/doctor/${doctorProfile._id}`)
                .then(res => setFeedbacks(res.data.data || []))
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [doctorProfile]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`material-symbols-outlined text-sm ${i <= rating ? 'text-primary fill-icon' : 'text-slate-300'}`}>star</span>
            );
        }
        return stars;
    };

    // Rating distribution
    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        value: r,
        count: feedbacks.filter(f => f.rating === r).length,
    }));
    const maxCount = Math.max(...ratingCounts.map(r => r.count), 1);

    return (
        <div className="bg-background-light font-display text-slate-900 min-h-screen">
            <Navbar />
            <main className="max-w-[1100px] mx-auto w-full px-4 sm:px-10 py-8">
                {/* Welcome Header */}
                <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="relative">
                            <div className="bg-primary/10 rounded-2xl h-24 w-24 flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-primary">person</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-bold shadow">Doctor</div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome, {doctorProfile?.name || 'Doctor'}!</h1>
                            <p className="text-primary font-semibold">{doctorProfile?.designation} • {doctorProfile?.department}</p>
                            {doctorProfile?.email && <p className="text-slate-500 text-sm mt-1">{doctorProfile.email}</p>}
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
                            <p className="text-slate-500 text-sm font-medium">Your Rating</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-slate-900 text-3xl font-black">{doctorProfile?.averageRating?.toFixed(1) || '0.0'}</p>
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
                            <p className="text-slate-900 text-3xl font-black">{doctorProfile?.totalFeedbacks || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">local_hospital</span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Department</p>
                            <p className="text-slate-900 text-xl font-bold">{doctorProfile?.department}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                    <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>
                    <div className="space-y-3">
                        {ratingCounts.map(r => (
                            <div key={r.value} className="flex items-center gap-4">
                                <span className="text-sm font-bold w-6 text-right">{r.value}★</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${(r.count / maxCount) * 100}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-slate-500 w-8">{r.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="text-lg font-bold">Patient Feedback ({feedbacks.length})</h3>
                        <p className="text-sm text-slate-500">What your patients are saying about you</p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <span className="material-symbols-outlined text-5xl">chat_bubble_outline</span>
                            <p className="mt-3 font-semibold">No feedback yet</p>
                            <p className="text-sm text-slate-400">You'll see patient reviews here once they start coming in.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {feedbacks.map(fb => (
                                <div key={fb._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                                {fb.patient?.name ? fb.patient.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <h4 className="text-slate-900 font-bold text-sm">{fb.patient?.name || 'Anonymous'}</h4>
                                                <p className="text-slate-400 text-xs">{new Date(fb.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">{renderStars(fb.rating)}</div>
                                    </div>
                                    {fb.comment && (
                                        <p className="text-slate-600 text-sm leading-relaxed pl-13">{fb.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
