import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import theme from './assets/styles/theme';
import NotificationProvider from './contexts/NotificationContext';
import WebSocketProvider from './contexts/WebSocketContext';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <NotificationProvider>
                        <AuthProvider>
                            <WebSocketProvider>
                                <AppRoutes />
                            </WebSocketProvider>
                        </AuthProvider>
                    </NotificationProvider>
                </BrowserRouter>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;