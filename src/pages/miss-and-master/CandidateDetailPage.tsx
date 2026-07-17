import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { candidateService, getImageUrl, type Candidate } from '../../services/candidateService';
import VotingModal from '../../components/VotingModal';
import { fallbackMissCandidates } from './data/fallbackCandidates';
import { rankByVotes } from './utils/rankByVotes';

const formatRank = (ranking: number) => `Nº ${String(ranking).padStart(2, '0')}`;

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
  </svg>
);

const socialLinks = (candidate: Candidate) => {
  const { instagram, facebook, tiktok } = candidate.socialMedia || {};
  const links: { label: string; handle: string; href?: string }[] = [];

  if (instagram) {
    links.push({
      label: 'Instagram',
      handle: instagram,
      href: `https://instagram.com/${instagram.replace(/^@/, '')}`
    });
  }
  if (tiktok) {
    links.push({
      label: 'TikTok',
      handle: tiktok,
      href: `https://www.tiktok.com/@${tiktok.replace(/^@/, '')}`
    });
  }
  if (facebook) {
    // Facebook entries are display names, not slugs — shown without a link
    links.push({ label: 'Facebook', handle: facebook });
  }

  return links;
};

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidateCount, setCandidateCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showVoting, setShowVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadCandidate = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    let ranked: Candidate[] = [];
    try {
      const response = await candidateService.getMissCandidates();
      ranked =
        response.success && response.data
          ? rankByVotes(response.data)
          : rankByVotes(fallbackMissCandidates);
    } catch {
      ranked = rankByVotes(fallbackMissCandidates);
    }

    let found = ranked.find((c) => c.id === id || c._id === id) || null;

    // Not in the miss list (e.g. master candidate) — try the direct endpoint
    if (!found) {
      try {
        const single = await candidateService.getCandidate(id);
        if (single.success && single.data) {
          const c = single.data;
          found = { ...c, id: c._id || c.id, votes: c.votes ?? c.points ?? 0, ranking: 0 };
        }
      } catch {
        // fall through to not-found
      }
    }

    setCandidateCount(ranked.length);
    setCandidate(found);
    setNotFound(!found);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadCandidate();
    // Marketing links land directly here — start at the top of the page
    window.scrollTo(0, 0);
  }, [loadCandidate]);

  useSEO({
    title: candidate
      ? `${candidate.name.trim()} | Miss & Master WAY 2026 - Votez maintenant`
      : 'Candidate | Miss & Master WAY 2026 - What About You',
    description: candidate
      ? `Découvrez ${candidate.name.trim()}${candidate.city ? `, candidate de ${candidate.city}` : ''} au concours Miss & Master WAY 2026 et votez pour elle dès maintenant.`
      : 'Découvrez les candidates du concours Miss & Master WAY 2026 et votez pour votre favorite.',
    keywords: 'Miss WAY 2026, vote en ligne, concours beauté Cameroun, candidate',
    image: candidate ? getImageUrl(candidate.image) : 'https://whataboutyou.cm/missandmasterhero.webp',
    url: candidate
      ? `https://whataboutyou.cm/#/miss-and-master/candidate/${candidate.id}`
      : 'https://whataboutyou.cm/#/miss-and-master',
    type: 'profile'
  });

  // Works in dev and prod regardless of where the app is hosted (HashRouter)
  const shareUrl = useMemo(
    () =>
      `${window.location.origin}${window.location.pathname}#/miss-and-master/candidate/${candidate?.id || id}`,
    [candidate?.id, id]
  );

  const shareText = candidate
    ? `Votez pour ${candidate.name.trim()} au concours Miss & Master WAY 2026 ! 👑`
    : 'Votez au concours Miss & Master WAY 2026 !';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API unavailable (http / old browser) — legacy fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl });
    } catch {
      // User cancelled the share sheet — nothing to do
    }
  };

  const links = candidate ? socialLinks(candidate) : [];
  const podium = !!candidate && candidate.ranking >= 1 && candidate.ranking <= 3;
  const showRank = !!candidate && candidate.ranking >= 1 && candidateCount > 1;

  return (
    <div className="min-h-screen bg-[#140D18] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/miss-and-master"
          className="inline-flex items-center gap-2 font-nekst text-sm text-[#A79BB3] hover:text-[#E8C15C] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Toutes les candidates
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-white/5 rounded-3xl aspect-[3/4] max-w-md w-full mx-auto lg:mx-0" />
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-10 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-24 bg-white/10 rounded" />
              <div className="h-12 bg-white/10 rounded-full w-1/2" />
            </div>
          </div>
        ) : notFound || !candidate ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <h1 className="font-clash font-semibold text-[#F5EFE4] text-2xl mb-3">
              Candidate introuvable
            </h1>
            <p className="font-nekst font-light text-[#A79BB3] mb-6">
              Ce profil n'existe pas ou n'est plus disponible.
            </p>
            <Link
              to="/miss-and-master"
              className="inline-block font-clash font-semibold bg-[#E8C15C] hover:bg-[#F2D27D] text-[#140D18] px-6 py-3 rounded-full transition-colors"
            >
              Voir toutes les candidates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Portrait */}
            <div className="relative max-w-md w-full mx-auto lg:mx-0">
              <div
                className={`relative rounded-3xl overflow-hidden border ${
                  candidate.ranking === 1 && showRank
                    ? 'border-[#E8C15C]/60 shadow-[0_0_60px_-12px_rgba(232,193,92,0.4)]'
                    : 'border-white/10'
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={getImageUrl(candidate.image)}
                    alt={candidate.name.trim()}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#140D18]/90 to-transparent" />

                  {showRank && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="w-12 h-12 rounded-full border border-[#E8C15C]/60 bg-[#140D18]/80 backdrop-blur-sm flex items-center justify-center font-azonix text-[#E8C15C]">
                        {String(candidate.ranking).padStart(2, '0')}
                      </span>
                      {candidate.ranking === 1 && <CrownIcon className="w-7 h-7 text-[#E8C15C]" />}
                    </div>
                  )}

                  {/* Sash */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-1/4 bottom-[12%] w-[150%] rotate-[-12deg] pointer-events-none"
                  >
                    <div
                      className={`py-2 shadow-lg ${
                        podium && showRank
                          ? 'bg-gradient-to-r from-[#C89B3C] via-[#EDD189] to-[#C89B3C]'
                          : 'bg-gradient-to-r from-[#E9E2D4] via-[#FBF7EE] to-[#E9E2D4]'
                      }`}
                    >
                      <p className="font-azonix text-center text-xs tracking-[0.3em] text-[#140D18]">
                        {showRank ? `${formatRank(candidate.ranking)} · ` : ''}
                        {candidate.sash || 'WAY 2026'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div>
              <p className="font-azonix text-[#E8C15C] text-xs tracking-[0.35em] mb-3">
                {candidate.sash || 'MISS WAY 2026'}
              </p>
              <h1 className="font-clash font-bold text-[#F5EFE4] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                {candidate.name.trim()}
              </h1>
              <div
                aria-hidden="true"
                className="mt-4 h-[3px] w-20 rotate-[-4deg] bg-gradient-to-r from-[#C89B3C] to-[#EDD189]"
              />

              <div className="flex items-baseline gap-2 mt-6">
                <span className="font-azonix text-[#E8C15C] text-3xl">
                  {(candidate.votes || 0).toLocaleString('fr-FR')}
                </span>
                <span className="font-nekst font-light text-[#A79BB3] text-sm tracking-widest uppercase">
                  votes
                </span>
              </div>

              {(candidate.age || candidate.city || candidate.profession) && (
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                  {candidate.age ? (
                    <div className="bg-[#201626] border border-white/5 rounded-xl px-4 py-3">
                      <dt className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase mb-1">
                        Âge
                      </dt>
                      <dd className="font-clash font-semibold text-[#F5EFE4]">{candidate.age} ans</dd>
                    </div>
                  ) : null}
                  {candidate.city ? (
                    <div className="bg-[#201626] border border-white/5 rounded-xl px-4 py-3">
                      <dt className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase mb-1">
                        Ville
                      </dt>
                      <dd className="font-clash font-semibold text-[#F5EFE4]">{candidate.city}</dd>
                    </div>
                  ) : null}
                  {candidate.profession ? (
                    <div className="bg-[#201626] border border-white/5 rounded-xl px-4 py-3 col-span-2 sm:col-span-1">
                      <dt className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase mb-1">
                        Profession
                      </dt>
                      <dd className="font-clash font-semibold text-[#F5EFE4] leading-snug">
                        {candidate.profession}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              )}

              {candidate.description && (
                <p className="font-nekst font-light text-[#CBC2D6] leading-relaxed mt-8">
                  {candidate.description}
                </p>
              )}

              {candidate.hobbies && candidate.hobbies.length > 0 && (
                <div className="mt-6">
                  <p className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase mb-3">
                    Centres d'intérêt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="font-nekst text-sm text-[#F5EFE4] border border-[#E8C15C]/30 bg-[#E8C15C]/5 rounded-full px-4 py-1.5"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {links.length > 0 && (
                <div className="mt-6">
                  <p className="font-nekst font-light text-[#A79BB3] text-xs tracking-widest uppercase mb-3">
                    Réseaux sociaux
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {links.map(({ label, handle, href }) =>
                      href ? (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-nekst text-sm text-[#E8C15C] hover:text-[#F2D27D] underline underline-offset-4 transition-colors"
                        >
                          {label} · {handle}
                        </a>
                      ) : (
                        <span key={label} className="font-nekst text-sm text-[#CBC2D6]">
                          {label} · {handle}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowVoting(true)}
                disabled={!candidate.isActive}
                className={`w-full sm:w-auto sm:min-w-[280px] font-clash font-semibold rounded-full py-4 px-10 text-lg mt-10 transition-colors ${
                  candidate.isActive
                    ? 'bg-[#E8C15C] hover:bg-[#F2D27D] text-[#140D18]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {candidate.isActive ? `Voter pour ${candidate.name.trim().split(' ')[0]}` : 'Votes clos'}
              </button>

              {/* Share block — the marketing link */}
              <div className="mt-10 bg-[#201626] border border-white/5 rounded-2xl p-5">
                <p className="font-clash font-semibold text-[#F5EFE4] mb-1">Partagez ce profil</p>
                <p className="font-nekst font-light text-[#A79BB3] text-sm mb-4">
                  Envoyez ce lien à vos proches pour récolter plus de votes.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <code className="flex-1 min-w-[200px] truncate bg-[#140D18] border border-white/10 rounded-full px-4 py-2.5 font-nekst text-xs text-[#CBC2D6]">
                    {shareUrl}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="font-clash font-medium text-sm text-[#140D18] bg-[#E8C15C] hover:bg-[#F2D27D] px-5 py-2.5 rounded-full transition-colors"
                  >
                    {copied ? 'Copié ✓' : 'Copier le lien'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-nekst text-sm text-[#F5EFE4] border border-white/15 hover:border-[#E8C15C]/60 rounded-full px-4 py-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-nekst text-sm text-[#F5EFE4] border border-white/15 hover:border-[#E8C15C]/60 rounded-full px-4 py-2 transition-colors"
                  >
                    Facebook
                  </a>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="font-nekst text-sm text-[#F5EFE4] border border-white/15 hover:border-[#E8C15C]/60 rounded-full px-4 py-2 transition-colors"
                    >
                      Plus d'options…
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {candidate && showVoting && (
        <VotingModal
          candidate={candidate}
          isOpen={showVoting}
          onClose={() => setShowVoting(false)}
          onVoteComplete={loadCandidate}
        />
      )}
    </div>
  );
};

export default CandidateDetailPage;
