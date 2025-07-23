import { useState, useEffect } from 'react';
import { getTicketStatistics, type TicketsStatistics } from '../../../services/ticketService';

interface TicketStatsProps {
  tickets?: any[];
}

const TicketStats = ({ tickets }: TicketStatsProps) => {
  const [stats, setStats] = useState<TicketsStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTicketStats();
  }, []);

  const fetchTicketStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTicketStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error loading ticket statistics:', err);
      
      // Handle specific authentication errors
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          setError('Accès non autorisé. Veuillez vous reconnecter à l\'administration.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color, icon }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Chargement des statistiques tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="text-lg font-medium text-red-900">Erreur de chargement</h3>
            <p className="text-red-600 mb-2">{error}</p>
            {error.includes('Accès non autorisé') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                <p className="text-xs text-yellow-700">
                  💡 <strong>Solution :</strong> Déconnectez-vous et reconnectez-vous à l'administration pour obtenir un nouveau token.
                </p>
              </div>
            )}
            <button
              onClick={fetchTicketStats}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Aucune statistique disponible</p>
      </div>
    );
  }

  const conversionRate = (stats.total || 0) > 0 ? (((stats.confirmed || 0) / (stats.total || 0)) * 100).toFixed(1) : '0';
  const validationRate = (stats.confirmed || 0) > 0 ? (((stats.validated || 0) / (stats.confirmed || 0)) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.total || 0}
          subtitle="Toutes commandes"
          color="#f59e0b"
          icon="🎫"
        />
        
        <StatCard
          title="Tickets Confirmés"
          value={stats.confirmed || 0}
          subtitle={`${conversionRate}% de conversion`}
          color="#10b981"
          icon="✅"
        />
        
        <StatCard
          title="Tickets Validés"
          value={stats.validated || 0}
          subtitle={`${validationRate}% d'utilisation`}
          color="#3b82f6"
          icon="🎯"
        />
        
        <StatCard
          title="Revenus"
          value={`${(stats.totalRevenue || 0).toLocaleString()} FCFA`}
          subtitle="Tickets confirmés"
          color="#8b5cf6"
          icon="💰"
        />
      </div>

      {/* Today's Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Valides Aujourd'hui"
          value={stats.todayValid || 0}
          subtitle="Tickets pour aujourd'hui"
          color="#06b6d4"
          icon="📅"
        />
        
        <StatCard
          title="Validés Aujourd'hui"
          value={stats.todayValidated || 0}
          subtitle="Entrées scannées"
          color="#84cc16"
          icon="🚪"
        />
      </div>

      {/* Situation Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🎨</span>
          Répartition par Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔴</span>
              <div>
                <p className="font-medium text-red-800">SECTION ROUGE</p>
                <p className="text-sm text-red-600">Étudiants</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-800">
              {stats.bySituation?.rouge || 0}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔵</span>
              <div>
                <p className="font-medium text-blue-800">SECTION BLEUE</p>
                <p className="text-sm text-blue-600">Collégiens</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {stats.bySituation?.bleu || 0}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🟡</span>
              <div>
                <p className="font-medium text-yellow-800">SECTION JAUNE</p>
                <p className="text-sm text-yellow-600">Travailleurs</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-800">
              {stats.bySituation?.jaune || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          État des Tickets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl text-yellow-600 mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-800">{stats.pending || 0}</div>
            <div className="text-sm text-yellow-600">En attente</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl text-green-600 mb-2">✅</div>
            <div className="text-2xl font-bold text-green-800">{stats.confirmed || 0}</div>
            <div className="text-sm text-green-600">Confirmés</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl text-blue-600 mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-800">{stats.validated || 0}</div>
            <div className="text-sm text-blue-600">Validés</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketStats; 