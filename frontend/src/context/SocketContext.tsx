import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
}

const SocketContext = createContext<SocketContextType>({ 
  socket: null, 
  isConnected: false,
  emit: () => {},
  on: () => {},
  off: () => {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, tokens } = useAuth();

  const emit = useCallback((event: string, data: unknown) => {
    socket?.emit(event, data);
  }, [socket]);

  const on = useCallback((event: string, callback: (data: unknown) => void) => {
    socket?.on(event, callback);
  }, [socket]);

  const off = useCallback((event: string, callback?: (data: unknown) => void) => {
    if (callback) {
      socket?.off(event, callback);
    } else {
      socket?.off(event);
    }
  }, [socket]);

  useEffect(() => {
    if (!isAuthenticated || !tokens) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: tokens.accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
    });
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, tokens]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}