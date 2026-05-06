import TicketStats from '../components/TicketStats';
import TicketsList from '../components/TicketsList';
import SectionHeader from '../components/SectionHeader';

const TicketsSection = () => {
  return (
    <div className="space-y-10">
      <SectionHeader
        index="02"
        eyebrow="Operations"
        title="Tickets"
        subtitle="Statistiques en temps réel et gestion complète de la billetterie WAY 2026."
        meta={<span>23 — 26 JANVIER · YAOUNDÉ</span>}
      />

      <TicketStats />

      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400">D</span>
          <div className="h-px flex-1 bg-black/10" />
          <span className="font-nekst text-[10px] tracking-[0.4em] uppercase text-black">
            Liste des tickets
          </span>
        </div>
        <TicketsList />
      </div>
    </div>
  );
};

export default TicketsSection;
