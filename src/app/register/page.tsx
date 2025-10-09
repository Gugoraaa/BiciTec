'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { 
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        matricula,
        password 
      });

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 ring-1 ring-white/10 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-slate-200"
            aria-hidden="true"
          >
            <path d="M12 4a8 8 0 1 1-6.32 12.9l-.86 2.58a1 1 0 0 1-1.9-.62l1.78-5.33A8 8 0 0 1 12 4Z" />
          </svg>
        </div>

        
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">BiciTec</h1>
          <p className="mt-1 text-sm text-slate-400">Únete a la revolución de las bicicletas inteligentes en el campus.</p>
        </div>

        
        <div className="mt-6 rounded-2xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            
            <label className="block text-sm font-medium text-slate-300" htmlFor="studentId">
              <span className="sr-only">Student ID</span>
              <div className="mt-1 relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm4 2a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Zm0 4a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2Zm-.5 5.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 0 0-5 0Z" />
                  </svg>
                </span>
                <input
                  id="matricula"
                  name="matricula"
                  type="text"
                  placeholder="Matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800"
                  required
                />
              </div>
            </label>

            
            <label className="block text-sm font-medium text-slate-300" htmlFor="firstName">
              <span className="sr-only">FirstName</span>
              <div className="mt-1 relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 8a7 7 0 0 1 14 0 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
                  </svg>
                </span>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800"
                  required
                />
              </div>
            </label>

            
            <label className="block text-sm font-medium text-slate-300" htmlFor="lastName">
              <span className="sr-only">LastName</span>
              <div className="mt-1 relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-6 5h12a6 6 0 0 0-12 0Z" />
                  </svg>
                </span>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800"
                  required
                />
              </div>
            </label>

            
            <label className="block text-sm font-medium text-slate-300" htmlFor="password">
              <span className="sr-only">Password</span>
              <div className="mt-1 relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
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
                  autoComplete="new-password"
                  className="block w-full rounded-xl border border-white/10 bg-slate-800/70 py-3 pl-10 pr-3 text-sm placeholder-slate-400 outline-none ring-0 focus:border-sky-500/60 focus:bg-slate-800"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-sky-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-900/30 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:scale-[.99] transition disabled:opacity-60"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 text-sm text-red-400 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          <p className="mt-4 text-center text-sm text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-sky-400 hover:text-sky-300">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
