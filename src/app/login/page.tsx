'use client'

import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { matricula, password });

      // Guardar el token y los datos del usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir al dashboard o página principal
      router.push('/bikes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo / Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 ring-1 ring-white/10 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm2 0h6V8a3 3 0 0 0-6 0Zm3 4a1.5 1.5 0 0 0-1.5 1.5V17a1.5 1.5 0 0 0 3 0v-1.5A1.5 1.5 0 0 0 12 14Z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-center mb-8">BiciTec Smart System</h1>
        
        <div className="w-full mt-6 rounded-2xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <label className="block text-sm font-medium text-slate-300" htmlFor="StudentID">
            <span className="sr-only">StudentID</span>
            <div className="mt-1 relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-8 8a8 8 0 1 1 16 0 1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
                </svg>
              </span>
              <input
                id="matricula"
                name="matricula"
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800 focus:outline-none"
                required
              />
            </div>
          </label>
          
          <label className="block text-sm font-medium text-slate-300" htmlFor="password">
            <span className="sr-only">Password</span>
            <div className="mt-1 relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm2 0h6V8a3 3 0 0 0-6 0Zm3 4a1.5 1.5 0 0 0-1.5 1.5V17a1.5 1.5 0 0 0 3 0v-1.5A1.5 1.5 0 0 0 12 14Z" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800 focus:outline-none"
                required
              />
            </div>
          </label>
          
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-sky-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-900/30 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:scale-[.99] transition"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 text-sm text-red-400 bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-sky-400 hover:text-sky-300">Regístrate</Link>
        </p>
      </div>
    </div>
  </div>
  )}