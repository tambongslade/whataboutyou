import { useOutletContext } from 'react-router-dom';
import AdminStats from '../components/AdminStats';
import TicketStats from '../components/TicketStats';
import ConferenceRegistrations from '../components/ConferenceRegistrations';
import SectionHeader from '../components/SectionHeader';
import { type AdminOutletContext } from '../AdminLayout';

const Block = ({ index, label, children }: { index: string; label: string; children: React.ReactNode }) => (
  <section className="space-y-5">
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400">{index}</span>
      <div className="h-px flex-1 bg-black/10" />
      <span className="font-nekst text-[10px] tracking-[0.4em] uppercase text-black">{label}</span>
    </div>
    {children}
  </section>
);

const DashboardSection = () => {
  const { registrations, setRegistrations } = useOutletContext<AdminOutletContext>();

  return (
    <div className="space-y-12">
      <SectionHeader
        index="00"
        eyebrow="Overview"
        title="Tableau de Bord"
        subtitle="Vue d'ensemble en temps réel des inscriptions, billetterie et statistiques de l'édition WAY 2026."
        meta={<span className="text-red-500">● LIVE</span>}
      />

      <Block index="A" label="Inscriptions Conférence">
        <AdminStats registrations={registrations} />
      </Block>

      <Block index="B" label="Billetterie WAY 2026">
        <TicketStats />
      </Block>

      <Block index="C" label="Inscriptions Récentes">
        <div className="bg-white border border-black/10 p-6">
          <ConferenceRegistrations
            registrations={registrations}
            setRegistrations={setRegistrations}
            isPreview={true}
          />
        </div>
      </Block>
    </div>
  );
};

export default DashboardSection;
