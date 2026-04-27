import { useState } from 'react';

interface Partner {
  id: number;
  logo: string;
  name: string;
  shortDesc: string;
  contact: string;
  email: string;
  services: string[];
  location: string;
  about: string;
}

const partners: Partner[] = [
  {
    id: 1,
    logo: '/Logo.webp',
    name: 'VGROUP',
    shortDesc: 'Groupe entrepreneurial camerounais actif dans plusieurs secteurs clés de l\'économie locale.',
    contact: '+237 6XX XXX XXX',
    email: 'contact@vgroup.cm',
    services: ['À compléter', 'À compléter', 'À compléter'],
    location: 'Cameroun',
    about: 'VGROUP est un acteur reconnu de l\'écosystème entrepreneurial camerounais, engagé dans le développement économique et le soutien aux initiatives locales.',
  },
  {
    id: 2,
    logo: '/Logo.webp',
    name: 'Partenaire 11',
    shortDesc: 'Partenaire officiel de WAY 2026, engagé dans la promotion de l\'entrepreneuriat et de l\'innovation.',
    contact: '+237 6XX XXX XXX',
    email: 'contact@partenaire11.cm',
    services: ['À compléter', 'À compléter', 'À compléter'],
    location: 'Cameroun',
    about: 'Partenaire de longue date de l\'événement WAY, cet acteur contribue activement au développement de l\'écosystème jeunesse et entrepreneurial au Cameroun.',
  },
  {
    id: 3,
    logo: '/Logo.webp',
    name: 'Partenaire 16',
    shortDesc: 'Acteur clé du tissu économique camerounais, présent aux côtés de WAY pour la 5ᵉ édition.',
    contact: '+237 6XX XXX XXX',
    email: 'contact@partenaire16.cm',
    services: ['À compléter', 'À compléter', 'À compléter'],
    location: 'Cameroun',
    about: 'Partenaire officiel de WAY 2026, engagé dans la valorisation des talents et des entreprises camerounaises.',
  },
  {
    id: 4,
    logo: '/Logo.webp',
    name: 'Partenaire 13',
    shortDesc: 'Structure dynamique soutenant les initiatives culturelles et entrepreneuriales de la jeunesse camerounaise.',
    contact: '+237 6XX XXX XXX',
    email: 'contact@partenaire13.cm',
    services: ['À compléter', 'À compléter', 'À compléter'],
    location: 'Cameroun',
    about: 'Partenaire officiel de WAY 2026, cette structure œuvre pour l\'émergence d\'une jeunesse camerounaise ambitieuse et connectée aux opportunités.',
  },
];

const BoutiqueTicketsSection = () => {
  const [selected, setSelected] = useState<Partner | null>(null);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-10/12 mx-auto py-20 relative z-10">
        <div className="flex flex-col xl:flex-row-reverse gap-8 xl:gap-16 items-center">

          {/* Right — Partner Cards */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelected(p)}
                >
                  {/* Logo */}
                  <div className="h-16 flex items-center mb-4">
                    <img src={p.logo} alt={p.name} className="h-12 w-auto object-contain" />
                  </div>

                  {/* Name */}
                  <h3 className="font-azonix text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    {p.name}
                  </h3>

                  {/* Short desc */}
                  <p className="font-nekst text-gray-500 text-xs leading-relaxed flex-1 mb-4">
                    {p.shortDesc}
                  </p>

                  {/* CTA */}
                  <button className="font-nekst text-xs uppercase tracking-widest text-black border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-200 w-fit">
                    Voir plus
                  </button>
                </div>
              ))}

              {/* Add partner placeholder */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[200px] text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-nekst text-xs uppercase tracking-widest">Votre marque ici</span>
              </div>
            </div>
          </div>

          {/* Left — Text */}
          <div className="flex-shrink-0 xl:w-[38%]">
            <span className="font-nekst text-xs uppercase tracking-[0.4em] text-yellow-500 mb-4 block">
              WAY 2026
            </span>

            <h2 className="font-azonix text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              VITRINE<br />
              PRESTIGE<br />
              <span className="text-yellow-400">PARTENAIRES</span>
            </h2>

            <p className="font-nekst text-gray-800 text-base md:text-lg font-semibold mb-3 leading-snug">
              Affirmez votre présence là où se créent les opportunités
            </p>

            <p className="font-nekst text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              Intégrez un espace privilégié dédié aux acteurs d'exception, et présentez votre activité à une audience qualifiée dans un environnement raffiné, propice aux collaborations d'envergure.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="font-azonix bg-black text-white px-6 py-3 rounded-full text-sm tracking-wider hover:bg-gray-800 transition-colors duration-200">
                Découvrir
              </button>
              <button className="font-azonix border border-black text-black px-6 py-3 rounded-full text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200">
                Accéder à cet espace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Card */}
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-[fadeScale_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeScale 0.2s ease-out' }}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo + Name */}
            <div className="flex items-center gap-4 mb-6">
              <img src={selected.logo} alt={selected.name} className="h-14 w-auto object-contain" />
              <h3 className="font-azonix text-xl font-bold text-black uppercase tracking-wide">{selected.name}</h3>
            </div>

            <div className="space-y-4 text-sm">
              {/* Location */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-nekst text-xs uppercase tracking-widest text-gray-400 mb-0.5">Localisation</p>
                  <p className="font-nekst text-gray-800">{selected.location}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-nekst text-xs uppercase tracking-widest text-gray-400 mb-0.5">Contact</p>
                  <p className="font-nekst text-gray-800">{selected.contact}</p>
                  <p className="font-nekst text-gray-500">{selected.email}</p>
                </div>
              </div>

              {/* Services */}
              <div className="flex items-start gap-3">
                <span className="text-lg">🛠️</span>
                <div>
                  <p className="font-nekst text-xs uppercase tracking-widest text-gray-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.services.map((s) => (
                      <span key={s} className="font-nekst text-xs bg-yellow-400/20 text-yellow-700 px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="flex items-start gap-3">
                <span className="text-lg">ℹ️</span>
                <div>
                  <p className="font-nekst text-xs uppercase tracking-widest text-gray-400 mb-0.5">À propos</p>
                  <p className="font-nekst text-gray-600 leading-relaxed">{selected.about}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default BoutiqueTicketsSection;
