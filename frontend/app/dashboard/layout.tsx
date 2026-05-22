'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, removeToken } from '../lib/auth';
import Link from 'next/link';
import NotificationBell from '../components/NotificationBell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/vehicles', label: 'Vehicles' },
    { href: '/dashboard/traffic', label: 'Traffic' },
    { href: '/dashboard/incidents', label: 'Incidents' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-56 bg-gray-800 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6 text-blue-400">TrafficMS</h2>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`p-3 rounded font-medium ${pathname === item.href ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            {item.label}
          </Link>
        ))}
        <button className="mt-auto p-3 rounded bg-red-600 hover:bg-red-700 font-medium"
          onClick={() => { removeToken(); router.push('/login'); }}>
          Logout
        </button>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 px-8 py-4 flex justify-end border-b border-gray-700">
          <NotificationBell />
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}