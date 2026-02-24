import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ShieldCheck, User, Phone, Lock,
    ChevronLeft, Sparkles, CheckCircle2, Eye, EyeOff, Sun, Moon
} from 'lucide-react';
import { useStore } from '../store';

type Step = 'welcome' | 'name' | 'phone' | 'password' | 'success';

// Country data for phone selector
const countries = [
    { code: '+237', name: 'Cameroun', flag: '🇨🇲' },
    { code: '+241', name: 'Gabon', flag: '🇬🇦' },
    { code: '+229', name: 'Bénin', flag: '🇧🇯' },
    { code: '+225', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: '+228', name: 'Togo', flag: '🇹🇬' },
    { code: '+221', name: 'Sénégal', flag: '🇸🇳' },
    { code: '+223', name: 'Mali', flag: '🇲🇱' },
    { code: '+224', name: 'Guinée', flag: '🇬🇳' },
    { code: '+235', name: 'Tchad', flag: '🇹🇩' },
    { code: '+236', name: 'RCA', flag: '🇨🇫' },
    { code: '+240', name: 'Guinée Équatoriale', flag: '🇬🇶' },
    { code: '+212', name: 'Maroc', flag: '🇲🇦' },
    { code: '+216', name: 'Tunisie', flag: '🇹🇳' },
    { code: '+213', name: 'Algérie', flag: '🇩🇿' },
    { code: '+20', name: 'Égypte', flag: '🇪🇬' },
];

export default function Auth() {
    const [step, setStep] = useState<Step>('welcome');
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        countryCode: '+237'
    });
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [isPreventMultiClick, setIsPreventMultiClick] = useState(false);
    const { login, darkMode, toggleDarkMode } = useStore();

    // Prevent multiple clicks
    const handleClick = (callback: () => void) => {
        if (isPreventMultiClick) return;
        setIsPreventMultiClick(true);
        callback();
        setTimeout(() => setIsPreventMultiClick(false), 1000);
    };

    const nextStep = (next: Step) => {
        setDirection(1);
        setStep(next);
    };

    const prevStep = (prev: Step) => {
        setDirection(-1);
        setStep(prev);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    const handleFinish = async () => {
        if (isPreventMultiClick) return;
        setIsPreventMultiClick(true);

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.countryCode + formData.phone,
                    password: formData.password,
                    role: 'director' // Always director by default
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
            setStep('success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setIsPreventMultiClick(false), 1000);
        }
    };

    const handleLogin = async () => {
        if (isPreventMultiClick) return;
        setIsPreventMultiClick(true);

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.countryCode + formData.phone, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion');
            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setIsPreventMultiClick(false), 1000);
        }
    };

    // After successful registration, auto-login
    const handlePostRegisterLogin = async () => {
        if (isPreventMultiClick) return;
        setIsPreventMultiClick(true);

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.countryCode + formData.phone, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setIsPreventMultiClick(false), 1000);
        }
    };

    const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

    // Theme classes
    const theme = {
        bg: darkMode ? 'bg-[#0a0a0f]' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50',
        text: darkMode ? 'text-white' : 'text-gray-900',
        textSecondary: darkMode ? 'text-indigo-200/60' : 'text-gray-500',
        glass: darkMode ? 'glass-dark' : 'glass',
        glassInput: darkMode ? 'bg-white/10 border-white/10 text-white placeholder:text-white/20' : 'bg-white/50 border-white/60 text-gray-900 placeholder:text-gray-400',
        glassButton: darkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/40 border-white/30 hover:bg-white/60',
        buttonPrimary: darkMode
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-900/40'
            : 'bg-white text-indigo-700 shadow-xl shadow-indigo-500/20',
        buttonSecondary: darkMode
            ? 'bg-indigo-800/40 text-white border border-indigo-400/20 hover:bg-indigo-800/60'
            : 'bg-indigo-600/10 text-indigo-700 border border-indigo-200/20 hover:bg-indigo-600/20',
    };

    const renderWelcome = () => (
        <div className="text-center space-y-6">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="relative inline-block"
            >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-indigo-500/50 mx-auto transform -rotate-6">
                    <span className="text-white font-black text-4xl">N</span>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-lg shadow-lg rotate-12"
                >
                    <Sparkles className="w-5 h-5 text-amber-900" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
            >
                <h1 className={`text-3xl font-black tracking-tight ${theme.text} italic`}>NKAP</h1>
                <p className={`font-medium ${theme.textSecondary}`}>Le logiciel qui protège ton argent.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8 space-y-3"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick(() => { setIsLogin(false); nextStep('name'); })}
                    className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    Créer mon compte <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleClick(() => { setIsLogin(true); setStep('phone'); })}
                    className={`w-full py-4 ${theme.buttonSecondary} rounded-2xl font-semibold transition-all`}
                >
                    J'ai déjà un compte
                </motion.button>
            </motion.div>
        </div>
    );

    const renderNameStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`${theme.glass} rounded-3xl p-6 space-y-6`}
        >
            <button onClick={() => prevStep('welcome')} className={`p-2 -ml-2 hover:opacity-70 transition-colors ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className={`text-2xl font-bold ${theme.text}`}>Comment t'appelles-tu ?</h2>
                <p className={`text-sm ${theme.textSecondary}`}>Utilise ton vrai nom ou le nom de ta boutique.</p>
                <input
                    autoFocus
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Boutique Harmony ou Jean NDONGO"
                    className={`w-full ${theme.glassInput} border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg`}
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!formData.name}
                    onClick={() => handleClick(() => nextStep('phone'))}
                    className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Continuer
                </motion.button>
            </div>
        </motion.div>
    );

    const renderPhoneStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`${theme.glass} rounded-3xl p-6 space-y-6`}
        >
            <button onClick={() => prevStep('name')} className={`p-2 -ml-2 hover:opacity-70 transition-colors ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className={`text-2xl font-bold ${theme.text}`}>{isLogin ? 'Content de te revoir !' : 'Ton numéro WhatsApp'}</h2>
                <p className={`text-sm ${theme.textSecondary}`}>{isLogin ? 'Connecte-toi pour surveiller tes boutiques' : 'C\'est ici que tu recevras tes alertes de sécurité.'}</p>

                {/* Country selector */}
                <div className="relative">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className={`${theme.glassInput} border rounded-2xl px-4 py-4 flex items-center gap-2 font-bold min-w-[100px] hover:opacity-80 transition-all`}
                        >
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.code}</span>
                        </button>
                        <input
                            autoFocus
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="6XX XXX XXX"
                            className={`flex-1 ${theme.glassInput} border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg`}
                        />
                    </div>

                    {/* Country dropdown */}
                    <AnimatePresence>
                        {showCountryDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl shadow-xl ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-100'}`}
                            >
                                {countries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => {
                                            setFormData({ ...formData, countryCode: country.code });
                                            setShowCountryDropdown(false);
                                        }}
                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-indigo-500/10 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'} ${formData.countryCode === country.code ? 'bg-indigo-500/20' : ''}`}
                                    >
                                        <span>{country.flag}</span>
                                        <span className="font-medium">{country.name}</span>
                                        <span className="ml-auto text-indigo-400">{country.code}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={formData.phone.length < 9}
                    onClick={() => handleClick(() => nextStep('password'))}
                    className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {isLogin ? 'Se connecter' : 'Protéger mon compte'}
                </motion.button>
            </div>
        </motion.div>
    );

    const renderPasswordStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`${theme.glass} rounded-3xl p-6 space-y-6`}
        >
            <button onClick={() => prevStep('phone')} className={`p-2 -ml-2 hover:opacity-70 transition-colors ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className={`text-2xl font-bold ${theme.text}`}>{isLogin ? 'Tape ton code secret' : 'Choisis un code secret'}</h2>
                <p className={`text-sm ${theme.textSecondary}`}>{isLogin ? 'Pour accéder à ton tableau de bord' : 'Mémorise-le bien, il protège tes finances.'}</p>

                {/* Password input with show/hide toggle */}
                <div className="relative">
                    <input
                        autoFocus
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full ${theme.glassInput} border rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-colors ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
                {isLogin ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={formData.password.length < 4 || loading || isPreventMultiClick}
                        onClick={handleLogin}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Ouvrir ma boutique <Sparkles className="w-5 h-5" /></>
                        )}
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={formData.password.length < 4 || loading || isPreventMultiClick}
                        onClick={handleFinish}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>C'est parti ! <Sparkles className="w-5 h-5" /></>
                        )}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );

    const renderSuccess = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
        >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <CheckCircle2 className="w-16 h-16" />
                </motion.div>
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Félicitations !</h2>
                <p className="text-indigo-200 text-lg">Ton empire Nkap est prêt.</p>
            </div>
            <p className="text-indigo-200/60">
                Tu vas maintenant accéder à ton tableau de bord pour sécuriser ton business.
            </p>
            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePostRegisterLogin}
                disabled={loading || isPreventMultiClick}
                className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? (
                    <div className="w-6 h-6 border-3 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                ) : (
                    'Ouvrir mon business'
                )}
            </motion.button>
        </motion.div>
    );

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.bg}`}>
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 blur-[100px]" />

            {/* Theme toggle */}
            <button
                onClick={toggleDarkMode}
                className={`absolute top-4 right-4 p-3 rounded-full ${darkMode ? 'glass-dark' : 'glass'} hover:opacity-80 transition-all z-[110]`}
            >
                {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>

            <div className="w-full max-w-md relative">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full"
                    >
                        {step === 'welcome' && renderWelcome()}
                        {step === 'name' && renderNameStep()}
                        {step === 'phone' && renderPhoneStep()}
                        {step === 'password' && renderPasswordStep()}
                        {step === 'success' && renderSuccess()}
                    </motion.div>
                </AnimatePresence>

                {step !== 'welcome' && step !== 'success' && (
                    <div className="flex gap-2 justify-center mt-8">
                        {['name', 'phone', 'password'].map((s) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-indigo-500' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}