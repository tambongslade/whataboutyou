import { type ConferenceRegistration } from '../../../services/registrationService';

interface AdminStatsProps {
  registrations?: ConferenceRegistration[];
}

const AdminStats = ({ registrations }: AdminStatsProps) => {
  // Ensure registrations is always an array
  const safeRegistrations = Array.isArray(registrations) ? registrations : [];
  
  // Calculate statistics
  const totalRegistrations = safeRegistrations.length;
  
  const situationStats = {
    rouge: safeRegistrations.filter(r => r.situation === 'rouge').length,
    bleu: safeRegistrations.filter(r => r.situation === 'bleu').length,
    jaune: safeRegistrations.filter(r => r.situation === 'jaune').length,
  };

  const hasConferenceExperience = safeRegistrations.filter(r => r.aDejaParticipe === 'oui').length;
  
  const todayRegistrations = safeRegistrations.filter(r => {
    const today = new Date();
    const regDate = new Date(r.createdAt);
    return regDate.toDateString() === today.toDateString();
  }).length;

  const averageAge = safeRegistrations.length > 0 
    ? Math.round(safeRegistrations.reduce((sum, r) => sum + parseInt(r.age || '0'), 0) / safeRegistrations.length)
    : 0;

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Inscriptions"
        value={totalRegistrations}
        subtitle="Toutes catégories"
        color="#f59e0b"
        icon="👥"
      />
      
      <StatCard
        title="Aujourd'hui"
        value={todayRegistrations}
        subtitle="Nouvelles inscriptions"
        color="#10b981"
        icon="📈"
      />
      
      <StatCard
        title="Âge Moyen"
        value={`${averageAge} ans`}
        subtitle="Participants"
        color="#3b82f6"
        icon="🎂"
      />
      
      <StatCard
        title="Expérience Conférence"
        value={hasConferenceExperience}
        subtitle={`sur ${totalRegistrations} participants`}
        color="#8b5cf6"
        icon="🎯"
      />

      {/* Situation Distribution */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Répartition par Situation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔴</span>
              <div>
                <p className="font-medium text-red-800">ROUGE</p>
                <p className="text-sm text-red-600">Étudiants, Chercheurs</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-800">
              {situationStats.rouge}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔵</span>
              <div>
                <p className="font-medium text-blue-800">BLEU</p>
                <p className="text-sm text-blue-600">Collégiens, Lycéens</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {situationStats.bleu}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🟡</span>
              <div>
                <p className="font-medium text-yellow-800">JAUNE</p>
                <p className="text-sm text-yellow-600">Travailleurs, Entrepreneurs</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-800">
              {situationStats.jaune}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats; 