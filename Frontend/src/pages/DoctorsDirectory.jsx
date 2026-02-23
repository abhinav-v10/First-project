import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const DEPARTMENTS = ['All', 'General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Neurology', 'Gynecology', 'ENT', 'Ophthalmology', 'Psychiatry'];
const PER_PAGE = 9;

export default function DoctorsDirectory() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('All');
    const [page, setPage] = useState(1);

    useEffect(() => {
        api.get('/doctors')
            .then(res => setAllDoctors(res.data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Filter + search
    const filtered = allDoctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.designation?.toLowerCase().includes(search.toLowerCase());
        const matchesDept = department === 'All' || doc.department === department;
        return matchesSearch && matchesDept;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [search, department]);

    const placeholderImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBbTPlhulOIHhg3nK7Q_Q5Cay0xUrYB6YlogHvFVS8_xgIQyHhbEOA0WKNAumx9p9mP8bKrdZKQIWyYuept6etusK-hkahDzcZF1cSxtPC7yMOlJHRrF2fc5_QxCCQ7Zt3t2niXn_OeOHgAXT8a7yQbAiEGAC1RGpoILwnMA1UImtv6MF5TJzy3TrLugTIpH1-1amCu59BZqvxbKdHAI07tluxt6o0H_9PRTgk9eEEp9gNitBtcH6zggp8ZYzi6wIz48fUkhn2GcVQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD-5QGECer2-yI86cT7MEMNSySeCS9f-XqBXhoBGM6nU8sH_s7UZcCPriGwU_htrlKUH04OcZ-IjtTHVkS4iMZFVbpVbYoMi_KQ7mTMbMfh1KBqz3By59RuDoRSA1Ko3iskl7165ZAWHLwU8xCmtBuds_tIm0fscWq1zdXGQ1mzTdkb_ZWYqd0qxIwihkJ-fSqKNQ3hDCNGJ-_oseZcX9lmXJy2SM25H_lnx68hpyzL8pChONXc9SZvi2T2wDtdjbeJWrMi0ExwNAc',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA7uj-nP_1RIb9MLWHbg2HeyJpNGTpvU_Mh7knJ8zIL_DuRwO_kdL_9Wr3UuQhh5eBMW8sPhtiTWI_1pbopnZndjrn_K22UUGr8WvX6Fx4BBKnnScL4XDAY-79wwEyk-3ysEqahQ3L-TSCTtoXWowHaZhA_W9SbhmHUw9tanySn3gW4WPW7_hQPDbH86r4NywMlnO0tqwlyulq3sqprhlaLO8MD5AjrJolxaYoLsQ3aKc4TAqW-c6q9uHIaHf6VZQcvBVK7Q6jXeBw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBVwtuQSodFFDgN8rU9RNVLIxcP1fU4lAB9ib5ce3Ajdl2JH6sO0PLCFblrZcZurbDuvb9C3xw4Z83D08SwodtdoUleJETa_yxNFUlhSBzKguBTk0LzrTtSK--T6Eghkt5fLdbX6Efo_FNeMnRIq4Rvh-qBdVtpG17s8XqMF9zo4DpZ6_YWcEFMxqIFjgnaEyPtaajV8fRdu-lZkoFYgAWf_PPpDLPd5SHQXQsSqt_uuQRZYcsHb_9ZFWw6V9PhZJnb7QpRUHaYqAg',
    ];

    return (
        <div className="font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
            <Navbar />
            <main className="max-w-7xl mx-auto w-full px-4 lg:px-10 py-8">
                <div className="mb-8">
                    <nav className="flex mb-2 text-xs font-medium text-slate-400 gap-2">
                        <span>Directory</span><span>/</span><span className="text-primary">Find Doctors</span>
                    </nav>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Doctors Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Browse our certified healthcare professionals.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Search by name or designation..."
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary font-semibold text-sm min-w-[180px]"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                    >
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* Results count */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
                    Showing {paginated.length} of {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
                    {department !== 'All' && <span> in <strong className="text-primary">{department}</strong></span>}
                    {search && <span> matching "<strong className="text-primary">{search}</strong>"</span>}
                </p>

                {loading ? (
                    <div className="text-center py-24 text-slate-400">
                        <span className="material-symbols-outlined text-6xl animate-spin">progress_activity</span>
                        <p className="mt-4 font-semibold">Loading doctors...</p>
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-24 text-slate-400">
                        <span className="material-symbols-outlined text-6xl">person_off</span>
                        <p className="mt-4 font-semibold">{allDoctors.length === 0 ? 'No doctors found. Add doctors via the admin panel.' : 'No doctors match your search.'}</p>
                        {(search || department !== 'All') && (
                            <button onClick={() => { setSearch(''); setDepartment('All'); }} className="mt-3 text-primary font-bold hover:underline">
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginated.map((doc, i) => (
                                <Link to={`/doctors/${doc._id}`} key={doc._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="relative">
                                        <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${placeholderImages[i % placeholderImages.length]}")` }}></div>
                                        {doc.averageRating >= 4.8 && (
                                            <div className="absolute bottom-3 left-3">
                                                <span className="px-2 py-1 bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest rounded">Top Rated</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg group-hover:text-primary transition-colors">{doc.name}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">{doc.department} • {doc.designation}</p>
                                        <div className="flex items-center gap-1 mb-4">
                                            <span className="material-symbols-outlined text-primary fill-icon text-lg">star</span>
                                            <span className="text-slate-900 dark:text-white font-bold text-sm">{doc.averageRating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-slate-400 text-xs font-medium">({doc.totalFeedbacks} reviews)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="flex-1 py-2.5 bg-primary text-slate-900 font-bold text-sm rounded-lg text-center hover:brightness-110 transition-all">View Profile</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${page === p ? 'bg-primary text-slate-900' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
