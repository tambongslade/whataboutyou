import { useState, useEffect } from 'react';
import { candidateService, getImageUrl, handleApiError, type Candidate } from '../../../services/candidateService';
import VotingModal from '../../../components/VotingModal';

const CandidatesSection = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Voting modal state
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

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
        console.log('🗳️ Raw API candidates data:', response.data);

        // Transform API data to match our interface (map _id to id)
        const transformedCandidates = response.data.map((candidate: any) => ({
          ...candidate,
          id: candidate._id, // Use MongoDB _id as the ID
          votes: candidate.votes || Math.floor((candidate.points || 0) / 1) || 0, // Use votes directly (1 point = 1 vote)
        }));

        console.log('🗳️ Transformed candidates:', transformedCandidates);
        console.log('🗳️ First candidate structure:', transformedCandidates[0]);
        console.log('🗳️ First candidate ID fields:', {
          id: transformedCandidates[0]?.id,
          _id: transformedCandidates[0]?._id
        });

        // Sort by votes (highest first)
        const sortedCandidates = transformedCandidates
          .sort((a, b) => {
            const aVotes = a.votes || 0;
            const bVotes = b.votes || 0;
            return bVotes - aVotes; // Higher votes first
          })
          .map((candidate, index) => ({
            ...candidate,
            ranking: index + 1 // Dynamic ranking based on votes
          }));

        console.log('🗳️ Final sorted candidates with rankings:', sortedCandidates);
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

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsVotingModalOpen(true);
  };

  const handleVotingModalClose = () => {
    setIsVotingModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleVoteComplete = () => {
    // Refresh candidates to show updated data
    loadCandidates();
  };

  // Mock data as fallback (in case API is not available)
  const fallbackCandidates: Candidate[] = [
    {
      id: '1',
      name: "EDIDIGUE SOPHIE NATACHA",
      category: 'miss',
      ranking: 1,
      votes: 251,
      image: "/miss2025/c1.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'

    },
    {
      id: '2',
      name: "MARTHE YVANA",
      category: 'miss',
      ranking: 2,
      votes: 245,
      image: "/miss2025/c2.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z',
    },
    {
      id: '3',
      name: "MENYE ABOUNA ORNELLA",
      category: 'miss',
      ranking: 3,
      votes: 184,
      image: "/miss2025/c3.webp",
      sash: "MISS WAY 2026",
      age: 23,
      city: "Bafoussam",
      profession: "Infirmière",
      hobbies: ["Bénévolat", "Lecture", "Natation", "Jardinage"],
      description: "Dévouée au service de la communauté, Ornella souhaite sensibiliser sur l'importance de la santé préventive.",
      socialMedia: {
        instagram: "@ornella_menye",
        facebook: "Ornella Menye Abouna",
        tiktok: "@ornellamenye",

      },
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '4',
      name: "MBASSEGUE MADELEINE IVANA",
      category: 'miss',
      ranking: 4,
      votes: 167,
      image: "/miss2025/c4.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '5',
      name: "MBARGA CHANTAL ASTRID",
      category: 'miss',
      ranking: 5,
      votes: 145,
      image: "/miss2025/c5.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '6',
      name: "BAKOTTO ÉMILIE CAROLE",
      category: 'miss',
      ranking: 6,
      votes: 132,
      image: "/miss2025/c6.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '7',
      name: "LOVELY MENDJA",
      category: 'miss',
      ranking: 7,
      votes: 128,
      image: "/miss2025/c7.webp",
      sash: "MISS WAY 2026",
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
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '8',
      name: "Sa'a Dongmo Emira Princesse",
      category: 'miss',
      ranking: 8,
      votes: 118,
      image: "/miss2025/c8.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '9',
      name: "MENDO Israel",
      category: 'miss',
      ranking: 9,
      votes: 112,
      image: "/miss2025/c9.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '10',
      name: "Metagne Aristide flaure ",
      category: 'miss',
      ranking: 10,
      votes: 105,
      image: "/miss2025/c10.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '11',
      name: "Bidjang Armand Danièle",
      category: 'miss',
      ranking: 11,
      votes: 98,
      image: "/miss2025/c11.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '12',
      name: "Djiani Lesly",
      category: 'miss',
      ranking: 12,
      votes: 92,
      image: "/miss2025/c12.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '13',
      name: "manguelle  Kimberly ",
      category: 'miss',
      ranking: 13,
      votes: 87,
      image: "/miss2025/c13.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '14',
      name: "NGWE  EZ'IA  REINE ",
      category: 'miss',
      ranking: 14,
      votes: 82,
      image: "/miss2025/c14.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    },
    {
      id: '15',
      name: "Baloueck  Princess Géraldine ",
      category: 'miss',
      ranking: 15,
      votes: 76,
      image: "/miss2025/c15.webp",
      sash: "MISS WAY 2026",
      isActive: true,
      createdAt: '2025-01-19T20:00:00Z',
      updatedAt: '2025-01-19T21:30:00Z'
    }
  ];

  // Use fallback data if API fails, apply same sorting logic
  const displayCandidates = candidates.length > 0 ? candidates : 
    fallbackCandidates
      .sort((a, b) => {
        const aVotes = a.votes || 0;
        const bVotes = b.votes || 0;
        return bVotes - aVotes; // Higher votes first
      })
      .map((candidate, index) => ({
        ...candidate,
        ranking: index + 1 // Dynamic ranking based on votes
      }));

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
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-bold text-gray-800">MISS WHAT ABOUT YOU 2025</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
              NOS CANDIDATES
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez les 15 magnifiques candidates en compétition pour le titre de Miss What About You 2025. 
            Votez pour votre favorite et aidez-la à remporter la couronne !
          </p>

          {/* Voting Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto shadow-xl border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                <h3 className="font-bold text-gray-800 mb-2">100 FCFA = 1 VOTE</h3>
                <p className="text-gray-600 text-sm">Minimum 100 FCFA pour voter</p>
                </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                <h3 className="font-bold text-gray-800 mb-2">PAIEMENT MOBILE</h3>
                <p className="text-gray-600 text-sm">MTN Mobile Money & Orange Money</p>
                </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">INSTANTANÉ</h3>
                <p className="text-gray-600 text-sm">Votes confirmés automatiquement</p>
              </div>
            </div>
        </div>
            </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayCandidates.map((candidate) => (
            <div key={candidate.id} className="group relative">
              {/* Enhanced Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/50">
                {/* Image Container */}
                <div className="relative overflow-hidden">
              <img
                src={getImageUrl(candidate.image)}
                alt={candidate.name}
                    className="w-full h-80 object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Ranking Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`${candidate.ranking <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'} text-white font-black text-sm px-3 py-2 rounded-2xl shadow-xl border-2 border-white`}>
                  <div className="text-center">
                        <div className="text-lg">#{candidate.ranking}</div>
                  </div>
                </div>
                {candidate.ranking === 1 && (
                      <div className="absolute -top-1 -right-1 animate-bounce">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
                    </svg>
                  </div>
                )}
              </div>

                  {/* Votes Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-2 rounded-full shadow-lg">
                    <span className="text-sm">{candidate.votes || 0} votes</span>
              </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Sash */}
                  <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-pink-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                    <span>{candidate.sash}</span>
              </div>

                  {/* Name */}
                  <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                {candidate.name}
              </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-bold">{candidate.votes} votes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                      <span className="font-bold">{candidate.votes || 0} votes</span>
                </div>
              </div>

              {/* Action Buttons */}
                  <div className="space-y-3">
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
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-400 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-150"></div>
                </div>
              </div>
                    ))}
                  </div>

        {/* Voting Modal */}
        {selectedCandidate && (
          <VotingModal
            candidate={selectedCandidate}
            isOpen={isVotingModalOpen}
            onClose={handleVotingModalClose}
            onVoteComplete={handleVoteComplete}
          />
        )}
                        </div>
    </section>
  );
};

export default CandidatesSection; 