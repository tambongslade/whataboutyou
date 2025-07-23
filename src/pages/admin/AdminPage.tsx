import { useState, useEffect } from 'react';
import AdminNavbar from './components/AdminNavbar';
import ConferenceRegistrations from './components/ConferenceRegistrations';
import AdminStats from './components/AdminStats';
import AdminLogin from './components/AdminLogin';
import MissAndMasterStats from './components/MissAndMasterStats';
import CandidatesList from './components/CandidatesList';
import TicketStats from './components/TicketStats';
import TicketsList from './components/TicketsList';
import QRValidationInterface from './components/QRValidationInterface';
import { type ConferenceRegistration } from '../../services/registrationService';
import { type Candidate } from '../../services/candidateService';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if admin is already authenticated and token is valid
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminAuth === 'true' && adminToken) {
      // TODO: Optionally verify token with backend
      setIsAuthenticated(true);
    } else {
      // Clear any stale auth data
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store the JWT token and user info
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('adminAuthenticated', 'true');
        
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
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
            
            {/* Conference Stats */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">👥</span>
                Inscriptions Conférence
              </h2>
              <AdminStats registrations={registrations} />
            </div>

            {/* Ticket Stats */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🎫</span>
                Tickets WAY 2025
              </h2>
              <TicketStats />
            </div>
            
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

        {activeTab === 'tickets' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🎫</span>
                Gestion des Tickets
              </h1>
              <div className="text-sm text-gray-600">
                WAY 2025 - 23-26 Janvier
              </div>
            </div>
            
            <TicketStats />
            
            <TicketsList />
          </div>
        )}

        {activeTab === 'qr-validation' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📱</span>
                Validation QR Code
              </h1>
              <div className="text-sm text-gray-600 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Interface Entrée
              </div>
            </div>
            
            <QRValidationInterface />
          </div>
        )}

        {activeTab === 'miss-master' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">👑</span>
                Miss & Master Dashboard
              </h1>
              <div className="text-sm text-gray-600">
                Concours en cours
              </div>
            </div>
            
            <MissAndMasterStats 
              candidates={candidates} 
              setCandidates={setCandidates}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Classement des Candidats
              </h2>
              <CandidatesList 
                candidates={candidates}
                isPreview={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 