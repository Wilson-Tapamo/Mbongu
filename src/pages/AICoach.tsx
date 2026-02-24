import { useState } from 'react';
import {
  Sparkles, ChevronRight, AlertTriangle, TrendingUp, Lightbulb,
  MessageCircle, Mic, Send, Clock, Package, DollarSign, Users
} from 'lucide-react';
import { aiInsights } from '../data/mockData';
import { useStore } from '../store';

export default function AICoach() {
  const { darkMode } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'warning' | 'opportunity' | 'action'>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "👋 Salut patron ! Je suis **Nkap Coach**, ton partenaire de croissance. Pose-moi n'importe quelle question sur ton business. \n\nPar exemple: \"Combien j'ai gagné cette semaine ?\" ou \"Quel produit bloque mon cash ?\"" }
  ]);

  const filtered = activeFilter === 'all' ? aiInsights : aiInsights.filter(i => i.type === activeFilter);

  const filters = [
    { id: 'all' as const, label: 'Tout', icon: Sparkles },
    { id: 'warning' as const, label: 'Alertes', icon: AlertTriangle },
    { id: 'opportunity' as const, label: 'Opportunités', icon: TrendingUp },
    { id: 'action' as const, label: 'Actions', icon: Lightbulb },
  ];

  const quickQuestions = [
    "Combien j'ai gagné aujourd'hui ?",
    "Quels produits commander ?",
    "Quelle boutique marche le mieux ?",
    "Mes crédits clients",
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let response = '';
      if (userMsg.toLowerCase().includes('gagn')) {
        response = "📊 Aujourd'hui, tu as fait 710 000 FCFA sur toutes tes boutiques.\n\n• Dépôt Akwa: 425 000 FCFA (+18%) 🔥\n• Marché Central: 285 000 FCFA\n• Bépanda: fermé aujourd'hui\n\nTu es en avance de 12% par rapport à hier. Continue comme ça ! 💪";
      } else if (userMsg.toLowerCase().includes('command')) {
        response = "📦 3 produits à commander en urgence:\n\n🔴 Lait Nido 900g — il en reste 2, tu en vends 3/jour\n🟡 Riz Uncle Ben's 5kg — stock à 8, minimum 15\n🟡 Huile Diamaor 5L — stock à 3, minimum 10\n\nJe te recommande de passer commande demain matin au plus tard.";
      } else if (userMsg.toLowerCase().includes('boutique') || userMsg.toLowerCase().includes('marche')) {
        response = "🏆 Le Dépôt Boissons Akwa est ta meilleure boutique ce mois:\n\n• CA: 11.2M FCFA (+18% vs semaine dernière)\n• Profit: 2.65M FCFA\n• Meilleur vendeur: Jean\n\nMaché Central est stable. Bépanda a baissé de 8% — à surveiller.";
      } else if (userMsg.toLowerCase().includes('crédit') || userMsg.toLowerCase().includes('dette')) {
        response = "⚠️ Tes crédits clients ont augmenté de 45% ce mois:\n\n🔴 Papa Fotso: 120 000 FCFA (5 jours de retard)\n🟡 Restaurant Le Délice: 250 000 FCFA (paiement partiel)\n🟢 Maman Ngono: 35 000 FCFA (dans les temps)\n\nTotal: 405 000 FCFA. Je te conseille de relancer Papa Fotso en priorité.";
      } else {
        response = "Je comprends ta question ! 🤔 Voici ce que je sais:\n\nTon business tourne bien ce mois avec 24.5M FCFA de CA sur 3 boutiques. Le profit estimé est de 5.45M FCFA (marge 22%).\n\nPose-moi une question plus précise, comme \"quel produit bloque mon cash ?\" ou \"compare mes boutiques\".";
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 800);
  };

  if (chatOpen) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] pb-24 lg:pb-0">
        {/* Chat Header */}
        <div className={`flex items-center justify-between p-4 rounded-t-2xl ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nkap Coach</p>
              <p className="text-xs text-emerald-500">Prêt à t'aider à décider</p>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white/40 text-gray-600 hover:bg-white/60'}`}>
            Alertes
          </button>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-black/10' : 'bg-white/10'}`}>
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-indigo-500/20'
                : darkMode ? 'glass-card-dark rounded-bl-sm text-gray-200' : 'glass-card rounded-bl-sm text-gray-800'
                }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className={`px-4 py-2 ${darkMode ? 'glass-dark' : 'glass'}`}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => { setChatInput(q); }} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${darkMode ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:border-indigo-500 hover:bg-white/50'}`}>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 ${darkMode ? 'glass-card-dark border-t border-white/5' : 'glass-card border-t border-white/40'}`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Pose ta question..."
              className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
            />
            <button className={`p-2 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}>
              <Mic className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={handleSendChat}
              className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>🧠 Coach IA</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ton assistant business intelligent</p>
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Summary */}
      <div className={`rounded-2xl p-5 bg-gradient-to-br ${darkMode ? 'glass-card-dark from-indigo-900/30 to-purple-900/30 border-indigo-700/30' : 'glass-card from-indigo-50/50 to-purple-50/50 border-indigo-200/50'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className={`font-semibold text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Résumé du jour — 15 Janvier</span>
        </div>
        <div className="space-y-2">
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            📈 <strong>Bonne journée !</strong> Tu as fait <strong>710K FCFA</strong> aujourd'hui sur 2 boutiques ouvertes.
          </p>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            🔥 Le Dépôt Akwa performe très bien cette semaine (+18%). Jean est ton meilleur vendeur.
          </p>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            ⚠️ <strong>3 actions urgentes</strong> à faire demain matin.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Package, value: '3', label: 'Ruptures', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
          { icon: TrendingUp, value: '+18%', label: 'Tendance', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { icon: DollarSign, value: '5.4M', label: 'Profit', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { icon: Users, value: '3', label: 'Crédits', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-3 text-center ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeFilter === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : darkMode ? 'glass-card-dark text-gray-400 hover:text-white' : 'glass-card text-gray-600 hover:text-gray-900'
            }`}>
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {filtered.map((insight) => (
          <div key={insight.id} className={`rounded-2xl p-4 transition-all hover:scale-[1.005] cursor-pointer border-l-4 ${insight.type === 'warning' ? 'border-l-amber-500' :
            insight.type === 'opportunity' ? 'border-l-emerald-500' :
              insight.type === 'action' ? 'border-l-indigo-500' : 'border-l-blue-500'
            } ${darkMode ? 'glass-card-dark hover:bg-white/5' : 'glass-card hover:bg-white/60'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${insight.priority === 'high' ? 'bg-rose-100 text-rose-700' : insight.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {insight.priority === 'high' ? 'Urgent' : insight.priority === 'medium' ? 'Important' : 'Info'}
                  </span>
                </div>
                <p className={`text-sm mt-1.5 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{insight.message}</p>
                <div className="flex items-center justify-between mt-3">
                  {insight.action && (
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-200 transition-colors">
                      {insight.action} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(insight.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat CTA */}
      <button
        onClick={() => setChatOpen(true)}
        className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] ${darkMode ? 'glass-card-dark bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-700/30' : 'glass-card bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-indigo-200/50'}`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="text-left flex-1">
          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pose une question à ton coach</p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>"Combien j'ai gagné ?" • "Que dois-je commander ?"</p>
        </div>
        <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </button>
    </div>
  );
}
