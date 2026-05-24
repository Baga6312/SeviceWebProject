'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import dynamic from 'next/dynamic';
import { isAdmin } from '../../lib/auth';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function TrafficPage() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [form, setForm] = useState({ name: '', lat: 36.8189, lng: 10.1658, radius: 500 });
  const [densityForm, setDensityForm] = useState({ zoneId: 1, density: 50 });

  const fetchData = async () => {
    const [data, z] = await Promise.all([
      api.get('/traffic/data').catch(() => ({ data: [] })),
      api.get('/traffic/zones').catch(() => ({ data: [] })),
    ]);
    setTrafficData(data.data);
    setZones(z.data);
  };

  useEffect(() => { fetchData(); }, []);



  const handleMeasure = async () => {
    await api.post('/traffic/density', densityForm);
    fetchData();
  };

  const handleCreateZone = async () => {
  console.log('form:', form);
  await api.post('/traffic/zones', form);
  fetchData();
};
const handleShowMap = (zoneId: number) => {
  const zone = zones.find((z: any) => Number(z.id) === Number(zoneId));
  console.log('zone:', zone, 'zoneId:', zoneId, 'zones:', zones);
  if (zone) setSelectedZone(zone);
};

  const levelColor = (level: string) =>
    level === 'HIGH' ? 'bg-red-600' : level === 'MEDIUM' ? 'bg-yellow-600' : 'bg-green-600';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Traffic Management</h1>
      {isAdmin() && (
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
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded" onClick={handleMeasure}>
            Create Zone
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Measure Density</h2>
          <select className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            onChange={(e) => setDensityForm({ ...densityForm, zoneId: parseInt(e.target.value) })}>
            {zones.map((z: any) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
          <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="Density (0-100)" type="number"
            onChange={(e) => setDensityForm({ ...densityForm, density: parseFloat(e.target.value) })} />
          <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded" onClick={handleCreateZone}>
            Measure
          </button>
        </div>
      </div>)}

      <h2 className="text-xl font-semibold mb-4">Traffic Data</h2>
      <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>{['Zone', 'Density', 'Level', 'Timestamp', 'Map'].map(h => (
              <th key={h} className="p-3 text-left">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {trafficData.map((t: any) => {
              const zone = zones.find((z: any) => z.id === t.zoneId);
              return (
                <tr key={t.id} className="border-t border-gray-700">
                  <td className="p-3">{zone ? zone.name : `Zone ${t.zoneId}`}</td>
                  <td className="p-3">{t.density}%</td>
                  <td className="p-3"><span className={`${levelColor(t.level)} px-2 py-1 rounded text-sm`}>{t.level}</span></td>
                  <td className="p-3">{new Date(t.timestamp).toLocaleString()}</td>
                  <td className="p-3">
                    <button className="text-blue-400 hover:underline" onClick={() => handleShowMap(t.zoneId)}>
                      Show
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedZone && <MapView positions={[selectedZone]} />}
    </div>
  );
}