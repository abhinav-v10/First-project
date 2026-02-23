import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import api from '../api';

const AuthContext = createContext({});

// Admin emails — add your admin email(s) here
const ADMIN_EMAILS = ['abhinavknight77@gmail.com'];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [doctorProfile, setDoctorProfile] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkDoctorRole(session.user.email);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    checkDoctorRole(session.user.email);
                } else {
                    setDoctorProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Check if the user's email matches a doctor in the database
    const checkDoctorRole = async (email) => {
        try {
            const res = await api.get('/doctors');
            const doctors = res.data.data || [];
            const matchedDoctor = doctors.find(
                (d) => d.email?.toLowerCase() === email?.toLowerCase()
            );
            setDoctorProfile(matchedDoctor || null);
        } catch {
            setDoctorProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => {
        setDoctorProfile(null);
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
    const isDoctor = !!doctorProfile;

    const value = {
        user,
        loading,
        isAdmin,
        isDoctor,
        doctorProfile,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
