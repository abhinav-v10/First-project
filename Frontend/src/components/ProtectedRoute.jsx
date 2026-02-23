import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <span className="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light gap-4">
                <span className="material-symbols-outlined text-6xl text-red-400">lock</span>
                <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
                <p className="text-slate-500">You need admin privileges to view this page.</p>
                <a href="/" className="text-primary font-bold hover:underline">← Go Home</a>
            </div>
        );
    }

    return children;
}
