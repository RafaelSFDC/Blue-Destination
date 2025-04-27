require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } from './utils';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const ACTIVITIES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ACTIVITIES'];

// Função principal para criar as atividades
async function seedActivities() {
  if (!ACTIVITIES_COLLECTION_ID) {
    console.error('Activities collection ID not found in .env.local');
    return;
  }

  console.log('Creating activities...');
  
  // Verifica se já existem atividades
  const activityExists = await documentExists(ACTIVITIES_COLLECTION_ID, 'name', 'City Tour');
  if (activityExists) {
    console.log('Activities already exist, skipping...');
    return;
  }
  
  // Lista de atividades turísticas comuns
  const activitiesList = [
    {
      name: 'City Tour',
      description: 'Conheça os principais pontos turísticos da cidade com um guia local experiente.',
      location: 'Centro da Cidade',
      duration: 4,
      price: 120,
      rating: 4.7,
      reviewCount: 156,
      featured: true
    },
    {
      name: 'Passeio de Barco',
      description: 'Navegue pelas águas cristalinas e desfrute de vistas deslumbrantes da costa.',
      location: 'Marina',
      duration: 3,
      price: 180,
      rating: 4.8,
      reviewCount: 203,
      featured: true
    },
    {
      name: 'Trilha Ecológica',
      description: 'Caminhe por trilhas naturais e descubra a fauna e flora local com guias especializados.',
      location: 'Parque Nacional',
      duration: 5,
      price: 90,
      rating: 4.6,
      reviewCount: 128,
      featured: false
    },
    {
      name: 'Tour Gastronômico',
      description: 'Experimente a culinária local visitando restaurantes tradicionais e mercados.',
      location: 'Bairro Gastronômico',
      duration: 4,
      price: 150,
      rating: 4.9,
      reviewCount: 187,
      featured: true
    },
    {
      name: 'Mergulho com Snorkel',
      description: 'Explore os recifes de coral e a vida marinha em águas rasas com equipamento de snorkel.',
      location: 'Praia Coral',
      duration: 2,
      price: 100,
      rating: 4.7,
      reviewCount: 142,
      featured: false
    },
    {
      name: 'Aula de Surf',
      description: 'Aprenda a surfar ou aprimore suas habilidades com instrutores profissionais.',
      location: 'Praia Grande',
      duration: 2,
      price: 120,
      rating: 4.5,
      reviewCount: 98,
      featured: false
    },
    {
      name: 'Tour Histórico',
      description: 'Visite monumentos históricos e aprenda sobre a história e cultura local.',
      location: 'Centro Histórico',
      duration: 3,
      price: 80,
      rating: 4.6,
      reviewCount: 112,
      featured: false
    },
    {
      name: 'Observação de Aves',
      description: 'Observe espécies raras de aves em seu habitat natural com guias especializados.',
      location: 'Reserva Natural',
      duration: 4,
      price: 70,
      rating: 4.4,
      reviewCount: 76,
      featured: false
    },
    {
      name: 'Passeio de Bicicleta',
      description: 'Explore a cidade ou trilhas naturais de bicicleta com rotas personalizadas.',
      location: 'Parque Urbano',
      duration: 3,
      price: 60,
      rating: 4.5,
      reviewCount: 104,
      featured: false
    },
    {
      name: 'Visita a Vinícola',
      description: 'Conheça o processo de produção de vinhos e participe de degustações exclusivas.',
      location: 'Vale dos Vinhedos',
      duration: 5,
      price: 200,
      rating: 4.8,
      reviewCount: 167,
      featured: true
    },
    {
      name: 'Rafting',
      description: 'Aventure-se em corredeiras com equipamentos de segurança e guias experientes.',
      location: 'Rio Bravo',
      duration: 4,
      price: 180,
      rating: 4.7,
      reviewCount: 132,
      featured: false
    },
    {
      name: 'Passeio de Helicóptero',
      description: 'Veja a paisagem de uma perspectiva única com um voo panorâmico de helicóptero.',
      location: 'Heliporto Central',
      duration: 1,
      price: 500,
      rating: 4.9,
      reviewCount: 87,
      featured: true
    },
    {
      name: 'Workshop de Culinária',
      description: 'Aprenda a preparar pratos típicos com chefs locais em uma experiência hands-on.',
      location: 'Escola de Gastronomia',
      duration: 3,
      price: 150,
      rating: 4.8,
      reviewCount: 94,
      featured: false
    },
    {
      name: 'Safari Fotográfico',
      description: 'Capture imagens incríveis da natureza com orientação de fotógrafos profissionais.',
      location: 'Reserva de Vida Selvagem',
      duration: 6,
      price: 220,
      rating: 4.6,
      reviewCount: 78,
      featured: false
    },
    {
      name: 'Escalada',
      description: 'Escale montanhas ou paredes artificiais com instrutores certificados.',
      location: 'Montanha Rochosa',
      duration: 5,
      price: 160,
      rating: 4.5,
      reviewCount: 63,
      featured: false
    }
  ];
  
  // Prepara os dados para inserção
  const activitiesData = activitiesList.map(activity => ({
    name: activity.name,
    description: activity.description,
    location: activity.location,
    duration: activity.duration,
    price: activity.price,
    rating: activity.rating,
    reviewCount: activity.reviewCount,
    imageUrl: `https://source.unsplash.com/featured/800x600?${encodeURIComponent(activity.name)}`,
    featured: activity.featured,
    createdAt: generateISODate(),
    updatedAt: generateISODate()
  }));
  
  // Cria as atividades
  const activityIds = await createDocuments(ACTIVITIES_COLLECTION_ID, activitiesData);
  console.log(`Created ${activityIds.length} activities successfully`);
}

// Executa a função principal
seedActivities().catch(error => {
  console.error('Error seeding activities:', error);
});
