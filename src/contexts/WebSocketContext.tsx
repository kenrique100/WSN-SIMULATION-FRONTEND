// WebSocketProvider.tsx
import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Alert } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuthStore } from '@/store/authStore';

interface WebSocketContextType {
    alerts: Alert[];
    readings: any[];
    sendMessage: (destination: string, message: any) => void;
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [readings, setReadings] = useState<any[]>([]);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const { showNotification } = useNotification();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const token = isAuthenticated ? localStorage.getItem('accessToken') : null;

    const connectWebSocket = useCallback(() => {
        if (!token) return null;

        // Ensure the URL is properly formatted for SockJS
        const wsUrl = (import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws')
          .replace(/^ws:/, 'http:')
          .replace(/^wss:/, 'https:');

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('[STOMP]', str),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            webSocketFactory: () => new SockJS(wsUrl),

            onConnect: () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                setConnectionStatus('connected');

                client.subscribe('/topic/alerts', (message: IMessage) => {
                    const data = JSON.parse(message.body) as Alert;
                    setAlerts(prev => [data, ...prev].slice(0, 50));
                    showNotification(`New alert: ${data.message}`, 'warning');
                });

                client.subscribe('/topic/readings', (message: IMessage) => {
                    const data = JSON.parse(message.body);
                    setReadings(prev => [data, ...prev].slice(0, 50));
                });
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers.message);
                setConnectionStatus('disconnected');
                setIsConnected(false);
            },

            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('disconnected');
                setIsConnected(false);
            },

            onDisconnect: () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                setConnectionStatus('disconnected');
            }
        });

        client.activate();
        setStompClient(client);
        return client;
    }, [token, showNotification]);

    const sendMessage = useCallback((destination: string, message: any) => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination,
                body: JSON.stringify(message),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.error('WebSocket is not connected');
        }
    }, [stompClient, token]);

    useEffect(() => {
        let client: Client | null = null;

        if (token) {
            client = connectWebSocket();
        }

        return () => {
            if (client && client.connected) {
                client.deactivate().catch(err => {
                    console.error('Error deactivating WebSocket:', err);
                });
            }
        };
    }, [connectWebSocket, token]);

    const value = {
        alerts,
        readings,
        sendMessage,
        isConnected,
        connectionStatus
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