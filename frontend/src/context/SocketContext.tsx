import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
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
  const { isAuthenticated, tokens, updateTokens } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (data: unknown) => void) => {
    socketRef.current?.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (data: unknown) => void) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  }, []);

  const connectSocket = useCallback(() => {
    if (!isAuthenticated || !tokens?.accessToken) return;

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: tokens.accessToken },
      transports: ['websocket', 'polling'],
      reconnection: false,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);

      if (reason === 'io server disconnect') {
        socketInstance.connect();
      } else if (reason === 'transport close' || reason === 'transport error') {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          socketInstance.connect();
        }, 1000);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('token_refreshed', (data: { accessToken: string; refreshToken: string }) => {
      updateTokens(data);
      socketInstance.auth = { token: data.accessToken };
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);
  }, [isAuthenticated, tokens, updateTokens]);

  useEffect(() => {
    if (!isAuthenticated || !tokens) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      return;
    }

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isAuthenticated, tokens, connectSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}