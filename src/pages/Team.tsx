import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Store, Users, UserPlus, MapPin, Mail, Shield } from 'lucide-react';

export default function Team() {
  const { shops, users, addShop, addUser, removeUser, currentUser } = useStore();
  const [showShopModal, setShowShopModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Shop Form State
  const [newShopName, setNewShopName] = useState('');
  const [newShopLocation, setNewShopLocation] = useState('');

  // User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'director' | 'seller'>('seller');
  const [newUserShopId, setNewUserShopId] = useState('');

  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newShopName && newShopLocation) {
      await addShop({ name: newShopName, location: newShopLocation });
      setNewShopName('');
      setNewShopLocation('');
      setShowShopModal(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      await addUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        shopId: newUserRole === 'seller' ? newUserShopId : undefined
      });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('seller');
      setNewUserShopId('');
      setShowUserModal(false);
    }
  };

  if (currentUser?.role !== 'director') {
    return (
      <div className="p-8 text-center text-gray-500">
        Accès restreint aux directeurs uniquement.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion d'Équipe & Boutiques</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos points de vente et vos vendeurs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Shops Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Store className="w-5 h-5 text-indigo-500" />
              Mes Boutiques
            </h2>
            <button
              onClick={() => setShowShopModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Boutique
            </button>
          </div>

          <div className="space-y-4">
            {shops.map((shop) => (
              <div key={shop.id} className="glass-card p-4 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {shop.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    ID: {shop.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Users className="w-5 h-5 text-emerald-500" />
              Mon Équipe
            </h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <UserPlus className="w-4 h-4" />
              Nouveau Membre
            </button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="glass-card p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'director'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                    {user.role === 'director' ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                    <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                      {user.role === 'seller' && user.shopId && (
                        <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                          <Store className="w-3 h-3" />
                          {shops.find(s => s.id === user.shopId)?.name || 'Boutique inconnue'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {user.id !== currentUser.id && (
                  <button
                    onClick={async () => {
                      if (confirm('Voulez-vous vraiment supprimer ce membre ?')) {
                        await removeUser(user.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Shop Modal */}
      {showShopModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="glass-card bg-white/95 dark:bg-gray-900/95 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-bounceIn">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Nouvelle Boutique</h3>
            <form onSubmit={handleAddShop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la boutique</label>
                <input
                  type="text"
                  required
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  placeholder="Ex: Boutique Mokolo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localisation</label>
                <input
                  type="text"
                  required
                  value={newShopLocation}
                  onChange={(e) => setNewShopLocation(e.target.value)}
                  className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  placeholder="Ex: Marché Mokolo, Yaoundé"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowShopModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="glass-card bg-white/95 dark:bg-gray-900/95 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-bounceIn">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Nouveau Membre</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  placeholder="jean@ngwaflow.cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'director' | 'seller')}
                  className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                >
                  <option value="seller">Vendeur</option>
                  <option value="director">Directeur</option>
                </select>
              </div>

              {newUserRole === 'seller' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigner à une boutique</label>
                  <select
                    required
                    value={newUserShopId}
                    onChange={(e) => setNewUserShopId(e.target.value)}
                    className="glass-input w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                  >
                    <option value="">Choisir une boutique...</option>
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
