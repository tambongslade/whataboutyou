import { useState, useEffect } from 'react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(formData.username, formData.password);
      if (!success) setError("Identifiants invalides");
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const time = now.toLocaleTimeString('fr-FR', { hour12: false });
  const date = now
    .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* LEFT — Atmosphere panel */}
      <aside className="relative lg:w-3/5 bg-black text-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[44vh] lg:min-h-screen">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div aria-hidden className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-red-500 blur-[140px] opacity-30" />
        <div aria-hidden className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-yellow-400 blur-[160px] opacity-20" />

        <div
          aria-hidden
          className="absolute top-[28%] right-12 w-14 h-14 bg-red-500 opacity-90"
          style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-12deg)' }}
        />
        <div
          aria-hidden
          className="absolute bottom-[30%] left-[42%] w-10 h-10 bg-yellow-400 opacity-80"
          style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)', transform: 'rotate(18deg)' }}
        />
        <div
          aria-hidden
          className="absolute top-[55%] left-[8%] w-7 h-9 bg-yellow-400 opacity-60"
          style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(-26deg)' }}
        />

        <header className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
              Access Portal
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-gray-400 hidden sm:block">
            {date} · {time}
          </div>
        </header>

        <div className="relative z-10 max-w-2xl">
          <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-yellow-400 mb-5 flex items-center gap-3">
            <span>What About You</span>
            <span className="w-8 h-px bg-yellow-400/60" />
            <span>Édition 05</span>
          </div>

          <h1 className="font-azonix leading-[0.9] text-6xl sm:text-7xl lg:text-[7.5rem] tracking-tight">
            WAY
            <br />
            <span className="text-red-500">2026</span>
          </h1>

          <div className="mt-8 flex items-start gap-4 max-w-md">
            <div className="w-1 h-16 bg-yellow-400 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-300 leading-relaxed">
              Console administrative. Gestion des inscriptions, billetterie, candidats Miss & Master, sondages, posts et utilisateurs de la cinquième édition.
            </p>
          </div>
        </div>

        <footer className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-azonix text-3xl text-white leading-none">23 — 26</div>
            <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-500 mt-2">
              Janvier 2026 · Yaoundé
            </div>
          </div>
          <div className="text-right font-nekst text-[10px] tracking-[0.4em] uppercase">
            <div className="text-gray-500">Restricted Zone</div>
            <div className="text-red-500 mt-1">Authorized personnel only</div>
          </div>
        </footer>
      </aside>

      {/* RIGHT — Form */}
      <main className="relative lg:w-2/5 bg-stone-50 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div aria-hidden className="absolute top-0 left-0 right-0 h-1 bg-yellow-400 lg:hidden" />

        <div className="absolute top-6 left-6 lg:hidden font-azonix text-2xl text-black tracking-tight">
          WAY <span className="text-red-500">2026</span>
        </div>
        <div className="absolute top-6 right-6 font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
          01 / Auth
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-10">
            <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-red-500 mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-red-500" />
              Sign In
            </div>
            <h2 className="font-azonix text-3xl sm:text-4xl text-black leading-tight">
              Administrator
              <br />
              <span className="text-gray-400">Console</span>
            </h2>
            <div className="w-12 h-[2px] bg-yellow-400 mt-6" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
              <div className="border-l-2 border-red-500 bg-red-500/5 px-4 py-3">
                <div className="flex items-center gap-2 font-nekst text-[10px] tracking-[0.3em] uppercase text-red-700 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Erreur
                </div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label className="block font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3">
                Identifiant
              </label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="admin@whataboutyou.cm"
                required
                autoComplete="email"
                className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-black px-0 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center justify-between font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3">
                <span>Mot de passe</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-black px-0 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-black text-white font-nekst text-xs tracking-[0.3em] uppercase py-4 hover:bg-red-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-6 mt-8"
            >
              <span>{loading ? 'Connexion...' : 'Authentifier'}</span>
              <span className="flex items-center">
                {loading ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={1.5} d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                )}
              </span>
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
            <span>Admin · v2.0</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Secure
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
