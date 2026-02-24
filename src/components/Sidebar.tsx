import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, Wallet, Sparkles, Store, Settings, LogOut, Sun, Moon, Wifi, WifiOff, Users, Building } from 'lucide-react';
import { useStore, Page } from '../store';
import { boutiques } from '../data/mockData';

export function Sidebar() {
  const {
    currentPage, setPage, darkMode, toggleDarkMode,
    sidebarOpen, setSidebarOpen, currentUser, logout, login, users
  } = useStore();

  const isDirector = currentUser?.role === 'director';

  const navItems = [
    { id: 'dashboard' as const, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'pos' as const, label: 'Point de vente', icon: ShoppingCart },
    { id: 'stock' as const, label: 'Stock', icon: Package },
    ...(isDirector ? [
      { id: 'finance' as const, label: 'Finances', icon: Wallet },
      { id: 'team' as const, label: 'Équipe & Boutiques', icon: Users },
    ] : []),
    { id: 'ai' as const, label: 'Coach IA', icon: Sparkles },
  ];

  // For Demo Purposes: Function to toggle between users
  const handleSwitchUser = () => {
    if (currentUser?.role === 'director') {
      const seller = users.find(u => u.role === 'seller');
      if (seller) login(seller);
    } else {
      const director = users.find(u => u.role === 'director');
      if (director) login(director);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-4 top-4 bottom-4 w-64 z-40 rounded-3xl transition-all duration-300 border-0 ${darkMode ? 'glass-dark' : 'glass'}`}>
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className={`font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nkap</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentUser?.role === 'director' ? 'Mode Directeur' : 'Mode Vendeur'}
              </p>
            </div>
          </div>
        </div>

        {/* User Info / Shop Info */}
        <div className="px-4 mb-4">
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${darkMode ? 'bg-white/5' : 'bg-white/40'}`}>
            <Store className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {currentUser?.role === 'director' ? 'Vue Globale' : 'Ma Boutique'}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id as Page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? `bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/50`
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Demo Switcher */}
        <div className="px-4 py-2">
          <button
            onClick={handleSwitchUser}
            className="w-full text-xs text-indigo-500 underline text-center"
          >
            Demo: Switch Role
          </button>
        </div>

        {/* Theme Toggle & Settings */}
        <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-white/20'}`}>
          <div className="flex items-center justify-between">
            <button onClick={toggleDarkMode} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-white/40 text-gray-600'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Clair' : 'Sombre'}
            </button>
            <button className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-white/40 text-gray-600'}`}>
              <LogOut className="w-4 h-4" onClick={() => logout()} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
