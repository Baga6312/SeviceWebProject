'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ plate: '', type: 'CAR', ownerId: 1 });
  
  const [positions, setPositions] = useState([]);

  const fetchVehicles = async () => {
    const res = await api.get('/vehicles');
    setVehicles(res.data);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleAdd = async () => {
      try {
        const res = await api.post('/vehicles', { ...form, ownerId: Number(form.ownerId) });
        fetchVehicles();
      } catch (e: any) {
        console.log('Error:', e.response?.data);
      }
    };

  const handleHistory = async (vehicleId: number) => {
    const res = await api.get(`/vehicles/${vehicleId}/history`);
    setPositions(res.data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vehicles</h1>
      <div className="bg-gray-800 p-6 rounded-xl mb-6 flex gap-4">
        <input className="p-2 rounded bg-gray-700 text-white" placeholder="Plate"
          onChange={(e) => setForm({ ...form, plate: e.target.value })} />
        <select className="p-2 rounded bg-gray-700 text-white"
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>CAR</option><option>TRUCK</option><option>BUS</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded" onClick={handleAdd}>
          Add Vehicle
        </button>
      </div>
      <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>{['ID', 'Plate', 'Type', 'Status', 'History'].map(h => (
              <th key={h} className="p-3 text-left">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {vehicles.map((v: any) => (
              <tr key={v.id} className="border-t border-gray-700">
                <td className="p-3">{v.id}</td>
                <td className="p-3">{v.plate}</td>
                <td className="p-3">{v.type}</td>
                <td className="p-3"><span className="bg-green-600 px-2 py-1 rounded text-sm">{v.status}</span></td>
                <td className="p-3">
                  <button className="text-blue-400 hover:underline" onClick={() => handleHistory(v.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {positions.length > 0 && <MapView positions={positions} />}
    </div>
  );
}