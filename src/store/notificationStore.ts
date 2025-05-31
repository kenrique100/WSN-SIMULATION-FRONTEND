import { create } from 'zustand';
import apiClient from '@/api/apiClient';
import { Notification } from '@/types/notification';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string | 'all') => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await apiClient.get('/notifications');
      const notifications = response.data as Notification[];
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id: string | 'all') => {
    try {
      if (id === 'all') {
        await apiClient.patch('/notifications/mark-all-read');
        set({
          notifications: get().notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        });
      } else {
        await apiClient.patch(`/notifications/${id}/read`);
        set((state) => {
          const updated = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = updated.filter(n => !n.read).length;
          return { notifications: updated, unreadCount };
        });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => {
      const exists = state.notifications.some(n => n.id === notification.id);
      if (exists) return state;

      const notifications = [notification, ...state.notifications];
      const unreadCount = notification.read ? state.unreadCount : state.unreadCount + 1;
      return { notifications, unreadCount };
    });
  },
}));