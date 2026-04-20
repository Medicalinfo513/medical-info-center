import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <g clipPath="url(#g)">
      <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.698H24.48v8.884h12.971c-.56 2.992-2.24 5.528-4.776 7.228v6.004h7.728c4.52-4.164 7.13-10.3 7.13-17.418z" fill="#4285F4" />
      <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.832l-7.728-6.004c-2.148 1.44-4.896 2.292-8.16 2.292-6.276 0-11.592-4.236-13.5-9.924H2.988v6.18C6.948 42.9 15.156 48 24.48 48z" fill="#34A853" />
      <path d="M10.98 28.532A14.36 14.36 0 0 1 10.2 24c0-1.572.276-3.096.756-4.532V13.29H2.988A23.95 23.95 0 0 0 .48 24c0 3.876.924 7.548 2.508 10.71l8.0-6.178z" fill="#FBBC05" />
      <path d="M24.48 9.54c3.54 0 6.708 1.212 9.204 3.6l6.888-6.888C36.396 2.364 30.96 0 24.48 0 15.156 0 6.948 5.1 2.988 13.29l7.992 6.178C12.888 13.776 18.204 9.54 24.48 9.54z" fill="#EA4335" />
    </g>
    <defs><clipPath id="g"><rect width="48" height="48" /></clipPath></defs>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/appointment';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate(from, { replace: true });
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/appointment` },
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #dcfce7 100%)' }}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center pt-[160px] pb-16 px-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-secondary-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 mb-8 text-sm">Sign in to access your dashboard</p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-[400px]">

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-5"
          >
            {GOOGLE_ICON} Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-grow h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Or continue with email</span>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-grow h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">New to our clinic?</span>
            <div className="flex-grow h-px bg-slate-200" />
          </div>

          <Link to="/signup"
            className="w-full flex items-center justify-center border border-slate-200 rounded-xl py-3 text-sm font-bold text-secondary-900 hover:bg-slate-50 transition-all">
            Create an account
          </Link>
        </div>
      </main>
    </div>
  );
}
