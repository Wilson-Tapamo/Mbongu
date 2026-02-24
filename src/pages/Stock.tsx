import React, { useState } from 'react';
import {
  Search, Filter, Plus, ArrowUpRight, ArrowDownRight,
  X, Camera
} from 'lucide-react';
import { useStore, Product } from '../store';

const formatCFA = (price: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(price);
};

export function Stock() {
  const {
    darkMode, products, addProduct, updateStock, currentUser
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    category: 'Epicerie',
    image: ''
  });

  const [stockMovement, setStockMovement] = useState({
    quantity: '',
    type: 'entry' as 'entry' | 'exit',
    reason: ''
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.cost) * p.stock), 0);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.shopId) return;

    await addProduct({
      ...newProduct,
      shopId: currentUser.shopId,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost),
      stock: Number(newProduct.stock),
      minStock: Number(newProduct.minStock)
    } as any);

    setShowAddModal(false);
    setNewProduct({ name: '', price: '', cost: '', stock: '', minStock: '', category: 'Epicerie', image: '' });
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && stockMovement.quantity) {
      const qty = Number(stockMovement.quantity);
      const finalQty = stockMovement.type === 'entry' ? qty : -qty;
      updateStock(selectedProduct.id, finalQty);
      setSelectedProduct(null);
      setStockMovement({ quantity: '', type: 'entry', reason: '' });
    }
  };

  return (
    <div className="pb-24 lg:pb-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gestion de Stock</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {products.length} produits référencés
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Nouveau Produit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className={`p-4 rounded-2xl ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valeur Stock</p>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCFA(totalStockValue)}
          </p>
        </div>
        <div className={`p-4 rounded-2xl ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alertes Rupture</p>
          <p className="text-lg font-bold text-amber-500">
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${darkMode ? 'glass-card-dark' : 'glass-card'}`}>
        <Search className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className={`w-full bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
        />
        <button className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
          <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'glass-card-dark hover:bg-white/5' : 'glass-card hover:bg-white/60'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span>📦</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold truncate pr-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock <= product.minStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {product.stock} {product.stock <= product.minStock ? '⚠️' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</span>
                <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{formatCFA(product.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={() => setShowAddModal(false)}>
          <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 ${darkMode ? 'modal-dark' : 'modal-light'}`} onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nouveau Produit</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10">
                  {newProduct.image ? (
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Photo</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Nom du produit</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    className={`w-full p-4 rounded-xl border outline-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                    placeholder="Ex: Savon de Marseille"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Prix Vente</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className={`w-full p-4 rounded-xl border outline-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Coût Achat</label>
                    <input
                      type="number"
                      required
                      value={newProduct.cost}
                      onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })}
                      className={`w-full p-4 rounded-xl border outline-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Stock Initial</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className={`w-full p-4 rounded-xl border outline-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Alerte</label>
                    <input
                      type="number"
                      required
                      value={newProduct.minStock}
                      onChange={e => setNewProduct({ ...newProduct, minStock: e.target.value })}
                      className={`w-full p-4 rounded-xl border outline-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1">Catégorie</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className={`w-full p-4 rounded-xl border outline-none appearance-none transition-all ${darkMode ? 'border-gray-700 bg-gray-800 focus:border-indigo-500' : 'border-gray-100 bg-gray-50 focus:border-indigo-500'}`}
                  >
                    <option>Divers</option>
                    <option>Alimentaire</option>
                    <option>Boissons</option>
                    <option>Matériaux</option>
                    <option>Hygiène</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold transition-all hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] mt-2 shadow-lg shadow-indigo-500/30"
              >
                Enregistrer le produit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail / Stock Movement Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedProduct(null)}>
          <div className={`w-full max-w-md rounded-3xl shadow-2xl animate-bounceIn p-6 ${darkMode ? 'modal-dark' : 'modal-light'}`} onClick={e => e.stopPropagation()}>

            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">📦</div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-500">{selectedProduct.category} • ID: {selectedProduct.id.substring(0, 4)}</p>
                  <p className="font-bold text-indigo-600 mt-1">{formatCFA(selectedProduct.price)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Stock Actuel</p>
                <p className="text-3xl font-bold">{selectedProduct.stock}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedProduct.stock <= selectedProduct.minStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {selectedProduct.stock <= selectedProduct.minStock ? 'Stock Faible' : 'En Stock'}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
                <button
                  onClick={() => setStockMovement({ ...stockMovement, type: 'entry' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockMovement.type === 'entry' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <ArrowUpRight className="w-4 h-4 inline mr-1" /> Entrée
                </button>
                <button
                  onClick={() => setStockMovement({ ...stockMovement, type: 'exit' })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockMovement.type === 'exit' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <ArrowDownRight className="w-4 h-4 inline mr-1" /> Sortie
                </button>
              </div>

              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantité à {stockMovement.type === 'entry' ? 'ajouter' : 'retirer'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    autoFocus
                    value={stockMovement.quantity}
                    onChange={e => setStockMovement({ ...stockMovement, quantity: e.target.value })}
                    className="w-full p-4 text-2xl font-bold text-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-indigo-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] ${stockMovement.type === 'entry' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
                >
                  Confirmer {stockMovement.type === 'entry' ? 'l\'entrée' : 'la sortie'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )
      }

    </div >
  );
}
