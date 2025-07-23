import { useState, useEffect } from 'react';
import { candidateService, type Candidate, type CandidateStats } from '../../../services/candidateService';

interface MissAndMasterStatsProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
}

const MissAndMasterStats = ({ candidates, setCandidates }: MissAndMasterStatsProps) => {
  const [stats, setStats] = useState<CandidateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesResponse, statsResponse] = await Promise.all([
        candidateService.getAllCandidates(),
        candidateService.getCandidateStats()
      ]);

      if (candidatesResponse.success && candidatesResponse.data) {
        setCandidates(candidatesResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching Miss and Master data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">{error}</div>
        <button 
          onClick={fetchData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Calculate additional metrics
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const totalPoints = candidates.reduce((sum, candidate) => sum + candidate.points, 0);
  
  // Find leading candidates
  const leadingMiss = candidates
    .filter(c => c.category === 'miss' && c.isActive)
    .sort((a, b) => b.points - a.points)[0];
  
  const leadingMaster = candidates
    .filter(c => c.category === 'master' && c.isActive)
    .sort((a, b) => b.points - a.points)[0];

  // Calculate account balance (assuming 1000 FCFA per vote)
  const accountBalance = totalVotes * 1000;

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

  const LeaderCard = ({ candidate, category }: { candidate: Candidate; category: string }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-yellow-200">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={candidate.image}
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400"
          />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            👑
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{category} en tête</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {candidate.points} points
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
              {candidate.votes} votes
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Votes"
          value={totalVotes.toLocaleString()}
          subtitle="Tous candidats"
          color="#f59e0b"
          icon="🗳️"
        />
        
        <StatCard
          title="Total Points"
          value={totalPoints.toLocaleString()}
          subtitle="Cumulés"
          color="#10b981"
          icon="⭐"
        />
        
        <StatCard
          title="Solde Compte"
          value={`${accountBalance.toLocaleString()} FCFA`}
          subtitle="Revenus générés"
          color="#3b82f6"
          icon="💰"
        />
        
        <StatCard
          title="Candidats Actifs"
          value={stats?.active || 0}
          subtitle={`sur ${stats?.total || 0} total`}
          color="#8b5cf6"
          icon="👥"
        />
      </div>

      {/* Leaders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leadingMiss && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👸</span>
              Miss en Tête
            </h3>
            <LeaderCard candidate={leadingMiss} category="miss" />
          </div>
        )}
        
        {leadingMaster && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🤴</span>
              Master en Tête
            </h3>
            <LeaderCard candidate={leadingMaster} category="master" />
          </div>
        )}
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Répartition par Catégorie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👸</span>
              <div>
                <p className="font-medium text-pink-800">MISS</p>
                <p className="text-sm text-pink-600">Candidates féminines</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-pink-800">
              {stats?.byCategory.miss || 0}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🤴</span>
              <div>
                <p className="font-medium text-blue-800">MASTER</p>
                <p className="text-sm text-blue-600">Candidats masculins</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {stats?.byCategory.master || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissAndMasterStats;