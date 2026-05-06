import { useOutletContext } from 'react-router-dom';
import ConferenceRegistrations from '../components/ConferenceRegistrations';
import SectionHeader from '../components/SectionHeader';
import { type AdminOutletContext } from '../AdminLayout';

const RegistrationsSection = () => {
  const { registrations, setRegistrations } = useOutletContext<AdminOutletContext>();

  return (
    <div className="space-y-8">
      <SectionHeader
        index="01"
        eyebrow="Operations"
        title="Inscriptions"
        subtitle="Liste complète des inscriptions à la conférence — recherche, export, validation."
        meta={<span>{registrations.length.toString().padStart(3, '0')} ENTRÉES</span>}
      />
      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <ConferenceRegistrations
          registrations={registrations}
          setRegistrations={setRegistrations}
          isPreview={false}
        />
      </div>
    </div>
  );
};

export default RegistrationsSection;
