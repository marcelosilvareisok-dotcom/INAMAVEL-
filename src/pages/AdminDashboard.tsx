import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, FolderGit2, Coins, TrendingUp, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalCoins: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalProjects: 0, totalCoins: 0 });
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const projectsSnap = await getDocs(collection(db, 'projects'));
        
        let totalCoins = 0;
        const usersList: any[] = [];
        
        usersSnap.forEach(doc => {
          const data = doc.data();
          totalCoins += data.coins || 0;
          usersList.push(data);
        });

        setStats({
          totalUsers: usersSnap.size,
          totalProjects: projectsSnap.size,
          totalCoins
        });

        // Mock data for charts (in a real app, you'd aggregate this by date from Firestore)
        setUsersData([
          { name: 'Seg', users: Math.floor(usersSnap.size * 0.2), projects: Math.floor(projectsSnap.size * 0.1) },
          { name: 'Ter', users: Math.floor(usersSnap.size * 0.4), projects: Math.floor(projectsSnap.size * 0.3) },
          { name: 'Qua', users: Math.floor(usersSnap.size * 0.6), projects: Math.floor(projectsSnap.size * 0.5) },
          { name: 'Qui', users: Math.floor(usersSnap.size * 0.8), projects: Math.floor(projectsSnap.size * 0.7) },
          { name: 'Sex', users: usersSnap.size, projects: projectsSnap.size },
        ]);

      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin"
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black tracking-tighter">Painel Analítico</h1>
        </div>
        <div className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-bold border border-purple-500/20">
          Acesso Administrador
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Total de Usuários</p>
              <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FolderGit2 size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Projetos Criados</p>
              <h3 className="text-3xl font-bold">{stats.totalProjects}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <Coins size={24} />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Moedas em Circulação</p>
              <h3 className="text-3xl font-bold">{stats.totalCoins}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            Crescimento de Usuários
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FolderGit2 size={20} className="text-emerald-400" />
            Projetos por Dia
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#222' }}
                />
                <Bar dataKey="projects" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
