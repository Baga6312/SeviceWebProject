'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ vehicles: 0, incidents: 0, congested: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vehicles, incidents, congested] = await Promise.all([
          api.get('/vehicles'),
          api.get('/incidents'),
          api.get('/traffic/congested'),
        ]);
        setStats({
          vehicles: vehicles.data.length,
          incidents: incidents.data.length,
          congested: congested.data.length,
        });
      } catch (e) {}
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Vehicles', value: stats.vehicles, color: 'bg-blue-600' },
    { label: 'Active Incidents', value: stats.incidents, color: 'bg-red-600' },
    { label: 'Congested Zones', value: stats.congested, color: 'bg-yellow-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} p-6 rounded-xl shadow-lg`}>
            <p className="text-lg font-medium opacity-80">{card.label}</p>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
