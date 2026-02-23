import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { user, isAdmin, isDoctor, signOut } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 transition-colors">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-primary p-2 rounded-lg text-slate-900">
                        <span className="material-symbols-outlined block text-2xl">medical_services</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Healback</h1>
                </Link>
                <nav className="hidden md:flex items-center gap-10">
                    <Link className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" to="/feedback">Submit Feedback</Link>
                    <Link className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" to="/doctors">Find Doctors</Link>
                    {isDoctor && (
                        <Link className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" to="/doctor-dashboard">My Dashboard</Link>
                    )}
                    {isAdmin && (
                        <Link className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors" to="/admin">Admin Dashboard</Link>
                    )}
                </nav>
                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-300">
                            {dark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {user ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                                {isAdmin && (
                                    <span className="text-[9px] font-black bg-primary text-slate-900 px-1.5 py-0.5 rounded uppercase">Admin</span>
                                )}
                                {isDoctor && !isAdmin && (
                                    <span className="text-[9px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded uppercase">Doctor</span>
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-red-200 transition-all"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                Sign In
                            </Link>
                            <Link to="/feedback" className="px-5 py-2.5 bg-primary text-slate-900 text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Give Feedback
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
