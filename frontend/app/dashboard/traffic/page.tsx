'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function TrafficPage() {
  const [congested, setCongested] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ name: '', lat: 36.8189, lng: 10.1658, radius: 500 });
  const [densityForm, setDensityForm] = useState({ zoneId: 1, density: 50 });

  const fetchData = async () => {
    const [c, z] = await Promise.all([
      api.get('/traffic/congested'),
      api.get('/traffic/zones').catch(() => ({ data: [] })),
    ]);
    setCongested(c.data);
    setZones(z.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateZone = async () => {
    await api.post('/traffic/zones', form);
    fetchData();
  };

  const handleMeasure = async () => {
    await api.post('/traffic/density', densityForm);
    fetchData();
  };

  const levelColor = (level: string) =>
    level === 'HIGH' ? 'bg-red-600' : level === 'MEDIUM' ? 'bg-yellow-600' : 'bg-green-600';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Traffic Zones</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Create Zone</h2>
          <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="Zone name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="flex gap-2 mb-3">
            <input className="flex-1 p-2 rounded bg-gray-700 text-white" placeholder="Lat" type="number"
              defaultValue={36.8189} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })} />
            <input className="flex-1 p-2 rounded bg-gray-700 text-white" placeholder="Lng" type="number"
              defaultValue={10.1658} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })} />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded" onClick={handleCreateZone}>
            Create Zone
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Measure Density</h2>
          <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="Zone ID" type="number"
            onChange={(e) => setDensityForm({ ...densityForm, zoneId: parseInt(e.target.value) })} />
          <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="Density (0-100)" type="number"
            onChange={(e) => setDensityForm({ ...densityForm, density: parseFloat(e.target.value) })} />
          <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded" onClick={handleMeasure}>
            Measure
          </button>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Congested Zones</h2>
      <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>{['Zone ID', 'Density', 'Level', 'Timestamp'].map(h => (
              <th key={h} className="p-3 text-left">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {congested.map((c: any) => (
              <tr key={c.id} className="border-t border-gray-700">
                <td className="p-3">{c.zoneId}</td>
                <td className="p-3">{c.density}%</td>
                <td className="p-3"><span className={`${levelColor(c.level)} px-2 py-1 rounded text-sm`}>{c.level}</span></td>
                <td className="p-3">{new Date(c.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {zones.length > 0 && <MapView positions={zones} />}
    </div>
  );
}