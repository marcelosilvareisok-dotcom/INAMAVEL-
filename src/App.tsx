import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firestore-errors';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { UserProfile } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Editor from './pages/Editor';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Admin from './pages/Admin';
import Docs from './pages/Docs';
import EngineeringHub from './pages/EngineeringHub';

// Components
import Layout from './components/Layout';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050505] gap-6">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <Heart size={48} className="text-red-500 fill-red-500" />
        <div className="absolute inset-0 blur-2xl bg-red-500/20 -z-10" />
      </motion.div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Sincronizando Memória...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  React.useEffect(() => {
    if (!user) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribeProfile();
  }, [user]);

  return (
    <ErrorBoundary>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router>
        <Routes>
          {/* Public Routes without Layout */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Editor has its own custom layout */}
          <Route 
            path="/editor/:id" 
            element={
              <AuthGuard>
                <Editor />
              </AuthGuard>
            } 
          />

          {/* Routes with Main Layout */}
          <Route
            path="*"
            element={
              <Layout user={user} coins={profile?.coins || 0}>
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <AuthGuard>
                        <Dashboard />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/new"
                    element={
                      <AuthGuard>
                        <NewProject />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/pricing"
                    element={
                      <AuthGuard>
                        <Pricing />
                      </AuthGuard>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/hub" element={<EngineeringHub />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AuthGuard>
                        {user?.email === 'marcelodasilvareis30@gmail.com' ? <Admin /> : <Navigate to="/dashboard" replace />}
                      </AuthGuard>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
