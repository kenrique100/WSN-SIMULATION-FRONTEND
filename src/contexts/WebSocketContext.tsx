import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { Alert } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';

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
    const [retryCount, setRetryCount] = useState(0);
    const { showNotification } = useNotification();

    const connectWebSocket = useCallback(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
        const ws = new WebSocket(wsUrl);

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    setAlerts(prev => [data.data, ...prev].slice(0, 50));
                    showNotification(`New alert: ${data.data.message}`, 'warning');
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
            setRetryCount(0);
        });

        ws.addEventListener('message', handleMessage);

        ws.addEventListener('close', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setSocket(null);
            // Exponential backoff for reconnection
            const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
            setTimeout(connectWebSocket, delay);
            setRetryCount(prev => prev + 1);
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return ws;
    }, [retryCount, showNotification]);

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
        } else {
            console.error('WebSocket is not connected');
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