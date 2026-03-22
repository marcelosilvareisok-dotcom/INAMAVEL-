import React from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, setDoc, getDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Users, Coins, Search, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, ZapOff } from 'lucide-react';

interface UserData {
  uid: string;
  email: string;
  coins: number;
  role: string;
  displayName?: string;
}

export default function Admin() {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [freeMode, setFreeMode] = React.useState(false);
  const [iconUrl, setIconUrl] = React.useState('');
  const [iconHistory, setIconHistory] = React.useState<string[]>([]);
  const [updatingSettings, setUpdatingSettings] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const docRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFreeMode(data.freeMode || false);
        setIconUrl(data.iconUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Inabalavel');
        setIconHistory(data.iconHistory || []);
      }
    }, (error) => {
      console.error("Error listening to settings:", error);
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('coins', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersList: UserData[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data() as UserData);
      });
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const toggleFreeMode = async () => {
    setUpdatingSettings(true);
    setError(null);
    setSuccess(null);
    try {
      // Get latest state from server before toggling
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDocFromServer(docRef);
      const currentMode = docSnap.exists() ? docSnap.data().freeMode : false;
      const newMode = !currentMode;

      await setDoc(docRef, {
        freeMode: newMode,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setFreeMode(newMode);
      setSuccess(`Modo Grátis ${newMode ? 'ativado' : 'desativado'} com sucesso!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating settings:", error);
      setError(error.message || "Erro ao atualizar configurações. Verifique suas permissões.");
    } finally {
      setUpdatingSettings(false);
    }
  };

  const updateIconUrl = async (newIconUrl: string = iconUrl) => {
    setUpdatingSettings(true);
    setError(null);
    setSuccess(null);
    try {
      // Update Firestore
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDocFromServer(docRef);
      const currentHistory = docSnap.exists() ? (docSnap.data().iconHistory || []) : [];
      
      const newHistory = currentHistory.includes(newIconUrl) 
        ? currentHistory 
        : [newIconUrl, ...currentHistory].slice(0, 10); // Keep last 10

      await setDoc(docRef, {
        iconUrl: newIconUrl,
        iconHistory: newHistory,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update manifest.json via API
      const response = await fetch('/api/update-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconUrl: newIconUrl })
      });
      
      if (!response.ok) throw new Error('Falha ao atualizar o ícone no servidor.');

      setIconUrl(newIconUrl);
      setSuccess("Ícone atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating icon:", error);
      setError(error.message || "Erro ao atualizar ícone.");
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleUpdateCoins = async (userId: string, currentCoins: number, amount: number) => {
    const newAmount = Math.max(0, currentCoins + amount);
    setUpdating(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        coins: newAmount
      });
      // Update local state
      setUsers(users.map(u => u.uid === userId ? { ...u, coins: newAmount } : u));
    } catch (error) {
      console.error("Error updating coins:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-purple-500" size={32} />
            PAINEL <span className="text-purple-500">ADMIN</span>
          </h1>
          <p className="text-white/60">Gerencie os usuários e recursos da plataforma.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-purple-500" />
            </div>
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Total Usuários</span>
          </div>
          <p className="text-3xl font-black">{users.length}</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Coins size={20} className="text-yellow-500" />
            </div>
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Moedas em Circulação</span>
          </div>
          <p className="text-3xl font-black">{users.reduce((acc, u) => acc + u.coins, 0)}</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-green-500" />
            </div>
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Status do Sistema</span>
          </div>
          <p className="text-3xl font-black text-green-500">ATIVO</p>
        </div>
        <button 
          onClick={toggleFreeMode}
          disabled={updatingSettings}
          className={`p-6 border rounded-[32px] text-left transition-all relative overflow-hidden group ${
            freeMode 
              ? 'bg-purple-500/20 border-purple-500' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              freeMode ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40'
            }`}>
              {freeMode ? <Zap size={20} /> : <ZapOff size={20} />}
            </div>
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Modo Grátis</span>
          </div>
          <p className="text-3xl font-black">{freeMode ? 'LIGADO' : 'DESLIGADO'}</p>
          {updatingSettings && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <RefreshCw className="animate-spin" />
            </div>
          )}
        </button>
        
        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4 md:col-span-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <img src={iconUrl} alt="Icon" className="w-6 h-6 rounded-full" />
            </div>
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">URL do Ícone</span>
          </div>
          <input 
            type="text"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-sm"
          />
          <button 
            onClick={() => updateIconUrl()}
            disabled={updatingSettings}
            className="w-full py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            Atualizar Ícone
          </button>
          
          {iconHistory.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 block">Histórico</span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {iconHistory.map((url, index) => (
                  <button 
                    key={index}
                    onClick={() => updateIconUrl(url)}
                    className="w-full aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-blue-500 transition-colors"
                  >
                    <img src={url} alt="Icon History" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2">
            <ZapOff size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={16} />
            {success}
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Usuário</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Moedas</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Cargo</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Carregando o Inabalável 💔</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-white/40">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white">{user.displayName || 'Sem Nome'}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Coins size={14} className="text-yellow-500" />
                        <span className="font-bold">{user.coins}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-white/5 text-white/40 border border-white/10'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateCoins(user.uid, user.coins, -10)}
                          disabled={updating === user.uid || user.coins < 10}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors disabled:opacity-20"
                          title="Remover 10 moedas"
                        >
                          <ArrowDownRight size={20} />
                        </button>
                        <button 
                          onClick={() => handleUpdateCoins(user.uid, user.coins, 10)}
                          disabled={updating === user.uid}
                          className="p-2 hover:bg-yellow-500/10 text-yellow-500 rounded-lg transition-colors disabled:opacity-50"
                          title="Adicionar 10 moedas"
                        >
                          <ArrowUpRight size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
