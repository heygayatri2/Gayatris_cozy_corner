import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush/20 to-cream px-4 py-12">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-softBrown/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-softBrown/20 to-blush/20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-softBrown" />
          </div>
          <h1 className="font-display text-4xl font-bold text-dark mb-2">Admin</h1>
          <p className="text-dark/60">Gayatri's Cozy Corner</p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-sage/20 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-dark text-center">Welcome Back</h2>
          
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark placeholder-dark/40 transition"
                  placeholder="gayatrimodak07@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/40" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark placeholder-dark/40 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-softBrown to-blush text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md shadow-softBrown/20 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg mt-8"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-sage/20">
            <p className="text-sm text-dark/60">
              Admin panel for <span className="font-semibold text-softBrown">Gayatri's Cozy Corner</span>
            </p>
          </div>
        </div>

        {/* Bottom Message */}
        <p className="text-center text-sm text-dark/50 mt-6">
          🔒 This area is secured and only accessible to authorized administrators
        </p>
      </div>
    </div>
  );
}
