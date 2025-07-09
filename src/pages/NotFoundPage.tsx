import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <div className="text-6xl font-bold text-gray-600 -mt-4">Oops!</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 underline mx-2"
            >
              Go Back
            </button>
            |
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800 underline mx-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 