import { useState, useEffect } from 'react';
import { Menu, Bell, ChevronDown, Wifi, WifiOff, Sun, Moon } from 'lucide-react';
import { useStore } from './store';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Stock } from './pages/Stock';
import { Finance } from './pages/Finance';
import AICoach from './pages/AICoach';
import Team from './pages/Team';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

import Auth from './pages/Auth';

export function App() {
  const { currentPage, darkMode, toggleDarkMode, setSidebarOpen, currentUser } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Conditional Rendering: If not logged in, show Auth exclusively
  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen font-[Inter,sans-serif] transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 text-gray-900'}`}>

      {/* Background Decor */}
      <div className={`fixed inset-0 z-0 pointer-events-none ${darkMode ? 'opacity-30' : 'opacity-60'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-teal-400/20 blur-[120px]" />
      </div>

      <Sidebar />

      {/* Top Bar */}
      <header className={`fixed top-4 left-4 right-4 lg:left-72 z-30 rounded-2xl transition-colors duration-300 ${darkMode ? 'glass-dark' : 'glass'}`}>
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl">
              <Menu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nkap</span>
            </div>
            {/* Desktop page title */}
            <div className="hidden lg:block">
              <h2 className={`font-semibold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPage}</h2>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? (darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50/50 text-emerald-600') : (darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50/50 text-amber-600')}`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </div>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}
            >
              <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-950" />
            </button>

            {/* Dark mode (mobile) */}
            <button onClick={toggleDarkMode} className={`lg:hidden p-2.5 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}>
              {darkMode ? <Sun className={`w-5 h-5 text-gray-400`} /> : <Moon className={`w-5 h-5 text-gray-600`} />}
            </button>

            {/* Profile */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.name?.substring(0, 2).toUpperCase() ?? 'PF'}
              </div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentUser?.name || 'Utilisateur'}
              </span>
              <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 lg:pl-72 lg:pr-6 lg:pt-24 pb-24 lg:pb-6 transition-all duration-300 relative z-10 h-screen overflow-y-auto custom-scrollbar">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'pos' && <POS />}
        {currentPage === 'stock' && <Stock />}
        {currentPage === 'finance' && <Finance />}
        {currentPage === 'ai' && <AICoach />}
        {currentPage === 'team' && <Team />}
      </main>

      <BottomNav />
    </div>
  );
}
