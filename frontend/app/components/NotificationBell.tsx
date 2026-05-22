'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.isRead).length;


  const fetchNotifications = async () => {
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);
    if (!userId) return;
    try {
      const res = await api.get(`/notifications/${userId}`);
      console.log('notifs:', res.data);
      setNotifications(res.data);
    } catch (e: any) {
      console.log('fetch error:', e.response?.data);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const socket = io('http://localhost:3002');
    socket.on('connect', () => console.log('WS connected:', socket.id));
    socket.on('connect_error', (err) => console.log('WS error:', err.message));
    socket.on('notification', () => fetchNotifications());
    return () => { socket.disconnect(); };
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await api.post('/notifications/read', { id });
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-white hover:text-blue-400">
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
            notifications.map((n) => (
              <div key={n.id} className={`p-4 border-b border-gray-700 hover:bg-gray-700 flex justify-between items-start ${!n.isRead ? 'bg-gray-750' : ''}`}>
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.type}</p>
                </div>
                {!n.isRead && (
                  <button className="text-xs text-blue-400 hover:underline ml-2 shrink-0"
                    onClick={() => handleMarkAsRead(n.id)}>
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}