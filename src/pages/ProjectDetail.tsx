import React from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { Project } from '../types';
import { Send, User } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = React.useState<Project | null>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [commentText, setCommentText] = React.useState('');

  React.useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      const docSnap = await getDoc(doc(db, 'projects', id));
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      }
    };
    fetchProject();

    const q = query(collection(db, 'projects', id, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const handleComment = async () => {
    if (!id || !commentText.trim() || !auth.currentUser) return;
    await addDoc(collection(db, 'projects', id, 'comments'), {
      projectId: id,
      userId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Usuário',
      text: commentText,
      createdAt: new Date().toISOString()
    });
    setCommentText('');
  };

  if (!project) return <div className="text-white">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-white">{project.name}</h1>
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
        <p className="text-white/80">{project.objective}</p>
        {project.isForSale && (
          <div className="mt-6 p-4 bg-purple-500/20 rounded-lg text-purple-300">
            À venda por R$ {project.price}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Comentários</h2>
        <div className="flex gap-2">
          <input 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white"
            placeholder="Escreva um comentário..."
          />
          <button onClick={handleComment} className="bg-white text-black px-4 py-2 rounded-lg">
            <Send size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="bg-[#0A0A0A] p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-white/40" />
                <span className="text-sm font-bold text-white">{c.authorName}</span>
              </div>
              <p className="text-sm text-white/70">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
