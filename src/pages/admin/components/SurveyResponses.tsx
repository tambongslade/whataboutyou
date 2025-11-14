import { useState, useEffect } from 'react';
import {
  getAllSurveys,
  getSurveyStatistics,
  exportSurveysToExcel,
  type SurveyResponse
} from '../../../services/surveyService';

const SurveyResponses = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Statistics state
  const [stats, setStats] = useState<{
    total: number;
    byCategory: Record<string, number>;
    recommendations: { oui: number; peutEtre: number; non: number };
  }>({
    total: 0,
    byCategory: {},
    recommendations: { oui: 0, peutEtre: 0, non: 0 }
  });

  useEffect(() => {
    fetchResponses();
    fetchStatistics();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchResponses();
  }, [filterCategory, searchTerm]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllSurveys(
        1,
        200, // Get more responses for admin
        filterCategory,
        searchTerm
      );

      if (response.success) {
        setResponses(response.data.surveys);
      }
    } catch (err: unknown) {
      console.error('Error fetching survey responses:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des sondages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getSurveyStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: unknown) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Export surveys to Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);

      // Get the Excel file as a Blob
      const blob = await exportSurveysToExcel(
        filterCategory,
        searchTerm,
        'desc'
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0];
      link.download = `sondages_${today}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error('Error exporting to Excel:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Filtered responses are already handled by the API
  const filteredResponses = responses;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exposant':
        return 'bg-purple-100 text-purple-800';
      case 'Participant étudiant':
        return 'bg-blue-100 text-blue-800';
      case 'Participant collégien':
        return 'bg-green-100 text-green-800';
      case 'Participant travailleur':
        return 'bg-orange-100 text-orange-800';
      case 'Participant partenaire':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des réponses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchResponses();
              fetchStatistics();
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Réponses totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recommanderaient</p>
              <p className="text-3xl font-bold text-green-600">{stats.recommendations.oui}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Peut-être</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.recommendations.peutEtre}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ne recommanderaient pas</p>
              <p className="text-3xl font-bold text-red-600">{stats.recommendations.non}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className={`p-4 rounded-lg ${getCategoryColor(category)}`}>
              <p className="text-sm font-medium">{category}</p>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Filtres et Actions</h3>
            <button
              onClick={handleExportToExcel}
              disabled={isExporting || filteredResponses.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Export en cours...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Exporter vers Excel</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, prénom ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par catégorie
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Toutes les catégories</option>
                <option value="Exposant">Exposant</option>
                <option value="Participant étudiant">Participant étudiant</option>
                <option value="Participant collégien">Participant collégien</option>
                <option value="Participant travailleur">Participant travailleur</option>
                <option value="Participant partenaire">Participant partenaire</option>
              </select>
            </div>
          </div>

          {(filterCategory !== 'all' || searchTerm) && (
            <div className="text-sm text-gray-600">
              {filteredResponses.length > 0 ? (
                <p>
                  <strong>{filteredResponses.length}</strong> sondage(s) trouvé(s)
                  {filterCategory !== 'all' && ` dans la catégorie "${filterCategory}"`}
                  {searchTerm && ` avec "${searchTerm}"`}
                </p>
              ) : (
                <p className="text-orange-600">Aucun sondage ne correspond aux filtres sélectionnés</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Responses list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Réponses au sondage ({filteredResponses.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommandation
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
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune réponse trouvée
                  </td>
                </tr>
              ) : (
                filteredResponses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.prenom} {response.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {response.occupationDetails}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(response.category)}`}>
                        {response.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{response.email}</div>
                      <div className="text-sm text-gray-500">{response.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        response.recommandation === 'Oui' ? 'bg-green-100 text-green-800' :
                        response.recommandation === 'Peut-être' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {response.recommandation}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(response.submittedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedResponse(response)}
                        className="text-orange-600 hover:text-orange-900 font-medium"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response details modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Détails de la réponse
              </h2>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nom complet:</span>
                    <p className="font-medium">{selectedResponse.prenom} {selectedResponse.nom}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Catégorie:</span>
                    <p className="font-medium">{selectedResponse.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedResponse.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Téléphone:</span>
                    <p className="font-medium">{selectedResponse.telephone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Occupation:</span>
                    <p className="font-medium">{selectedResponse.occupationDetails}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Participation précédente:</span>
                    <p className="font-medium">{selectedResponse.previousParticipation}</p>
                  </div>
                </div>
              </div>

              {/* Category-specific responses */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Réponses spécifiques</h3>
                <div className="space-y-3 text-sm">
                  {Object.entries(selectedResponse.categoryResponses).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600 block mb-1">Question {key}:</span>
                      <p className="font-medium bg-white p-2 rounded">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* General suggestions */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Suggestions générales</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">Plus grande force:</span>
                    <p className="font-medium bg-white p-2 rounded">{selectedResponse.plusGrandeForce}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Point à améliorer:</span>
                    <p className="font-medium bg-white p-2 rounded">{selectedResponse.pointAmeliorer}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Recommandation:</span>
                    <p className="font-medium">
                      <span className={`px-3 py-1 rounded-full ${
                        selectedResponse.recommandation === 'Oui' ? 'bg-green-100 text-green-800' :
                        selectedResponse.recommandation === 'Peut-être' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedResponse.recommandation}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-sm text-gray-500 text-center">
                Soumis le {new Date(selectedResponse.submittedAt).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
