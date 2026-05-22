'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { setToken } from '../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'OPERATOR' });
  const [error, setError] = useState('');

const handleRegister = async () => {
  try {
    const res = await api.post('/auth/register', form);
    setToken(res.data.token);
    localStorage.setItem('userId', res.data.user.id);
    router.push('/dashboard');
  } catch (e) {
    setError('Registration failed');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input className="w-full mb-4 p-3 rounded bg-gray-700 text-white" placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="w-full mb-4 p-3 rounded bg-gray-700 text-white" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full mb-4 p-3 rounded bg-gray-700 text-white" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="OPERATOR">OPERATOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          onClick={handleRegister}>
          Register
        </button>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <span className="text-blue-400 cursor-pointer" onClick={() => router.push('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}