'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { setUserData } from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('login response:', res.data);
      setUserData(res.data.user.id, res.data.user.role, res.data.token);
      router.push('/dashboard');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Urban Traffic Login</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input className="w-full mb-4 p-3 rounded bg-gray-700 text-white" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-4 p-3 rounded bg-gray-700 text-white" type="password"
          placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          onClick={handleLogin}>Login</button>
        <p className="text-gray-400 mt-4 text-center">
          No account?{' '}
          <span className="text-blue-400 cursor-pointer" onClick={() => router.push('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}