import { useCallback, useEffect, useState } from 'react';
import { useSEO } from '../../hooks/useSEO';
import { candidateService, type Candidate } from '../../services/candidateService';
import MissAndMasterHeroSection from './components/MissAndMasterHeroSection';
import CandidatesSection from './components/CandidatesSection';
import { fallbackMissCandidates } from './data/fallbackCandidates';
import { rankByVotes } from './utils/rankByVotes';

const MissAndMasterPage = () => {
  useSEO({
    title: 'Miss & Master WAY 2026 | Compétition de Beauté et Talent - What About You',
    description:
      'Participez ou votez pour vos candidats préférés au concours Miss & Master WAY 2026. Une compétition unique célébrant la beauté, le talent et l’intelligence au Cameroun.',
    keywords:
      'Miss WAY 2026, Master WAY 2026, concours beauté Cameroun, compétition talent, miss master Cameroun, vote en ligne',
    image: 'https://whataboutyou.cm/missandmasterhero.webp',
    url: 'https://whataboutyou.cm/miss-and-master',
    type: 'website'
  });

  const [missCandidates, setMissCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadCandidates = useCallback(async () => {
    setLoading(true);

    try {
      const response = await candidateService.getMissCandidates();
      if (response.success && response.data) {
        setMissCandidates(rankByVotes(response.data));
        setUsingFallback(false);
      } else {
        setMissCandidates(rankByVotes(fallbackMissCandidates));
        setUsingFallback(true);
      }
    } catch {
      setMissCandidates(rankByVotes(fallbackMissCandidates));
      setUsingFallback(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const totalVotes = missCandidates.reduce(
    (sum, candidate) => sum + (candidate.votes || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#140D18]">
      <MissAndMasterHeroSection
        candidateCount={missCandidates.length}
        totalVotes={totalVotes}
        loading={loading}
      />

      <CandidatesSection
        missCandidates={missCandidates}
        loading={loading}
        usingFallback={usingFallback}
        onRetry={loadCandidates}
        onVoteComplete={loadCandidates}
      />
    </div>
  );
};

export default MissAndMasterPage;
