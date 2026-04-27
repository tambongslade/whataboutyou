import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';

type Step = 'hero' | 'category' | 'formules';
type Category = 'entreprises' | 'festif';

const WHATSAPP_NUMBER = '237655643859';
const whatsappLink = (formula: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour, je souhaite réserver un stand (${formula}) pour WAY 6ème édition.`
  )}`;

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
      className="absolute top-[30%] right-[18%] w-10 h-14 bg-cyan-400 opacity-85"
      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(15deg)' }}
    />
    <div
      className="absolute bottom-[28%] left-[18%] w-8 h-12 bg-cyan-400 opacity-80"
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

  const goToCategory = () => {
    setStep('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (cat: Category) => {
    setCategory(cat);
    setStep('formules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (step === 'formules') {
      setStep('category');
    } else {
      setStep('hero');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
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

                <div className="mt-8 flex justify-center">
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

                <div className="mt-8 flex justify-center">
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
                ? ['GASTRONOMIE', 'BUVETTE', 'B2B ET B2C', 'FOOD TRUCK', 'ANIMATION']
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
                ? 'Un espace convivial et festif pour les professionnels de la gastronomie, de la buvette et de l’animation, au cœur de l’effervescence du festival.'
                : 'Un espace dédié aux grandes entreprises pour promouvoir leurs offres, écouler leurs stocks et maximiser leur visibilité pendant le festival.'}
            </p>

            {/* Banner */}
            <div className="flex justify-center mt-6">
              <div
                className={`text-white font-clash font-bold tracking-wider text-xs sm:text-sm px-8 sm:px-12 py-2.5 shadow-md ${
                  category === 'festif' ? 'bg-red-600' : 'bg-sky-500'
                }`}
                style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
              >
                RÉSERVEZ VOTRE STAND - WAY 5EME EDITION
              </div>
            </div>
          </div>

          {/* Formula cards — 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
            {/* FORMULE 1 */}
            <FormulaCard
              image="/stand/mockup%20Tente%203.webp"
              title="FORMULE 1"
              bullets={['9 m² (3 x 3 m)', '4 personnes', 'Format accessible, mise en place rapide']}
              price="120 000 FCFA"
              whatsappLink={whatsappLink('Formule 1 - 9m² - 120 000 FCFA')}
            />

            {/* FORMULE 2 */}
            <FormulaCard
              image="/stand/mockup%20Tente%204.webp"
              title="FORMULE 2"
              bullets={['25 m² (5 x 5 m)', '5 personnes', 'Meilleure visibilité, espace d’interaction optimisé']}
              price="150 000 FCFA"
              whatsappLink={whatsappLink('Formule 2 - 25m² - 150 000 FCFA')}
            />

            {/* SURFACE NUE */}
            <FormulaCard
              isOutline
              title="SURFACE NUE"
              bullets={['(Dimension en m²)', 'Personnes indéterminée', 'Liberté totale d’aménagement, adaptation sur mesure']}
              price="20 000 FCFA / M²"
              whatsappLink={whatsappLink('Surface nue - 20 000 FCFA/m²')}
            />

            {/* FORMULE 3 */}
            <FormulaCard
              image="/stand/mockup%20Tente%205.webp"
              title="FORMULE 3"
              bullets={['50 m² (5 x 10 m)', '10 personnes', 'Forte présence de marque, grande capacité d’accueil']}
              price="400 000 FCFA"
              whatsappLink={whatsappLink('Formule 3 - 50m² - 400 000 FCFA')}
            />
          </div>

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
}

const FormulaCard: React.FC<FormulaCardProps> = ({ image, title, bullets, price, whatsappLink, isOutline }) => (
  <article className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
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

      {/* Price CTA */}
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
    </div>
  </article>
);

export default BoutiquePage;
