export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  coins: number;
  createdAt: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  type: 'website' | 'app' | 'landing' | 'service';
  objective: string;
  content: string; // JSON or HTML representation
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'spend';
  description: string;
  createdAt: string;
}
