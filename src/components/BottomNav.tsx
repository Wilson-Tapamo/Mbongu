import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, Wallet, Sparkles, Users } from 'lucide-react';
import { useStore, Page } from '../store';

export function BottomNav() {
  const { currentPage, setPage, darkMode, currentUser } = useStore();
  
  const isDirector = currentUser?.role === 'director';

  const navItems = [
    { id: 'dashboard' as const, label: 'Accueil', icon: LayoutDashboard },
    { id: 'pos' as const, label: 'Vente', icon: ShoppingCart },
    { id: 'stock' as const, label: 'Stock', icon: Package },
    ...(isDirector ? [
      { id: 'finance' as const, label: 'Compta', icon: Wallet },
      // { id: 'team' as const, label: 'Équipe', icon: Users }, // Too many items for bottom nav, maybe exclude or put in a "Menu"
    ] : []),
    { id: 'ai' as const, label: 'IA', icon: Sparkles },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 rounded-2xl transition-colors duration-300 ${darkMode ? 'glass-dark' : 'glass'}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-0 ${
                isActive ? '' : 'opacity-60'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-300/40' : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
