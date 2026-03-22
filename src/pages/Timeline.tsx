import React from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Project } from '../types';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Clock } from 'lucide-react';

export default function Timeline() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('status', '==', 'published'),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white">Linha do Tempo</h1>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Carregando o Inabalável 💔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="h-32 bg-[#111] rounded-lg mb-4 flex items-center justify-center">
                <Monitor size={32} className="text-white/10" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-white/60 mb-4">{project.type}</p>
              <div className="flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                {project.isForSale && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    À venda: R$ {project.price}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
