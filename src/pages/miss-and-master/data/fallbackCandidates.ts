import type { Candidate } from '../../../services/candidateService';

// Demo data shown only when the candidates API is unreachable.
export const fallbackMissCandidates: Candidate[] = [
  {
    id: '1',
    name: 'EDIDIGUE SOPHIE NATACHA',
    category: 'miss',
    ranking: 1,
    votes: 251,
    image: '/miss2025/c1.webp',
    sash: 'MISS WAY 2026',
    age: 22,
    city: 'Douala',
    profession: 'Étudiante en Commerce International',
    hobbies: ['Danse', 'Photographie', 'Voyage', 'Lecture'],
    description:
      "Passionnée par l'art et la culture, Sophie rêve de représenter le Cameroun sur la scène internationale. Elle s'engage activement dans des projets communautaires pour l'éducation des jeunes filles.",
    socialMedia: {
      instagram: '@sophie_natacha',
      facebook: 'Sophie Natacha Edidigue',
      tiktok: '@sophienatacha'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '2',
    name: 'MARTHE YVANA',
    category: 'miss',
    ranking: 2,
    votes: 245,
    image: '/miss2025/c2.webp',
    sash: 'MISS WAY 2026',
    age: 21,
    city: 'Yaoundé',
    profession: 'Étudiante en Marketing Digital',
    hobbies: ['Mode', 'Cuisine', 'Fitness', 'Musique'],
    description:
      "Créative et ambitieuse, Marthe aspire à utiliser sa plateforme pour promouvoir l'entrepreneuriat féminin au Cameroun.",
    socialMedia: {
      instagram: '@marthe_yvana',
      facebook: 'Marthe Yvana',
      tiktok: '@martheyvana'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '3',
    name: 'MENYE ABOUNA ORNELLA',
    category: 'miss',
    ranking: 3,
    votes: 184,
    image: '/miss2025/c3.webp',
    sash: 'MISS WAY 2026',
    age: 23,
    city: 'Bafoussam',
    profession: 'Infirmière',
    hobbies: ['Bénévolat', 'Lecture', 'Natation', 'Jardinage'],
    description:
      "Dévouée au service de la communauté, Ornella souhaite sensibiliser sur l'importance de la santé préventive.",
    socialMedia: {
      instagram: '@ornella_menye',
      facebook: 'Ornella Menye Abouna',
      tiktok: '@ornellamenye'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '4',
    name: 'MBASSEGUE MADELEINE IVANA',
    category: 'miss',
    ranking: 4,
    votes: 167,
    image: '/miss2025/c4.webp',
    sash: 'MISS WAY 2026',
    age: 20,
    city: 'Douala',
    profession: 'Étudiante en Droit',
    hobbies: ['Débat', 'Écriture', 'Théâtre', 'Peinture'],
    description:
      'Future avocate passionnée par la justice sociale, Madeleine veut défendre les droits des femmes et des enfants.',
    socialMedia: {
      instagram: '@madeleine_ivana',
      facebook: 'Madeleine Ivana Mbassegue',
      tiktok: '@madeleineivana'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '5',
    name: 'MBARGA CHANTAL ASTRID',
    category: 'miss',
    ranking: 5,
    votes: 145,
    image: '/miss2025/c5.webp',
    sash: 'MISS WAY 2026',
    age: 24,
    city: 'Yaoundé',
    profession: 'Architecte',
    hobbies: ['Design', 'Voyage', 'Photographie', 'Yoga'],
    description:
      'Architecte créative, Chantal rêve de concevoir des espaces durables et accessibles pour tous.',
    socialMedia: {
      instagram: '@chantal_astrid',
      facebook: 'Chantal Astrid Mbarga',
      tiktok: '@chantalastrid'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '6',
    name: 'BAKOTTO ÉMILIE CAROLE',
    category: 'miss',
    ranking: 6,
    votes: 132,
    image: '/miss2025/c6.webp',
    sash: 'MISS WAY 2026',
    age: 22,
    city: 'Bamenda',
    profession: 'Journaliste',
    hobbies: ['Écriture', 'Investigation', 'Podcast', 'Cinéma'],
    description:
      'Journaliste engagée, Émilie veut donner une voix aux sans-voix et promouvoir la transparence.',
    socialMedia: {
      instagram: '@emilie_carole',
      facebook: 'Émilie Carole Bakotto',
      tiktok: '@emiliecarole'
    },
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '7',
    name: 'LOVELY MENDJA',
    category: 'miss',
    ranking: 7,
    votes: 128,
    image: '/miss2025/c7.webp',
    sash: 'MISS WAY 2026',
    age: 21,
    city: 'Douala',
    profession: 'Étudiante en Médecine',
    hobbies: ['Recherche', 'Musique', 'Danse', 'Bénévolat'],
    description:
      "Future médecin, Lovely s'engage pour améliorer l'accès aux soins de santé dans les zones rurales.",
    socialMedia: {
      instagram: '@lovely_mendja',
      facebook: 'Lovely Mendja',
      tiktok: '@lovelymendja'
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
    image: '/miss2025/c8.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '9',
    name: 'MENDO Israel',
    category: 'miss',
    ranking: 9,
    votes: 112,
    image: '/miss2025/c9.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '10',
    name: 'Metagne Aristide flaure',
    category: 'miss',
    ranking: 10,
    votes: 105,
    image: '/miss2025/c10.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '11',
    name: 'Bidjang Armand Danièle',
    category: 'miss',
    ranking: 11,
    votes: 98,
    image: '/miss2025/c11.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '12',
    name: 'Djiani Lesly',
    category: 'miss',
    ranking: 12,
    votes: 92,
    image: '/miss2025/c12.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '13',
    name: 'Manguelle Kimberly',
    category: 'miss',
    ranking: 13,
    votes: 87,
    image: '/miss2025/c13.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '14',
    name: "NGWE EZ'IA REINE",
    category: 'miss',
    ranking: 14,
    votes: 82,
    image: '/miss2025/c14.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  },
  {
    id: '15',
    name: 'Baloueck Princess Géraldine',
    category: 'miss',
    ranking: 15,
    votes: 76,
    image: '/miss2025/c15.webp',
    sash: 'MISS WAY 2026',
    isActive: true,
    createdAt: '2025-01-19T20:00:00Z',
    updatedAt: '2025-01-19T21:30:00Z'
  }
];
