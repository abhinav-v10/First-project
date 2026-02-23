import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function FeedbackSuccess() {
    return (
        <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                <div className="max-w-[640px] w-full text-center space-y-8">
                    {/* Success Icon */}
                    <div className="relative flex justify-center items-center">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-125"></div>
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-white rounded-full shadow-xl border-4 border-primary/20 overflow-hidden">
                            <span className="material-symbols-outlined text-[100px] md:text-[140px] text-primary leading-none">check_circle</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold tracking-tight">
                            Thank You for Your Feedback!
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                            Your input is invaluable. It helps our medical staff and administrators provide better care for you and the community.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/" className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary text-slate-900 text-lg font-bold hover:brightness-105 transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">home</span>
                            <span>Return to Home</span>
                        </Link>
                        <Link to="/doctors" className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl h-14 px-8 bg-white border border-slate-200 text-slate-700 text-lg font-bold hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined">person_search</span>
                            <span>View Doctors</span>
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-10 border-t border-slate-200">
                        <p className="text-slate-500 text-sm font-medium mb-4">Share your experience with others</p>
                        <div className="flex items-center justify-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-primary/20 hover:text-slate-900 transition-all">
                                <span className="material-symbols-outlined text-xl">share</span>
                                <span className="text-sm font-semibold">Share Experience</span>
                            </button>
                        </div>
                        <p className="text-slate-400 text-xs mt-4 italic">Joined 12,000+ patients in improving our services</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
