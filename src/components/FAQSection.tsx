import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Quel âge pour participer ?',
      answer:
        "What About You est ouvert à tous les âges. Cependant, l'événement est principalement conçu pour les jeunes entrepreneurs, étudiants et professionnels âgés de 15 à 40 ans.",
    },
    {
      id: 2,
      question: 'Y a-t-il un programme pour les entrepreneurs ?',
      answer:
        "Oui ! WAY propose des conférences, ateliers pratiques, sessions de mentorat et des espaces de networking dédiés aux entrepreneurs. Vous pourrez également exposer vos produits et services sur nos stands.",
    },
    {
      id: 3,
      question: 'Quels moyens de paiement sont acceptés ?',
      answer:
        "Nous acceptons les paiements par Mobile Money (MTN Mobile Money, Orange Money), les cartes bancaires (Visa, Mastercard), ainsi que les paiements en espèces sur place.",
    },
    {
      id: 4,
      question: 'Comment puis-je obtenir plus d\'informations ?',
      answer:
        "Contactez-nous par téléphone au +237 6 91 94 58 95, +237 6 55 64 38 59 ou +237 6 73 03 52 57. Par email : whatabout.officiel@gmail.com. Suivez-nous sur nos réseaux sociaux pour les dernières actualités.",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-clash text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 uppercase tracking-tight">
            Questions Fréquemment
          </h2>
          <p className="font-nekst text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tu as des questions sur WAY 5 ? Nous avons regroupé ici les réponses aux questions les plus
            fréquentes pour t'aider à préparer ton expérience.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className={index < faqItems.length - 1 ? 'border-b border-gray-200' : ''}
            >
              {/* Question Row */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-nekst text-gray-900 text-base md:text-lg pr-4">
                  {item.question}
                </span>
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-transform duration-300 ${
                    openItem === item.id ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="font-nekst text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
