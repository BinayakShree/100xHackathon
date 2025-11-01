import { useState } from 'react';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  unreadCount?: number;
  onClick?: () => void;
}

export function NotificationBell({ unreadCount = 0, onClick }: NotificationBellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Bell className={`h-5 w-5 ${isHovered ? 'text-gray-600' : 'text-gray-500'}`} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}