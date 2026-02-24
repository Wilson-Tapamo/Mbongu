import { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard, Users, ArrowDownCircle,
  ArrowUpCircle, Plus, ChevronRight, Clock, AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

const formatCFA = (price: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

const formatCFAFull = formatCFA;

export function Finance() {
  const { darkMode, expenses, addExpense, currentUser, stats } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'debts'>('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Add Expense State
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });

  const handleAddExpense = async () => {
    if (newExpense.description && newExpense.amount && newExpense.category && currentUser?.shopId) {
      await addExpense({
        date: new Date().toISOString(),
        description: newExpense.description,
        amount: Number(newExpense.amount),
        category: newExpense.category,
        shopId: currentUser.shopId
      });
      setShowAddExpense(false);
      setNewExpense({ description: '', amount: '', category: '' });
    }
  };

  const displayRevenue = stats?.revenue || 0;
  const totalExpenses = stats?.expenses || 0;
  const displayProfit = stats?.profit || 0;

  // Debts (Mock as placeholder until schema update)
  interface Debt {
    id: string;
    name: string;
    amount: number;
    type: 'supplier' | 'client';
    status: 'overdue' | 'pending' | 'partial';
    dueDate: string;
  }

  const debts: Debt[] = [
    { id: '1', name: 'SABC Cameroon', amount: 450000, type: 'supplier', status: 'overdue', dueDate: '2023-10-15' },
    { id: '2', name: 'Boulangerie du Centre', amount: 125000, type: 'supplier', status: 'pending', dueDate: '2023-10-30' },
    { id: '3', name: 'Hôtel Splendid (Kribi)', amount: 85000, type: 'client', status: 'overdue', dueDate: '2023-10-10' },
  ];

  const supplierDebts = debts.filter(d => d.type === 'supplier').reduce((s, d) => s + d.amount, 0);
  const clientDebts = debts.filter(d => d.type === 'client').reduce((s, d) => s + d.amount, 0);
  const overdueDebts = debts.filter(d => d.status === 'overdue');

  // Cashflow Data (Mock fallback)
  const cashflowData = [
    { day: 'Lun', revenue: 120000, expenses: 80000 },
    { day: 'Mar', revenue: 150000, expenses: 95000 },
    { day: 'Mer', revenue: 130000, expenses: 110000 },
    { day: 'Jeu', revenue: 180000, expenses: 70000 },
    { day: 'Ven', revenue: 220000, expenses: 140000 },
    { day: 'Sam', revenue: 300000, expenses: 120000 },
    { day: 'Dim', revenue: 250000, expenses: 90000 },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Vue globale' },
    { id: 'expenses' as const, label: 'Dépenses' },
    { id: 'debts' as const, label: 'Dettes & Crédits' },
  ];

  return (
    <div className="space-y-4 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Finances</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suivi de votre argent</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Revenus (Global)', value: formatCFA(displayRevenue), change: '+8%', icon: ArrowUpCircle, positive: true, gradient: 'from-emerald-500 to-teal-600' },
          { label: 'Dépenses ce mois', value: formatCFA(totalExpenses), change: '-3%', icon: ArrowDownCircle, positive: false, gradient: 'from-rose-500 to-pink-600' },
          { label: 'Dettes fournisseurs', value: formatCFA(supplierDebts), change: `${overdueDebts.filter(d => d.type === 'supplier').length} en retard`, icon: CreditCard, positive: false, gradient: 'from-amber-500 to-orange-600' },
          { label: 'Crédits clients', value: formatCFA(clientDebts), change: `${overdueDebts.filter(d => d.type === 'client').length} alertes`, icon: Users, positive: false, gradient: 'from-indigo-500 to-purple-600' },
        ].map((card, i) => (
          <div key={i} className={`rounded-2xl p-4 transition-all hover:scale-[1.02] ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
            <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${card.gradient} mb-2 shadow-lg shadow-indigo-500/20`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {card.positive ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
              <span className={`text-xs ${card.positive ? 'text-emerald-500' : 'text-rose-500'}`}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex rounded-2xl p-1 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? (darkMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-900 shadow-sm') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          {/* Profit Card */}
          <div className={`rounded-2xl p-5 bg-gradient-to-br ${darkMode ? 'glass-card-dark from-emerald-900/30 to-teal-900/30 border-emerald-700/30' : 'glass-card from-emerald-50/50 to-teal-50/50 border-emerald-200/50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className={`text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Profit estimé ce mois</span>
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-emerald-800'}`}>{formatCFA(displayProfit)}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>Marge nette: {displayRevenue > 0 ? ((displayProfit / displayRevenue) * 100).toFixed(1) : 0}%</p>
          </div>

          {/* Cashflow Chart */}
          <div className={`rounded-2xl p-5 ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
            <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cashflow de la semaine</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Entrées vs sorties</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCFA(v)} dx={-10} />
                  <Tooltip formatter={(value) => formatCFAFull(Number(value))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)', backgroundColor: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Entrées" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Sorties" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
          {expenses.map((expense) => (
            <div key={expense.id} className={`rounded-2xl p-4 transition-all ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${expense.category === 'Loyer' ? 'bg-indigo-100 text-indigo-600' :
                    expense.category === 'Salaires' ? 'bg-emerald-100 text-emerald-600' :
                      expense.category === 'Transport' ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {expense.category === 'Loyer' ? '🏠' : expense.category === 'Salaires' ? '👤' : expense.category === 'Transport' ? '🚚' : expense.category === 'Charges' ? '⚡' : '🔧'}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{expense.description}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{expense.category} • {new Date(expense.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <p className="text-rose-500 font-bold text-sm">-{formatCFAFull(expense.amount)}</p>
              </div>
            </div>
          ))}
          <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="text-sm">Total: <span className="font-bold text-rose-500">{formatCFAFull(totalExpenses)}</span></p>
          </div>
        </div>
      )}

      {/* Debts Tab */}
      {activeTab === 'debts' && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          {/* Supplier Debts */}
          <div>
            <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <ArrowUpCircle className="w-4 h-4 text-rose-500" /> Dettes fournisseurs
            </h3>
            <div className="space-y-3">
              {debts.filter(d => d.type === 'supplier').map(debt => (
                <div key={debt.id} className={`rounded-2xl p-4 border-l-4 ${debt.status === 'overdue' ? 'border-l-rose-500' : 'border-l-amber-500'
                  } ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{debt.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${debt.status === 'overdue' ? 'text-rose-500 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {debt.status === 'overdue' ? '⚠️ En retard' : `Échéance: ${new Date(debt.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-rose-500 font-bold">{formatCFAFull(debt.amount)}</p>
                      <button className="text-xs text-indigo-500 font-medium mt-1 flex items-center gap-0.5">
                        Payer <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Credits */}
          <div>
            <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <ArrowDownCircle className="w-4 h-4 text-amber-500" /> Crédits clients
            </h3>
            <div className="space-y-3">
              {debts.filter(d => d.type === 'client').map(debt => (
                <div key={debt.id} className={`rounded-2xl p-4 border-l-4 ${debt.status === 'overdue' ? 'border-l-rose-500' : debt.status === 'partial' ? 'border-l-amber-500' : 'border-l-indigo-500'
                  } ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{debt.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {debt.status === 'overdue' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                        <span className={`text-xs ${debt.status === 'overdue' ? 'text-rose-500 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {debt.status === 'overdue' ? 'En retard — relancer' : debt.status === 'partial' ? 'Paiement partiel' : `Échéance: ${new Date(debt.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-bold">{formatCFAFull(debt.amount)}</p>
                      <button className="text-xs text-indigo-500 font-medium mt-1 flex items-center gap-0.5">
                        Relancer <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAddExpense(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl lg:rounded-3xl p-6 ${darkMode ? 'glass-card-dark' : 'glass-card'}`} onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ajouter une dépense</h3>
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/50 border-gray-200'}`}
                  placeholder="Ex: Transport marchandises"
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Montant (FCFA)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/50 border-gray-200'}`}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Catégorie</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Loyer', 'Salaires', 'Transport', 'Charges', 'Maintenance', 'Autre'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewExpense({ ...newExpense, category: cat })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${newExpense.category === cat ? 'bg-indigo-600 text-white border-indigo-600' : (darkMode ? 'border-gray-600 text-gray-300 hover:border-indigo-500' : 'border-gray-200 text-gray-600 hover:border-indigo-500')}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddExpense}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold transition-all hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] mt-2 shadow-lg shadow-indigo-500/30"
              >
                Enregistrer la dépense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
