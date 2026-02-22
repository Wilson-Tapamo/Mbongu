import {
  TrendingUp, TrendingDown, Store, Package, AlertTriangle,
  ChevronRight, Sparkles, ShoppingCart, BarChart3, DollarSign
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '../store';

const formatCFA = (price: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

export function Dashboard() {
  const { darkMode, setPage, sales, products, currentUser, stats, isLoading } = useStore();

  // Filter data based on role
  const isDirector = currentUser?.role === 'director';

  // KPIs from Real Stats (Backend) or Fallback to calculations
  const displayRevenue = stats?.revenue || 0;
  const displayProfit = stats?.profit || 0;
  const lowStockCount = stats?.lowStockCount || 0;

  // Local calculations for real-time feel (optional, but keep for now)
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Chart Data Preparation (Mocked/Calculated)
  const revenueData = [
    { day: 'Lun', revenue: displayRevenue * 0.1, profit: displayProfit * 0.1 },
    { day: 'Mar', revenue: displayRevenue * 0.15, profit: displayProfit * 0.15 },
    { day: 'Mer', revenue: displayRevenue * 0.12, profit: displayProfit * 0.12 },
    { day: 'Jeu', revenue: displayRevenue * 0.2, profit: displayProfit * 0.2 },
    { day: 'Ven', revenue: displayRevenue * 0.25, profit: displayProfit * 0.25 },
    { day: 'Sam', revenue: displayRevenue * 0.3, profit: displayProfit * 0.3 },
    { day: 'Dim', revenue: todayRevenue, profit: todayRevenue * 0.2 }, // Today
  ];

  // Category Data from real sales
  const categoryCount: Record<string, number> = {};
  sales.forEach(s => {
    s.items.forEach(i => {
      const p = products.find(prod => prod.id === i.productId);
      if (p) {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + (Number(i.price) * i.quantity);
      }
    });
  });

  const categoryBreakdown = Object.entries(categoryCount).map(([name, value], index) => ({
    name,
    value: Math.round((value / (displayRevenue || 1)) * 100),
    color: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'][index % 4]
  }));

  if (categoryBreakdown.length === 0) {
    categoryBreakdown.push({ name: 'Aucune donnée', value: 100, color: '#e5e7eb' });
  }

  const kpiCards = [
    { label: "Ventes aujourd'hui", value: formatCFA(todayRevenue), sub: `${todaySales.length} commandes`, icon: ShoppingCart, color: 'from-indigo-500 to-purple-600', trend: 'up' },
    { label: 'CA Global', value: formatCFA(displayRevenue), sub: 'Cumulé', icon: BarChart3, color: 'from-emerald-500 to-teal-600', trend: 'up' },
    { label: 'Profit Net', value: formatCFA(displayProfit), sub: 'Marge réelle', icon: DollarSign, color: 'from-amber-500 to-orange-600', trend: 'up' },
    { label: 'Alertes Stock', value: lowStockCount, sub: 'Produits critiques', icon: Package, color: 'from-rose-500 to-pink-600', trend: 'down' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* AI Summary Banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.01] ${darkMode ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-700/50' : 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-xl shadow-indigo-300/40'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
        <div className="absolute bottom-0 left-20 w-20 h-20 bg-white/10 rounded-full -mb-8 blur-lg" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-indigo-100 text-sm font-medium">Mbongu Coach • Résumé</span>
          </div>
          <p className="text-white text-base lg:text-lg font-medium leading-relaxed">
            Bonjour {currentUser?.name.split(' ')[0]} ! Aujourd'hui : <span className="text-amber-300 font-bold">{formatCFA(todayRevenue)}</span> de ventes.
            {lowStockProducts.length > 0 ? ` Attention, ${lowStockProducts.length} produits sont presque en rupture.` : ' Stock stable.'}
          </p>
          <button
            onClick={() => setPage('ai')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all backdrop-blur-md border border-white/20"
          >
            Conseils IA <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className={`rounded-2xl p-4 lg:p-5 transition-all hover:scale-[1.02] cursor-pointer ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} mb-3 shadow-lg shadow-indigo-500/20`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-xs lg:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.label}</p>
            <p className={`text-xl lg:text-2xl font-bold mt-0.5 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
              <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Revenue Chart */}
        <div className={`lg:col-span-2 rounded-2xl p-5 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Évolution des ventes</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Semaine en cours</p>
            </div>
          </div>
          <div className="h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} dx={-10} />
                <Tooltip formatter={(value) => formatCFA(Number(value))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)', backgroundColor: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#colorRevenue)" name="Ventes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={`rounded-2xl p-5 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Catégories</h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top ventes du mois</p>
          <div className="h-40 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2 overflow-y-auto max-h-32 custom-scrollbar">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.name}</span>
                </div>
                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Director Only: Multi-Shop View */}
      {isDirector && (
        <div className={`rounded-2xl p-5 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance Boutiques</h3>
            <Store className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useStore.getState().shops.map(shop => {
              const shopSales = sales.filter(s => s.shopId === shop.id && s.date.startsWith(today));
              const shopTotal = shopSales.reduce((sum, s) => sum + s.total, 0);
              return (
                <div key={shop.id} className={`p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{shop.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{shop.location}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aujourd'hui</p>
                    <p className="text-lg font-bold text-indigo-500">{formatCFA(shopTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className={`rounded-2xl p-5 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alertes stock</h3>
            </div>
            <button onClick={() => setPage('stock')} className="text-indigo-500 text-sm font-medium">Voir stock</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map((p) => (
              <div key={p.id} className={`rounded-xl p-3 flex items-center gap-3 ${darkMode ? 'bg-amber-900/10 border border-amber-700/20' : 'bg-amber-50/50 border border-amber-100/50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${p.stock <= 3 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                  {p.stock}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Min: {p.minStock} • {useStore.getState().shops.find(s => s.id === p.shopId)?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
