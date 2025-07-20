import React, { useState, useEffect } from 'react';
import { candidateService, votingService, handleApiError, type Candidate } from '../../../services/candidateService';

const CandidatesSection = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'voting' | 'details'>('grid');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load candidates from API
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidateService.getMissCandidates();

      if (response.success && response.data) {
        // Sort by ranking
        const sortedCandidates = response.data.sort((a, b) => a.ranking - b.ranking);
        setCandidates(sortedCandidates);
      } else {
        setError(response.error || 'Erreur lors du chargement des candidates');
      }
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data as fallback (in case API is not available)
  const fallbackCandidates: Candidate[] = [
    {
      id: '1',
      name: "EDIDIGUE SOPHIE NATACHA",
      category: 'miss',
      ranking: 1,
      points: 251,
      image: "/miss2025/c1.jpg",
      sash: "MISS WAY 2025",
      age: 22,
      city: "Douala",
      profession: "Étudiante en Commerce International",
      hobbies: ["Danse", "Photographie", "Voyage", "Lecture"],
      description: "Passionnée par l'art et la culture, Sophie rêve de représenter le Cameroun sur la scène internationale. Elle s'engage activement dans des projets communautaires pour l'éducation des jeunes filles.",
      socialMedia: {
        instagram: "@sophie_natacha",
        facebook: "Sophie Natacha Edidigue",
        tiktok: "@sophienatacha"
      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'

    },
    {
      id: '2',
      name: "MARTHE YVANA",
      category: 'miss',
      ranking: 2,
      points: 245,
      image: "/miss2025/c2.jpg",
      sash: "MISS WAY 2025",
      age: 21,
      city: "Yaoundé",
      profession: "Étudiante en Marketing Digital",
      hobbies: ["Mode", "Cuisine", "Fitness", "Musique"],
      description: "Créative et ambitieuse, Marthe aspire à utiliser sa plateforme pour promouvoir l'entrepreneuriat féminin au Cameroun.",
      socialMedia: {
        instagram: "@marthe_yvana",
        facebook: "Marthe Yvana",
        tiktok: "@martheyvana",
      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z',
    },
    {
      id: '3',
      name: "MENYE ABOUNA ORNELLA",
      category: 'miss',
      ranking: 3,
      points: 184,
      image: "/miss2025/c3.jpg",
      sash: "MISS WAY 2025",
      age: 23,
      city: "Bafoussam",
      profession: "Infirmière",
      hobbies: ["Bénévolat", "Lecture", "Natation", "Jardinage"],
      description: "Dévouée au service de la communauté, Ornella souhaite sensibiliser sur l'importance de la santé préventive.",
      socialMedia: {
        instagram: "@ornella_menye",
        facebook: "Ornella Menye Abouna",
        tiktok: "@ornellamenye",

      }
      , isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '4',
      name: "MBASSEGUE MADELEINE IVANA",
      category: 'miss',
      ranking: 4,
      points: 167,
      image: "/miss2025/c4.jpg",
      sash: "MISS WAY 2025",
      age: 20,
      city: "Douala",
      profession: "Étudiante en Droit",
      hobbies: ["Débat", "Écriture", "Théâtre", "Peinture"],
      description: "Future avocate passionnée par la justice sociale, Madeleine veut défendre les droits des femmes et des enfants.",
      socialMedia: {
        instagram: "@madeleine_ivana",
        facebook: "Madeleine Ivana Mbassegue",
        tiktok: "@madeleineivana"
      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '5',
      name: "MBARGA CHANTAL ASTRID",
      category: 'miss',
      ranking: 5,
      points: 145,
      image: "/miss2025/c5.jpg",
      sash: "MISS WAY 2025",
      age: 24,
      city: "Yaoundé",
      profession: "Architecte",
      hobbies: ["Design", "Voyage", "Photographie", "Yoga"],
      description: "Architecte créative, Chantal rêve de concevoir des espaces durables et accessibles pour tous.",
      socialMedia: {
        instagram: "@chantal_astrid",
        facebook: "Chantal Astrid Mbarga",
        tiktok: "@chantalastrid",

      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '6',
      name: "BAKOTTO ÉMILIE CAROLE",
      category: 'miss',
      ranking: 6,
      points: 132,
      image: "/miss2025/c6.jpg",
      sash: "MISS WAY 2025",
      age: 22,
      city: "Bamenda",
      profession: "Journaliste",
      hobbies: ["Écriture", "Investigation", "Podcast", "Cinéma"],
      description: "Journaliste engagée, Émilie veut donner une voix aux sans-voix et promouvoir la transparence.",
      socialMedia: {
        instagram: "@emilie_carole",
        facebook: "Émilie Carole Bakotto",
        tiktok: "@emiliecarole",

      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '7',
      name: "LOVELY MENDJA",
      category: 'miss',
      ranking: 7,
      points: 128,
      image: "/miss2025/c7.jpg",
      sash: "MISS WAY 2025",
      age: 21,
      city: "Douala",
      profession: "Étudiante en Médecine",
      hobbies: ["Recherche", "Musique", "Danse", "Bénévolat"],
      description: "Future médecin, Lovely s'engage pour améliorer l'accès aux soins de santé dans les zones rurales.",
      socialMedia: {
        instagram: "@lovely_mendja",
        facebook: "Lovely Mendja",
        tiktok: "@lovelymendja",

      },
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '8',
      name: "Sa’a Dongmo Emira Princesse",
      category: 'miss',
      ranking: 8,
      points: 118,
      image: "/miss2025/c8.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '9',
      name: "MENDO Israel",
      category: 'miss',
      ranking: 9,
      points: 112,
      image: "/miss2025/c9.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '10',
      name: "Metagne Aristide flaure ",
      category: 'miss',
      ranking: 10,
      points: 105,
      image: "/miss2025/c10.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '11',
      name: "Bidjang Armand Danièle",
      category: 'miss',
      ranking: 11,
      points: 98,
      image: "/miss2025/c11.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '12',
      name: "Djiani Lesly",
      category: 'miss',
      ranking: 12,
      points: 92,
      image: "/miss2025/c12.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '13',
      name: "manguelle  Kimberly ",
      category: 'miss',
      ranking: 13,
      points: 87,
      image: "/miss2025/c13.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '14',
      name: "NGWE  EZ'IA  REINE ",
      category: 'miss',
      ranking: 14,
      points: 82,
      image: "/miss2025/c14.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '15',
      name: "Baloueck  Princess Géraldine ",
      category: 'miss',
      ranking: 15,
      points: 76,
      image: "/miss2025/c15.jpg",
      sash: "MISS WAY 2025",
      isActive: true,
      votes: 76,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    }
  ];

  // Use fallback data if API fails
  const displayCandidates = candidates.length > 0 ? candidates : fallbackCandidates;

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('voting');
  };

  // const handleDetailsClick = (candidate: Candidate) => {
  //   setSelectedCandidate(candidate);
  //   setViewMode('details');
  // };

  const handleClose = () => {
    setSelectedCandidate(null);
    setViewMode('grid');
  };

  if (selectedCandidate && viewMode === 'voting') {
    return <VotingInterface candidate={selectedCandidate} onClose={handleClose} />;
  }

  if (selectedCandidate && viewMode === 'details') {
    return <CandidateDetailsPage candidate={selectedCandidate} onClose={handleClose} onVote={() => setViewMode('voting')} />;
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-700">Chargement des candidates...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-4 max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
              <p className="mb-4">{error}</p>
              <button
                onClick={loadCandidates}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Réessayer
              </button>
            </div>
            {fallbackCandidates.length > 0 && (
              <p className="text-gray-600">Affichage des données de démonstration...</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Section Title with Enhanced Styling */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            <svg className="w-8 h-8 mx-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 mb-4">
            MISS WHAT ABOUT YOU
          </h2>
          <p className="text-xl text-gray-600 font-medium">CANDIDATES 2025</p>
          <div className="mt-6 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
              <span className="text-gray-700 font-semibold">{displayCandidates.length} Candidates • Vote Now</span>
            </div>
          </div>
        </div>

        {/* Candidates Grid with Enhanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {displayCandidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-2 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Candidate Image with Overlay Effects */}
              <div className="relative overflow-hidden">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-full h-80 object-cover object-top transition-transform duration-300 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>

                {/* Ranking Badge - Enhanced Design */}
                <div className="absolute -top-4 -right-4 z-20">
                  <div className="relative">
                    <div className={`${candidate.ranking <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} text-white font-black text-lg px-4 py-3 rounded-2xl shadow-2xl border-4 border-white transform rotate-12 group-hover:rotate-0 transition-transform duration-150`}>
                      <div className="text-center">
                        <div className="text-2xl font-black">#{candidate.ranking}</div>
                        <div className="text-xs font-bold mt-1">MISS</div>
                      </div>
                    </div>
                    {/* Sparkle Effect for Top 3 */}
                    {candidate.ranking <= 3 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* Crown for #1 with Animation */}
                {candidate.ranking === 1 && (
                  <div className="absolute -top-3 -right-3 z-30 animate-bounce">
                    <svg className="w-8 h-8 text-yellow-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
                    </svg>
                  </div>
                )}

                {/* Points Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-1 rounded-full shadow-lg">
                  <span className="text-sm">{candidate.points} PTS</span>
                </div>

                {/* Sash with Better Design */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-150">
                    {candidate.sash}
                  </div>
                </div>
              </div>

              {/* Candidate Info with Enhanced Styling */}
              <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-150">
                  {candidate.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-600 font-semibold text-sm">MISS 2025</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-gray-700 font-bold text-sm">{candidate.points}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <button
                    onClick={() => handleDetailsClick(candidate)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-150 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>VOIR PROFIL</span>
                  </button> */}

                  <button
                    onClick={() => handleVoteClick(candidate)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-150 transform hover:scale-105 hover:shadow-lg group-hover:shadow-pink-500/25 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>VOTER POUR MOI</span>
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-150"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-150"></div>
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">Vote for your favorite candidate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Voting Interface Component
interface VotingInterfaceProps {
  candidate: Candidate;
  onClose: () => void;
  onVoteComplete?: () => void;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ candidate, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'MTN' | 'ORANGEMONEY'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(500);
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate points based on amount (100 FCFA = 1 point)
  const calculatePoints = (amount: number): number => {
    return Math.floor(amount / 100);
  };

  const points = calculatePoints(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await votingService.handleVoteSubmission(
        candidate.id,
        {
          phone: phoneNumber,
          email: email,
          name: customerName
        },
        amount,
        paymentMethod,
        candidate.name
      );

      if (result.success) {
        // Payment link will redirect user
        console.log('Redirecting to payment...');
        // The redirect happens in the service
      } else {
        setError(result.error || 'Erreur lors de la création du vote');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-white text-lg">Vote Now</span>
                <p className="text-white/80 text-sm">500 FCFA = 1 VOTE</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Enhanced Candidate Image */}
          <div className="lg:w-1/2 p-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-150"></div>
              <img
                src={candidate.image}
                alt={candidate.name}
                className="relative w-full h-96 object-cover object-top rounded-2xl shadow-2xl"
              />

              {/* Enhanced Ranking Badge */}
              <div className="absolute top-6 left-6">
                <div className={`${candidate.ranking <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} text-white font-black text-xl px-4 py-3 rounded-2xl shadow-xl border-4 border-white`}>
                  <div className="text-center">
                    <div className="text-2xl">#{candidate.ranking}</div>
                    <div className="text-xs font-bold">MISS</div>
                  </div>
                </div>
                {candidate.ranking === 1 && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Points Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-4 py-2 rounded-full shadow-lg">
                <span className="text-lg">{candidate.points} PTS</span>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -right-6 w-6 h-6 bg-indigo-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>

          {/* Right Side - Enhanced Voting Form */}
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">VOTER POUR</h2>
              </div>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
                {candidate.name}
              </h3>
              <div className="flex items-center space-x-4 text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                <span className="font-semibold">MISS 2025</span>
                <span>•</span>
                <span className="font-bold">{candidate.points} PTS</span>
                <span>•</span>
                <span>#{candidate.ranking} / 15</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Payment Method */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Méthode de paiement
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'MTN' | 'ORANGEMONEY')}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-100 appearance-none bg-white shadow-sm font-semibold"
                  >
                    <option value="MTN">🟡 MTN Mobile Money</option>
                    <option value="ORANGEMONEY">🟠 Orange Money CM</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="674123456"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-100 shadow-sm font-semibold"
                  required
                />
              </div>

              {/* Enhanced Amount with Custom Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Montant du vote (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setAmount(Math.max(100, value)); // Minimum 100 FCFA
                    }}
                    min="100"
                    step="100"
                    placeholder="Entrez le montant"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-100 shadow-sm font-bold text-lg"
                    required
                  />
                  <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                    FCFA
                  </span>
                </div>

                {/* Points Display */}
                <div className="mt-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Points à gagner:</span>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-2xl font-black text-pink-600">
                        {points}
                      </span>
                      <span className="text-gray-600 font-semibold">
                        point{points > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    100 FCFA = 1 point • Minimum: 100 FCFA
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[500, 1000, 2500, 5000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${amount === quickAmount
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {quickAmount} FCFA ({Math.floor(quickAmount / 100)} pts)
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-100 shadow-sm font-semibold"
                  required
                />
              </div>

              {/* Customer Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-100 shadow-sm font-semibold"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={loading || !candidate.isActive}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white font-black py-5 px-8 rounded-xl transition-all duration-150 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{loading ? 'Traitement...' : 'PROCÉDER AU PAIEMENT'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {!candidate.isActive && (
                <p className="text-center text-red-600 font-semibold mt-4">
                  Ce candidat n'accepte plus de votes
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Candidate Details Page Component
interface CandidateDetailsPageProps {
  candidate: Candidate;
  onClose: () => void;
  onVote: () => void;
}

const CandidateDetailsPage: React.FC<CandidateDetailsPageProps> = ({ candidate, onClose, onVote }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Retour aux candidats</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className={`${candidate.ranking <= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-gray-400 to-gray-600'} text-white font-bold px-3 py-1 rounded-full`}>
                #{candidate.ranking}
              </div>
              <span className="text-gray-600 font-semibold">{candidate.points} PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Candidate Image */}
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="relative w-full max-w-md mx-auto h-96 lg:h-[500px] object-cover object-top rounded-3xl shadow-2xl"
                />

                {/* Crown for #1 */}
                {candidate.ranking === 1 && (
                  <div className="absolute -top-6 -right-6 animate-bounce">
                    <div className="bg-yellow-400 p-4 rounded-full shadow-xl">
                      <svg className="w-8 h-8 text-yellow-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-4">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-bold text-gray-700">{candidate.sash}</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 mb-4">
                  {candidate.name}
                </h1>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  {candidate.age && (
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <span className="text-gray-700 font-semibold">{candidate.age} ans</span>
                    </div>
                  )}
                  {candidate.city && (
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <span className="text-gray-700 font-semibold">📍 {candidate.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={onVote}
                  className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white font-black py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>VOTER MAINTENANT</span>
                </button>

                <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>PARTAGER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900">À Propos</h2>
              </div>

              {candidate.profession && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Profession</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{candidate.profession}</p>
                </div>
              )}

              {candidate.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Présentation</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{candidate.description}</p>
                </div>
              )}
            </div>

            {/* Hobbies & Social Media */}
            <div className="space-y-8">
              {/* Hobbies */}
              {candidate.hobbies && candidate.hobbies.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-full">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Passions</h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {candidate.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 font-semibold px-4 py-2 rounded-full border border-pink-200"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {candidate.socialMedia && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Réseaux Sociaux</h2>
                  </div>

                  <div className="space-y-3">
                    {candidate.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${candidate.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-all duration-200 group"
                      >
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.756c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-3.323 1.297c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">{candidate.socialMedia.instagram}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {candidate.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${candidate.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">{candidate.socialMedia.facebook}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {candidate.socialMedia.tiktok && (
                      <a
                        href={`https://tiktok.com/${candidate.socialMedia.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group"
                      >
                        <div className="bg-gradient-to-r from-gray-700 to-black p-2 rounded-full">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-gray-900">{candidate.socialMedia.tiktok}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            Soutenez {candidate.name.split(' ')[0]}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Chaque vote compte pour la faire gagner Miss What About You 2025
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onVote}
              className="bg-white hover:bg-gray-100 text-gray-900 font-black py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>VOTER MAINTENANT</span>
            </button>

            <div className="text-white/80 font-semibold">
              Actuellement #{candidate.ranking} avec {candidate.points} points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesSection; 