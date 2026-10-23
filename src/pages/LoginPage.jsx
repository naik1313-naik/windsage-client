import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const submit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setError(null);
    if (!form.email) setFieldErrors({ email: 'Email is required.' });
    if (!form.password) setFieldErrors({ password: 'Password is required.' });
    if (fieldErrors.email || fieldErrors.password) return;

    try {
      await login({ email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const fillDemo = () => {
    setForm({ email: 'operator@windsage.ai', password: 'demo123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-slate-200">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
            <Lock size={14} /> WindSage AI
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-slate-500">Access your turbine alarm dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  fieldErrors.email ? 'border-red-500' : 'border-slate-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`w-full pr-4 py-3 rounded-lg border ${
                  fieldErrors.password ? 'border-red-500' : 'border-slate-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <ArrowRight size={16} /> Sign in
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Demo account:{' '}
          <button
            type="button"
            onClick={fillDemo}
            className="font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            operator@windsage.ai / demo123
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo uses local session only — no training, no backend required.
        </p>
      </div>
    </div>
  );
}
