'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { isAdmin } from '../../lib/auth';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ type: 'ACCIDENT', description: '', location: '', reportedBy: 1 });

  const fetchIncidents = async () => {
    const res = await api.get('/incidents');
    setIncidents(res.data);
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleDeclare = async () => {
    await api.post('/incidents', form);
    fetchIncidents();
  };

  const handleStatus = async (id: number, status: string) => {
    await api.post('/incidents/status', { id, status });
    fetchIncidents();
  };

  const statusColor = (status: string) =>
    status === 'RESOLVED' ? 'bg-green-600' : status === 'IN_PROGRESS' ? 'bg-yellow-600' : 'bg-red-600';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Declare Incident</h2>
        <div className="flex gap-4 flex-wrap">
          <select className="p-2 rounded bg-gray-700 text-white"
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>ACCIDENT</option>
            <option>TRAVAUX</option>
            <option>ROUTE_FERMEE</option>
            <option>EMBOUTEILLAGE</option>
          </select>
          <input className="flex-1 p-2 rounded bg-gray-700 text-white" placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="flex-1 p-2 rounded bg-gray-700 text-white" placeholder="Location"
            onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded" onClick={handleDeclare}>
            Declare
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>{['ID', 'Type', 'Description', 'Location', 'Status', 'Actions'].map(h => (
              <th key={h} className="p-3 text-left">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {incidents.map((inc: any) => (
              <tr key={inc.id} className="border-t border-gray-700">
                <td className="p-3">{inc.id}</td>
                <td className="p-3">{inc.type}</td>
                <td className="p-3">{inc.description}</td>
                <td className="p-3">{inc.location}</td>
                <td className="p-3">
                  <span className={`${statusColor(inc.status)} px-2 py-1 rounded text-sm`}>{inc.status}</span>
                </td>
              <td className="p-3 flex gap-2">
  {isAdmin() && <>
    <button className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
      onClick={() => handleStatus(inc.id, 'IN_PROGRESS')}>In Progress</button>
    <button className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm"
      onClick={() => handleStatus(inc.id, 'RESOLVED')}>Resolve</button>
  </>}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}