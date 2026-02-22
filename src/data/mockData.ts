export interface Boutique {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  todayRevenue: number;
  monthRevenue: number;
  profit: number;
  stockValue: number;
  employees: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  boutiqueId: string;
  image?: string;
  trending: 'up' | 'down' | 'stable';
  salesLast7d: number;
}

export interface Sale {
  id: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  boutiqueId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  paymentMethod: 'cash' | 'momo' | 'om';
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: string;
  boutiqueId: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'action' | 'info';
  icon: string;
  title: string;
  message: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface Debt {
  id: string;
  type: 'supplier' | 'client';
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'partial';
}

export const boutiques: Boutique[] = [
  { id: 'b1', name: 'Boutique Marché Central', location: 'Douala - Marché Central', status: 'online', todayRevenue: 285000, monthRevenue: 7850000, profit: 1820000, stockValue: 4500000, employees: 3 },
  { id: 'b2', name: 'Dépôt Boissons Akwa', location: 'Douala - Akwa', status: 'online', todayRevenue: 425000, monthRevenue: 11200000, profit: 2650000, stockValue: 8200000, employees: 4 },
  { id: 'b3', name: 'Quincaillerie Bépanda', location: 'Douala - Bépanda', status: 'offline', todayRevenue: 0, monthRevenue: 5400000, profit: 980000, stockValue: 6800000, employees: 2 },
];

export const products: Product[] = [
  { id: 'p1', name: 'Bière 33 Export (casier)', category: 'Boissons', buyPrice: 7500, sellPrice: 9000, stock: 45, minStock: 20, boutiqueId: 'b2', trending: 'up', salesLast7d: 120 },
  { id: 'p2', name: 'Riz Uncle Ben\'s 5kg', category: 'Alimentaire', buyPrice: 3200, sellPrice: 4000, stock: 8, minStock: 15, boutiqueId: 'b1', trending: 'up', salesLast7d: 35 },
  { id: 'p3', name: 'Ciment CIMENCAM 50kg', category: 'Construction', buyPrice: 4800, sellPrice: 5500, stock: 120, minStock: 30, boutiqueId: 'b3', trending: 'stable', salesLast7d: 18 },
  { id: 'p4', name: 'Huile Diamaor 5L', category: 'Alimentaire', buyPrice: 4500, sellPrice: 5500, stock: 3, minStock: 10, boutiqueId: 'b1', trending: 'up', salesLast7d: 28 },
  { id: 'p5', name: 'Coca-Cola 1.5L (pack 6)', category: 'Boissons', buyPrice: 3000, sellPrice: 3600, stock: 62, minStock: 25, boutiqueId: 'b2', trending: 'stable', salesLast7d: 45 },
  { id: 'p6', name: 'Savon Azur (carton)', category: 'Hygiène', buyPrice: 8000, sellPrice: 10000, stock: 15, minStock: 8, boutiqueId: 'b1', trending: 'down', salesLast7d: 5 },
  { id: 'p7', name: 'Fer à béton 10mm', category: 'Construction', buyPrice: 3500, sellPrice: 4200, stock: 200, minStock: 50, boutiqueId: 'b3', trending: 'up', salesLast7d: 30 },
  { id: 'p8', name: 'Malta Guinness (casier)', category: 'Boissons', buyPrice: 6500, sellPrice: 8000, stock: 28, minStock: 15, boutiqueId: 'b2', trending: 'up', salesLast7d: 55 },
  { id: 'p9', name: 'Sucre en poudre 1kg', category: 'Alimentaire', buyPrice: 800, sellPrice: 1000, stock: 50, minStock: 20, boutiqueId: 'b1', trending: 'stable', salesLast7d: 40 },
  { id: 'p10', name: 'Peinture Seigneurie 4L', category: 'Construction', buyPrice: 12000, sellPrice: 15000, stock: 5, minStock: 3, boutiqueId: 'b3', trending: 'down', salesLast7d: 2 },
  { id: 'p11', name: 'Lait Nido 900g', category: 'Alimentaire', buyPrice: 4200, sellPrice: 5200, stock: 2, minStock: 8, boutiqueId: 'b1', trending: 'up', salesLast7d: 22 },
  { id: 'p12', name: 'Top Ananas (casier)', category: 'Boissons', buyPrice: 5000, sellPrice: 6500, stock: 35, minStock: 10, boutiqueId: 'b2', trending: 'stable', salesLast7d: 20 },
];

export const recentSales: Sale[] = [
  { id: 's1', items: [{ productId: 'p1', name: 'Bière 33 Export', qty: 3, price: 9000 }], total: 27000, boutiqueId: 'b2', employeeId: 'e1', employeeName: 'Jean', date: '2025-01-15T14:30:00', paymentMethod: 'cash' },
  { id: 's2', items: [{ productId: 'p2', name: 'Riz Uncle Ben\'s', qty: 2, price: 4000 }, { productId: 'p9', name: 'Sucre 1kg', qty: 5, price: 1000 }], total: 13000, boutiqueId: 'b1', employeeId: 'e2', employeeName: 'Marie', date: '2025-01-15T13:15:00', paymentMethod: 'momo' },
  { id: 's3', items: [{ productId: 'p3', name: 'Ciment CIMENCAM', qty: 10, price: 5500 }], total: 55000, boutiqueId: 'b3', employeeId: 'e3', employeeName: 'Paul', date: '2025-01-15T11:45:00', paymentMethod: 'cash' },
  { id: 's4', items: [{ productId: 'p5', name: 'Coca-Cola 1.5L', qty: 4, price: 3600 }], total: 14400, boutiqueId: 'b2', employeeId: 'e1', employeeName: 'Jean', date: '2025-01-15T10:20:00', paymentMethod: 'om' },
  { id: 's5', items: [{ productId: 'p4', name: 'Huile Diamaor', qty: 1, price: 5500 }], total: 5500, boutiqueId: 'b1', employeeId: 'e2', employeeName: 'Marie', date: '2025-01-15T09:00:00', paymentMethod: 'cash' },
];

export const expenses: Expense[] = [
  { id: 'ex1', label: 'Loyer Marché Central', amount: 150000, category: 'Loyer', boutiqueId: 'b1', date: '2025-01-01' },
  { id: 'ex2', label: 'Transport marchandises', amount: 45000, category: 'Transport', boutiqueId: 'b2', date: '2025-01-10' },
  { id: 'ex3', label: 'Salaire Jean', amount: 80000, category: 'Salaires', boutiqueId: 'b2', date: '2025-01-05' },
  { id: 'ex4', label: 'Électricité Bépanda', amount: 35000, category: 'Charges', boutiqueId: 'b3', date: '2025-01-08' },
  { id: 'ex5', label: 'Réparation étagères', amount: 25000, category: 'Maintenance', boutiqueId: 'b1', date: '2025-01-12' },
];

export const debts: Debt[] = [
  { id: 'd1', type: 'supplier', name: 'Brasseries du Cameroun', amount: 850000, dueDate: '2025-01-20', status: 'pending' },
  { id: 'd2', type: 'supplier', name: 'CIMENCAM', amount: 480000, dueDate: '2025-01-15', status: 'overdue' },
  { id: 'd3', type: 'client', name: 'Maman Ngono', amount: 35000, dueDate: '2025-01-25', status: 'pending' },
  { id: 'd4', type: 'client', name: 'Papa Fotso', amount: 120000, dueDate: '2025-01-10', status: 'overdue' },
  { id: 'd5', type: 'client', name: 'Restaurant Le Délice', amount: 250000, dueDate: '2025-02-01', status: 'partial' },
];

export const aiInsights: AIInsight[] = [
  { id: 'ai1', type: 'warning', icon: '🚨', title: 'Rupture imminente', message: 'Le Lait Nido 900g sera en rupture demain à Marché Central. Il reste seulement 2 unités et tu vends 3/jour en moyenne.', action: 'Commander maintenant', priority: 'high', timestamp: '2025-01-15T14:00:00' },
  { id: 'ai2', type: 'opportunity', icon: '💰', title: 'Produit très rentable', message: 'La Malta Guinness génère 23% de marge et ses ventes augmentent de 15% cette semaine. Augmente ton stock !', action: 'Voir détails', priority: 'medium', timestamp: '2025-01-15T13:30:00' },
  { id: 'ai3', type: 'warning', icon: '⚠️', title: 'Crédits clients en hausse', message: 'Tes crédits clients ont augmenté de 45% ce mois. Papa Fotso doit 120 000 FCFA depuis 5 jours. Relance-le.', action: 'Voir crédits', priority: 'high', timestamp: '2025-01-15T12:00:00' },
  { id: 'ai4', type: 'action', icon: '📦', title: 'Commande Riz demain', message: 'Le Riz Uncle Ben\'s 5kg se vend 5 fois/jour. Avec 8 en stock, il faut commander demain matin au plus tard.', action: 'Préparer commande', priority: 'high', timestamp: '2025-01-15T11:00:00' },
  { id: 'ai5', type: 'info', icon: '📊', title: 'Boutique Akwa performe', message: 'Le Dépôt Boissons Akwa a fait +18% de CA cette semaine vs la semaine dernière. Jean vend très bien !', priority: 'low', timestamp: '2025-01-15T10:00:00' },
  { id: 'ai6', type: 'warning', icon: '💸', title: 'Produit qui bloque ton cash', message: 'La Peinture Seigneurie 4L est en stock depuis 45 jours avec seulement 2 ventes. 60 000 FCFA bloqués.', action: 'Faire une promo', priority: 'medium', timestamp: '2025-01-15T09:00:00' },
  { id: 'ai7', type: 'opportunity', icon: '🎯', title: 'Fournisseur CIMENCAM', message: 'Ta dette CIMENCAM de 480 000 FCFA est en retard. Paie vite pour garder tes conditions de prix.', action: 'Programmer paiement', priority: 'high', timestamp: '2025-01-15T08:00:00' },
];

export const revenueData = [
  { day: 'Lun', revenue: 580000, expenses: 120000, profit: 460000 },
  { day: 'Mar', revenue: 620000, expenses: 95000, profit: 525000 },
  { day: 'Mer', revenue: 490000, expenses: 180000, profit: 310000 },
  { day: 'Jeu', revenue: 710000, expenses: 110000, profit: 600000 },
  { day: 'Ven', revenue: 850000, expenses: 130000, profit: 720000 },
  { day: 'Sam', revenue: 920000, expenses: 150000, profit: 770000 },
  { day: 'Dim', revenue: 380000, expenses: 80000, profit: 300000 },
];

export const monthlyData = [
  { month: 'Sep', revenue: 18500000 },
  { month: 'Oct', revenue: 21200000 },
  { month: 'Nov', revenue: 19800000 },
  { month: 'Déc', revenue: 28500000 },
  { month: 'Jan', revenue: 24450000 },
];

export const categoryBreakdown = [
  { name: 'Boissons', value: 45, color: '#6366f1' },
  { name: 'Alimentaire', value: 28, color: '#10b981' },
  { name: 'Construction', value: 18, color: '#f59e0b' },
  { name: 'Hygiène', value: 9, color: '#ec4899' },
];

export const formatCFA = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}K`;
  }
  return amount.toLocaleString('fr-FR');
};

export const formatCFAFull = (amount: number): string => {
  return amount.toLocaleString('fr-FR') + ' FCFA';
};
