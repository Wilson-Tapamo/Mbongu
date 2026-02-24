import { useState } from 'react';
import {
  Search, Plus, Minus, X, ShoppingBag, CreditCard, Smartphone, Banknote,
  Check, Trash2, ChevronRight
} from 'lucide-react';
import { useStore } from '../store';

const formatCFA = (price: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(price);
};

export function POS() {
  const { darkMode, cartItems, addToCart, removeFromCart, clearCart, showSaleSuccess, setShowSaleSuccess, products, addSale, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MTN_MOMO' | 'ORANGE_MONEY' | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get unique categories
  const categories = ['Tous', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleCompleteSale = () => {
    if (!paymentMethod || !currentUser) return;

    // Add sale to store
    addSale({
      date: new Date().toISOString(),
      total: cartTotal,
      items: cartItems.map(i => ({
        productId: i.productId,
        quantity: i.qty,
        price: i.price,
        name: i.name
      })),
      shopId: currentUser.shopId || '1', // Default to 1 if director/unknown
      sellerId: currentUser.id,
      paymentMethod: paymentMethod
    });

    setShowPaymentModal(false);
    setShowSaleSuccess(true);
    setTimeout(() => {
      setShowSaleSuccess(false);
      clearCart();
      setPaymentMethod(null);
    }, 2500);
  };

  // Cart Component (Reused for Mobile and Desktop)
  const CartContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-500" />
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Panier</h2>
        </div>
        <button
          onClick={clearCart}
          className={`p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={cartItems.length === 0}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
            <ShoppingBag className="w-12 h-12 mb-2 text-gray-400" />
            <p className="text-sm font-medium">Votre panier est vide</p>
            <p className="text-xs">Ajoutez des produits pour commencer</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-white/60 shadow-sm'}`}>
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {/* Try to find image in products */}
                {products.find(p => p.id === item.productId)?.image ? (
                  <img src={products.find(p => p.id === item.productId)?.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                <p className="text-xs text-indigo-500 font-bold">{formatCFA(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300 hover:text-rose-500"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs font-bold text-gray-500">{formatCFA(item.price * item.qty)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'} bg-white/50 dark:bg-gray-900/50 backdrop-blur-md`}>
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total à payer</span>
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCFA(cartTotal)}</span>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          disabled={cartItems.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] ${cartItems.length === 0
            ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
        >
          Encaisser
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 relative">

      {/* LEFT: Products Area */}
      <div className="flex-1 flex flex-col h-full min-h-0">

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-shrink-0">
          <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
            <Search className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (Code, Nom)..."
              className={`w-full bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide flex-shrink-0 mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : darkMode ? 'glass-card-dark text-gray-400 hover:text-white' : 'glass-card text-gray-600 hover:text-gray-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 pr-2">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find(i => i.productId === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart({ productId: product.id, name: product.name, qty: 1, price: product.price })}
                  className={`group relative flex flex-col text-left p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${inCart
                    ? 'ring-2 ring-indigo-500 ' + (darkMode ? 'glass-card-dark bg-indigo-900/10' : 'glass-card bg-indigo-50/50')
                    : darkMode ? 'glass-card-dark hover:bg-white/5' : 'glass-card hover:bg-white/60'
                    }`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {product.category === 'Boissons' ? '🍺' : product.category === 'Alimentaire' ? '🛒' : product.category === 'Construction' ? '🧱' : '📦'}
                      </div>
                    )}
                    {inCart && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounceIn">
                        {inCart.qty}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-medium text-gray-500 uppercase mb-0.5`}>{product.category}</p>
                    <p className={`text-sm font-bold leading-tight mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <p className="text-indigo-600 font-bold text-base">{formatCFA(product.price)}</p>
                    <div className={`text-[10px] px-1.5 py-0.5 rounded-md ${product.stock <= product.minStock ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'} dark:bg-gray-800 dark:text-gray-400`}>
                      {product.stock} en stock
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Fixed Cart (Desktop) */}
      <div className={`hidden lg:block w-96 flex-shrink-0 h-full rounded-2xl overflow-hidden ${darkMode ? 'glass-dark' : 'glass'}`}>
        <CartContent />
      </div>

      {/* MOBILE: Bottom Sheet Cart Toggle (Visible only on mobile) */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-20 left-0 right-0 px-4 z-30 animate-slideUp">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full p-4 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform">
                {cartCount}
              </div>
              <span className="font-bold tracking-wide">Payer maintenant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatCFA(cartTotal)}</span>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </div>
          </button>
        </div>
      )}

      {/* Payment / Cart Modal (Mobile & Desktop Overlay) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:p-0">
          <div className={`w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-bounceIn ${darkMode ? 'glass-card-dark bg-gray-900' : 'glass-card bg-white'}`}>

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold dark:text-white">Finaliser la vente</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Display */}
            <div className="p-6 text-center bg-indigo-50 dark:bg-indigo-900/20">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total à payer</p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{formatCFA(cartTotal)}</p>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <p className="text-sm font-semibold mb-4 dark:text-white">Mode de paiement</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'CASH' as const, label: 'Espèces', icon: Banknote, color: 'text-emerald-500' },
                  { id: 'MTN_MOMO' as const, label: 'Momo', icon: Smartphone, color: 'text-amber-500' },
                  { id: 'ORANGE_MONEY' as const, label: 'OM', icon: CreditCard, color: 'text-orange-500' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === pm.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100'
                      }`}
                  >
                    <pm.icon className={`w-6 h-6 ${pm.color}`} />
                    <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleCompleteSale}
                disabled={!paymentMethod}
                className={`flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${paymentMethod
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
              >
                Confirmer la vente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation Overlay */}
      {showSaleSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-600/90 backdrop-blur-xl transition-all">
          <div className="text-center text-white animate-bounceIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl">
              <Check className="w-12 h-12 text-white" strokeWidth={4} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Vente Réussie !</h2>
            <p className="text-xl opacity-90">{formatCFA(cartTotal)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
