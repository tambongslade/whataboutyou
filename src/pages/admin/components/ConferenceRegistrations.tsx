import { useState, useEffect } from 'react';
import { getAllRegistrations, type ConferenceRegistration, resendConfirmationEmail } from '../../../services/registrationService';

interface ConferenceRegistrationsProps {
  registrations: ConferenceRegistration[];
  setRegistrations: (registrations: ConferenceRegistration[]) => void;
  isPreview?: boolean;
}

const ConferenceRegistrations = ({ registrations, setRegistrations, isPreview = false }: ConferenceRegistrationsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSituation, setFilterSituation] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<ConferenceRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  // Load registrations from backend API
  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error('Error loading registrations:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des inscriptions');
        setRegistrations([]); // Ensure registrations is always an array
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [setRegistrations]);

  // Resend confirmation email
  const handleResendEmail = async (registrationId: string) => {
    if (!registrationId) return;
    
    try {
      setResendingEmail(registrationId);
      await resendConfirmationEmail(registrationId);
      alert('Email de confirmation renvoyé avec succès!');
    } catch (err) {
      console.error('Error resending email:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setResendingEmail(null);
    }
  };

  // Filter registrations
  const safeRegistrations = Array.isArray(registrations) ? registrations : [];
  const filteredRegistrations = safeRegistrations.filter(registration => {
    const matchesSearch = 
      registration.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.quartier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.registrationNumber && registration.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterSituation === 'all' || registration.situation === filterSituation;
    
    return matchesSearch && matchesFilter;
  });

  const displayedRegistrations = isPreview ? filteredRegistrations.slice(0, 5) : filteredRegistrations;

  const getSituationBadge = (situation: string) => {
    const badges = {
      rouge: { color: 'bg-red-100 text-red-800', emoji: '🔴', label: 'ROUGE' },
      bleu: { color: 'bg-blue-100 text-blue-800', emoji: '🔵', label: 'BLEU' },
      jaune: { color: 'bg-yellow-100 text-yellow-800', emoji: '🟡', label: 'JAUNE' }
    };
    
    const badge = badges[situation as keyof typeof badges] || { color: 'bg-gray-100 text-gray-800', emoji: '⚪', label: 'AUTRE' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <span className="mr-1">{badge.emoji}</span>
        {badge.label}
      </span>
    );
  };

  const formatDate = (date: Date | string | any) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Chargement des inscriptions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header and Filters */}
      {!isPreview && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Inscriptions à la Conférence
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRegistrations.length} inscription(s) trouvée(s)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Rechercher (nom, email, numéro)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <select
                value={filterSituation}
                onChange={(e) => setFilterSituation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Toutes situations</option>
                <option value="rouge">🔴 Rouge</option>
                <option value="bleu">🔵 Bleu</option>
                <option value="jaune">🟡 Jaune</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° / Participant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Situation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRegistrations.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {registration.registrationNumber && (
                      <div className="text-xs font-mono text-gray-500 mb-1">
                        {registration.registrationNumber}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {registration.prenom} {registration.nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {registration.age} ans • {registration.quartier}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSituationBadge(registration.situation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{registration.email}</div>
                  <div className="text-sm text-gray-500">{registration.numeroTelephone}</div>
                  {registration.emailSent && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      📧 Email envoyé
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{registration.statut}</div>
                  {registration.organisation && (
                    <div className="text-sm text-gray-500">{registration.organisation}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.createdAt && formatDate(registration.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedRegistration(registration)}
                    className="text-orange-600 hover:text-orange-900 mr-3"
                  >
                    Voir
                  </button>
                  {registration.id && (
                    <button
                      onClick={() => handleResendEmail(registration.id!)}
                      disabled={resendingEmail === registration.id}
                      className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                    >
                      {resendingEmail === registration.id ? '⏳' : '📧'} Renvoyer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedRegistrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📋</div>
          <p className="text-gray-500">Aucune inscription trouvée</p>
        </div>
      )}

      {isPreview && registrations.length > 5 && (
        <div className="p-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Affichage de 5 sur {registrations.length} inscriptions
          </p>
        </div>
      )}

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Détails de l'inscription
                </h3>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedRegistration.registrationNumber && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">Numéro d'inscription</label>
                    <p className="text-lg font-mono text-orange-600">{selectedRegistration.registrationNumber}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.nom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.prenom}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Âge</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.age} ans</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Situation</label>
                    <div className="mt-1">{getSituationBadge(selectedRegistration.situation)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.numeroTelephone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quartier</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.quartier}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.nationalite}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedRegistration.statut}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expérience Conférence</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.aDejaParticipe === 'oui' ? 'Oui' : 'Non'}</p>
                  </div>
                </div>
                
                {selectedRegistration.organisation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organisation</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.organisation}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                    <p className="text-sm text-gray-900">
                      {selectedRegistration.createdAt && formatDate(selectedRegistration.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut Email</label>
                    <p className="text-sm text-gray-900">
                      {selectedRegistration.emailSent ? '✅ Envoyé' : '❌ Non envoyé'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceRegistrations; 