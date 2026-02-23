import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white/80 dark:bg-slate-800/70 border-t border-slate-200/50 dark:border-slate-700/50 pt-16 pb-8 backdrop-blur-sm transition-colors">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-1.5 rounded-lg text-slate-900">
                                <span className="material-symbols-outlined block text-xl">medical_services</span>
                            </div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Healback</h2>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                            The leading feedback platform dedicated to improving medical standards through patient voices and provider analytics.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition-colors" to="/feedback">Patient Portal</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/doctors">Find Doctors</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/admin">Admin Panel</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Compliance</h4>
                        <div className="space-y-4">
                            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-700 text-[10px] font-bold text-slate-400 uppercase text-center">HIPAA Compliant</div>
                            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-700 text-[10px] font-bold text-slate-400 uppercase text-center">GDPR Ready</div>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
                    <p>© 2024 Healback Technologies Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a className="hover:text-primary" href="#">Cookies</a>
                        <a className="hover:text-primary" href="#">Security</a>
                        <a className="hover:text-primary" href="#">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
