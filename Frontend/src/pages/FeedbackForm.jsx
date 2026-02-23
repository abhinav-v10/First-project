import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

export default function FeedbackForm() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anonymous, setAnonymous] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedGender, setSelectedGender] = useState('');
    const [form, setForm] = useState({
        name: '', age: '', doctorId: '', comment: '',
    });

    useEffect(() => {
        api.get('/doctors').then(res => setDoctors(res.data.data || [])).catch(() => { });
    }, []);

    const ratingOptions = [
        { icon: 'sentiment_very_satisfied', label: 'Great', value: 5 },
        { icon: 'sentiment_satisfied', label: 'Good', value: 4 },
        { icon: 'sentiment_neutral', label: 'Okay', value: 3 },
        { icon: 'sentiment_dissatisfied', label: 'Poor', value: 2 },
        { icon: 'sentiment_very_dissatisfied', label: 'Bad', value: 1 },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.doctorId || !selectedRating) {
            alert('Please select a doctor and a rating.');
            return;
        }
        setLoading(true);
        try {
            const body = {
                doctorId: form.doctorId,
                rating: selectedRating,
                comment: form.comment || undefined,
            };
            if (!anonymous && (form.name || form.age || selectedGender)) {
                body.patient = {};
                if (form.name) body.patient.name = form.name;
                if (form.age) body.patient.age = Number(form.age);
                if (selectedGender) body.patient.gender = selectedGender;
            }
            await api.post('/feedback', body);
            navigate('/feedback/success');
        } catch (err) {
            alert('Failed to submit feedback: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-background-light text-slate-900 min-h-screen">
            <Navbar />
            <main className="flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-40">
                <form onSubmit={handleSubmit} className="flex flex-col max-w-[800px] flex-1 gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">Submit Patient Feedback</h1>
                        <p className="text-slate-600 text-lg">Your input helps us improve the quality of care for everyone in our community.</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                        {/* Patient Identity */}
                        <div className="p-8 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">person</span>
                                <h3 className="text-xl font-bold">Patient Identity</h3>
                            </div>
                            {/* Anonymous Toggle */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8">
                                <div className="flex flex-col gap-1">
                                    <p className="text-slate-900 text-base font-bold">Submit Anonymously</p>
                                    <p className="text-slate-600 text-sm">Your personal details will not be shared with the medical staff.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={anonymous} onChange={() => setAnonymous(!anonymous)} />
                                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            {!anonymous && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">Full Name (Optional)</label>
                                        <input className="rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-4 py-2.5" placeholder="John Doe" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">Age</label>
                                        <input className="rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-4 py-2.5" placeholder="25" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Gender Identity</label>
                                        <div className="flex gap-3">
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <button type="button" key={g} onClick={() => setSelectedGender(g)} className={`flex-1 py-2 px-4 rounded-lg border font-bold transition-colors ${selectedGender === g ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:border-primary'}`}>{g}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Visit Details */}
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">stethoscope</span>
                                <h3 className="text-xl font-bold">Visit Details</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Doctor *</label>
                                <select className="rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-4 py-2.5" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required>
                                    <option value="">Select a doctor</option>
                                    {doctors.map(d => (
                                        <option key={d._id} value={d._id}>{d.name} — {d.department}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Rating & Review */}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">grade</span>
                                <h3 className="text-xl font-bold">Rating &amp; Review</h3>
                            </div>
                            <div className="flex flex-col items-center gap-6 mb-8 p-6 bg-slate-50 rounded-xl">
                                <p className="text-base font-medium">How would you rate your overall experience? *</p>
                                <div className="flex gap-4">
                                    {ratingOptions.map(opt => (
                                        <div key={opt.value} onClick={() => setSelectedRating(opt.value)} className="flex flex-col items-center gap-2 group cursor-pointer">
                                            <span className={`material-symbols-outlined text-4xl transition-colors ${selectedRating >= opt.value ? 'text-primary fill-icon' : 'text-slate-300 group-hover:text-primary'}`}>{opt.icon}</span>
                                            <span className={`text-xs font-bold ${selectedRating >= opt.value ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Share your experience (Optional)</label>
                                <textarea className="w-full rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-4 py-3" placeholder="Tell us more about your visit..." rows="4" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}></textarea>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="px-8 py-6 bg-slate-50 flex items-center justify-end gap-4">
                            <button type="submit" disabled={loading} className="px-10 py-2.5 rounded-lg bg-primary text-slate-900 font-black hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>

                    {/* Help Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                        <div className="p-6 rounded-xl bg-white border border-slate-200 flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary">privacy_tip</span>
                            <div>
                                <h4 className="font-bold text-slate-900">Privacy Assured</h4>
                                <p className="text-sm text-slate-500 mt-1">We comply with all healthcare data protection regulations (HIPAA).</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl bg-white border border-slate-200 flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <div>
                                <h4 className="font-bold text-slate-900">Track Progress</h4>
                                <p className="text-sm text-slate-500 mt-1">View how your feedback led to improvements in our services.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
