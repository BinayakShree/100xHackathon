import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title: string;
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

type State = NotificationStore;
type SetState = (fn: (state: State) => Partial<State>) => void;

export const useNotificationStore = create<NotificationStore>((set: SetState) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => {
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(2),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      return {
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50 notifications
        unreadCount: state.unreadCount + 1,
      };
    });
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    });
  },
  clearAll: () => {
    set((state) => ({ notifications: [], unreadCount: 0 }));
  },
}));