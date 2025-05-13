import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { Alert } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface WebSocketContextType {
    alerts: Alert[];
    readings: any[];
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [readings, setReadings] = useState<any[]>([]);
    const { user, token } = useAuth();

    const connectWebSocket = useCallback(() => {
        if (!user || !token) return;

        const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`;
        const ws = new WebSocket(wsUrl);

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    setAlerts(prev => [data.data, ...prev].slice(0, 50)); // Keep only latest 50 alerts
                } else if (data.type === 'reading') {
                    setReadings(prev => [data.data, ...prev].slice(0, 50));
                }
            } catch (err) {
                console.error('Failed to parse WebSocket message:', err);
            }
        };

        ws.addEventListener('open', () => {
            console.log('WebSocket connected');
            setSocket(ws);
        });

        ws.addEventListener('message', handleMessage);

        ws.addEventListener('close', () => {
            console.log('WebSocket disconnected');
            setSocket(null);
            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return ws;
    }, [user, token]);

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
        sendMessage
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