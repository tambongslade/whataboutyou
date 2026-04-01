import { useState } from 'react';
import { Link } from 'react-router-dom';
import TicketPurchaseModal from './TicketPurchaseModal';

interface NavbarProps {
  isAuthenticated?: boolean;
  userAvatar?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, userAvatar, onLogin }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'ACCUEIL' },
    { to: '/boutique', label: 'BOUTIQUE' },
    { to: '/about', label: 'WHATABOUTYOU' },
    { to: '/posts', label: 'POSTS' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo.webp"
                alt="What About You - WAY 2025"
                className="h-10 w-auto transition-opacity hover:opacity-80"
              />
            </Link>
          </div>

          {/* Desktop Navigation — Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-nekst text-gray-300 hover:text-white px-2 py-2 text-sm font-light transition-colors tracking-widest uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Icon */}
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

            {/* Profile / Login */}
            {isAuthenticated ? (
              <button className="flex items-center text-gray-400 hover:text-white p-1 rounded-md transition-colors">
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
            ) : (
              <button
                onClick={onLogin}
                className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
            >
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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-nekst text-gray-300 hover:text-white block px-3 py-2 text-base font-light transition-colors tracking-widest uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsTicketModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="font-azonix bg-gradient-to-r from-orange-500 to-red-500 text-white mx-3 px-4 py-2 rounded-lg text-base font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 w-[calc(100%-1.5rem)]"
            >
              TICKETS
            </button>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 px-3 py-2">
                  {userAvatar ? (
                    <img className="h-8 w-8 rounded-full object-cover" src={userAvatar} alt="Profile" />
                  ) : (
                    <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">Profile</span>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ticket Purchase Modal */}
      <TicketPurchaseModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
