"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, AlertCircle, Bell } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationSheetProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  onCloseAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function NotificationSheet({
  notifications,
  onClose,
  onCloseAll,
  isOpen,
  onToggle,
}: NotificationSheetProps) {
  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={onToggle}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Sheet */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onToggle}
          />
          <div className="fixed right-4 top-16 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Notifications</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onCloseAll}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onToggle}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {notification.type === "success" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {notification.type === "error" && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {notification.type === "warning" && (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          {notification.type === "info" && (
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={() => onClose(notification.id)}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Notification Context/Hook
let notificationIdCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addNotification = (
    type: Notification["type"],
    title: string,
    message: string
  ) => {
    const notification: Notification = {
      id: `notification-${notificationIdCounter++}`,
      type,
      title,
      message,
      timestamp: new Date(),
    };
    setNotifications((prev) => [notification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    notifications,
    isOpen,
    addNotification,
    removeNotification,
    clearAll,
    toggleSheet,
  };
}

