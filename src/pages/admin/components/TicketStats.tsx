import { useState, useEffect } from 'react';
import { getTicketStatistics, type TicketsStatistics } from '../../../services/ticketService';
import StatCard from './StatCard';

const TicketStats = () => {
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
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          setError("Accès non autorisé. Veuillez vous reconnecter à l'administration.");
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

  if (loading) {
    return (
      <div className="flex items-center gap-4 px-6 py-8 border border-black/10 bg-white">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">
          Chargement…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-l-2 border-red-500 bg-red-500/5 p-6">
        <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-red-700 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Erreur de chargement
        </div>
        <p className="font-nekst text-sm text-red-700">{error}</p>
        {error.includes('Accès non autorisé') && (
          <p className="mt-2 font-nekst text-xs text-gray-600">
            Déconnectez-vous et reconnectez-vous pour rafraîchir le token.
          </p>
        )}
        <button
          onClick={fetchTicketStats}
          className="mt-4 font-nekst text-[10px] tracking-[0.3em] uppercase text-black hover:text-red-500 underline-offset-4 hover:underline"
        >
          Réessayer →
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="border border-black/10 p-8 text-center font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-400">
        Aucune statistique
      </div>
    );
  }

  const conversionRate =
    (stats.total || 0) > 0 ? (((stats.confirmed || 0) / (stats.total || 0)) * 100).toFixed(0) : '0';
  const validationRate =
    (stats.confirmed || 0) > 0 ? (((stats.validated || 0) / (stats.confirmed || 0)) * 100).toFixed(0) : '0';

  const sectionRows = [
    { key: 'rouge', label: 'Section Rouge', sub: 'Étudiants', count: stats.bySituation?.rouge || 0, dot: 'bg-red-500' },
    { key: 'bleu', label: 'Section Bleue', sub: 'Collégiens', count: stats.bySituation?.bleu || 0, dot: 'bg-blue-500' },
    { key: 'jaune', label: 'Section Jaune', sub: 'Travailleurs', count: stats.bySituation?.jaune || 0, dot: 'bg-yellow-400' },
  ];
  const sectionMax = Math.max(...sectionRows.map((r) => r.count), 1);

  const statusItems = [
    { label: 'En attente', value: stats.pending || 0, color: 'text-yellow-600', dot: 'bg-yellow-400' },
    { label: 'Confirmés', value: stats.confirmed || 0, color: 'text-emerald-600', dot: 'bg-emerald-500' },
    { label: 'Validés', value: stats.validated || 0, color: 'text-blue-600', dot: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
        <StatCard index="01" label="Total Tickets" value={stats.total || 0} hint="Toutes commandes" accent="red" />
        <StatCard
          index="02"
          label="Confirmés"
          value={stats.confirmed || 0}
          hint={`${conversionRate}% conversion`}
          accent="yellow"
          trend={stats.confirmed && stats.confirmed > 0 ? 'up' : 'flat'}
        />
        <StatCard
          index="03"
          label="Validés"
          value={stats.validated || 0}
          hint={`${validationRate}% utilisation`}
          accent="black"
        />
        <StatCard
          index="04"
          label="Revenus"
          value={`${(stats.totalRevenue || 0).toLocaleString('fr-FR')} F`}
          hint="FCFA · confirmés"
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
        <StatCard index="05" label="Valides Aujourd'hui" value={stats.todayValid || 0} hint="Pour aujourd'hui" accent="yellow" />
        <StatCard index="06" label="Validés Aujourd'hui" value={stats.todayValidated || 0} hint="Entrées scannées" accent="red" />
      </div>

      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-1">07 / SEGMENT</div>
            <h3 className="font-azonix text-2xl text-black leading-none">Répartition</h3>
          </div>
          <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
            Par section
          </div>
        </div>

        <div className="space-y-5">
          {sectionRows.map((row) => {
            const pct = (row.count / sectionMax) * 100;
            return (
              <div key={row.key}>
                <div className="flex items-baseline justify-between mb-2 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 ${row.dot} flex-shrink-0`} />
                    <span className="font-nekst text-xs tracking-[0.3em] uppercase text-black truncate">
                      {row.label}
                    </span>
                    <span className="font-nekst text-[10px] tracking-widest uppercase text-gray-400 truncate">
                      · {row.sub}
                    </span>
                  </div>
                  <span className="font-azonix text-2xl text-black tracking-tight">{row.count}</span>
                </div>
                <div className="h-1 bg-gray-100 relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 bottom-0 ${row.dot} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-1">08 / STATUS</div>
            <h3 className="font-azonix text-2xl text-black leading-none">État des Tickets</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
          {statusItems.map((item) => (
            <div key={item.label} className="bg-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 ${item.dot}`} />
                <span className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">
                  {item.label}
                </span>
              </div>
              <span className="font-azonix text-3xl text-black leading-none">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketStats;
