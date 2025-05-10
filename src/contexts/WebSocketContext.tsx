import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    alerts: any[];
    readings: any[];
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>(null!);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [readings, setReadings] = useState<any[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${localStorage.getItem('accessToken')}`);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    setAlerts(prev => [...prev, data.data]);
                } else if (data.type === 'reading') {
                    setReadings(prev => [...prev, data.data]);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setSocket(null);
            };

            return () => {
                ws.close();
            };
        }
    }, [user]);

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

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}