import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---

export type UserRole = 'director' | 'seller';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  shopId?: string; // If seller, linked to a specific shop
  email: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  shopId: string;
  image?: string;
}

export interface Sale {
  id: string;
  date: string;
  total: number;
  items: { productId: string; quantity: number; price: number; name: string }[];
  shopId: string;
  sellerId: string;
  paymentMethod: 'CASH' | 'MTN_MOMO' | 'ORANGE_MONEY';
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  shopId: string;
}

export type Page = 'dashboard' | 'pos' | 'stock' | 'finance' | 'ai' | 'team';

interface AppState {
  // UI State
  currentPage: Page;
  setPage: (page: Page) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Cart State
  cartItems: { productId: string; name: string; qty: number; price: number }[];
  addToCart: (item: { productId: string; name: string; qty: number; price: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showSaleSuccess: boolean;
  setShowSaleSuccess: (show: boolean) => void;

  // Data State
  currentUser: User | null;
  users: User[];
  shops: Shop[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];

  // Dashboard Stats
  stats: {
    revenue: number;
    expenses: number;
    profit: number;
    lowStockCount: number;
  } | null;
  isLoading: boolean;

  // Actions
  login: (userData: any) => void;
  logout: () => void;
  fetchData: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
  addShop: (shop: Omit<Shop, 'id'>) => void;

  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateStock: (productId: string, quantity: number) => void; // quantity can be negative
}

// --- Mock Data ---

const MOCK_SHOPS: Shop[] = [
  { id: '1', name: 'Boutique Mokolo', location: 'Marché Mokolo, Yaoundé' },
  { id: '2', name: 'Dépôt Akwa', location: 'Akwa, Douala' },
];

const MOCK_USERS: User[] = [
  { id: '1', name: 'Patron (Directeur)', role: 'director', email: 'boss@mbongu.cm' },
  { id: '2', name: 'Jean (Vendeur Mokolo)', role: 'seller', shopId: '1', email: 'jean@mbongu.cm' },
  { id: '3', name: 'Marie (Vendeur Akwa)', role: 'seller', shopId: '2', email: 'marie@mbongu.cm' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Ciment Dangote 50kg', category: 'Matériaux', price: 4800, cost: 4200, stock: 120, minStock: 20, shopId: '1', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Riz Parfumé 25kg', category: 'Alimentaire', price: 18500, cost: 16000, stock: 45, minStock: 10, shopId: '1', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Huile Mayor 1L', category: 'Alimentaire', price: 1200, cost: 950, stock: 200, minStock: 50, shopId: '2', image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Guinness PM', category: 'Boissons', price: 900, cost: 750, stock: 240, minStock: 48, shopId: '1', image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Savon Azur', category: 'Hygiène', price: 400, cost: 300, stock: 500, minStock: 100, shopId: '2', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=200' },
  { id: '6', name: 'Spaghetti Pasta', category: 'Alimentaire', price: 500, cost: 350, stock: 150, minStock: 30, shopId: '1', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=200' },
];

const MOCK_SALES: Sale[] = [
  { id: '1', date: new Date().toISOString(), total: 14400, items: [{ productId: '1', quantity: 3, price: 4800, name: 'Ciment Dangote' }], shopId: '1', sellerId: '2', paymentMethod: 'CASH' },
  { id: '2', date: new Date(Date.now() - 86400000).toISOString(), total: 18500, items: [{ productId: '2', quantity: 1, price: 18500, name: 'Riz Parfumé' }], shopId: '1', sellerId: '2', paymentMethod: 'MTN_MOMO' },
  { id: '3', date: new Date(Date.now() - 172800000).toISOString(), total: 2700, items: [{ productId: '4', quantity: 3, price: 900, name: 'Guinness PM' }], shopId: '1', sellerId: '2', paymentMethod: 'CASH' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: '1', date: new Date().toISOString(), description: 'Facture Électricité ENEO', amount: 25000, category: 'Charges', shopId: '1' },
  { id: '2', date: new Date(Date.now() - 432000000).toISOString(), description: 'Transport Marchandises', amount: 15000, category: 'Transport', shopId: '1' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI Defaults
      currentPage: 'dashboard',
      setPage: (page) => set({ currentPage: page }),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Cart Defaults
      cartItems: [],
      addToCart: (item) => set((state) => {
        const existing = state.cartItems.find(i => i.productId === item.productId);
        if (existing) {
          return { cartItems: state.cartItems.map(i => i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i) };
        }
        return { cartItems: [...state.cartItems, item] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cartItems: state.cartItems.filter(i => i.productId !== productId)
      })),
      clearCart: () => set({ cartItems: [] }),
      showSaleSuccess: false,
      setShowSaleSuccess: (show) => set({ showSaleSuccess: show }),

      // Data Defaults
      currentUser: null,
      users: MOCK_USERS,
      shops: MOCK_SHOPS,
      products: [],
      sales: [],
      expenses: [],
      stats: null,
      isLoading: false,

      // Actions
      login: (userData) => {
        set({ currentUser: userData as User });
        // Fetch data immediately after login
        get().fetchData();
      },
      logout: () => set({ currentUser: null, products: [], sales: [], expenses: [], stats: null }),

      fetchData: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        set({ isLoading: true });
        try {
          // Fetch Shops
          const shopsRes = await fetch(`/api/shops`);
          const shopsData = await shopsRes.json();

          // Fetch All Users (for Team management)
          const teamRes = await fetch(`/api/team`);
          const teamData = await teamRes.json();

          // If seller, fetch specific shop data
          const shopId = currentUser.shopId;
          let productsData = [];
          let statsData = null;
          let expensesData = [];

          if (shopId) {
            // Fetch Products
            const productsRes = await fetch(`/api/products?shopId=${shopId}`);
            productsData = await productsRes.json();

            // Fetch Summary
            const statsRes = await fetch(`/api/stats/summary?shopId=${shopId}`);
            statsData = await statsRes.json();

            // Fetch Recent Expenses
            const expensesRes = await fetch(`/api/expenses?shopId=${shopId}`);
            expensesData = await expensesRes.json();
          }

          set({
            shops: Array.isArray(shopsData) ? shopsData : [],
            users: Array.isArray(teamData) ? teamData : [],
            products: Array.isArray(productsData) ? productsData : [],
            stats: statsData,
            expenses: Array.isArray(expensesData) ? expensesData : [],
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to fetch data:", error);
          set({ isLoading: false });
        }
      },

      addUser: async (user) => {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        if (res.ok) {
          get().fetchData();
        }
      },
      removeUser: async (userId) => {
        const res = await fetch(`/api/team?id=${userId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          get().fetchData();
        }
      },
      addShop: async (shop) => {
        const res = await fetch('/api/shops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shop)
        });
        if (res.ok) {
          get().fetchData();
        }
      },

      addProduct: async (product) => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        if (res.ok) {
          get().fetchData(); // Refresh data
        }
      },
      addSale: async (sale) => {
        // Will implement POST /api/sales later, for now refresh
        const res = await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sale)
        });
        if (res.ok) {
          get().fetchData();
        }
      },
      addExpense: async (expense) => {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense)
        });
        if (res.ok) {
          get().fetchData();
        }
      },
      updateStock: (productId, quantity) => set((state) => ({
        products: state.products.map(p =>
          p.id === productId ? { ...p, stock: p.stock + quantity } : p
        )
      })),
    }),
    {
      name: 'mbongu-storage',
    }
  )
);
