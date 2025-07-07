interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminNavbar = ({ activeTab, setActiveTab, onLogout }: AdminNavbarProps) => {
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-orange-600">
              WhatAboutYou
            </div>
            <div className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
              Admin
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Tableau de Bord
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'registrations'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Inscriptions
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Connecté en tant qu'Admin
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 