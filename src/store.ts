import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---

export type UserRole = 'director' | 'seller';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  shopId?: string;
  email?: string; // ✅ optionnel - l'API ne le retourne pas toujours
  phone?: string; // ✅ ajouté - l'API retourne le phone
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
  currentPage: Page;
  setPage: (page: Page) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  cartItems: { productId: string; name: string; qty: number; price: number }[];
  addToCart: (item: { productId: string; name: string; qty: number; price: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showSaleSuccess: boolean;
  setShowSaleSuccess: (show: boolean) => void;

  currentUser: User | null;
  users: User[];
  shops: Shop[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];

  stats: {
    revenue: number;
    expenses: number;
    profit: number;
    lowStockCount: number;
  } | null;
  isLoading: boolean;

  login: (userData: any) => void;
  logout: () => void;
  fetchData: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (userId: string) => void;
  addShop: (shop: Omit<Shop, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateStock: (productId: string, quantity: number) => void;
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

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'dashboard',
      setPage: (page) => set({ currentPage: page }),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

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

      currentUser: null,
      users: MOCK_USERS,
      shops: MOCK_SHOPS,
      products: [],
      sales: [],
      expenses: [],
      stats: null,
      isLoading: false,

      login: (userData) => {
        // ✅ Normalise l'objet user pour garantir que tous les champs existent
        const normalizedUser: User = {
          id: userData.id ?? '',
          name: userData.name ?? 'Utilisateur',
          role: userData.role ?? 'seller',
          shopId: userData.shopId ?? userData.shop_id ?? undefined,
          email: userData.email ?? undefined,
          phone: userData.phone ?? undefined,
        };
        set({ currentUser: normalizedUser });
        get().fetchData();
      },

      logout: () => set({ currentUser: null, products: [], sales: [], expenses: [], stats: null }),

      fetchData: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        set({ isLoading: true });
        try {
          const userId = currentUser.id;
          const [shopsRes, teamRes] = await Promise.all([
            fetch(`/api/shops?userId=${userId}`),
            fetch(`/api/team?userId=${userId}`)
          ]);
          const shopsData = shopsRes.ok ? await shopsRes.json() : [];
          const teamData = teamRes.ok ? await teamRes.json() : [];

          const shopId = currentUser.shopId;
          let productsData = [];
          let statsData = null;
          let expensesData = [];
          let salesData = [];

          const targetId = currentUser.role === 'director'
            ? (shopId || (Array.isArray(shopsData) && shopsData.length > 0 ? shopsData[0].id : null))
            : shopId;

          if (targetId) {
            const [pRes, sRes, eRes, salesRes] = await Promise.all([
              fetch(`/api/products?shopId=${targetId}`),
              fetch(`/api/stats/summary?shopId=${targetId}`),
              fetch(`/api/expenses?shopId=${targetId}`),
              fetch(`/api/sales/get?shopId=${targetId}`)
            ]);
            productsData = pRes.ok ? await pRes.json() : [];
            statsData = sRes.ok ? await sRes.json() : null;
            expensesData = eRes.ok ? await eRes.json() : [];
            salesData = salesRes.ok ? await salesRes.json() : [];
          }

          set({
            shops: Array.isArray(shopsData) ? shopsData : [],
            users: Array.isArray(teamData) ? teamData : [],
            products: Array.isArray(productsData) ? productsData : [],
            stats: statsData,
            expenses: Array.isArray(expensesData) ? expensesData : [],
            sales: Array.isArray(salesData) ? salesData : [],
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
        if (res.ok) get().fetchData();
      },
      removeUser: async (userId) => {
        const res = await fetch(`/api/team?id=${userId}`, { method: 'DELETE' });
        if (res.ok) get().fetchData();
      },
      addShop: async (shop) => {
        const res = await fetch('/api/shops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shop)
        });
        if (res.ok) get().fetchData();
      },
      addProduct: async (product) => {
        console.log('Store addProduct called with:', product);
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        console.log('API response status:', res.status);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to add product' }));
          console.error('API error:', errorData);
          throw new Error(errorData.message || 'Failed to add product');
        }
        const data = await res.json();
        console.log('API success response:', data);
        get().fetchData();
      },
      addSale: async (sale) => {
        const res = await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sale)
        });
        if (res.ok) get().fetchData();
      },
      addExpense: async (expense) => {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense)
        });
        if (res.ok) get().fetchData();
      },
      updateStock: (productId, quantity) => set((state) => ({
        products: state.products.map(p =>
          p.id === productId ? { ...p, stock: p.stock + quantity } : p
        )
      })),
    }),
    {
      name: 'nkap-storage',
    }
  )
);