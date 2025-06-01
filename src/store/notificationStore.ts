// notificationStore.ts
import { create } from 'zustand';
import apiClient from '@/api/apiClient';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/notifications', {
        skipErrorNotification: true // Skip showing error notifications for this request
      });
      const notifications = response.data;
      set({
        notifications,
        unreadCount: notifications.filter((n: Notification) => !n.read).length,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({
        error: 'Failed to load notifications',
        isLoading: false
      });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
}));