import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Coins, 
  User, 
  LogOut, 
  Heart,
  Menu,
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  coins: number;
}

export default function Layout({ children, user, coins }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Novo Projeto', path: '/new', icon: PlusCircle },
    { name: 'Comprar Moedas', path: '/pricing', icon: Coins },
    { name: 'Sobre o CEO', path: '/about', icon: User },
  ];

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Heart className="text-red-500 fill-red-500 group-hover:scale-110 transition-transform" size={24} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Inamável
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <Coins size={14} className="text-yellow-500" />
              <span className="text-sm font-medium">{coins} moedas</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 fixed h-[calc(100vh-64px)] border-r border-white/5 bg-[#050505]">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  location.pathname === item.path 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "hover:bg-white/5 text-white/60 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-transform group-hover:scale-110",
                  location.pathname === item.path ? "text-purple-400" : "text-white/40"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-auto p-4 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-red-500/10 border border-white/5">
              <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Plano Atual</p>
              <p className="text-sm font-bold text-white mb-1">Free</p>
              <p className="text-xs text-white/60 mb-3">1 projeto ativo</p>
              <Link 
                to="/pricing"
                className="block w-full py-2 text-center text-xs font-bold bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </aside>

        {/* Sidebar Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed left-0 top-16 bottom-0 w-72 z-50 bg-[#050505] border-r border-white/5 lg:hidden"
              >
                <div className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                        location.pathname === item.path 
                          ? "bg-purple-500/10 text-purple-400" 
                          : "hover:bg-white/5 text-white/60"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-64px)] p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
