// Tipos
export type Destination = {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  featured: boolean;
  popular?: boolean;
  tags: string[]; // Mantido para compatibilidade com dados mock
  tagIds?: string[]; // Adicionado para compatibilidade com o banco de dados (opcional para mock data)
  region?: string;
};

export type Package = {
  id: string;
  name: string;
  description: string;
  destinations: string[]; // Mantido para compatibilidade com dados mock
  destinationIds?: string[]; // Adicionado para compatibilidade com o banco de dados (opcional para mock data)
  duration: number;
  price: number;
  discount?: number;
  imageUrl: string;
  featured: boolean;
  inclusions: string[]; // This is already string[], but making it explicit
  tags: string[]; // Mantido para compatibilidade com dados mock
  tagIds?: string[]; // Adicionado para compatibilidade com o banco de dados (opcional para mock data)
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
};

export type Testimonial = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  packageId: string;
  destinationId?: string;
  date: string;
  featured?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  bookings: string[];
};

export type Booking = {
  id: string;
  userId: string;
  packageId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  travelDate: string;
  travelers: number;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "refunded";
};

export type SearchFilters = {
  query?: string;
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  ratings?: number[];
  tags?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
  travelers?: number;
};

// Mock Destinations
export const mockDestinations: Destination[] = [
  {
    id: "dest-001",
    name: "Praias de Maldivas",
    location: "Maldivas, Ásia",
    description:
      "Descubra o paraíso nas deslumbrantes praias de águas cristalinas das Maldivas, perfeitas para relaxar e se desconectar.",
    price: 4500,
    rating: 4.9,
    reviewCount: 128,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["praia", "luxo", "romântico"],
    region: "Ásia",
  },
  {
    id: "dest-002",
    name: "Tóquio Urbana",
    location: "Japão, Ásia",
    description:
      "Explore a vibrante metrópole de Tóquio, onde tradição e tecnologia se encontram para criar uma experiência única.",
    price: 3200,
    rating: 4.7,
    reviewCount: 95,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["urbano", "cultura", "gastronomia"],
    region: "Ásia",
  },
  {
    id: "dest-003",
    name: "Santorini Clássica",
    location: "Grécia, Europa",
    description:
      "Visite as icônicas casas brancas e cúpulas azuis de Santorini, com vistas deslumbrantes para o Mar Egeu.",
    price: 2800,
    rating: 4.8,
    reviewCount: 112,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["romântico", "vista", "histórico"],
    region: "Europa",
  },
  {
    id: "dest-004",
    name: "Machu Picchu",
    location: "Peru, América do Sul",
    description:
      "Descubra as ruínas incas de Machu Picchu, uma das maravilhas do mundo moderno.",
    price: 2200,
    rating: 4.9,
    reviewCount: 145,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["histórico", "aventura", "natureza"],
    region: "América do Sul",
  },
  {
    id: "dest-005",
    name: "Safari na Tanzânia",
    location: "Tanzânia, África",
    description:
      "Experimente a emoção de um safari na Tanzânia, observando a vida selvagem em seu habitat natural.",
    price: 3800,
    rating: 4.8,
    reviewCount: 87,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["aventura", "natureza", "vida selvagem"],
    region: "África",
  },
  {
    id: "dest-006",
    name: "Veneza Romântica",
    location: "Itália, Europa",
    description:
      "Navegue pelos canais românticos de Veneza e descubra a beleza desta cidade única construída sobre a água.",
    price: 2600,
    rating: 4.6,
    reviewCount: 103,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["romântico", "histórico", "cultura"],
    region: "Europa",
  },
  {
    id: "dest-007",
    name: "Grande Barreira de Coral",
    location: "Austrália, Oceania",
    description:
      "Mergulhe nas águas cristalinas da Grande Barreira de Coral e descubra um mundo subaquático fascinante.",
    price: 3500,
    rating: 4.7,
    reviewCount: 92,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["natureza", "aventura", "praia"],
    region: "Oceania",
  },
  {
    id: "dest-008",
    name: "Nova York Vibrante",
    location: "EUA, América do Norte",
    description:
      "Explore a cidade que nunca dorme, com seus arranha-céus icônicos, teatros da Broadway e diversidade cultural.",
    price: 2900,
    rating: 4.5,
    reviewCount: 118,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["urbano", "cultura", "compras"],
    region: "América do Norte",
  },
];

// Mock Packages
export const mockPackages: Package[] = [
  {
    id: "pkg-001",
    name: "Paraísos Tropicais",
    description:
      "Uma jornada inesquecível pelos mais belos paraísos tropicais do mundo.",
    destinations: ["dest-001", "dest-007"],
    duration: 12,
    price: 7500,
    discount: 10,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["praia", "luxo", "natureza"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem 5 estrelas",
      "Café da manhã",
      "Traslados",
      "Passeios guiados",
      "Seguro viagem",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada",
        description: "Recepção no aeroporto e traslado para o hotel.",
      },
      {
        day: 2,
        title: "Explorando a Cidade",
        description: "Tour guiado pelos principais pontos turísticos.",
      },
      {
        day: 3,
        title: "Dia Livre",
        description: "Dia livre para atividades opcionais.",
      },
      {
        day: 4,
        title: "Jantar Romântico",
        description:
          "Jantar especial à beira-mar com menu degustação de frutos do mar.",
      },
      {
        day: 5,
        title: "Último Dia nas Maldivas",
        description:
          "Tempo livre pela manhã. À tarde, traslado para o aeroporto e voo para a Austrália.",
      },
      {
        day: 6,
        title: "Chegada à Austrália",
        description:
          "Chegada a Cairns e traslado para o hotel. Tempo livre para descansar.",
      },
      {
        day: 7,
        title: "Grande Barreira de Coral",
        description:
          "Passeio de barco até a Grande Barreira de Coral com oportunidade de mergulho.",
      },
      {
        day: 8,
        title: "Floresta Tropical",
        description:
          "Excursão à floresta tropical de Daintree, uma das mais antigas do mundo.",
      },
      {
        day: 9,
        title: "Dia Livre em Cairns",
        description:
          "Dia livre para explorar a cidade ou fazer atividades opcionais.",
      },
      {
        day: 10,
        title: "Último Mergulho",
        description:
          "Última oportunidade de mergulho na Grande Barreira de Coral.",
      },
      {
        day: 11,
        title: "Preparação para Retorno",
        description: "Dia livre para compras e preparação para o retorno.",
      },
      {
        day: 12,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno.",
      },
    ],
  },
  {
    id: "pkg-002",
    name: "Tesouros da Europa",
    description:
      "Uma viagem cultural pelos mais belos destinos europeus, explorando história, arte e gastronomia.",
    destinations: ["dest-003", "dest-006"],
    duration: 10,
    price: 5200,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["cultura", "histórico", "gastronomia"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem 4 estrelas",
      "Café da manhã",
      "Traslados",
      "Passeios guiados",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Santorini",
        description:
          "Recepção no aeroporto e traslado para o hotel com vista para o Mar Egeu.",
      },
      {
        day: 2,
        title: "Tour por Oia",
        description:
          "Visita à pitoresca vila de Oia, famosa por suas casas brancas e pôr do sol deslumbrante.",
      },
      {
        day: 3,
        title: "Praias Vulcânicas",
        description:
          "Passeio pelas praias vulcânicas de areia preta e vermelha de Santorini.",
      },
      {
        day: 4,
        title: "Vinícolas Locais",
        description:
          "Tour pelas vinícolas locais com degustação de vinhos produzidos na ilha.",
      },
      {
        day: 5,
        title: "Partida para Veneza",
        description:
          "Traslado para o aeroporto e voo para Veneza. Chegada e traslado para o hotel.",
      },
      {
        day: 6,
        title: "Praça São Marcos",
        description:
          "Visita à Praça São Marcos, Basílica de São Marcos e Palácio Ducal.",
      },
      {
        day: 7,
        title: "Passeio de Gôndola",
        description: "Passeio tradicional de gôndola pelos canais de Veneza.",
      },
      {
        day: 8,
        title: "Ilhas de Murano e Burano",
        description:
          "Excursão às ilhas de Murano, famosa pelo vidro, e Burano, conhecida pelas rendas e casas coloridas.",
      },
      {
        day: 9,
        title: "Dia Livre em Veneza",
        description: "Dia livre para explorar a cidade ou fazer compras.",
      },
      {
        day: 10,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno.",
      },
    ],
  },
  {
    id: "pkg-003",
    name: "Aventura na Ásia",
    description:
      "Uma jornada fascinante pelo continente asiático, explorando culturas milenares e paisagens deslumbrantes.",
    destinations: ["dest-002"],
    duration: 8,
    price: 4200,
    discount: 5,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: true,
    tags: ["cultura", "aventura", "gastronomia"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem 4 estrelas",
      "Café da manhã",
      "Traslados",
      "Passeios guiados",
      "Assistência 24h",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Tóquio",
        description:
          "Recepção no aeroporto e traslado para o hotel. Breve passeio de orientação pelo bairro.",
      },
      {
        day: 2,
        title: "Tóquio Tradicional",
        description:
          "Visita ao Templo Senso-ji, Jardins do Palácio Imperial e Santuário Meiji.",
      },
      {
        day: 3,
        title: "Tóquio Moderna",
        description:
          "Exploração dos bairros de Shibuya, Harajuku e Shinjuku. Subida ao Observatório do Governo Metropolitano.",
      },
      {
        day: 4,
        title: "Excursão ao Monte Fuji",
        description:
          "Viagem de um dia ao icônico Monte Fuji e região dos Cinco Lagos.",
      },
      {
        day: 5,
        title: "Gastronomia Japonesa",
        description:
          "Aula de culinária japonesa pela manhã e tour gastronômico à noite.",
      },
      {
        day: 6,
        title: "Akihabara e Odaiba",
        description:
          "Visita ao distrito eletrônico de Akihabara e à ilha artificial de Odaiba.",
      },
      {
        day: 7,
        title: "Dia Livre em Tóquio",
        description: "Dia livre para explorar a cidade ou fazer compras.",
      },
      {
        day: 8,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno.",
      },
    ],
  },
  {
    id: "pkg-004",
    name: "Maravilhas da América do Sul",
    description:
      "Uma viagem inesquecível pelas mais impressionantes maravilhas naturais e arqueológicas da América do Sul.",
    destinations: ["dest-004"],
    duration: 9,
    price: 3800,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["aventura", "natureza", "histórico"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem 3 estrelas",
      "Café da manhã",
      "Traslados",
      "Passeios guiados",
      "Seguro viagem",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Lima",
        description:
          "Recepção no aeroporto e traslado para o hotel. Tempo livre para descansar.",
      },
      {
        day: 2,
        title: "City Tour em Lima",
        description:
          "Visita ao centro histórico de Lima, Catedral, Convento de São Francisco e bairro de Miraflores.",
      },
      {
        day: 3,
        title: "Voo para Cusco",
        description:
          "Traslado para o aeroporto e voo para Cusco. Tarde livre para aclimatação à altitude.",
      },
      {
        day: 4,
        title: "City Tour em Cusco",
        description:
          "Visita às ruínas de Sacsayhuamán, Qenqo, Puca Pucara e Tambomachay.",
      },
      {
        day: 5,
        title: "Vale Sagrado",
        description:
          "Excursão ao Vale Sagrado dos Incas, visitando Pisac e Ollantaytambo.",
      },
      {
        day: 6,
        title: "Machu Picchu",
        description:
          "Viagem de trem para Aguas Calientes e visita às ruínas de Machu Picchu.",
      },
      {
        day: 7,
        title: "Segundo Dia em Machu Picchu",
        description:
          "Segunda visita opcional a Machu Picchu ou tempo livre em Aguas Calientes.",
      },
      {
        day: 8,
        title: "Retorno a Cusco",
        description: "Retorno de trem para Cusco. Tarde livre para compras.",
      },
      {
        day: 9,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno via Lima.",
      },
    ],
  },
  {
    id: "pkg-005",
    name: "Explorando a África",
    description:
      "Uma aventura inesquecível pelos parques nacionais e paisagens deslumbrantes da África.",
    destinations: ["dest-005"],
    duration: 10,
    price: 4500,
    discount: 8,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["safari", "natureza", "aventura"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem em lodges",
      "Pensão completa",
      "Traslados",
      "Safáris guiados",
      "Seguro viagem",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Arusha",
        description:
          "Recepção no aeroporto e traslado para o hotel. Briefing sobre o safari.",
      },
      {
        day: 2,
        title: "Parque Nacional do Tarangire",
        description:
          "Safari de dia inteiro no Parque Nacional do Tarangire, famoso por seus baobás e elefantes.",
      },
      {
        day: 3,
        title: "Cratera de Ngorongoro",
        description:
          "Descida à Cratera de Ngorongoro, um dos mais impressionantes ecossistemas da África.",
      },
      {
        day: 4,
        title: "Serengeti (Norte)",
        description:
          "Safari no norte do Serengeti, em busca dos Big Five e da Grande Migração.",
      },
      {
        day: 5,
        title: "Serengeti (Central)",
        description:
          "Exploração da região central do Serengeti, rica em vida selvagem.",
      },
      {
        day: 6,
        title: "Serengeti (Sul)",
        description:
          "Safari na região sul do Serengeti, conhecida pelas planícies abertas.",
      },
      {
        day: 7,
        title: "Lago Manyara",
        description:
          "Safari no Parque Nacional do Lago Manyara, famoso por seus leões que sobem em árvores.",
      },
      {
        day: 8,
        title: "Visita a uma Vila Masai",
        description:
          "Visita cultural a uma autêntica vila Masai para conhecer suas tradições.",
      },
      {
        day: 9,
        title: "Dia de Descanso em Arusha",
        description:
          "Dia livre para descansar ou fazer compras de artesanato local.",
      },
      {
        day: 10,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno.",
      },
    ],
  },
  {
    id: "pkg-006",
    name: "Descobrindo a Oceania",
    description:
      "Uma viagem completa pela Austrália e Nova Zelândia, explorando cidades, praias e natureza.",
    destinations: ["dest-007"],
    duration: 14,
    price: 8900,
    imageUrl: "/placeholder.svg?height=500&width=800",
    featured: false,
    tags: ["natureza", "cidade", "praia"],
    inclusions: [
      "Passagens aéreas",
      "Hospedagem 4 estrelas",
      "Café da manhã",
      "Traslados",
      "Passeios guiados",
      "Seguro viagem",
    ],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Sydney",
        description:
          "Recepção no aeroporto e traslado para o hotel. Tempo livre para descansar.",
      },
      {
        day: 2,
        title: "City Tour em Sydney",
        description:
          "Visita à Opera House, Harbour Bridge, Bondi Beach e outros pontos turísticos.",
      },
      {
        day: 3,
        title: "Blue Mountains",
        description:
          "Excursão às Blue Mountains, com vistas para o Three Sisters e Scenic World.",
      },
      {
        day: 4,
        title: "Voo para Cairns",
        description:
          "Traslado para o aeroporto e voo para Cairns, porta de entrada para a Grande Barreira de Coral.",
      },
      {
        day: 5,
        title: "Grande Barreira de Coral",
        description:
          "Passeio de barco até a Grande Barreira de Coral com oportunidade de mergulho e snorkeling.",
      },
      {
        day: 6,
        title: "Floresta Tropical de Daintree",
        description:
          "Excursão à floresta tropical de Daintree e Cape Tribulation.",
      },
      {
        day: 7,
        title: "Voo para Auckland",
        description:
          "Traslado para o aeroporto e voo para Auckland, Nova Zelândia.",
      },
      {
        day: 8,
        title: "City Tour em Auckland",
        description:
          "Visita aos principais pontos turísticos de Auckland, a Cidade das Velas.",
      },
      {
        day: 9,
        title: "Rotorua",
        description:
          "Viagem para Rotorua, centro da cultura Maori e atividade geotérmica.",
      },
      {
        day: 10,
        title: "Cultura Maori",
        description:
          "Experiência cultural Maori com hangi (jantar tradicional) e apresentação cultural.",
      },
      {
        day: 11,
        title: "Queenstown",
        description:
          "Voo para Queenstown, capital dos esportes de aventura da Nova Zelândia.",
      },
      {
        day: 12,
        title: "Milford Sound",
        description:
          "Excursão ao fiorde de Milford Sound, uma das paisagens mais impressionantes do mundo.",
      },
      {
        day: 13,
        title: "Dia Livre em Queenstown",
        description:
          "Dia livre para atividades opcionais como bungee jumping, jet boat ou passeios de vinícolas.",
      },
      {
        day: 14,
        title: "Retorno",
        description: "Traslado para o aeroporto e voo de retorno.",
      },
    ],
  },
];

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: "test-001",
    name: "Carlos Silva",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "Uma experiência incrível nas Maldivas! As praias são exatamente como nas fotos, e o serviço foi impecável. Recomendo fortemente o pacote Paraísos Tropicais.",
    packageId: "pkg-001",
    destinationId: "dest-001",
    date: "2023-08-15",
    featured: true,
  },
  {
    id: "test-002",
    name: "Ana Oliveira",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment:
      "Santorini é um sonho! As vistas são de tirar o fôlego e os hotéis são maravilhosos. Apenas achei que o tempo em Veneza poderia ser um pouco maior.",
    packageId: "pkg-002",
    destinationId: "dest-003",
    date: "2023-07-22",
    featured: true,
  },
  {
    id: "test-003",
    name: "Roberto Martins",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "Tóquio superou todas as minhas expectativas! A mistura de tradição e modernidade é fascinante. O guia foi excelente e nos mostrou lugares que normalmente os turistas não conhecem.",
    packageId: "pkg-003",
    destinationId: "dest-002",
    date: "2023-09-05",
    featured: true,
  },
  {
    id: "test-004",
    name: "Juliana Costa",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "Machu Picchu é simplesmente mágico! A energia do lugar é indescritível. A organização da viagem foi perfeita, sem nenhum contratempo.",
    packageId: "pkg-004",
    destinationId: "dest-004",
    date: "2023-06-30",
  },
  {
    id: "test-005",
    name: "Marcelo Santos",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment:
      "O safari na Tanzânia foi uma experiência única! Ver os animais em seu habitat natural é algo que nunca vou esquecer. A hospedagem nos lodges foi muito confortável.",
    packageId: "pkg-005",
    destinationId: "dest-005",
    date: "2023-05-18",
  },
  {
    id: "test-006",
    name: "Fernanda Lima",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "A Grande Barreira de Coral é ainda mais impressionante ao vivo! As cores, os peixes, tudo é incrível. O pacote Descobrindo a Oceania vale cada centavo.",
    packageId: "pkg-006",
    destinationId: "dest-007",
    date: "2023-04-10",
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "João Pereira",
    email: "joao@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "user",
    bookings: ["book-001"],
  },
  {
    id: "user-002",
    name: "Maria Santos",
    email: "maria@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "user",
    bookings: ["book-002"],
  },
  {
    id: "user-003",
    name: "Admin",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "admin",
    bookings: [],
  },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "book-001",
    userId: "user-001",
    packageId: "pkg-001",
    status: "confirmed",
    bookingDate: "2023-05-10",
    travelDate: "2023-10-15",
    travelers: 2,
    totalPrice: 13500,
    paymentStatus: "paid",
  },
  {
    id: "book-002",
    userId: "user-002",
    packageId: "pkg-002",
    status: "pending",
    bookingDate: "2023-06-20",
    travelDate: "2023-11-05",
    travelers: 4,
    totalPrice: 20800,
    paymentStatus: "pending",
  },
];
