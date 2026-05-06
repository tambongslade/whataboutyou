import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminLogin from './components/AdminLogin';
import { type ConferenceRegistration } from '../../services/registrationService';
import { type Candidate } from '../../services/candidateService';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api').replace(/\/+$/, '');

console.log('🔐 Admin API Base URL:', API_BASE_URL);

export interface AdminOutletContext {
  registrations: ConferenceRegistration[];
  setRegistrations: React.Dispatch<React.SetStateAction<ConferenceRegistration[]>>;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const adminToken = localStorage.getItem('adminToken');

    if (adminAuth === 'true' && adminToken) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const loginUrl = `${API_BASE_URL}/auth/login`;
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
        return true;
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('🔐 Login failed:', response.status, errorData);
      return false;
    } catch (error) {
      console.error('🔐 Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const context: AdminOutletContext = {
    registrations,
    setRegistrations,
    candidates,
    setCandidates,
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 min-w-0 overflow-x-hidden relative">
        <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400 z-10" />
        <div className="px-6 sm:px-10 lg:px-12 py-10 pt-20 lg:pt-12 max-w-[1600px] mx-auto">
          <Outlet context={context} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
