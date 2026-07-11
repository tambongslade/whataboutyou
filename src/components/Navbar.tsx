import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
  userAvatar?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, userAvatar, onLogin, onLogout }: NavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWayDropdownOpen, setIsWayDropdownOpen] = useState(false);
  const [isMobileWayOpen, setIsMobileWayOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks: { to: string; label: string; comingSoon?: boolean }[] = [
    { to: '/', label: 'ACCUEIL' },
    { to: '/miss-and-master', label: 'MISS & MASTER' },
    { to: '/boutique', label: 'BOUTIQUE' },
    { to: '/posts', label: 'POSTS' },
    { to: '/contact', label: 'CONTACT' },
  ];

  const wayEditions = [
    { to: '/way-1', label: 'WAY 1' },
    { to: '/way-2', label: 'WAY 2' },
    { to: '/way-3', label: 'WAY 3' },
    { to: '/way-4', label: 'WAY 4' },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const isWayActive = wayEditions.some((e) => location.pathname.startsWith(e.to));

  const ActiveDot = () => (
    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
    </span>
  );

  const desktopLinkClass = (active: boolean) =>
    `font-nekst px-2 py-2 text-sm font-light tracking-widest uppercase relative transition-colors duration-200 group
    ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`;

  const mobileLinkClass = (active: boolean) =>
    `font-nekst block px-3 py-2 text-base font-light tracking-widest uppercase transition-colors duration-200 border-l-2
    ${active ? 'text-white border-white' : 'text-gray-400 hover:text-white border-transparent hover:border-gray-600'}`;

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo.webp"
                alt="What About You - WAY 2026"
                className="h-10 w-auto transition-opacity hover:opacity-80"
              />
            </Link>
          </div>

          {/* Desktop Navigation — Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navLinks.slice(0, 2).map((link) =>
                link.comingSoon ? (
                  <span
                    key={link.to}
                    className="font-nekst text-gray-500 px-2 py-2 text-sm font-light tracking-widest uppercase cursor-default relative flex items-center gap-2"
                  >
                    {link.label}
                    <span className="text-[10px] bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full leading-none tracking-normal normal-case">
                      Bientôt
                    </span>
                  </span>
                ) : (
                  <Link key={link.to} to={link.to} className={desktopLinkClass(isActive(link.to))}>
                    {link.label}
                    {/* hover underline */}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-white/60 transition-all duration-300 ${isActive(link.to) ? 'w-0' : 'w-0 group-hover:w-full'}`} />
                    {/* active ping dot */}
                    {isActive(link.to) && <ActiveDot />}
                  </Link>
                )
              )}

              {/* WHATABOUTYOU Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsWayDropdownOpen(true)}
                onMouseLeave={() => setIsWayDropdownOpen(false)}
              >
                <button
                  className={`font-nekst px-2 py-2 text-sm font-light tracking-widest uppercase flex items-center gap-1 cursor-pointer relative group transition-colors duration-200
                  ${isWayActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  WHATABOUTYOU
                  {/* hover underline */}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-white/60 transition-all duration-300 ${isWayActive ? 'w-0' : 'w-0 group-hover:w-full'}`} />
                  {/* active ping dot */}
                  {isWayActive && <ActiveDot />}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isWayDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isWayDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {wayEditions.map((edition) => (
                      <Link
                        key={edition.to}
                        to={edition.to}
                        className={`font-nekst block px-5 py-3 text-sm tracking-widest uppercase transition-colors
                        ${isActive(edition.to) ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                      >
                        {edition.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.slice(2).map((link) =>
                link.comingSoon ? (
                  <span
                    key={link.to}
                    className="font-nekst text-gray-500 px-2 py-2 text-sm font-light tracking-widest uppercase cursor-default relative flex items-center gap-2"
                  >
                    {link.label}
                    <span className="text-[10px] bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full leading-none tracking-normal normal-case">
                      Bientôt
                    </span>
                  </span>
                ) : (
                  <Link key={link.to} to={link.to} className={desktopLinkClass(isActive(link.to))}>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-white/60 transition-all duration-300 ${isActive(link.to) ? 'w-0' : 'w-0 group-hover:w-full'}`} />
                    {isActive(link.to) && <ActiveDot />}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <button className="text-gray-400 hover:text-white p-2 rounded-md transition-colors relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center text-gray-400 hover:text-white p-1 rounded-md transition-colors"
                  aria-label="Menu utilisateur"
                >
                  {userAvatar ? (
                    <img className="h-8 w-8 rounded-full object-cover" src={userAvatar} alt="Profile" />
                  ) : (
                    <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </button>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-44 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="font-nekst block w-full text-left px-5 py-3 text-sm tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={onLogin} className="text-gray-400 hover:text-white p-2 rounded-md transition-colors" aria-label="Se connecter">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white p-2 rounded-md transition-colors">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
            {navLinks.slice(0, 2).map((link) =>
              link.comingSoon ? (
                <span
                  key={link.to}
                  className="font-nekst text-gray-500 block px-3 py-2 text-base font-light tracking-widest uppercase cursor-default flex items-center gap-2"
                >
                  {link.label}
                  <span className="text-[10px] bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full leading-none tracking-normal normal-case">
                    Bientôt
                  </span>
                </span>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={mobileLinkClass(isActive(link.to))}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile WHATABOUTYOU Accordion */}
            <button
              onClick={() => setIsMobileWayOpen(!isMobileWayOpen)}
              className={`font-nekst w-full text-left px-3 py-2 text-base font-light tracking-widest uppercase flex items-center justify-between cursor-pointer transition-colors duration-200 border-l-2
              ${isWayActive ? 'text-white border-white' : 'text-gray-400 hover:text-white border-transparent hover:border-gray-600'}`}
            >
              WHATABOUTYOU
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMobileWayOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMobileWayOpen && (
              <div className="pl-6 space-y-1">
                {wayEditions.map((edition) => (
                  <Link
                    key={edition.to}
                    to={edition.to}
                    className={`font-nekst block px-3 py-2 text-sm font-light tracking-widest uppercase transition-colors duration-200 border-l-2
                    ${isActive(edition.to) ? 'text-white border-white' : 'text-gray-400 hover:text-white border-transparent hover:border-gray-600'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {edition.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.slice(2).map((link) =>
              link.comingSoon ? (
                <span
                  key={link.to}
                  className="font-nekst text-gray-500 block px-3 py-2 text-base font-light tracking-widest uppercase cursor-default flex items-center gap-2"
                >
                  {link.label}
                  <span className="text-[10px] bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full leading-none tracking-normal normal-case">
                    Bientôt
                  </span>
                </span>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={mobileLinkClass(isActive(link.to))}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-700">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogin?.();
                  }}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
