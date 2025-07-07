import { useState, useEffect } from 'react';
import AdminNavbar from './components/AdminNavbar';
import ConferenceRegistrations from './components/ConferenceRegistrations';
import AdminStats from './components/AdminStats';
import AdminLogin from './components/AdminLogin';
import { type ConferenceRegistration } from '../../services/registrationService';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if admin is already authenticated (you can improve this with proper auth later)
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication for now - replace with proper auth later
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setActiveTab('dashboard');
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

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Tableau de Bord Admin
              </h1>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <AdminStats registrations={registrations} />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Aperçu des Inscriptions Récentes
              </h2>
              <ConferenceRegistrations 
                registrations={registrations} 
                setRegistrations={setRegistrations}
                isPreview={true}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'registrations' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Gestion des Inscriptions
            </h1>
            <ConferenceRegistrations 
              registrations={registrations} 
              setRegistrations={setRegistrations}
              isPreview={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 