import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, Loader2, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white shadow-md shadow-brand-500/25 mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to CrewUp
        </h2>
        <p className="text-sm text-slate-600">
          Sign in to collaborate with your student project teams
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                University / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@student.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" />
              Quick Fill Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('alex@student.edu')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-brand-50 hover:border-brand-300 transition-colors"
              >
                <div className="font-bold text-slate-800">Alex (Full-Stack)</div>
                <div className="text-[10px] text-slate-500 truncate">Project Owner</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('sarah@student.edu')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-brand-50 hover:border-brand-300 transition-colors"
              >
                <div className="font-bold text-slate-800">Sarah (AI / ML)</div>
                <div className="text-[10px] text-slate-500 truncate">Applicant / Lead</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('marcus@student.edu')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-brand-50 hover:border-brand-300 transition-colors"
              >
                <div className="font-bold text-slate-800">Marcus (Mobile)</div>
                <div className="text-[10px] text-slate-500 truncate">React Native / AWS</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('elena@student.edu')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-brand-50 hover:border-brand-300 transition-colors"
              >
                <div className="font-bold text-slate-800">Elena (UI / UX)</div>
                <div className="text-[10px] text-slate-500 truncate">Team Member</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Password for all demo accounts: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">password123</code>
            </p>
          </div>

          <div className="text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
