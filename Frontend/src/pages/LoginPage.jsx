import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ email: '', password: '', fullName: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (mode === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
                    redirectTo: `${window.location.origin}/login`,
                });
                if (error) throw error;
                setSuccess('Password reset link sent! Check your email inbox.');
            } else if (mode === 'signup') {
                const { error } = await signUp(form.email, form.password, form.fullName);
                if (error) throw error;
                setSuccess('Account created! Check your email to confirm, then log in.');
                setMode('login');
                setForm({ email: form.email, password: '', fullName: '' });
            } else {
                const { error } = await signIn(form.email, form.password);
                if (error) throw error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
        setSuccess('');
    };

    const getTitle = () => {
        if (mode === 'reset') return 'Reset Password';
        if (mode === 'signup') return 'Create Account';
        return 'Welcome Back';
    };

    const getSubtitle = () => {
        if (mode === 'reset') return "Enter your email and we'll send you a reset link";
        if (mode === 'signup') return 'Join Healback to share your healthcare experiences';
        return 'Sign in to your Healback account';
    };

    const getIcon = () => {
        if (mode === 'reset') return 'lock_reset';
        if (mode === 'signup') return 'person_add';
        return 'login';
    };

    return (
        <div className="min-h-screen font-display flex flex-col transition-colors">
            {/* Header */}
            <header className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg text-slate-900">
                            <span className="material-symbols-outlined block text-2xl">medical_services</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Healback</h1>
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">{getIcon()}</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{getTitle()}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{getSubtitle()}</p>
                        </div>

                        {/* Error / Success */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                {success}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === 'signup' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                        <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="John Doe" type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                    <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="you@example.com" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>

                            {mode !== 'reset' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                                    </div>
                                </div>
                            )}

                            {/* Forgot Password link */}
                            {mode === 'login' && (
                                <div className="text-right">
                                    <button type="button" onClick={() => switchMode('reset')} className="text-sm text-primary font-semibold hover:underline">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-slate-900 font-black rounded-xl hover:brightness-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 text-base">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                        {mode === 'reset' ? 'Sending...' : mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                                    </span>
                                ) : (
                                    mode === 'reset' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-8 text-center space-y-2">
                            {mode === 'reset' ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Remember your password?
                                    <button className="ml-2 text-primary font-bold hover:underline" onClick={() => switchMode('login')}>Sign In</button>
                                </p>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                                    <button className="ml-2 text-primary font-bold hover:underline" onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}>
                                        {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400">
                        By continuing, you agree to Healback's Terms of Service and Privacy Policy.
                    </p>
                </div>
            </main>
        </div>
    );
}
