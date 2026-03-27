import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Coins, 
  User, 
  LogOut, 
  Menu,
  X,
  ShieldCheck,
  MessageCircle,
  BookOpen,
  Terminal
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import Footer from './Footer';
import Logo from './Logo';
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
    { name: 'Docs', path: '/docs', icon: BookOpen },
    { name: 'Engineering Hub', path: '/hub', icon: Terminal },
    { name: 'Linha do Tempo', path: '/timeline', icon: LayoutDashboard },
  ];

  if (user?.email === 'marcelodasilvareis30@gmail.com') {
    navItems.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
  }

  const handleLogout = () => signOut(auth);

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent("Conheça o Inabalável, a melhor plataforma de desenvolvimento de software com IA do mundo! 🚀\n\nAcesse agora: " + window.location.origin);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors text-white/70"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/10">
              <Coins size={14} className="text-white/70" />
              <span className="text-xs font-medium text-white/90">{coins} moedas</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full border border-white/20"
                />
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-md transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex pt-14">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 fixed h-[calc(100vh-56px)] border-r border-white/10 bg-[#000000]">
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm",
                  location.pathname === item.path 
                    ? "bg-white/10 text-white font-medium" 
                    : "hover:bg-white/5 text-white/60 hover:text-white"
                )}
              >
                <item.icon size={16} className={cn(
                  "transition-transform",
                  location.pathname === item.path ? "text-white" : "text-white/40 group-hover:text-white/70"
                )} />
                <span>{item.name}</span>
              </Link>
            ))}

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm hover:bg-green-500/10 text-green-500/80 hover:text-green-500 mt-4 border border-green-500/20"
            >
              <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
              <span className="font-medium">Compartilhar no WhatsApp</span>
            </button>
          </div>
          
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <p className="text-xs font-semibold text-white mb-1">Inabalável Pro</p>
              <p className="text-[11px] text-white/50 mb-3 leading-relaxed">Desbloqueie o poder total da IA para seus projetos.</p>
              <Link 
                to="/pricing"
                className="block w-full py-2 text-center text-xs font-medium bg-white text-black rounded-md hover:bg-white/90 transition-all"
              >
                Fazer Upgrade
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
                className="fixed left-0 top-14 bottom-0 w-64 z-50 bg-[#000000] border-r border-white/10 lg:hidden"
              >
                <div className="p-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
                        location.pathname === item.path 
                          ? "bg-white/10 text-white font-medium" 
                          : "hover:bg-white/5 text-white/60 hover:text-white"
                      )}
                    >
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleWhatsAppShare();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm hover:bg-green-500/10 text-green-500/80 hover:text-green-500 mt-4 border border-green-500/20"
                  >
                    <MessageCircle size={16} />
                    <span className="font-medium">Compartilhar no WhatsApp</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-56px)] p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
