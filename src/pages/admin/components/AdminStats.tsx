import { type ConferenceRegistration } from '../../../services/registrationService';
import StatCard from './StatCard';

interface AdminStatsProps {
  registrations?: ConferenceRegistration[];
}

const AdminStats = ({ registrations }: AdminStatsProps) => {
  const safe = Array.isArray(registrations) ? registrations : [];
  const total = safe.length;

  const situation = {
    rouge: safe.filter((r) => r.situation === 'rouge').length,
    bleu: safe.filter((r) => r.situation === 'bleu').length,
    jaune: safe.filter((r) => r.situation === 'jaune').length,
  };

  const experienced = safe.filter((r) => r.aDejaParticipe === 'oui').length;

  const today = safe.filter((r) => {
    const t = new Date();
    const d = new Date(r.createdAt);
    return d.toDateString() === t.toDateString();
  }).length;

  const averageAge =
    safe.length > 0
      ? Math.round(safe.reduce((sum, r) => sum + parseInt(r.age || '0'), 0) / safe.length)
      : 0;

  const situationRows = [
    { key: 'rouge', label: 'Rouge', sub: 'Étudiants · Chercheurs', count: situation.rouge, dot: 'bg-red-500' },
    { key: 'bleu', label: 'Bleu', sub: 'Collégiens · Lycéens', count: situation.bleu, dot: 'bg-blue-500' },
    { key: 'jaune', label: 'Jaune', sub: 'Travailleurs · Entrepreneurs', count: situation.jaune, dot: 'bg-yellow-400' },
  ];

  const max = Math.max(...situationRows.map((r) => r.count), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
        <StatCard index="01" label="Total Inscriptions" value={total} hint="Toutes catégories" accent="red" />
        <StatCard index="02" label="Aujourd'hui" value={today} hint="Nouvelles 24 h" accent="yellow" trend={today > 0 ? 'up' : 'flat'} />
        <StatCard index="03" label="Âge Moyen" value={`${averageAge} ans`} hint="Participants" accent="black" />
        <StatCard index="04" label="Expérience Conférence" value={experienced} hint={`Sur ${total} inscrits`} accent="red" />
      </div>

      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-1">05 / SEGMENT</div>
            <h3 className="font-azonix text-2xl text-black leading-none">Répartition</h3>
          </div>
          <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400">
            Par situation
          </div>
        </div>

        <div className="space-y-5">
          {situationRows.map((row) => {
            const pct = max > 0 ? (row.count / max) * 100 : 0;
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
                  <span className="font-azonix text-2xl text-black tracking-tight">
                    {row.count}
                  </span>
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
    </div>
  );
};

export default AdminStats;
