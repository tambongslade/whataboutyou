import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContentSection {
  type: 'intro' | 'text-image' | 'dark-section' | 'image-grid';
  heading?: string;
  text?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  items?: { heading: string; text: string; image?: string }[];
  images?: string[];
  darkBg?: boolean;
  accentColor?: string;
}

interface WayEditionConfig {
  edition: number;
  editionLabel: string;
  subtitle: string;
  date: string;
  dateDetails: string;
  location: string;
  venue: string;
  heroImage: string;
  featuredImage: string;
  heading: string;
  introText: string;
  sections: ContentSection[];
  galleryImages: string[];
  videos: string[];
}

/* ------------------------------------------------------------------ */
/*  WAY 2 Data                                                         */
/* ------------------------------------------------------------------ */

const way2: WayEditionConfig = {
  edition: 2,
  editionLabel: '2ÈME ÉDITION',
  subtitle: 'DE LA FOIRE ENTREPRENEURIALE',
  date: 'Juillet 2023',
  dateDetails: 'Du 19 au 23 Juillet 2023',
  location: 'Yaoundé, Cameroun',
  venue: "L'Hôtel de Ville de Yaoundé",
  heroImage: '/way 2/dji_fly_20230723_210652_649_1690158906603_photo.webp',
  featuredImage: '/way 2/EmptyName 390.webp',
  heading: "UNE ÉDITION QUI A CONFIRMÉ LE MOUVEMENT",
  introText:
    "Après une première édition prometteuse, WhatAboutYou revient avec sa deuxième édition (WAY 2) pour renforcer son ambition : créer un espace où culture urbaine, jeunesse et entrepreneuriat se rencontrent.\n\nOrganisée du 19 au 23 juillet 2023 à l'Hôtel de Ville de Yaoundé, cette grande foire festive a rassemblé pendant cinq jours des visiteurs venus vivre une expérience unique mêlant expositions, animations culturelles, rencontres et performances artistiques.\n\nWAY 2 a marqué une étape importante dans la construction du festival, en installant progressivement WhatAboutYou comme un rendez-vous incontournable des vacances à Yaoundé, où créativité, divertissement et opportunités se croisent.",
  sections: [
    {
      type: 'text-image',
      heading: 'UN FESTIVAL RYTHMÉ PAR 5 JOURNÉES THÉMATIQUES',
      text: "Afin d'offrir une expérience dynamique et immersive au public, cette deuxième édition s'est articulée autour de cinq journées thématiques, chacune mettant en avant une facette particulière de la culture jeune et urbaine.",
      image: '/way 2/EmptyName 141.webp',
      imagePosition: 'right',
    },
    {
      type: 'text-image',
      heading: 'MERCREDI 19 JUILLET – GRANDE OUVERTURE',
      text: "La première journée a donné le ton du festival avec une cérémonie d'ouverture festive, marquant le début officiel des activités. Exposants, visiteurs et partenaires se sont retrouvés dans une ambiance conviviale pour lancer cinq jours d'animations, de rencontres et de découvertes.",
      image: '/way 2/EmptyName 15.webp',
      imagePosition: 'right',
      accentColor: 'yellow',
    },
    {
      type: 'text-image',
      heading: 'JEUDI 20 JUILLET – STREET WEAR DAY',
      text: "Cette journée a mis à l'honneur la mode urbaine et les tendances streetwear, avec la présence de jeunes créateurs, marques locales et passionnés de style. Les visiteurs ont pu découvrir des collections, échanger avec les exposants et célébrer l'identité stylistique de la jeunesse.",
      image: '/way 2/EmptyName 22.webp',
      imagePosition: 'left',
      accentColor: 'blue',
    },
    {
      type: 'text-image',
      heading: 'VENDREDI 21 JUILLET – JERSEY DAY',
      text: "Le public était invité à venir porter son maillot préféré, transformant le festival en un espace coloré et convivial où les cultures sportives et urbaines se rencontrent. Dans une ambiance festive et détendue, les participants pouvaient ainsi afficher leurs couleurs, partager leur passion pour le sport et célébrer la diversité des équipes et des styles.",
      image: '/way 2/EmptyName 46.webp',
      imagePosition: 'right',
      accentColor: 'red',
    },
    {
      type: 'text-image',
      heading: 'SAMEDI 22 JUILLET – AMAPIANO DAY',
      text: "Cette journée a été marquée par une ambiance musicale exceptionnelle avec l'univers de l'Amapiano, genre musical devenu incontournable sur la scène africaine. Performances, danse et animations ont rythmé cette journée très attendue par les festivaliers.",
      image: '/way 2/EmptyName 75.webp',
      imagePosition: 'left',
      accentColor: 'yellow',
    },
    {
      type: 'text-image',
      heading: 'DIMANCHE 23 JUILLET – WHITE T-SHIRT DAY',
      text: "La dernière journée a offert un moment symbolique et participatif : les participants étaient invités à porter un t-shirt blanc et à écrire des messages dessus, créant ainsi un espace d'expression collective et de souvenirs partagés.",
      image: '/way 2/EmptyName 283.webp',
      imagePosition: 'right',
      accentColor: 'blue',
    },
    {
      type: 'dark-section',
      heading: 'DES PERFORMANCES ARTISTIQUES ET UNE OUVERTURE INTERNATIONALE',
      text: "WAY 2 a également été marqué par la présence d'artistes invités venus offrir des performances mémorables au public.\n\nParmi les moments forts de cette édition, la venue des artistes Ste Milano et Zagba Le Requin, en provenance de Côte d'Ivoire, a particulièrement marqué les festivaliers. Leur présence a apporté une dimension internationale à l'événement et renforcé l'attractivité du festival auprès du public.",
      images: ['/way 2/EmptyName 353.webp', '/way 2/EmptyName 371.webp'],
    },
    {
      type: 'dark-section',
      heading: 'ESPACE DE RENCONTRE EXPOSANTS ET PARTENAIRES',
      text: "Tout au long de l'événement, plusieurs exposants et partenaires ont contribué à dynamiser la foire en présentant leurs produits, services et initiatives.\n\nAvec l'appui de partenaires tels que iPhone Cameroun, Gadgeto237, Le Nkang et Déconnexe Shoot, WAY 2 a offert aux entrepreneurs, marques et créateurs un espace pour gagner en visibilité, rencontrer le public et promouvoir leurs activités.",
      images: [
        '/way 2/EmptyName 205.webp',
        '/way 2/EmptyName 216.webp',
        '/way 2/EmptyName 243.webp',
        '/way 2/EmptyName 295.webp',
      ],
    },
  ],
  galleryImages: [
    '/way 2/EmptyName 3.webp',
    '/way 2/EmptyName 15.webp',
    '/way 2/EmptyName 18.webp',
    '/way 2/EmptyName 22.webp',
    '/way 2/EmptyName 23.webp',
    '/way 2/EmptyName 36.webp',
    '/way 2/EmptyName 40.webp',
    '/way 2/EmptyName 46.webp',
    '/way 2/EmptyName 59.webp',
    '/way 2/EmptyName 70.webp',
    '/way 2/EmptyName 75.webp',
    '/way 2/EmptyName 141.webp',
    '/way 2/EmptyName 144.webp',
    '/way 2/EmptyName 149.webp',
    '/way 2/EmptyName 205.webp',
    '/way 2/EmptyName 216.webp',
    '/way 2/EmptyName 243.webp',
    '/way 2/EmptyName 283.webp',
    '/way 2/EmptyName 295.webp',
    '/way 2/EmptyName 353.webp',
    '/way 2/EmptyName 371.webp',
    '/way 2/EmptyName 390.webp',
    '/way 2/EmptyName 391.webp',
    '/way 2/dji_fly_20230721_221928_583_1690010984233_photo.webp',
    '/way 2/dji_fly_20230723_190932_645_1690158914563_photo.webp',
    '/way 2/dji_fly_20230723_210652_649_1690158906603_photo.webp',
    '/way 2/dji_fly_20230723_210912_651_1690158901756_photo.webp',
  ],
  videos: [
    '/way 2/360061454_820511212648692_509885440515438493_n.mp4',
    '/way 2/MVI_7365~1.mp4',
  ],
};

/* ------------------------------------------------------------------ */
/*  WAY 3 Data                                                         */
/* ------------------------------------------------------------------ */

const way3: WayEditionConfig = {
  edition: 3,
  editionLabel: '3ÈME ÉDITION',
  subtitle: 'DE LA FOIRE ENTREPRENEURIALE',
  date: 'Juillet 2024',
  dateDetails: 'Du 13 au 18 Juillet 2024',
  location: 'Yaoundé, Cameroun',
  venue: "Esplanade de l'Hôtel de Ville de Yaoundé",
  heroImage: '/Way 3/DSC_5619.webp',
  featuredImage: '/Way 3/DSC_5645.webp',
  heading: "RENFORCER L'ENTREPRENEURIAT JEUNE",
  introText:
    "Avec sa troisième édition, WhatAboutYou (WAY) confirme son ambition de devenir bien plus qu'un simple événement festif. La foire s'affirme progressivement comme une plateforme dédiée à la valorisation de l'entrepreneuriat jeune, de la créativité et des initiatives locales.\n\nOrganisée du 13 au 18 juillet 2024 à l'Esplanade de l'Hôtel de Ville de Yaoundé, cette édition a rassemblé pendant cinq jours des milliers de visiteurs, entrepreneurs, créateurs, artistes et partenaires autour d'un objectif commun : encourager la jeunesse à transformer ses idées en projets concrets.\n\nPorté par l'Association pour la Promotion des Activités Entrepreneuriales et Culturelles (APAEC), le festival s'inscrit dans une vision claire : promouvoir le vivre-ensemble, soutenir les initiatives locales et offrir aux jeunes un espace pour exprimer leur talent et développer leurs activités.",
  sections: [
    {
      type: 'text-image',
      heading: 'UNE PLATEFORME POUR LES INITIATIVES LOCALES',
      text: "Au cœur de WAY 3 se trouvait un village entrepreneurial où plusieurs exposants ont présenté leurs produits et services. Entrepreneurs, créateurs et porteurs de projets ont pu exposer, vendre et promouvoir leurs initiatives tout en rencontrant un large public.\n\nCette dynamique a permis de mettre en valeur des produits locaux et artisanaux, des projets entrepreneuriaux émergents, des initiatives culinaires et créatives, ainsi que de nombreuses petites entreprises portées par des jeunes talents.",
      image: '/Way 3/DSC_5638.webp',
      imagePosition: 'right',
    },
    {
      type: 'text-image',
      heading: 'UNE PROGRAMMATION CULTURELLE AU SERVICE DE LA CRÉATIVITÉ',
      text: "Pour accompagner cette dynamique entrepreneuriale, WAY 3 a également proposé une programmation culturelle riche et participative.\n\nPlus de 20 mini-concerts ont permis à de jeunes artistes de se produire devant un public important, contribuant à valoriser la scène musicale émergente. L'événement a également proposé des compétitions de jeux vidéo, des animations artistiques et des performances de DJ, créant une atmosphère dynamique et inclusive.",
      image: '/Way 3/DSC_5665.webp',
      imagePosition: 'left',
    },
    {
      type: 'dark-section',
      heading: "UN CONCERT MÉMORABLE",
      text: "L'un des moments marquants de cette édition a été le concert de l'artiste Cysoul, accompagné de performances de DJs reconnus, offrant au public un spectacle fédérateur pour clôturer le festival.",
      images: ['/Way 3/DSC_6047.webp', '/Way 3/DSC_6051.webp'],
    },
    {
      type: 'text-image',
      heading: 'UNE MOBILISATION COLLECTIVE',
      text: "La réussite de cette troisième édition repose sur la collaboration de nombreux acteurs engagés dans le développement du projet.\n\nParmi eux, plusieurs partenaires et structures ont contribué à enrichir l'événement, notamment Sassaye Afrique, ainsi que les équipes audiovisuelles Déconnexe Shoot, Artis Studio 13, Nephtali Photo et Teguis Shoot, qui ont assuré la couverture médiatique de la foire.",
      image: '/Way 3/DSC_6113.webp',
      imagePosition: 'right',
    },
    {
      type: 'dark-section',
      heading: 'UN ÉVÉNEMENT EN PLEINE CROISSANCE',
      text: "Avec une fréquentation estimée à plus de 65 000 visiteurs, WAY 3 confirme l'intérêt croissant du public pour ce rendez-vous annuel. Afin de garantir un environnement sécurisé pour tous, un dispositif spécial a été mis en place avec l'appui des forces de maintien de l'ordre et d'une équipe de sécurité dédiée.\n\nCette édition marque ainsi une étape importante dans l'évolution de WhatAboutYou, qui continue de se structurer pour devenir un véritable écosystème de rencontres, d'opportunités et d'innovation pour la jeunesse.",
      images: ['/Way 3/DSC_6107.webp', '/Way 3/DSC_6124.webp', '/Way 3/DSC_6114.webp', '/Way 3/DSC_6166.webp'],
    },
  ],
  galleryImages: [
    '/Way 3/DSC_5619.webp',
    '/Way 3/DSC_5621.webp',
    '/Way 3/DSC_5638.webp',
    '/Way 3/DSC_5645.webp',
    '/Way 3/DSC_5665.webp',
    '/Way 3/DSC_5709.webp',
    '/Way 3/DSC_6047.webp',
    '/Way 3/DSC_6051.webp',
    '/Way 3/DSC_6052.webp',
    '/Way 3/DSC_6107.webp',
    '/Way 3/DSC_6113.webp',
    '/Way 3/DSC_6114.webp',
    '/Way 3/DSC_6117.webp',
    '/Way 3/DSC_6124.webp',
    '/Way 3/DSC_6166.webp',
  ],
  videos: [],
};

/* ------------------------------------------------------------------ */
/*  WAY 4 Data                                                         */
/* ------------------------------------------------------------------ */

const way4: WayEditionConfig = {
  edition: 4,
  editionLabel: '4ÈME ÉDITION',
  subtitle: 'DE LA FOIRE ENTREPRENEURIALE',
  date: 'Juillet 2025',
  dateDetails: 'Du 21 au 26 Juillet 2025',
  location: 'Yaoundé, Cameroun',
  venue: "Palais des Congrès de Yaoundé",
  heroImage: '/Way 4/Way 4/Facebook-Banner.webp',
  featuredImage: '/Way 4/Way 4/IMG1.webp',
  heading: "UNE NOUVELLE DIMENSION POUR WHATABOUTYOU",
  introText:
    "Avec sa quatrième édition, WhatAboutYou franchit un cap important et confirme son évolution vers un événement d'envergure dédié à la jeunesse, à l'entrepreneuriat et à la valorisation des talents.\n\nOrganisée du 21 au 26 juillet 2025 à la partie basse du Palais des Congrès de Yaoundé, cette édition marque une étape majeure dans le développement du festival. Conçu et piloté par Solution Plus Group Sarl, entreprise spécialisée en communication 360°, marketing digital et événementiel, l'événement a bénéficié d'une organisation structurée allant de la stratégie à l'exécution opérationnelle.\n\nCette édition a permis de réunir entrepreneurs, créateurs, artistes, marques et institutions autour d'un programme riche combinant réflexion, opportunités économiques et animation culturelle.",
  sections: [
    {
      type: 'text-image',
      heading: 'UNE VISION ENTREPRENEURIALE AFFIRMÉE',
      text: "L'un des moments clés de cette édition a été la Conférence Entrepreneuriale, organisée en amont de la foire au Palais des Congrès de Yaoundé.\n\nPlacée sous le thème « Leadership, mindset et résilience du jeune entrepreneur : échouer en affaire, une fin ou un nouveau départ ? », cette rencontre a rassemblé plusieurs entrepreneurs, leaders d'opinion et environ 250 jeunes participants, parmi lesquels des étudiants et porteurs de projets.",
      image: '/Way 4/Way 4/IMG2.webp',
      imagePosition: 'right',
    },
    {
      type: 'text-image',
      heading: 'UNE FOIRE ÉCONOMIQUE EN PLEINE EXPANSION',
      text: "Le cœur de l'événement s'est déroulé pendant six jours, avec une grande foire exposition-vente installée à la partie basse du Palais des Congrès.\n\nCette foire a permis de créer un espace dynamique où entrepreneurs, entreprises et créateurs ont pu présenter leurs produits et services, développer leur réseau et générer des opportunités commerciales.\n\nQuelques chiffres clés : 155 tentes installées pour les exposants, 38 350 visiteurs enregistrés, plusieurs marques et entreprises participantes.",
      image: '/Way 4/Way 4/IMG3.webp',
      imagePosition: 'left',
    },
    {
      type: 'dark-section',
      heading: 'CULTURE, TALENTS ET DIVERTISSEMENT',
      text: "Fidèle à son ADN, WhatAboutYou combine entrepreneuriat et valorisation des talents artistiques. L'édition 2025 a ainsi proposé une programmation culturelle riche avec concerts, performances de DJ, animations et spectacles de danse.\n\nParmi les artistes invités figuraient notamment : Maalhox Le Vibeur, Locko, Ténor, Krys M, Petit Kanté, Lucky+2, Kratos et les Rythmeurs ABC.\n\nLes concerts organisés chaque soir ont rassemblé en moyenne 3 500 spectateurs, contribuant à l'atmosphère festive et conviviale de l'événement.",
      images: [
        '/Way 4/Way 4/ARTISTE/LOCKOArtboard 1.webp',
        '/Way 4/Way 4/ARTISTE/MAALHOXArtboard 1 2.webp',
      ],
    },
    {
      type: 'text-image',
      heading: 'MISS WHATABOUTYOU : LEADERSHIP ET VALORISATION FÉMININE',
      text: "L'édition 4 a également accueilli le concours Miss WhatAboutYou, une initiative visant à mettre en avant le leadership et l'engagement des jeunes femmes dans la société.\n\nAu-delà de la compétition, cette activité a permis de valoriser le rôle de la femme dans l'entrepreneuriat, la culture et le développement social, renforçant ainsi la dimension inclusive du festival.",
      image: '/Way 4/Way 4/IMG2(1).webp',
      imagePosition: 'right',
    },
    {
      type: 'dark-section',
      heading: 'UNE ÉTAPE VERS UN FESTIVAL ENCORE PLUS AMBITIEUX',
      text: "La quatrième édition de WhatAboutYou confirme la croissance continue du projet et son positionnement parmi les événements majeurs dédiés à la jeunesse et à l'entrepreneuriat au Cameroun.\n\nGrâce à une organisation renforcée et à une participation toujours plus importante, WAY poursuit son évolution avec l'ambition de développer un écosystème durable d'opportunités, de créativité et de collaboration pour la jeunesse africaine.",
      images: [
        '/Way 4/Way 4/ARTISTE/_ADC3947.webp',
        '/Way 4/Way 4/ARTISTE/_ADC4424.webp',
        '/Way 4/Way 4/ARTISTE/_ADC4541 - Copie.webp',
      ],
    },
  ],
  galleryImages: [
    '/Way 4/Way 4/IMG1.webp',
    '/Way 4/Way 4/IMG2.webp',
    '/Way 4/Way 4/IMG2(1).webp',
    '/Way 4/Way 4/IMG3.webp',
    '/Way 4/Way 4/Facebook-Banner.webp',
    '/Way 4/Way 4/ARTISTE/LOCKOArtboard 1.webp',
    '/Way 4/Way 4/ARTISTE/MAALHOXArtboard 1 2.webp',
    '/Way 4/Way 4/ARTISTE/_ADC3947.webp',
    '/Way 4/Way 4/ARTISTE/_ADC4424.webp',
    '/Way 4/Way 4/ARTISTE/_ADC4541 - Copie.webp',
  ],
  videos: [],
};

/* ------------------------------------------------------------------ */
/*  WAY 1 Data                                                         */
/* ------------------------------------------------------------------ */

const way1: WayEditionConfig = {
  edition: 1,
  editionLabel: '1ÈRE ÉDITION',
  subtitle: 'DE LA FOIRE ENTREPRENEURIALE',
  date: '2022',
  dateDetails: '2022',
  location: 'Yaoundé, Cameroun',
  venue: "Yaoundé",
  heroImage: '/way1/DSC_5516.webp',
  featuredImage: '/way1/DSC_5636.webp',
  heading: "L'ÉDITION QUI A LANCÉ LE MOUVEMENT",
  introText:
    "La toute première édition de What About You a posé les bases d'un mouvement entrepreneurial unique au Cameroun. Un événement fondateur qui a rassemblé des jeunes passionnés autour de l'innovation et de l'entrepreneuriat.\n\nCette édition a marqué le début d'une aventure exceptionnelle, réunissant pour la première fois une communauté de jeunes entrepreneurs, créateurs et rêveurs autour d'une vision commune : transformer les idées en projets concrets.",
  sections: [
    {
      type: 'text-image',
      heading: 'LES FONDATIONS DU MOUVEMENT',
      text: "WAY 1 a été le point de départ d'un concept novateur au Cameroun : une foire qui combine entrepreneuriat, culture urbaine et divertissement. Cette première édition a permis de tester le concept et de prouver que la jeunesse camerounaise était prête pour un événement de cette envergure.",
      image: '/way1/DSC_5527.webp',
      imagePosition: 'right',
    },
    {
      type: 'text-image',
      heading: 'UNE COMMUNAUTÉ NAISSANTE',
      text: "Dès cette première édition, WhatAboutYou a su créer un engouement autour de sa vision. Les premiers exposants, partenaires et visiteurs ont posé les bases d'une communauté grandissante qui allait se renforcer au fil des éditions suivantes.",
      image: '/way1/DSC_5795.webp',
      imagePosition: 'left',
    },
    {
      type: 'dark-section',
      heading: 'DES MOMENTS INOUBLIABLES',
      text: "Entre animations, performances artistiques et rencontres, la première édition de WAY a offert des moments forts qui ont marqué tous les participants et donné envie de revenir pour les éditions suivantes.",
      images: ['/way1/DSC_5904.webp', '/way1/DSC_5918.webp', '/way1/DSC_6003.webp', '/way1/DSC_6021.webp'],
    },
  ],
  galleryImages: [
    '/way1/DSC_5516.webp',
    '/way1/DSC_5527.webp',
    '/way1/DSC_5572.webp',
    '/way1/DSC_5628.webp',
    '/way1/DSC_5636.webp',
    '/way1/DSC_5652.webp',
    '/way1/DSC_5737.webp',
    '/way1/DSC_5795.webp',
    '/way1/DSC_5904.webp',
    '/way1/DSC_5918.webp',
    '/way1/DSC_5942.webp',
    '/way1/DSC_5983.webp',
    '/way1/DSC_6003.webp',
    '/way1/DSC_6021.webp',
    '/way1/DSC_6025.webp',
    '/way1/DSC_6107.webp',
    '/way1/DSC_6113.webp',
    '/way1/DSC_6151.webp',
    '/way1/DSC_6172.webp',
    '/way1/DSC_6217.webp',
  ],
  videos: [],
};

/* ------------------------------------------------------------------ */
/*  Registry                                                           */
/* ------------------------------------------------------------------ */

const wayEditions: Record<number, WayEditionConfig> = {
  1: way1,
  2: way2,
  3: way3,
  4: way4,
};

/* ------------------------------------------------------------------ */
/*  Accent bubble component                                            */
/* ------------------------------------------------------------------ */

const AccentBubble = ({ color }: { color?: string }) => {
  const bgMap: Record<string, string> = {
    blue: 'bg-cyan-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500',
  };
  const bg = bgMap[color || 'blue'] || 'bg-cyan-400';

  return (
    <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center shadow-lg`}>
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

type TabType = 'apropos' | 'images' | 'videos';

interface WayEditionPageProps {
  edition: number;
}

const WayEditionPage = ({ edition }: WayEditionPageProps) => {
  const config = wayEditions[edition];
  const [activeTab, setActiveTab] = useState<TabType>('apropos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!config) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'apropos', label: 'A PROPOS' },
    { key: 'images', label: 'IMAGES' },
    { key: 'videos', label: 'VIDÉOS' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={config.heroImage} alt={`WAY ${config.editionLabel}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
          <img src="/Lights.svg" alt="" className="absolute top-0 left-0 w-[30%] h-full object-cover opacity-70" />
          <img src="/Lights.svg" alt="" className="absolute top-0 right-0 w-[30%] h-full object-cover opacity-70 scale-x-[-1]" />
        </div>

        <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-4 w-[70vw] sm:w-[55vw] md:w-[45vw] lg:w-[35vw] max-w-3xl mx-auto">
            <img src="/logog final 3D.webp" alt="What About You" className="w-full h-auto drop-shadow-2xl" />
          </div>

          <h1 className="font-clash text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            {config.editionLabel}
          </h1>
          <p className="font-nekst text-gray-300 text-sm sm:text-base md:text-lg uppercase tracking-widest mb-8">
            {config.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-nekst text-sm tracking-wider">{config.dateDetails}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-nekst text-sm tracking-wider">{config.location}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ============ TAB BAR ============ */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 sm:gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`font-azonix relative py-4 text-sm sm:text-base font-bold tracking-wider transition-colors cursor-pointer ${
                  activeTab === tab.key ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============ A PROPOS TAB ============ */}
      {activeTab === 'apropos' && (
        <div>
          {/* Intro Section */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-8 uppercase leading-tight">
                    {config.heading}
                  </h2>
                  {config.introText.split('\n\n').map((p, i) => (
                    <p key={i} className="font-nekst text-gray-500 text-base md:text-lg leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <img src={config.featuredImage} alt={`WAY ${config.edition}`} className="w-full h-[350px] sm:h-[420px] object-cover" />
                  </div>
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="font-azonix text-xs sm:text-sm font-bold tracking-wide">{config.venue}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          {config.sections.map((section, sIdx) => {
            /* ---------- TEXT + IMAGE ---------- */
            if (section.type === 'text-image') {
              const isLeft = section.imagePosition === 'left';
              return (
                <section key={sIdx} className="py-16 bg-gray-50 even:bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isLeft ? '' : ''}`}>
                      {/* Image (left) */}
                      {isLeft && (
                        <div className="relative">
                          <div className="rounded-2xl overflow-hidden bg-gray-200">
                            {section.image ? (
                              <img src={section.image} alt={section.heading} className="w-full h-[300px] sm:h-[380px] object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-[300px] sm:h-[380px]"></div>
                            )}
                          </div>
                          <div className="absolute -bottom-4 -right-4">
                            <AccentBubble color={section.accentColor} />
                          </div>
                        </div>
                      )}

                      {/* Text */}
                      <div>
                        <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 uppercase leading-tight">
                          {section.heading}
                        </h3>
                        {section.text?.split('\n\n').map((p, i) => (
                          <p key={i} className="font-nekst text-gray-500 text-base leading-relaxed mb-4">
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Image (right) */}
                      {!isLeft && (
                        <div className="relative">
                          <div className="rounded-2xl overflow-hidden bg-gray-200">
                            {section.image ? (
                              <img src={section.image} alt={section.heading} className="w-full h-[300px] sm:h-[380px] object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-[300px] sm:h-[380px]"></div>
                            )}
                          </div>
                          <div className="absolute -bottom-4 -left-4">
                            <AccentBubble color={section.accentColor} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            /* ---------- DARK SECTION ---------- */
            if (section.type === 'dark-section') {
              const images = section.images || [];
              return (
                <section key={sIdx} className="py-16 sm:py-20 bg-gray-900 text-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 uppercase leading-tight">
                      {section.heading}
                    </h3>
                    {section.text?.split('\n\n').map((p, i) => (
                      <p key={i} className="font-nekst text-gray-300 text-base md:text-lg leading-relaxed mb-4 max-w-4xl">
                        {p}
                      </p>
                    ))}

                    {images.length > 0 && (
                      <div className={`grid gap-4 mt-10 ${
                        images.length === 1 ? 'grid-cols-1 max-w-2xl' :
                        images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                        images.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                        'grid-cols-2'
                      }`}>
                        {images.map((img, i) => (
                          <div key={i} className="rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedImage(img)}>
                            <img src={img} alt="" className="w-full h-[220px] sm:h-[280px] object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* ============ IMAGES TAB ============ */}
      {activeTab === 'images' && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {config.galleryImages.length > 1 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {config.galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid cursor-pointer group overflow-hidden rounded-xl"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`WAY ${config.edition} - Photo ${i + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="font-nekst text-gray-400 text-lg">Les photos de cette édition seront bientôt disponibles.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ VIDEOS TAB ============ */}
      {activeTab === 'videos' && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {config.videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {config.videos.map((vid, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-lg bg-black">
                    <video
                      src={vid}
                      controls
                      className="w-full h-auto"
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="font-nekst text-gray-400 text-lg">Les vidéos de cette édition seront bientôt disponibles.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ LIGHTBOX ============ */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors cursor-pointer" onClick={() => setSelectedImage(null)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={selectedImage} alt="Photo agrandie" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default WayEditionPage;
