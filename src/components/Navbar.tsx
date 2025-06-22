import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
  userAvatar?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, userAvatar, onLogin }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWhataboutyouDropdownOpen, setIsWhataboutyouDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleWhataboutyouDropdown = () => {
    setIsWhataboutyouDropdownOpen(!isWhataboutyouDropdownOpen);
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Always at the beginning */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/Logo.webp" 
                alt="WhataboutYou Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                ACCUEIL
              </Link>
              <Link
                to="/events"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                ÉVÉNEMENT
              </Link>
              
              {/* WHATABOUTYOU Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleWhataboutyouDropdown}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center"
                >
                  WHATABOUTYOU
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isWhataboutyouDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isWhataboutyouDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link
                        to="/about"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        À propos
                      </Link>
                      <Link
                        to="/team"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        Équipe
                      </Link>
                      <Link
                        to="/history"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        Histoire
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/miss-and-master"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                MISS AND MASTER
              </Link>
              <Link
                to="/tombola"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                TOMBOLA
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-400 hover:text-white p-2 rounded-md transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Icon */}
                <button className="text-gray-400 hover:text-white p-2 rounded-md transition-colors relative">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-3.5-5.5L15 5a7 7 0 00-6 0L7.5 11.5 4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                    />
                  </svg>
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="relative">
                  <button className="flex items-center text-gray-400 hover:text-white p-1 rounded-md transition-colors">
                    {userAvatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={userAvatar}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
            <Link
              to="/"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
            >
              ACCUEIL
            </Link>
            <Link
              to="/events"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
            >
              ÉVÉNEMENT
            </Link>
            
            {/* WHATABOUTYOU Mobile Dropdown */}
            <div>
              <button
                onClick={toggleWhataboutyouDropdown}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left flex items-center justify-between"
              >
                WHATABOUTYOU
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isWhataboutyouDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isWhataboutyouDropdownOpen && (
                <div className="pl-6 space-y-1">
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white block px-3 py-2 text-sm transition-colors"
                  >
                    À propos
                  </Link>
                  <Link
                    to="/team"
                    className="text-gray-400 hover:text-white block px-3 py-2 text-sm transition-colors"
                  >
                    Équipe
                  </Link>
                  <Link
                    to="/history"
                    className="text-gray-400 hover:text-white block px-3 py-2 text-sm transition-colors"
                  >
                    Histoire
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/miss-and-master"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
            >
              MISS AND MASTER
            </Link>
            <Link
              to="/tombola"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
            >
              TOMBOLA
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
            >
              CONTACT
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 px-3 py-2">
                  <div className="flex items-center space-x-3">
                    {userAvatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={userAvatar}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-gray-300 text-sm">Profile</span>
                  </div>
                  <button className="text-gray-400 hover:text-white p-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-white p-2 relative">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-3.5-5.5L15 5a7 7 0 00-6 0L7.5 11.5 4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mx-3"
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