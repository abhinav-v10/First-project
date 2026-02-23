import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import api from '../api';

export default function LandingPage() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        api.get('/doctors')
            .then(res => setDoctors(res.data.data || []))
            .catch(() => { });
    }, []);

    const carouselItems = doctors.slice(0, 8).map(doc => ({
        id: doc._id,
        title: doc.name,
        description: `${doc.department} • ${doc.designation} • ⭐ ${doc.averageRating?.toFixed(1) || '0.0'}`,
        icon: <span className="material-symbols-outlined carousel-icon" style={{ fontSize: 20 }}>person</span>,
    }));

    return (
        <div className="font-display text-slate-900 dark:text-slate-100 antialiased transition-colors">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                New: Advanced Analytics for Clinics
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                                Your Feedback <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Improves</span> Healthcare
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-xl">
                                Empowering patients and providers to build a better medical experience together through transparent, actionable insights.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/feedback" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-slate-900 font-bold rounded-xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                                    Start Survey <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <Link to="/doctors" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all dark:text-white">
                                    View Doctors
                                </Link>
                            </div>
                            <div className="mt-12 flex items-center gap-4 text-slate-500">
                                <div className="flex -space-x-3">
                                    <img className="w-10 h-10 rounded-full border-2 border-white" alt="User 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJO9moVUnVhiHDrA0AtLIVQNAoHJ_FQ40BgQs0_jEfgIpQYCPcEmkisonpIX31V2ENawe3ZnnTt9tO8A4wj7DecmYZ708L6Y_ZFcIPpEx3mpSLo6lJ2TllSf9Er7BlJwNmYX6saTygB-mZH-2MZ0rtWy-qFBz3Sb6UKaIK9CoKeQQwaw97gXSfw8o_Rc6jTqGjf6mA4vmJyMVPsFDFvXdgCOChjX9NqewQS3K8VgeYaABOcpiuDj1lB3WQdP49jMZJ00STKLCf0BM" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" alt="User 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIjbUs7v9c69jTeXUzcG4x71j9X_FiehVj-OcrEtFuwmmdXMEnnH6rswnahS_bfI-5GT_5CKZuzrgO0jK3L7euZlRHBOzoHxtDDLeJB9zrvyc3JBcAWRGSbhbrbv9EtWay0_n-uay5LCq0RtPqmWLHzkELzkibyrXGXjo4Str6xaO84jhcaMWzUsD6lxUwbC7dZiSC1KZwWSy5RtrFCV-ivLrQhDpUD4MaxbGlQc7f5KHPNLX0WcVMlheq9ftzrZnyNo8kTrBRH6M" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" alt="User 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyqTa_N_pcNBHew4akW9HZFwoWEhDjSeZOffFGGNoMf7cMPqdJEIxa0vNJ-olG5FX9WVv0jdyeFx2Edd2Zb4t_wMm-dCNMejA6n4fMgbX3eE9A3awU0Z8L5WrK1kEC5YQFPgWX072DyaCF2rw60yRZlAY23RIZJhmeiS3fngfu5S3wzLB6zmILCkPNZR1NQVt6weNFjMZ8BIKvqLrR47kgymHKjnFjUGJdIteCWGDvyrGKsZ64-vckFFpJq4PN-Sgj9laTo443_-Y" />
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">+2k</div>
                                </div>
                                <p className="text-sm font-medium dark:text-slate-300">Trusted by 12,000+ medical professionals</p>
                            </div>
                        </div>
                        <div className="relative lg:block">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
                                <img className="w-full h-full object-cover" alt="Modern medical facility" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBavIib11t36oY4iRW8o7fYIEG5cFbk8W5hfDO9gJA8MkuLJLMVqf7Ejsfo1vdar483ps9FZhKEEkym2tIxUeRxAivxwd5AO9IKW4jeEhp-v1agSy0xGi1wserN405YjHbcFB2x9KDHhA38-T83TDnnU-H6VlOrEMUhDhtuXeZI3SCgkR3sG-5ykcVU51xmm3-XWyePx4GEvOHsLledvWo6XkJGQdpQ6djX10Eb8O5DR36Zmc1FP4tk68illz6dFyXdAhA9oB8HkXE" />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold">Real-time Satisfaction</h4>
                                        <span className="text-emerald-500 font-bold">98.2%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[98%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portal Selection */}
                <section className="py-24 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl lg:text-4xl font-black mb-4">Select Your Portal</h2>
                            <p className="text-slate-600">Tailored experiences for every member of the healthcare ecosystem.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Patient Portal */}
                            <div className="group relative p-8 rounded-3xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl">patient_list</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Submit Feedback</h3>
                                <p className="text-slate-600 mb-6">Share your care experience securely and help your providers improve. 100% HIPAA compliant and private.</p>
                                <ul className="space-y-3 mb-8 text-sm text-slate-500">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Anonymous options</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Instant reporting</li>
                                </ul>
                                <Link to="/feedback" className="block w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl group-hover:bg-primary group-hover:text-slate-900 transition-all text-center">
                                    Patient Portal
                                </Link>
                            </div>
                            {/* Physician Portal */}
                            <div className="group relative p-8 rounded-3xl border-2 border-primary bg-white shadow-xl shadow-primary/5 hover:translate-y-[-4px] transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>
                                <div className="mb-6 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl">stethoscope</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">View Doctors</h3>
                                <p className="text-slate-600 mb-6">Access comprehensive patient reviews and performance analytics to elevate your medical practice.</p>
                                <ul className="space-y-3 mb-8 text-sm text-slate-500">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Sentiment analysis</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Trend benchmarking</li>
                                </ul>
                                <Link to="/doctors" className="block w-full py-3 px-4 bg-primary text-slate-900 font-bold rounded-xl hover:scale-105 transition-all text-center">
                                    Physician Portal
                                </Link>
                            </div>
                            {/* Admin Portal */}
                            <div className="group relative p-8 rounded-3xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl">analytics</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
                                <p className="text-slate-600 mb-6">Manage facility-wide data, ensure compliance, and oversee operational efficiency across all departments.</p>
                                <ul className="space-y-3 mb-8 text-sm text-slate-500">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Staff management</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Compliance auditing</li>
                                </ul>
                                <Link to="/admin" className="block w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl group-hover:bg-primary group-hover:text-slate-900 transition-all text-center">
                                    System Insights
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Doctors Carousel */}
                {carouselItems.length > 0 && (
                    <section className="py-24 bg-background-light/80 dark:bg-slate-900/60 backdrop-blur-sm transition-colors">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <h2 className="text-3xl lg:text-4xl font-black mb-4 dark:text-white">Our Top Doctors</h2>
                                <p className="text-slate-600 dark:text-slate-400">Swipe through our certified healthcare professionals.</p>
                            </div>
                            <div className="flex justify-center">
                                <div style={{ height: '280px', position: 'relative' }}>
                                    <Carousel
                                        items={carouselItems}
                                        baseWidth={340}
                                        autoplay={true}
                                        autoplayDelay={3000}
                                        pauseOnHover={true}
                                        loop={true}
                                        round={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Statistics Banner */}
                <section className="py-12 border-y border-slate-200/50 dark:border-slate-700/50 bg-background-light/80 dark:bg-slate-900/60 backdrop-blur-sm transition-colors">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900 mb-1">500k+</p>
                            <p className="text-sm font-semibold text-slate-500">Feedbacks Processed</p>
                            <p className="text-xs font-bold text-emerald-500 mt-1">↑ 12% Monthly</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900 mb-1">12,000+</p>
                            <p className="text-sm font-semibold text-slate-500">Active Providers</p>
                            <p className="text-xs font-bold text-emerald-500 mt-1">↑ 5% Monthly</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900 mb-1">98%</p>
                            <p className="text-sm font-semibold text-slate-500">Patient Satisfaction</p>
                            <p className="text-xs font-bold text-emerald-500 mt-1">↑ 2% Global</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900 mb-1">24/7</p>
                            <p className="text-sm font-semibold text-slate-500">System Uptime</p>
                            <p className="text-xs font-bold text-emerald-500 mt-1">Enterprise Grade</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-16 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                            <h2 className="text-3xl lg:text-5xl font-black mb-6 relative z-10">Ready to transform your healthcare experience?</h2>
                            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto relative z-10">Join thousands of clinics and patients working together to create a world-class medical journey.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <input className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80 placeholder:text-slate-500" placeholder="Enter your work email" type="email" />
                                <button className="px-8 py-4 bg-primary text-slate-900 font-black rounded-xl hover:scale-105 transition-all">Get Free Demo</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
