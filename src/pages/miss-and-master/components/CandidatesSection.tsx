import React, { useState } from 'react';

interface Candidate {
  id: number;
  name: string;
  category: 'miss';
  ranking: number;
  points: number;
  image: string;
  sash: string;
}

const CandidatesSection = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Mock data for candidates - only Miss candidates
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "AÏCHA NGUEMWO",
      category: 'miss',
      ranking: 1,
      points: 251,
      image: "/miss1.webp",
      sash: "MISS FESTIVAL 2024"
  },
  {
    id: 2,
    name: "VANESSA KOUMBA",
    category: 'miss',
    ranking: 2,
    points: 251,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 3,
    name: "KELLY NDIONE",
    category: 'miss',
    ranking: 3,
    points: 184,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 4,
    name: "MARIE DUBOIS",
    category: 'miss',
    ranking: 4,
    points: 167,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 5,
    name: "SARAH JOHNSON",
    category: 'miss',
    ranking: 5,
    points: 145,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 6,
    name: "EMMA WILSON",
    category: 'miss',
    ranking: 6,
    points: 132,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 7,
    name: "LÉA MARTIN",
    category: 'miss',
    ranking: 7,
    points: 128,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 8,
    name: "ZOÉ LEFÈVRE",
    category: 'miss',
    ranking: 8,
    points: 118,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 9,
    name: "AMINATA DIALLO",
    category: 'miss',
    ranking: 9,
    points: 112,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 10,
    name: "FATOU BÂ",
    category: 'miss',
    ranking: 10,
    points: 105,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 11,
    name: "SOPHIE LEROY",
    category: 'miss',
    ranking: 11,
    points: 98,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 12,
    name: "CLARA DUPONT",
    category: 'miss',
    ranking: 12,
    points: 92,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 13,
    name: "JADE BERTRAND",
    category: 'miss',
    ranking: 13,
    points: 87,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 14,
    name: "LUCIA FERNANDEZ",
    category: 'miss',
    ranking: 14,
    points: 82,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 15,
    name: "MARWA BENAHMED",
    category: 'miss',
    ranking: 15,
    points: 76,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 16,
    name: "ANNA KOWALSKA",
    category: 'miss',
    ranking: 16,
    points: 71,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 17,
    name: "YASMINA OUAHBI",
    category: 'miss',
    ranking: 17,
    points: 65,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 18,
    name: "LINA PETROVA",
    category: 'miss',
    ranking: 18,
    points: 59,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 19,
    name: "NADIA EL-MASRI",
    category: 'miss',
    ranking: 19,
    points: 54,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  },
  {
    id: 20,
    name: "HANA ABDI",
    category: 'miss',
    ranking: 20,
    points: 48,
    image: "/miss1.webp",
    sash: "MISS FESTIVAL 2024"
  }
  ];

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseVoting = () => {
    setSelectedCandidate(null);
  };

  if (selectedCandidate) {
    return <VotingInterface candidate={selectedCandidate} onClose={handleCloseVoting} />;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          MISS WHAT ABOUT YOU - CANDIDATES
        </h2>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Candidate Image */}
              <div className="relative">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-full h-80 object-cover object-center"
                />
                {/* Ranking Badge - Overlapping design */}
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-black font-bold text-2xl px-4 py-3 rounded-lg shadow-lg border-4 border-white z-10">
                  <div className="text-center">
                    <div className="text-3xl font-black">#{candidate.ranking}</div>
                    <div className="text-xs font-semibold mt-1">
                      MISS
                    </div>
                  </div>
                </div>
                {/* Crown for #1 */}
                {candidate.ranking === 1 && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z"/>
                    </svg>
                  </div>
                )}
                {/* Sash Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-white text-sm font-semibold transform -rotate-12 bg-gray-800/80 px-2 py-1 rounded inline-block">
                    {candidate.sash}
                  </div>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">
                    MISS2024
                  </span>
                  <span className="text-gray-600 font-semibold">{candidate.points} PTS</span>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => handleVoteClick(candidate)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
                >
                  VOTER POUR MOI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Voting Interface Component
interface VotingInterfaceProps {
  candidate: Candidate;
  onClose: () => void;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ candidate, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('Orange CM');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('1000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle voting submission
    console.log('Vote submitted:', { candidate: candidate.id, paymentMethod, phoneNumber, amount });
    // You would typically send this to your backend
    alert('Vote soumis avec succès!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-yellow-400 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-bold text-black">NB : 500 FCFA = 1 OPTS</span>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Candidate Image */}
          <div className="lg:w-1/2 p-8">
            <div className="relative">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              {/* Ranking Badge */}
              <div className="absolute top-4 left-4 bg-yellow-400 text-black font-bold text-2xl px-4 py-2 rounded-lg">
                #{candidate.ranking}
                <div className="text-sm font-normal">
                  MISS
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-500 rounded-full opacity-80"></div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-cyan-500 rounded-full opacity-80"></div>
            </div>
          </div>

          {/* Right Side - Voting Form */}
          <div className="lg:w-1/2 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">VOTER POUR MOI</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{candidate.name}</h3>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>MISS2024</span>
                <span>|</span>
                <span>{candidate.points} PTS</span>
                <span>|</span>
                <span>#{candidate.ranking} / 6</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Orange CM">Orange CM</option>
                    <option value="MTN CM">MTN CM</option>
                    <option value="Moov CM">Moov CM</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+237 690 123 456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrez le montant (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="500"
                    step="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>PROCÉDER AU PAIEMENT</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesSection; 