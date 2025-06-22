import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="/Logo.webp"
                alt="WhataboutYou"
                className="h-12 mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback logo text if image fails */}
              <div className="text-2xl font-bold">
                <span className="text-red-500">What</span>
                <span className="text-white">about</span>
                <span className="text-yellow-400">You</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              QUEL EST VOTRE<br />
              SITUATION AMOUREUSE ?
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  ACCUEIL
                </Link>
              </li>
              <li>
                <Link 
                  to="/boutique" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  BOUTIQUE
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  CALENDRIER
                </Link>
              </li>
              <li>
                <Link 
                  to="/posts" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  ÉVÉNEMENTS
                </Link>
              </li>
              <li>
                <Link 
                  to="/posts" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  POSTS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">CONTACT</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  TERMS OF USE
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  PRIVACY POLICY
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  TERMS OF USE
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  PRIVACY POLICY
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.938 16.879c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297l-1.188-1.188c-.875.807-2.026 1.297-3.323 1.297zm7.119 0c-1.297 0-2.448-.49-3.323-1.297l-1.188 1.188c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297l-1.188-1.188c-.875.807-2.026 1.297-3.323 1.297z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center md:text-right">
            © COPYRIGHT ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 