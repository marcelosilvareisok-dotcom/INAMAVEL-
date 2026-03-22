import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Notification {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  clearNotification: (index: number) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  clearNotification: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        newSocket.emit('join', user.uid);
      }
    });

    newSocket.on('notification', (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
      
      // Auto clear after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== notification));
      }, 5000);
    });

    return () => {
      unsubscribe();
      newSocket.disconnect();
    };
  }, []);

  const clearNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotification }}>
      {children}
      
      {/* Notifications Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {notifications.map((notif, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start justify-between min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-300 ${
              notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              notif.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              notif.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            <div>
              <h4 className="font-bold text-sm">{notif.title}</h4>
              <p className="text-sm opacity-80">{notif.message}</p>
            </div>
            <button 
              onClick={() => clearNotification(index)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
};
