import { useOutletContext } from 'react-router-dom';
import { candidateService } from '../../../services/candidateService';
import MissAndMasterStats from '../components/MissAndMasterStats';
import CandidatesList from '../components/CandidatesList';
import AddCandidateForm from '../components/AddCandidateForm';
import SectionHeader from '../components/SectionHeader';
import { type AdminOutletContext } from '../AdminLayout';

const MissAndMasterSection = () => {
  const { candidates, setCandidates } = useOutletContext<AdminOutletContext>();

  return (
    <div className="space-y-10">
      <SectionHeader
        index="04"
        eyebrow="Content"
        title="Miss & Master"
        subtitle="Concours en cours — candidats, votes, classement live."
        meta={<span>{candidates.length.toString().padStart(2, '0')} CANDIDATS</span>}
      />

      <MissAndMasterStats candidates={candidates} setCandidates={setCandidates} />

      <AddCandidateForm
        onCreated={async () => {
          const response = await candidateService.getAllCandidates();
          if (response.success && response.data) {
            setCandidates(response.data);
          }
        }}
      />

      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400">E</span>
          <div className="h-px flex-1 bg-black/10" />
          <span className="font-nekst text-[10px] tracking-[0.4em] uppercase text-black">
            Classement live
          </span>
        </div>
        <CandidatesList candidates={candidates} isPreview={false} />
      </div>
    </div>
  );
};

export default MissAndMasterSection;
