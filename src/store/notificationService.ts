// src/services/notificationService.ts

type NotificationFn = (message: string, severity: 'error' | 'success' | 'info' | 'warning') => void;

let showNotificationFn: NotificationFn | null = null;

export const registerNotificationFn = (fn: NotificationFn) => {
  showNotificationFn = fn;
};

export const notify = (message: string, severity: 'error' | 'success' | 'info' | 'warning' = 'info') => {
  if (showNotificationFn) {
    showNotificationFn(message, severity);
  } else {
    console.warn('Notification function not registered');
  }
};
