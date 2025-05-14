import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { Alert } from '@/types';

interface WebSocketContextType {
    alerts: Alert[];
    readings: any[];
    sendMessage: (message: string) => void;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [readings, setReadings] = useState<any[]>([]);

    const connectWebSocket = useCallback(() => {
        const wsUrl = import.meta.env.VITE_WS_URL;
        const ws = new WebSocket(wsUrl);

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    setAlerts(prev => [data.data, ...prev].slice(0, 50));
                } else if (data.type === 'reading') {
                    setReadings(prev => [data.data, ...prev].slice(0, 50));
                }
            } catch (err) {
                console.error('Failed to parse WebSocket message:', err);
            }
        };

        ws.addEventListener('open', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setSocket(ws);
        });

        ws.addEventListener('message', handleMessage);

        ws.addEventListener('close', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setSocket(null);
            setTimeout(connectWebSocket, 5000);
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return ws;
    }, []);

    useEffect(() => {
        const ws = connectWebSocket();
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [connectWebSocket]);

    const sendMessage = useCallback((message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    }, [socket]);

    const value = {
        alerts,
        readings,
        sendMessage,
        isConnected
    };

    return (
      <WebSocketContext.Provider value={value}>
          {children}
      </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}