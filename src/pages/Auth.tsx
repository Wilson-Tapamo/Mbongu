import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ShieldCheck, User, Phone, Lock,
    Store, ChevronLeft, Sparkles, CheckCircle2
} from 'lucide-react';
import { useStore } from '../store';

type Step = 'welcome' | 'name' | 'phone' | 'password' | 'role' | 'success';

export default function Auth() {
    const [step, setStep] = useState<Step>('welcome');
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'seller' as 'director' | 'seller'
    });
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState('');
    const { login } = useStore();

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
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
            setStep('success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion');
            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // After successful registration, auto-login
    const handlePostRegisterLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
            login(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderWelcome = () => (
        <div className="text-center space-y-6">
            <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-indigo-500/50 mx-auto transform -rotate-6">
                    <span className="text-white font-black text-4xl">M</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-lg shadow-lg rotate-12">
                    <Sparkles className="w-5 h-5 text-amber-900" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-white italic">MBONGU</h1>
                <p className="text-indigo-200/80 font-medium">Le logiciel qui protège ton argent.</p>
            </div>

            <div className="pt-8 space-y-3">
                <button
                    onClick={() => { setIsLogin(false); nextStep('name'); }}
                    className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    Créer mon compte <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => { setIsLogin(true); setStep('phone'); }}
                    className="w-full py-4 bg-indigo-800/40 text-white border border-indigo-400/20 rounded-2xl font-semibold hover:bg-indigo-800/60 transition-all"
                >
                    J'ai déjà un compte
                </button>
            </div>
        </div>
    );

    const renderNameStep = () => (
        <div className="space-y-6">
            <button onClick={() => prevStep('welcome')} className="p-2 -ml-2 text-indigo-300 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Comment t'appelles-tu ?</h2>
                <p className="text-indigo-200/60 text-sm">Utilise ton vrai nom ou le nom de ta boutique.</p>
                <input
                    autoFocus
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Boutique Harmony ou Jean NDONGO"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                />
                <button
                    disabled={!formData.name}
                    onClick={() => nextStep('phone')}
                    className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Continuer
                </button>
            </div>
        </div>
    );

    const renderPhoneStep = () => (
        <div className="space-y-6">
            <button onClick={() => prevStep('name')} className="p-2 -ml-2 text-indigo-300 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{isLogin ? 'Content de te revoir !' : 'Ton numéro WhatsApp'}</h2>
                <p className="text-indigo-200/60 text-sm">{isLogin ? 'Connecte-toi pour surveiller tes boutiques' : 'C\'est ici que tu recevras tes alertes de sécurité.'}</p>
                <div className="flex gap-3">
                    <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-white flex items-center font-bold">
                        +237
                    </div>
                    <input
                        autoFocus
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="6XX XXX XXX"
                        className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                    />
                </div>
                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
                <button
                    disabled={formData.phone.length < 9}
                    onClick={() => nextStep('password')}
                    className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Protéger mon compte
                </button>
            </div>
        </div>
    );

    const renderPasswordStep = () => (
        <div className="space-y-6">
            <button onClick={() => prevStep('phone')} className="p-2 -ml-2 text-indigo-300 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{isLogin ? 'Tape ton code secret' : 'Choisis un code secret'}</h2>
                <p className="text-indigo-200/60 text-sm">{isLogin ? 'Pour accéder à ton tableau de bord' : 'Mémorise-le bien, il protège tes finances.'}</p>
                <input
                    autoFocus
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                />
                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
                {isLogin ? (
                    <button
                        disabled={formData.password.length < 4 || loading}
                        onClick={handleLogin}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Ouvrir ma boutique <Sparkles className="w-5 h-5" /></>
                        )}
                    </button>
                ) : (
                    <button
                        disabled={formData.password.length < 4}
                        onClick={() => nextStep('role')}
                        className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Valider le code
                    </button>
                )}
            </div>
        </div>
    );

    const renderRoleStep = () => (
        <div className="space-y-6">
            <button onClick={() => prevStep('password')} className="p-2 -ml-2 text-indigo-300 hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Store className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quel est ton rôle ?</h2>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => setFormData({ ...formData, role: 'director' })}
                        className={`p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${formData.role === 'director' ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                        <div className={`p-2 rounded-xl ${formData.role === 'director' ? 'bg-amber-400 text-amber-900' : 'bg-white/10 text-white'}`}>
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Directeur / Patron</p>
                            <p className="text-xs text-indigo-200/60 mt-1">Gère plusieurs boutiques et voit tous les rapports.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setFormData({ ...formData, role: 'seller' })}
                        className={`p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${formData.role === 'seller' ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                        <div className={`p-2 rounded-xl ${formData.role === 'seller' ? 'bg-indigo-400 text-white' : 'bg-white/10 text-white'}`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Vendeur / Gérant</p>
                            <p className="text-xs text-indigo-200/60 mt-1">Enregistre les ventes et gère le stock d'une boutique.</p>
                        </div>
                    </button>
                </div>

                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}

                <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>C'est parti ! <Sparkles className="w-5 h-5" /></>
                    )}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6 py-8">
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
                <p className="text-indigo-200 text-lg">Ton empire Mbongu est prêt.</p>
            </div>
            <p className="text-indigo-200/60">
                Tu vas maintenant accéder à ton tableau de bord pour sécuriser ton business.
            </p>
            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <button
                onClick={handlePostRegisterLogin}
                disabled={loading}
                className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                {loading ? (
                    <div className="w-6 h-6 border-3 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                ) : (
                    'Ouvrir mon business'
                )}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0f]">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 blur-[100px]" />

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
                        {step === 'role' && renderRoleStep()}
                        {step === 'success' && renderSuccess()}
                    </motion.div>
                </AnimatePresence>

                {step !== 'welcome' && step !== 'success' && (
                    <div className="flex gap-2 justify-center mt-8">
                        {['name', 'phone', 'password', 'role'].map((s) => (
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