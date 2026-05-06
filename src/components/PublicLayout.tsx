import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal, { type AuthUser } from './AuthModal';

const PublicLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem('userAuthenticated');
    const stored = localStorage.getItem('userInfo');
    if (flag === 'true' && stored) {
      try {
        setUser(JSON.parse(stored));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('userAuthenticated');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
      }
    }
  }, []);

  const handleLogin = () => setIsAuthModalOpen(true);

  const handleAuthSuccess = (authUser: AuthUser) => {
    setUser(authUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        userAvatar={typeof user?.avatar === 'string' ? user.avatar : undefined}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
