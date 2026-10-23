import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wind, AlertTriangle, LogOut, ShieldCheck, BarChart3, Clock } from 'lucide-react';

const KPIS = [
  { label: 'Active Alarms', value: '24', delta: '+3 vs yesterday', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Unresolved', value: '7', delta: 'Needs attention', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Turbines Monitored', value: '12', delta: 'All online', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Est. Energy Loss', value: '1,840 kWh', delta: 'Last 24h', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
];

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState(null);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      // Safety net: logout must never surface an error to the user.
      setLogoutError('Something went wrong while signing out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Wind className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-slate-900 text-lg tracking-tight">WindSage AI</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-slate-600">
                Welcome, {user?.name || 'Operator'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {logoutError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-2">
            <AlertTriangle size={18} className="flex-shrink-0" /> {logoutError}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-500">Wind turbine alarm intelligence &mdash; no training, open-source weights only.</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className={`${kpi.bg} rounded-xl p-5 border border-slate-200`}>
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-slate-400 text-xs">{kpi.delta}</span>
              </div>
              <p className="text-sm font-medium text-slate-600">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Alarm triage</h3>
            <p className="text-sm text-slate-500 mb-4">Review and classify incoming turbine alarms using fine-tuned open-source models.</p>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Open triage
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Work queue</h3>
            <p className="text-sm text-slate-500 mb-4">Assign incidents and track corrective actions across your turbine fleet.</p>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              View queue
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Settings</h3>
            <p className="text-sm text-slate-500 mb-4">Manage your account and notification preferences.</p>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
