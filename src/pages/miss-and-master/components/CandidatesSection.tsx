import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, type Candidate } from '../../../services/candidateService';
import VotingModal from '../../../components/VotingModal';

interface CandidatesSectionProps {
  missCandidates: Candidate[];
  loading: boolean;
  usingFallback: boolean;
  onRetry: () => void;
  onVoteComplete: () => void;
}

const formatRank = (ranking: number) => `Nº ${String(ranking).padStart(2, '0')}`;

/* The signature: a satin sash laid diagonally across the photo, carrying the rank.
   Gold for the podium, ivory for the rest of the field.
   While the race is neutral (no vote spread yet) the rank is hidden. */
const Sash = ({
  candidate,
  podium,
  showRank
}: {
  candidate: Candidate;
  podium: boolean;
  showRank: boolean;
}) => (
  <div
    aria-hidden="true"
    className="absolute -left-1/4 bottom-[12%] w-[150%] rotate-[-12deg] pointer-events-none"
  >
    <div
      className={`py-1.5 shadow-lg ${
        podium
          ? 'bg-gradient-to-r from-[#C89B3C] via-[#EDD189] to-[#C89B3C]'
          : 'bg-gradient-to-r from-[#E9E2D4] via-[#FBF7EE] to-[#E9E2D4]'
      }`}
    >
      <p className="font-azonix text-center text-[10px] sm:text-xs tracking-[0.3em] text-[#140D18]">
        {showRank ? `${formatRank(candidate.ranking)} · ` : ''}{candidate.sash || 'WAY 2026'}
      </p>
    </div>
  </div>
);

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
  </svg>
);

const CandidateCard = ({
  candidate,
  podium = false,
  showRank = true,
  onVote,
  className = '',
  style
}: {
  candidate: Candidate;
  podium?: boolean;
  showRank?: boolean;
  onVote: (candidate: Candidate) => void;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <article
    style={style}
    className={`group relative bg-[#201626] rounded-2xl overflow-hidden border transition-all duration-300 ${
      podium && candidate.ranking === 1
        ? 'border-[#E8C15C]/60 shadow-[0_0_40px_-10px_rgba(232,193,92,0.35)]'
        : 'border-white/5 hover:border-[#E8C15C]/40'
    } ${className}`}
  >
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={getImageUrl(candidate.image)}
        alt={candidate.name.trim()}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#201626]/90 to-transparent" />

      {podium && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="w-11 h-11 rounded-full border border-[#E8C15C]/60 bg-[#140D18]/80 backdrop-blur-sm flex items-center justify-center font-azonix text-[#E8C15C] text-sm">
            {String(candidate.ranking).padStart(2, '0')}
          </span>
          {candidate.ranking === 1 && <CrownIcon className="w-6 h-6 text-[#E8C15C]" />}
        </div>
      )}

      <Sash candidate={candidate} podium={podium} showRank={showRank} />
    </div>

    <div className={podium ? 'p-5' : 'p-4'}>
      <h3
        className={`font-clash font-semibold leading-snug line-clamp-2 ${
          podium ? 'text-lg' : 'text-sm sm:text-base'
        }`}
      >
        <Link
          to={`/miss-and-master/candidate/${candidate.id}`}
          aria-label={`Voir le profil de ${candidate.name.trim()}`}
          className="text-[#F5EFE4] group-hover:text-[#E8C15C] transition-colors after:absolute after:inset-0 after:content-['']"
        >
          {candidate.name.trim()}
        </Link>
      </h3>

      <div className="flex items-baseline gap-1.5 mt-2 mb-4">
        <span className={`font-azonix text-[#E8C15C] ${podium ? 'text-2xl' : 'text-lg'}`}>
          {(candidate.votes || 0).toLocaleString('fr-FR')}
        </span>
        <span className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase">
          votes
        </span>
      </div>

      <button
        onClick={() => onVote(candidate)}
        disabled={!candidate.isActive}
        className={`relative z-10 w-full font-clash font-semibold rounded-full transition-colors ${
          podium ? 'py-3.5 text-base' : 'py-2.5 text-sm'
        } ${
          candidate.isActive
            ? 'bg-[#E8C15C] hover:bg-[#F2D27D] text-[#140D18]'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        {candidate.isActive ? 'Voter' : 'Votes clos'}
      </button>
    </div>
  </article>
);

const SkeletonCard = ({ tall = false }: { tall?: boolean }) => (
  <div className="bg-[#201626] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
    <div className={`bg-white/5 ${tall ? 'aspect-[3/4]' : 'aspect-[3/4]'}`} />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-9 bg-white/10 rounded-full" />
    </div>
  </div>
);

const SectionHeading = ({ eyebrow, title, live = false }: { eyebrow: string; title: string; live?: boolean }) => (
  <div className="mb-10">
    <p className="font-azonix text-[#E8C15C] text-xs tracking-[0.35em] mb-3 flex items-center gap-3">
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C15C] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8C15C]" />
        </span>
      )}
      {eyebrow}
    </p>
    <h2 className="font-clash font-bold text-[#F5EFE4] text-3xl sm:text-4xl">{title}</h2>
    {/* Slanted rule — same angle as the sash */}
    <div aria-hidden="true" className="mt-4 h-[3px] w-20 rotate-[-4deg] bg-gradient-to-r from-[#C89B3C] to-[#EDD189]" />
  </div>
);

const CandidatesSection = ({
  missCandidates,
  loading,
  usingFallback,
  onRetry,
  onVoteComplete
}: CandidatesSectionProps) => {
  const [query, setQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return missCandidates;
    return missCandidates.filter((candidate) => candidate.name.toLowerCase().includes(q));
  }, [missCandidates, query]);

  // Neutral race: every candidate has the same vote count (e.g. all zeros at launch).
  // No podium, no ranks — every card is rendered identically.
  const topVotes = missCandidates[0]?.votes || 0;
  const neutralRace =
    missCandidates.length > 0 &&
    missCandidates.every((candidate) => (candidate.votes || 0) === topVotes);

  const searching = query.trim().length > 0;
  const flatList = searching || neutralRace;
  const podium = flatList ? [] : filtered.slice(0, 3);
  const field = flatList ? filtered : filtered.slice(3);

  // Desktop podium order: 2nd — 1st (lifted) — 3rd
  const podiumLayout: Record<number, string> = {
    1: 'lg:order-2 lg:-translate-y-8',
    2: 'lg:order-1',
    3: 'lg:order-3'
  };

  const handleVote = (candidate: Candidate) => setSelectedCandidate(candidate);

  return (
    <section id="candidates-section" className="relative bg-[#140D18] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {neutralRace ? (
          <SectionHeading eyebrow="La compétition est ouverte" title="Les candidates" />
        ) : (
          <SectionHeading eyebrow="Classement en direct" title="Le podium" live />
        )}
      </div>

      {/* Toolbar: count, search */}
      <div className="sticky top-16 z-30 bg-[#140D18]/90 backdrop-blur-md border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="font-nekst uppercase tracking-widest text-sm text-[#E8C15C] px-1 py-2">
            Miss · {missCandidates.length} candidates
          </p>

          <div className="relative flex-1 min-w-[220px] max-w-sm ml-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une candidate…"
              aria-label="Rechercher une candidate"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 font-nekst font-light text-sm text-[#F5EFE4] placeholder:text-white/40 focus:border-[#E8C15C]/60 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {usingFallback && (
          <div className="mb-8 flex flex-wrap items-center gap-4 bg-[#E8C15C]/10 border border-[#E8C15C]/30 rounded-xl px-5 py-3">
            <p className="font-nekst font-light text-sm text-[#EDD189]">
              Connexion au serveur impossible — données de démonstration affichées.
            </p>
            <button
              onClick={onRetry}
              className="font-clash font-medium text-sm text-[#140D18] bg-[#E8C15C] hover:bg-[#F2D27D] px-4 py-1.5 rounded-full transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-16">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} tall />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <h3 className="font-clash font-semibold text-[#F5EFE4] text-xl mb-3">
              Aucune candidate ne correspond à « {query.trim()} »
            </h3>
            <button
              onClick={() => setQuery('')}
              className="font-nekst text-sm text-[#E8C15C] hover:text-[#F2D27D] underline underline-offset-4 transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-20 lg:pt-8">
                {podium.map((candidate, i) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    podium
                    onVote={handleVote}
                    className={`animate-rise-in ${podiumLayout[candidate.ranking] || ''}`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}

            {field.length > 0 && (
              <>
                {!searching && !neutralRace && (
                  <div className="mb-8">
                    <h3 className="font-clash font-semibold text-[#F5EFE4] text-xl sm:text-2xl">
                      Toutes les candidates
                    </h3>
                    <p className="font-nekst font-light text-[#A79BB3] text-sm mt-1">
                      Le classement se met à jour à chaque vote confirmé.
                    </p>
                  </div>
                )}
                {!searching && neutralRace && (
                  <div className="mb-8">
                    <p className="font-nekst font-light text-[#A79BB3] text-sm">
                      {topVotes === 0
                        ? "Aucun vote comptabilisé pour l'instant — le classement apparaîtra dès les premiers votes."
                        : 'Toutes les candidates sont à égalité — le classement apparaîtra dès que les votes se départageront.'}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {field.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      showRank={!neutralRace}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* How to vote — a real sequence, so the steps are numbered */}
      <div id="comment-voter" className="border-t border-white/5 bg-[#181020] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <SectionHeading eyebrow="Mode d'emploi" title="Comment voter" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {[
              {
                step: '01',
                title: 'Choisissez votre candidate',
                text: 'Parcourez le classement et appuyez sur « Voter » sous son portrait.'
              },
              {
                step: '02',
                title: 'Payez par mobile money',
                text: 'MTN Mobile Money ou Orange Money — validez simplement le paiement sur votre téléphone.'
              },
              {
                step: '03',
                title: 'Vos votes sont crédités',
                text: 'La confirmation est automatique et le classement se met à jour immédiatement.'
              }
            ].map(({ step, title, text }) => (
              <div key={step}>
                <p className="font-azonix text-[#E8C15C]/70 text-3xl mb-4">{step}</p>
                <h3 className="font-clash font-semibold text-[#F5EFE4] text-lg mb-2">{title}</h3>
                <p className="font-nekst font-light text-[#A79BB3] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-nekst font-light text-[#A79BB3] text-sm tracking-widest uppercase mr-2">
              Packs de votes
            </p>
            {[
              ['500 FCFA', '5 votes'],
              ['1 000 FCFA', '11 votes'],
              ['5 000 FCFA', '55 votes']
            ].map(([price, count]) => (
              <span
                key={price}
                className="inline-flex items-baseline gap-2 border border-[#E8C15C]/30 bg-[#E8C15C]/5 rounded-full px-4 py-2"
              >
                <span className="font-clash font-semibold text-[#F5EFE4] text-sm">{price}</span>
                <span className="font-azonix text-[#E8C15C] text-xs">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {selectedCandidate && (
        <VotingModal
          candidate={selectedCandidate}
          isOpen={selectedCandidate !== null}
          onClose={() => setSelectedCandidate(null)}
          onVoteComplete={onVoteComplete}
        />
      )}
    </section>
  );
};

export default CandidatesSection;
