import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isFeatured?: boolean;
  image?: string;
}

const FAQSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(2); // Start with featured item open

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Quand et où se déroule What About You ?",
      answer: "What About You 4ème édition se déroule du 21 au 26 juillet au Palais de Congrès à Yaoundé, Cameroun. Un événement de 6 jours rempli d'activités entrepreneuriales, de conférences, d'expositions et de divertissements."
    },
    {
      id: 2,
      question: "Quelles sont les catégories de personnes concernées ?",
      answer: "What About You s'adresse principalement aux jeunes entrepreneurs et futurs entrepreneurs : les étudiants, les collégiens et les travailleurs. Notre événement est conçu pour inspirer et former tous ceux qui souhaitent développer leur esprit entrepreneurial et concrétiser leurs projets.",
      isFeatured: true,
      image: "/Store.webp"
    },
    {
      id: 3,
      question: "Comment s'acquérir d'un stand d'exposition ?",
      answer: "Pour acquérir un stand d'exposition, vous pouvez nous contacter directement via nos numéros de téléphone (+237 6 91 94 58 95, +237 6 55 64 38 59, +237 6 73 03 52 57) ou par email à whatabout.officiel@gmail.com. Nos équipes vous guideront dans le processus de réservation et vous fourniront tous les détails sur les tarifs et les modalités."
    },
    {
      id: 4,
      question: "Quel est le prix d'un ticket d'entrée ?",
      answer: "Les tarifs des tickets varient selon les catégories d'âge et les types d'accès. Pour connaître les prix détaillés et les offres spéciales, veuillez nous contacter directement. Nous proposons également des tarifs préférentiels pour les groupes et les étudiants."
    },
    {
      id: 5,
      question: "Comment puis-je obtenir plus d'informations ?",
      answer: "Pour toute information supplémentaire, n'hésitez pas à nous contacter au Palais de Congrès à Yaoundé. Téléphones : +237 6 91 94 58 95, +237 6 55 64 38 59, +237 6 73 03 52 57. Email : whatabout.officiel@gmail.com. Suivez-nous également sur nos réseaux sociaux pour rester informés des dernières actualités."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            FAQ WAY
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trouvez les réponses à vos questions les plus fréquentes sur What About You, 
            l'événement entrepreneurial jeune qui transforme les rêves en réalité.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                item.isFeatured && openItem === item.id
                  ? 'bg-gray-900 text-white border-gray-700'
                  : 'bg-white'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  item.isFeatured && openItem === item.id
                    ? 'hover:bg-gray-800 text-white'
                    : 'text-gray-900'
                }`}
              >
                <span className="font-medium pr-4">{item.question}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  item.isFeatured && openItem === item.id
                    ? 'border-white bg-white text-gray-900'
                    : 'border-gray-300 text-gray-600'
                } ${openItem === item.id ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer Content */}
              {openItem === item.id && (
                <div className={`px-6 pb-6 ${
                  item.isFeatured ? 'pt-0' : 'pt-2'
                }`}>
                  {item.isFeatured ? (
                    /* Featured Item with Image */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Content Side */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          NOTRE COMMUNAUTÉ
                        </h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {item.answer}
                        </p>
                      </div>

                      {/* Image Side */}
                      <div className="relative">
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={item.image}
                            alt="Notre communauté"
                            className="w-full h-64 lg:h-80 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x300/4A5568/white?text=Event+Community';
                            }}
                          />
                          {/* Yellow accent circle */}
                          <div className="absolute bottom-4 right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular FAQ Answer */
                    <div className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous avez d'autres questions ? N'hésitez pas à nous contacter !
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            NOUS CONTACTER
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 