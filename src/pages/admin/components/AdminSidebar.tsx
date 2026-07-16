import { NavLink } from 'react-router-dom';
import { useState } from 'react';

interface AdminSidebarProps {
  onLogout: () => void;
}

interface NavItem {
  to: string;
  label: string;
  group: string;
}

const navItems: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', group: 'Overview' },
  { to: '/admin/registrations', label: 'Inscriptions', group: 'Operations' },
  { to: '/admin/tickets', label: 'Tickets', group: 'Operations' },
  { to: '/admin/qr-validation', label: 'Scanner QR', group: 'Operations' },
  { to: '/admin/posts', label: 'Posts', group: 'Content' },
  { to: '/admin/miss-master', label: 'Miss & Master', group: 'Content' },
  { to: '/admin/users', label: 'Utilisateurs', group: 'Community' },
  { to: '/admin/surveys', label: 'Sondages', group: 'Community' },
];

const grouped: Record<string, NavItem[]> = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
  (acc[item.group] ??= []).push(item);
  return acc;
}, {});

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  let counter = 0;

  return (
    <>
      {/* Mobile open trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-black text-white p-2.5 shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-black text-white flex flex-col z-50 transition-transform duration-300 w-72 lg:w-64 flex-shrink-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Right edge accent */}
        <div aria-hidden className="absolute top-0 right-0 bottom-0 w-px bg-white/5" />

        {/* Header */}
        <div className="relative px-6 py-7 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-azonix text-2xl tracking-tight leading-none">
                WAY <span className="text-red-500">26</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400" />
                </span>
                <span className="font-nekst text-[9px] tracking-[0.4em] uppercase text-gray-400">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
              aria-label="Fermer le menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto py-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-7">
              <div className="px-6 mb-3 flex items-center gap-2">
                <span className="w-3 h-px bg-gray-700" />
                <span className="font-nekst text-[9px] tracking-[0.4em] uppercase text-gray-600">
                  {group}
                </span>
              </div>
              {items.map((item) => {
                counter += 1;
                const idx = String(counter).padStart(2, '0');
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-4 pl-6 pr-4 py-2.5 font-nekst text-[11px] tracking-[0.25em] uppercase transition-colors ${
                        isActive ? 'text-white bg-white/[0.04]' : 'text-gray-500 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          aria-hidden
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-200 ${
                            isActive
                              ? 'w-[3px] bg-red-500'
                              : 'w-[2px] bg-transparent group-hover:bg-yellow-400/50'
                          }`}
                        />
                        <span
                          className={`font-mono text-[10px] transition-colors ${
                            isActive ? 'text-red-500' : 'text-gray-700 group-hover:text-gray-500'
                          }`}
                        >
                          {idx}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative border-t border-white/10 p-6 space-y-5">
          <button
            onClick={onLogout}
            className="group flex items-center justify-between w-full font-nekst text-[11px] tracking-[0.25em] uppercase text-gray-400 hover:text-red-500 transition-colors"
          >
            <span>Déconnexion</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
          <div className="flex items-center justify-between font-nekst text-[9px] tracking-[0.4em] uppercase text-gray-700">
            <span>v2.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              <span>WAY · 26</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
