import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './types';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Editor from './pages/Editor';
import Pricing from './pages/Pricing';
import About from './pages/About';

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
    <div className="h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

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
    });

    return () => unsubscribeProfile();
  }, [user]);

  return (
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
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
