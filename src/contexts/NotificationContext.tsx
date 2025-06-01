// src/contexts/NotificationContext.tsx
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { AlertColor, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { registerNotificationFn } from '@/store/notificationService';

interface Notification {
    message: string;
    severity: AlertColor;
}

interface NotificationContextType {
    showNotification: (message: string, severity?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => {}
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [open, setOpen] = useState(false);

    const showNotification = (message: string, severity: AlertColor = 'info') => {
        setNotification({ message, severity });
        setOpen(true);
    };

    useEffect(() => {
        registerNotificationFn(showNotification); // 👈 Register here
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
      <NotificationContext.Provider value={{ showNotification }}>
          {children}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={notification?.severity}
              >
                  {notification?.message}
              </MuiAlert>
          </Snackbar>
      </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
