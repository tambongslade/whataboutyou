import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';

type Step = 'hero' | 'category' | 'formules';
type Category = 'entreprises' | 'festif' | 'rencontre';

const WHATSAPP_NUMBER = '237696957872';
const whatsappLink = (formula: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour, je souhaite réserver un stand (${formula}) pour WAY 6ème édition.`
  )}`;

interface FormulaOption {
  id: string;
  title: string;
  image?: string;
  bullets: string[];
  price: string;
  priceValue: number;
  isOutline?: boolean;
  isSurfaceNue?: boolean;
}

const ENTREPRISES_FORMULAS: FormulaOption[] = [
  {
    id: 'f1',
    title: 'FORMULE 1',
    image: '/stand/mockup%20Tente%203.webp',
    bullets: ['9 m² (3 x 3 m)', '4 personnes', 'Format accessible, mise en place rapide'],
    price: '120 000 FCFA',
    priceValue: 120000,
  },
  {
    id: 'f2',
    title: 'FORMULE 2',
    image: '/stand/mockup%20Tente%204.webp',
    bullets: ['25 m² (5 x 5 m)', '5 personnes', 'Meilleure visibilité, espace d’interaction optimisé'],
    price: '150 000 FCFA',
    priceValue: 150000,
  },
  {
    id: 'sn',
    title: 'SURFACE NUE',
    isOutline: true,
    isSurfaceNue: true,
    bullets: ['(Dimension en m²)', 'Personnes indéterminée', 'Liberté totale d’aménagement, adaptation sur mesure'],
    price: '20 000 FCFA / M²',
    priceValue: 20000,
  },
  {
    id: 'f3',
    title: 'FORMULE 3',
    image: '/stand/mockup%20Tente%205.webp',
    bullets: ['50 m² (5 x 10 m)', '10 personnes', 'Forte présence de marque, grande capacité d’accueil'],
    price: '400 000 FCFA',
    priceValue: 400000,
  },
];

const RENCONTRE_FORMULAS: FormulaOption[] = [
  {
    id: 'r1',
    title: 'MODULE 18 M²',
    image: '/stand/mockup%20Tente%203.webp',
    bullets: ['18 m² (9 x 3 m)', 'Cloisons CIMA & climatisation', 'Idéal pour rencontres & présentations'],
    price: '450 000 FCFA',
    priceValue: 450000,
  },
  {
    id: 'r2',
    title: 'MODULE 9 M²',
    image: '/stand/mockup%20Tente%203.webp',
    bullets: ['9 m² (3 x 3 m)', 'Cloisons CIMA & climatisation', 'Format compact pour échanges B2B / B2C'],
    price: '300 000 FCFA',
    priceValue: 300000,
  },
];

interface FestifModule {
  id: string;
  label: string;
  price: string;
  priceValue: number;
}

interface FestifSection {
  number: number;
  title: string;
  modules: FestifModule[];
}

const FESTIF_SECTIONS: FestifSection[] = [
  {
    number: 1,
    title: 'ESPACE GRILLADES AVEC BOISSON',
    modules: [
      { id: 'fs1-a', label: '50 M² (25 M² COUVERT + 25 M² TERRASSE)', price: '200 000 FCFA', priceValue: 200000 },
      { id: 'fs1-b', label: '9 M² (3 × 3 SANS TERRASSE)', price: '150 000 FCFA', priceValue: 150000 },
    ],
  },
  {
    number: 2,
    title: 'ESPACE GRILLADES SANS BOISSON',
    modules: [
      { id: 'fs2-a', label: '25 M² (5 × 5 SANS TERRASSE)', price: '130 000 FCFA', priceValue: 130000 },
      { id: 'fs2-b', label: '9 M² (3 × 3 SANS TERRASSE)', price: '100 000 FCFA', priceValue: 100000 },
    ],
  },
  {
    number: 3,
    title: 'BUVETTE (BOISSON UNIQUEMENT)',
    modules: [
      { id: 'fs3-a', label: '35 M² (25 M² COUVERT + 10 M² TERRASSE)', price: '150 000 FCFA', priceValue: 150000 },
      { id: 'fs3-b', label: '9 M² (3 × 3 SANS TERRASSE)', price: '100 000 FCFA', priceValue: 100000 },
    ],
  },
  {
    number: 4,
    title: 'FAST FOOD, REPAS TRADITIONNELS, PATISSERIE',
    modules: [
      { id: 'fs4-a', label: '25 M² (5 × 5 SANS TERRASSE)', price: '150 000 FCFA', priceValue: 150000 },
      { id: 'fs4-b', label: '9 M² (3 × 3 SANS TERRASSE)', price: '100 000 FCFA', priceValue: 100000 },
    ],
  },
  {
    number: 5,
    title: 'MACHINES À GLACE & MACHINES À SHAWARMA',
    modules: [
      { id: 'fs5-a', label: 'ESPACE MACHINE À GLACE', price: '85 000 FCFA', priceValue: 85000 },
      { id: 'fs5-b', label: 'ESPACE MACHINE À SHAWARMA', price: '95 000 FCFA', priceValue: 95000 },
    ],
  },
];

interface CategoryTheme {
  ringClass: string;
  badgeBgClass: string;
  badgeBorderClass: string;
  borderClass: string;
  bgLightClass: string;
  borderLightClass: string;
  accentTextClass: string;
  totalTextClass: string;
  focusRingClass: string;
  categoryLabel: string;
}

const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  entreprises: {
    ringClass: 'ring-sky-500',
    badgeBgClass: 'bg-sky-500',
    badgeBorderClass: 'border-sky-500',
    borderClass: 'border-sky-500',
    bgLightClass: 'bg-sky-50',
    borderLightClass: 'border-sky-200',
    accentTextClass: 'text-sky-500',
    totalTextClass: 'text-sky-600',
    focusRingClass: 'focus:ring-sky-500',
    categoryLabel: 'Entreprises et Institutions',
  },
  rencontre: {
    ringClass: 'ring-yellow-500',
    badgeBgClass: 'bg-yellow-500',
    badgeBorderClass: 'border-yellow-500',
    borderClass: 'border-yellow-500',
    bgLightClass: 'bg-yellow-50',
    borderLightClass: 'border-yellow-200',
    accentTextClass: 'text-yellow-500',
    totalTextClass: 'text-yellow-600',
    focusRingClass: 'focus:ring-yellow-500',
    categoryLabel: 'WAY : Espace de Rencontre B2B et B2C',
  },
  festif: {
    ringClass: 'ring-red-600',
    badgeBgClass: 'bg-red-600',
    badgeBorderClass: 'border-red-600',
    borderClass: 'border-red-600',
    bgLightClass: 'bg-red-50',
    borderLightClass: 'border-red-200',
    accentTextClass: 'text-red-600',
    totalTextClass: 'text-red-700',
    focusRingClass: 'focus:ring-red-600',
    categoryLabel: 'Festif & Grandes Saveurs',
  },
};

const formatFCFA = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

const DecorativeTriangles: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    <div
      className="absolute top-[8%] left-[6%] w-10 h-14 bg-yellow-400 opacity-90"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-18deg)' }}
    />
    <div
      className="absolute bottom-[18%] left-[3%] w-8 h-12 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 0, 100% 40%, 20% 100%)', transform: 'rotate(25deg)' }}
    />
    <div
      className="absolute top-[55%] right-[14%] w-10 h-14 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(12deg)' }}
    />
    <div
      className="absolute top-[18%] right-[4%] w-16 h-10 bg-red-600 opacity-90"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-10deg)' }}
    />
    <div
      className="absolute top-[42%] left-[2%] w-14 h-9 bg-red-600 opacity-85"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(8deg)' }}
    />
    <div
      className="absolute bottom-[8%] right-[6%] w-12 h-8 bg-red-600 opacity-80"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(20deg)' }}
    />
    <div
      className="absolute top-[30%] right-[18%] w-10 h-14 bg-yellow-400 opacity-85"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(15deg)' }}
    />
    <div
      className="absolute bottom-[28%] left-[18%] w-8 h-12 bg-yellow-400 opacity-80"
      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)', transform: 'rotate(-22deg)' }}
    />
  </div>
);

const BoutiquePage: React.FC = () => {
  useSEO({
    title: 'Prenez votre Stand | WAY 2026 - What About You',
    description:
      'Réservez votre stand pour la 6ème édition de What About You. Exposez vos produits, valorisez vos services et créez des opportunités concrètes.',
    keywords: 'stand WAY 2026, réservation stand, exposition WAY, What About You 6eme edition',
    image: 'https://whataboutyou.cm/stand/mockup%20Tente.webp',
    url: 'https://whataboutyou.cm/boutique',
    type: 'website',
  });

  const [step, setStep] = useState<Step>('hero');
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedFormulas, setSelectedFormulas] = useState<string[]>([]);
  const [surfaceNueDimension, setSurfaceNueDimension] = useState<number>(9);

  const goToCategory = () => {
    setStep('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (cat: Category) => {
    setCategory(cat);
    setSelectedFormulas([]);
    setSurfaceNueDimension(9);
    setStep('formules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFormula = (id: string) => {
    setSelectedFormulas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goBack = () => {
    if (step === 'formules') {
      setStep('category');
    } else {
      setStep('hero');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSelectable = category !== null;
  const activeTheme: CategoryTheme | null = category ? CATEGORY_THEMES[category] : null;
  const activeFormulas: FormulaOption[] =
    category === 'rencontre' ? RENCONTRE_FORMULAS : ENTREPRISES_FORMULAS;

  type SelectedRecapItem = {
    id: string;
    title: string;
    detail?: string;
    subtotal: number;
  };

  let selectedItems: SelectedRecapItem[] = [];

  if (category === 'festif') {
    selectedItems = FESTIF_SECTIONS.flatMap((s) =>
      s.modules
        .filter((m) => selectedFormulas.includes(m.id))
        .map<SelectedRecapItem>((m) => ({
          id: m.id,
          title: m.label,
          detail: `Section ${s.number} — ${s.title}`,
          subtotal: m.priceValue,
        }))
    );
  } else if (category === 'entreprises' || category === 'rencontre') {
    selectedItems = activeFormulas
      .filter((f) => selectedFormulas.includes(f.id))
      .map<SelectedRecapItem>((f) => ({
        id: f.id,
        title: f.title,
        detail: f.isSurfaceNue
          ? `${surfaceNueDimension} m² × 20 000 FCFA`
          : f.bullets[0],
        subtotal: f.isSurfaceNue
          ? f.priceValue * surfaceNueDimension
          : f.priceValue,
      }));
  }

  const totalPrice = selectedItems.reduce((sum, i) => sum + i.subtotal, 0);

  const recapWhatsappLink = (() => {
    const lines = selectedItems.map((i) => {
      const detail = i.detail ? ` (${i.detail})` : '';
      return `- ${i.title}${detail} : ${formatFCFA(i.subtotal)}`;
    });
    const categoryLabel = activeTheme?.categoryLabel ?? '';
    const message = [
      `Bonjour, je souhaite réserver les stands suivants pour WAY 6ème édition (Catégorie : ${categoryLabel}) :`,
      ...lines,
      `TOTAL : ${formatFCFA(totalPrice)}`,
    ].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  })();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white pt-16">
      <DecorativeTriangles />

      {/* 13 JOURS badge — only on hero step */}
      {step === 'hero' && (
        <div
          className="absolute top-24 right-0 z-20 hidden sm:flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-200 pl-8 pr-10 py-4 shadow-lg"
          style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="font-clash text-black leading-none text-center">
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight">13</div>
            <div className="text-xs md:text-sm font-semibold tracking-[0.3em] mt-1">JOURS</div>
          </div>
        </div>
      )}

      {step === 'hero' && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-24 text-center">
          <h1 className="font-clash text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-black leading-[0.95]">
            Prenez
            <br />
            votre <span className="text-red-600">Stand</span>
          </h1>

          <div className="flex justify-center mt-8">
            <div
              className="bg-red-600 text-white font-clash font-bold tracking-wider text-sm sm:text-base md:text-lg px-10 sm:px-14 py-3 shadow-lg"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
            >
              RÉSERVEZ VOTRE STAND - WAY 5EME EDITION
            </div>
          </div>

          <p className="font-nekst mt-8 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Exposez vos produits, valorisez vos services et créez des opportunités concrètes de vente
            et de collaboration dans un environnement festif et business.
          </p>

          <div className="mt-10 md:mt-14 flex justify-center">
            <img
              src="/stand/mockup%20Tente.webp"
              alt="Stand WAY 2026 — Tente officielle"
              className="w-full max-w-3xl h-auto drop-shadow-2xl"
              loading="eager"
            />
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={goToCategory}
              className="group relative bg-gradient-to-r from-yellow-300 to-yellow-200 text-black font-clash font-bold uppercase tracking-wider text-sm sm:text-base px-10 sm:px-14 py-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center gap-3 cursor-pointer"
              style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)' }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-black">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </span>
              Prendre un stand maintenant
            </button>
          </div>
        </section>
      )}

      {step === 'category' && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-24">
          {/* Back button */}
          <button
            type="button"
            onClick={goBack}
            className="font-nekst text-sm tracking-wider uppercase text-gray-700 hover:text-black flex items-center gap-2 mb-8 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>

          <div className="text-center mb-14">
            <h2 className="font-clash text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-[0.95]">
              Choisissez
              <br />
              votre <span className="text-red-600">Categorie</span>
            </h2>
            <p className="font-nekst mt-6 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Exposez vos produits, valorisez vos services et créez des opportunités concrètes de
              vente et de collaboration dans un environnement festif et business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* ENTREPRISES */}
            <article className="relative rounded-2xl overflow-hidden shadow-xl bg-white flex flex-col">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src="/Store.webp"
                  alt="Entreprises — stands de vente"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <img
                  src="/stand/mockup%20Tente.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-2/3 max-w-[260px] drop-shadow-2xl pointer-events-none"
                />
              </div>

              <div className="relative bg-gradient-to-b from-sky-500 to-sky-800 text-white px-6 sm:px-8 pt-16 pb-8 flex-1 flex flex-col">
                <h3 className="font-clash text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-center">
                  Entreprises et Institutions
                </h3>

                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {['PRESTATIONS', 'ARTISANTS', 'JEUX VIDÉOS'].map((tag) => (
                    <span
                      key={tag}
                      className="font-nekst text-xs sm:text-sm border border-white/80 rounded-full px-4 py-1.5 tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="font-nekst mt-6 space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Visibilité maximale
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Espaces larges pour exposition
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Forte affluence et trafic continu
                  </li>
                </ul>

                <div className="mt-auto pt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => selectCategory('entreprises')}
                    className="group bg-gradient-to-r from-yellow-300 to-yellow-200 text-black font-clash font-bold uppercase tracking-wider text-sm px-10 py-3 shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                    style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)' }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-black">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                    Selectionner
                  </button>
                </div>
              </div>
            </article>

            {/* FESTIF & GRANDES SAVEURS */}
            <article className="relative rounded-2xl overflow-hidden shadow-xl bg-white flex flex-col">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src="/eventhero.webp"
                  alt="Festif & grandes saveurs — gastronomie et buvette"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <img
                  src="/stand/mockup%20Tente%202.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-2/3 max-w-[260px] drop-shadow-2xl pointer-events-none"
                />
              </div>

              <div className="relative bg-gradient-to-b from-red-600 to-red-900 text-white px-6 sm:px-8 pt-16 pb-8 flex-1 flex flex-col">
                <h3 className="font-clash text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-center leading-tight">
                  Festif &
                  <br />
                  Grandes Saveurs
                </h3>

                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {['GASTRONOMIE', 'BUVETTE', 'B2B ET B2C'].map((tag) => (
                    <span
                      key={tag}
                      className="font-nekst text-xs sm:text-sm border border-white/80 rounded-full px-4 py-1.5 tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="font-nekst mt-6 space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Format flexible et accessible
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Ambiance conviviale et festive
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    Vente directe et forte interaction
                  </li>
                </ul>

                <div className="mt-auto pt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => selectCategory('festif')}
                    className="group bg-gradient-to-r from-yellow-300 to-yellow-200 text-black font-clash font-bold uppercase tracking-wider text-sm px-10 py-3 shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                    style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)' }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-black">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                    Selectionner
                  </button>
                </div>
              </div>
            </article>

            {/* WAY : ESPACE DE RENCONTRE B2B ET B2C */}
            <article className="relative rounded-2xl overflow-hidden shadow-xl bg-white flex flex-col">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src="/eventhero.webp"
                  alt="WAY — Espace de rencontre B2B et B2C"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <img
                  src="/stand/mockup%20Tente%203.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-2/3 max-w-[260px] drop-shadow-2xl pointer-events-none"
                />
              </div>

              <div className="relative bg-gradient-to-b from-yellow-300 to-yellow-500 text-black px-6 sm:px-8 pt-16 pb-8 flex-1 flex flex-col">
                <h3 className="font-clash text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-center leading-tight">
                  WAY : Espace de
                  <br />
                  Rencontre B2B et B2C
                </h3>

                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {['NETWORKING', 'B2B', 'B2C'].map((tag) => (
                    <span
                      key={tag}
                      className="font-nekst text-xs sm:text-sm border border-black/80 rounded-full px-4 py-1.5 tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="font-nekst mt-6 space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                    Mise en relation directe
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                    Espace dédié aux échanges professionnels
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                    Opportunités d&apos;affaires concrètes
                  </li>
                </ul>

                <div className="mt-auto pt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => selectCategory('rencontre')}
                    className="group bg-gradient-to-r from-red-600 to-red-700 text-white font-clash font-bold uppercase tracking-wider text-sm px-10 py-3 shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                    style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)' }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-white">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                      </svg>
                    </span>
                    Selectionner
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {step === 'formules' && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-24">
          {/* Back button */}
          <button
            type="button"
            onClick={goBack}
            className="font-nekst text-sm tracking-wider uppercase text-gray-700 hover:text-black flex items-center gap-2 mb-8 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="font-clash text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95]">
              {category === 'festif' ? (
                <>
                  <span className="text-black">FESTIF</span>{' '}
                  <span className="text-red-600">&amp; SAVEURS</span>
                </>
              ) : category === 'rencontre' ? (
                <>
                  <span className="text-black">RENCO</span>
                  <span className="text-yellow-500">NTRE</span>
                </>
              ) : (
                <>
                  <span className="text-black">ENTREP</span>
                  <span className="text-sky-500">RISES</span>
                </>
              )}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {(category === 'festif'
                ? ['GASTRONOMIE', 'FAST-FOOD', 'RESTAURATION', 'BUVETTE']
                : category === 'rencontre'
                ? ['NETWORKING', 'B2B', 'B2C', 'PARTENARIATS', 'OPPORTUNITÉS']
                : ['COMMERÇANTS', 'ARTISANTS', 'JEUX VIDÉOS', 'DIVERTISSEMENT', 'PRESTATIONS']
              ).map((tag) => (
                <span
                  key={tag}
                  className="font-nekst text-xs sm:text-sm border border-gray-400 rounded-full px-4 py-1.5 tracking-wider text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-nekst mt-6 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {category === 'festif'
                ? 'Les espaces réservés à la promotion sont limités. Les modules autorisés sont de 9 m² et 25 m² couvert. Le matériel est aménageable par le propriétaire du module.'
                : category === 'rencontre'
                ? 'Une nouveauté pour cette édition, un espace dédié aux rencontres entre businessman et clients. Les modules disponibles sont de 9 m² et 18 m² couvert. Les différents modules seront séparés par des cloisons CIMA et seront climatisés. Un espace de formation et de Conférence sera également mis à disposition. Son utilisation sera payante et facturée à l’heure.'
                : 'Un espace dédié aux grandes entreprises pour promouvoir leurs offres, écouler leurs stocks et maximiser leur visibilité pendant le festival.'}
            </p>

            {category === 'festif' && (
              <div className="mt-6 max-w-2xl mx-auto bg-red-50 border-l-4 border-red-600 px-5 py-4 text-left">
                <p className="font-clash font-bold uppercase tracking-wider text-xs text-red-700">
                  NB : les modules ci-dessous définissent clairement les différentes catégories
                </p>
                <p className="font-nekst mt-2 text-gray-700 text-sm leading-relaxed">
                  La machine à Chawarma et à glace représentent une catégorie de modules unique. Si un exposant inscrit l’un de ces appareils dans son espace gastronomique (9 m² ou 25 m²), il devra payer les frais entiers du module dédié à ces appareils.
                </p>
              </div>
            )}

            {/* Banner */}
            <div className="flex justify-center mt-6">
              <div
                className={`text-white font-clash font-bold tracking-wider text-xs sm:text-sm px-8 sm:px-12 py-2.5 shadow-md ${
                  category === 'festif'
                    ? 'bg-red-600'
                    : category === 'rencontre'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-sky-500'
                }`}
                style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
              >
                RÉSERVEZ VOTRE STAND - WAY 5EME EDITION
              </div>
            </div>
          </div>

          {/* Formula cards grid OR Festif section panels */}
          {category === 'festif' ? (
            <div className="mt-12 space-y-6">
              {FESTIF_SECTIONS.map((section) => (
                <FestifSectionPanel
                  key={section.number}
                  section={section}
                  selectedIds={selectedFormulas}
                  onToggle={toggleFormula}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
              {activeFormulas.map((f) => (
                <FormulaCard
                  key={f.id}
                  image={f.image}
                  title={f.title}
                  bullets={f.bullets}
                  price={f.price}
                  isOutline={f.isOutline}
                  isSurfaceNue={f.isSurfaceNue}
                  whatsappLink={whatsappLink(`${f.title} - ${f.price}`)}
                  selectable={isSelectable}
                  selected={selectedFormulas.includes(f.id)}
                  onToggle={() => toggleFormula(f.id)}
                  surfaceNueDimension={surfaceNueDimension}
                  onDimensionChange={setSurfaceNueDimension}
                  theme={activeTheme}
                />
              ))}
            </div>
          )}

          {/* Recap — when category supports selection and at least one is selected */}
          {isSelectable && activeTheme && selectedItems.length > 0 && (
            <div className={`mt-12 bg-white rounded-2xl shadow-2xl border-2 ${activeTheme.borderClass} p-6 sm:p-10`}>
              <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-black">
                Récapitulatif <span className={activeTheme.accentTextClass}>de votre sélection</span>
              </h3>
              <p className="font-nekst mt-2 text-gray-600 text-sm sm:text-base">
                Catégorie : {activeTheme.categoryLabel}
              </p>

              <ul className="font-nekst mt-6 divide-y divide-gray-200">
                {selectedItems.map((item) => (
                  <li
                    key={item.id}
                    className="py-4 flex justify-between items-center gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-clash font-bold uppercase tracking-tight text-base sm:text-lg text-black">
                        {item.title}
                      </p>
                      {item.detail && (
                        <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                      )}
                    </div>
                    <p className="font-clash font-bold text-base sm:text-lg text-black whitespace-nowrap">
                      {formatFCFA(item.subtotal)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                <p className="font-clash font-extrabold text-xl sm:text-2xl uppercase text-black">
                  Total
                </p>
                <p className={`font-clash font-extrabold text-2xl sm:text-3xl ${activeTheme.totalTextClass}`}>
                  {formatFCFA(totalPrice)}
                </p>
              </div>

              <div className="mt-8 flex justify-center sm:justify-end">
                <a
                  href={recapWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-clash font-bold uppercase tracking-wider text-sm px-10 py-3.5 shadow-lg hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                  style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-green-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.56 4.12 1.62 5.92L0 24l6.28-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.2-3.48-8.52zM12 21.8a9.78 9.78 0 01-5-1.38l-.36-.22-3.73.98 1-3.64-.24-.37A9.8 9.8 0 012.2 12C2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.48-7.34c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.18.2-.35.22-.65.07a8 8 0 01-2.36-1.45 8.9 8.9 0 01-1.64-2.04c-.17-.3 0-.45.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.67-.5h-.57a1.1 1.1 0 00-.8.38 3.35 3.35 0 00-1.05 2.5c0 1.47 1.08 2.9 1.22 3.1.15.2 2.12 3.23 5.13 4.53.72.3 1.27.5 1.7.63.72.22 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                    </svg>
                  </span>
                  Confirmer ma sélection
                </a>
              </div>
            </div>
          )}

          {/* Included + schedule block — dark */}
          <div className="mt-16 bg-gradient-to-b from-black to-red-950 rounded-2xl px-6 sm:px-10 py-12 text-white">
            <div className="text-center">
              <p className="font-nekst text-sm tracking-[0.3em] text-gray-300">13 JOURS DE LOCATION</p>
              <h3 className="font-clash text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight mt-2 leading-tight">
                Le prix forfaitaire
                <br />
                des modules <span className="text-yellow-400">comprend :</span>
              </h3>
            </div>

            <ul className="font-nekst mt-10 max-w-2xl mx-auto space-y-3 text-sm sm:text-base">
              {[
                'Chapiteau avec joues fermable, l’éclairage & une prise',
                'Identification du personnel de l’exposant avec des supports fournis par l’organisateur',
                'Durée : 13 jours d’exploitation',
                'Paiement complet requis avant le 10 juillet 2026',
                'Placement prioritaire selon ordre de paiement',
                'NB : L’installation du triphasé sur demande spécifique coûte 25.000 FCFA',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Schedule frame */}
            <div className="mt-10 mx-auto max-w-3xl border border-white/30 rounded-xl px-6 py-6 text-center space-y-2">
              <p className="font-clash text-cyan-400 text-sm sm:text-base tracking-wider uppercase">
                Aménagement de l&apos;espace : 15 - 17 Juil 2026
              </p>
              <p className="font-clash text-yellow-400 text-sm sm:text-base tracking-wider uppercase">
                Exposition Vente, Animation, Promotions : 18 - 27 Juil 2026 (13 Jrs)
              </p>
              <p className="font-clash text-red-500 text-sm sm:text-base tracking-wider uppercase">
                Libération des stands : 26 - 27 Juil 2026
              </p>
            </div>

            {/* Contact */}
            <div className="mt-10 text-center">
              <p className="font-nekst text-gray-300 text-sm sm:text-base">
                Pour plus d&apos;informations et la réservation de vos stands, contactez-nous.
              </p>
              <p className="font-clash text-white text-lg sm:text-xl md:text-2xl tracking-wider mt-3">
                TEL : +237 655 64 38 59 / +237 658 21 96 38
              </p>
              <p className="font-clash text-white text-sm sm:text-base md:text-lg tracking-wider mt-1">
                EMAIL : WHATABOUTYOU@GMAIL.COM
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

interface FormulaCardProps {
  image?: string;
  title: string;
  bullets: string[];
  price: string;
  whatsappLink: string;
  isOutline?: boolean;
  isSurfaceNue?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
  surfaceNueDimension?: number;
  onDimensionChange?: (n: number) => void;
  theme?: CategoryTheme | null;
}

const FormulaCard: React.FC<FormulaCardProps> = ({
  image,
  title,
  bullets,
  price,
  whatsappLink,
  isOutline,
  isSurfaceNue,
  selectable,
  selected,
  onToggle,
  surfaceNueDimension,
  onDimensionChange,
  theme,
}) => (
  <article
    onClick={selectable ? onToggle : undefined}
    className={`relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all ${
      selectable ? 'cursor-pointer' : ''
    } ${
      selectable && selected
        ? `ring-4 ${theme?.ringClass ?? 'ring-sky-500'} shadow-2xl`
        : 'shadow-lg hover:shadow-xl'
    }`}
  >
    {/* Selection checkbox indicator */}
    {selectable && (
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
            selected
              ? `${theme?.badgeBgClass ?? 'bg-sky-500'} ${theme?.badgeBorderClass ?? 'border-sky-500'} text-white`
              : 'bg-white border-gray-300 text-transparent'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
    )}

    {/* Image zone */}
    <div className="relative h-56 sm:h-64 bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4">
      {isOutline ? (
        <svg viewBox="0 0 200 140" className="w-48 h-36" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 6">
          <path d="M20 120 L20 60 L100 20 L180 60 L180 120 Z" strokeLinejoin="round" />
        </svg>
      ) : (
        <img src={image} alt={title} className="max-h-full w-auto object-contain drop-shadow-xl" loading="lazy" />
      )}
    </div>

    {/* Content */}
    <div className="px-6 sm:px-8 py-6 flex-1 flex flex-col">
      <h4 className="font-clash text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
        {title}
      </h4>
      <ul className="font-nekst mt-4 space-y-2 text-sm sm:text-base text-gray-700 flex-1">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 mt-2" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Surface Nue dimension input (selectable mode only) */}
      {selectable && isSurfaceNue && selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`mt-4 flex items-center gap-3 ${theme?.bgLightClass ?? 'bg-sky-50'} border ${theme?.borderLightClass ?? 'border-sky-200'} rounded-lg px-4 py-3`}
        >
          <label className="font-nekst text-sm text-gray-700 whitespace-nowrap">
            Dimension :
          </label>
          <input
            type="number"
            min={1}
            value={surfaceNueDimension ?? 1}
            onChange={(e) =>
              onDimensionChange?.(Math.max(1, Number(e.target.value) || 1))
            }
            className={`w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${theme?.focusRingClass ?? 'focus:ring-sky-500'} font-clash`}
          />
          <span className="font-nekst text-sm text-gray-700">m²</span>
        </div>
      )}

      {/* Price CTA — link to WhatsApp when not selectable, plain label when selectable */}
      {selectable ? (
        <div
          className="mt-6 self-start bg-gradient-to-r from-yellow-300 to-yellow-200 text-black font-clash font-bold uppercase tracking-wider text-sm px-8 py-2.5 shadow-md"
          style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
        >
          {price}
        </div>
      ) : (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 self-start bg-gradient-to-r from-yellow-300 to-yellow-200 text-black font-clash font-bold uppercase tracking-wider text-sm px-8 py-2.5 shadow-md hover:scale-[1.02] transition-transform flex items-center gap-3 cursor-pointer"
          style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.56 4.12 1.62 5.92L0 24l6.28-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.2-3.48-8.52zM12 21.8a9.78 9.78 0 01-5-1.38l-.36-.22-3.73.98 1-3.64-.24-.37A9.8 9.8 0 012.2 12C2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.48-7.34c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.18.2-.35.22-.65.07a8 8 0 01-2.36-1.45 8.9 8.9 0 01-1.64-2.04c-.17-.3 0-.45.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.67-.5h-.57a1.1 1.1 0 00-.8.38 3.35 3.35 0 00-1.05 2.5c0 1.47 1.08 2.9 1.22 3.1.15.2 2.12 3.23 5.13 4.53.72.3 1.27.5 1.7.63.72.22 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            </svg>
          </span>
          {price}
        </a>
      )}
    </div>
  </article>
);

interface FestifSectionPanelProps {
  section: FestifSection;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const FestifSectionPanel: React.FC<FestifSectionPanelProps> = ({
  section,
  selectedIds,
  onToggle,
}) => (
  <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-red-600 bg-white">
    <div className="bg-red-600 text-white px-5 sm:px-6 py-3 sm:py-4">
      <h4 className="font-clash font-extrabold uppercase tracking-tight text-base sm:text-lg">
        Section {section.number} : {section.title}
      </h4>
    </div>

    <div className="hidden sm:grid grid-cols-[2fr_1fr_auto] gap-4 px-5 sm:px-6 py-2.5 bg-red-50 border-b border-red-200 items-center">
      <span className="font-clash font-bold uppercase text-[11px] tracking-wider text-red-700">
        Type de module
      </span>
      <span className="font-clash font-bold uppercase text-[11px] tracking-wider text-red-700 text-right">
        Tarif en FCFA
      </span>
      <span className="font-clash font-bold uppercase text-[11px] tracking-wider text-red-700 w-12 text-center">
        Choix
      </span>
    </div>

    <ul>
      {section.modules.map((m, idx) => {
        const isSelected = selectedIds.includes(m.id);
        return (
          <li
            key={m.id}
            className={
              idx < section.modules.length - 1 ? 'border-b border-gray-100' : ''
            }
          >
            <button
              type="button"
              onClick={() => onToggle(m.id)}
              className={`w-full grid grid-cols-[2fr_1fr_auto] gap-4 items-center px-5 sm:px-6 py-3.5 text-left transition cursor-pointer ${
                isSelected ? 'bg-red-50' : 'bg-white hover:bg-red-50/60'
              }`}
            >
              <span className="font-nekst text-sm sm:text-base text-gray-800">
                {m.label}
              </span>
              <span className="font-clash font-bold text-sm sm:text-base text-black text-right whitespace-nowrap">
                {m.price}
              </span>
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                  isSelected
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-300 text-transparent'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

export default BoutiquePage;
