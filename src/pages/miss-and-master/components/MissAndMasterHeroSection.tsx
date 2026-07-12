interface MissAndMasterHeroSectionProps {
  candidateCount: number;
  totalVotes: number;
  loading: boolean;
}

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const MissAndMasterHeroSection = ({
  candidateCount,
  totalVotes,
  loading
}: MissAndMasterHeroSectionProps) => {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#140D18] flex items-center">
      {/* Photo — winners with sashes under the festival lights */}
      <div className="absolute inset-0">
        <img
          src="/missandmasterhero.webp"
          alt="Les lauréats Miss & Master WAY, sous les lumières du festival"
          className="w-full h-full object-cover object-[70%_center] opacity-80"
        />
        {/* Noir-violet veil: strong on the left where the text sits, open on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#140D18] via-[#140D18]/85 to-[#140D18]/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#140D18] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#140D18]/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-2xl animate-rise-in">
          <p className="font-azonix text-[#E8C15C] text-xs sm:text-sm tracking-[0.35em] mb-6">
            WAY 2026 · LA COMPÉTITION
          </p>

          <h1 className="font-clash font-bold text-[#F5EFE4] leading-[0.95] text-5xl sm:text-6xl lg:text-7xl mb-4">
            MISS
            <br />
            <span className="relative inline-block mt-2">
              {/* The sash: a gold satin band carrying the second half of the title */}
              <span
                aria-hidden="true"
                className="absolute -inset-x-3 inset-y-1 -skew-y-2 bg-gradient-to-r from-[#C89B3C] via-[#EDD189] to-[#C89B3C]"
              />
              <span className="relative px-1 text-[#140D18]">&amp; MASTER</span>
            </span>
          </h1>

          {/* No apostrophes or hyphens here: the Nekst demo font renders both as flower glyphs */}
          <p className="font-nekst font-light text-[#A79BB3] text-lg sm:text-xl leading-relaxed mt-8 mb-10 max-w-xl">
            Une couronne, un titre — votre vote décide.
            Soutenez votre candidate préférée sur le chemin du sacre.
          </p>

          {/* Live standings */}
          <div className="flex items-center gap-10 mb-12">
            <div>
              <p className="font-azonix text-[#E8C15C] text-3xl sm:text-4xl">
                {loading ? '—' : candidateCount}
              </p>
              <p className="font-nekst font-light text-[#A79BB3] text-sm tracking-widest uppercase mt-1">
                Candidates en lice
              </p>
            </div>
            <div className="w-px h-12 bg-white/10" aria-hidden="true" />
            <div>
              <p className="font-azonix text-[#E8C15C] text-3xl sm:text-4xl">
                {loading ? '—' : totalVotes.toLocaleString('fr-FR')}
              </p>
              <p className="font-nekst font-light text-[#A79BB3] text-sm tracking-widest uppercase mt-1">
                Votes enregistrés
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToId('candidates-section')}
              className="bg-[#E8C15C] hover:bg-[#F2D27D] text-[#140D18] font-clash font-semibold text-base px-8 py-4 rounded-full transition-colors"
            >
              Voir les candidates
            </button>
            <button
              onClick={() => scrollToId('comment-voter')}
              className="border border-white/25 hover:border-[#E8C15C]/70 hover:text-[#E8C15C] text-[#F5EFE4] font-clash font-medium text-base px-8 py-4 rounded-full transition-colors"
            >
              Comment voter ?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissAndMasterHeroSection;
