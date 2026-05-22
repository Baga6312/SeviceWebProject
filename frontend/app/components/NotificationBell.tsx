'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:3002');
    socket.on('connect', () => console.log('WS connected:', socket.id));
    socket.on('connect_error', (err) => console.log('WS error:', err.message));
    socket.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnread((prev) => prev + 1);
    });
    return () => { socket.disconnect(); };
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) setUnread(0);
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2 text-white hover:text-blue-400">
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-700 font-semibold">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-400">No notifications yet</p>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="p-4 border-b border-gray-700 hover:bg-gray-700">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.type}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}