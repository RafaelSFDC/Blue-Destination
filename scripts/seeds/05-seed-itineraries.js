require("dotenv").config({ path: ".env.local" });
const { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } = require('./utils');
const fs = require('fs');
const path = require('path');

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const ITINERARY_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ITINERARY'];
const PACKAGES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_PACKAGES'];
const ACTIVITIES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ACTIVITIES'];
const MEALS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_MEALS'];
const ACCOMMODATIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ACCOMMODATIONS'];

// Função para carregar os IDs dos pacotes
function loadPackageIds() {
  const packageIdsPath = path.join(process.cwd(), 'scripts', 'package-ids.json');
  if (fs.existsSync(packageIdsPath)) {
    return JSON.parse(fs.readFileSync(packageIdsPath, 'utf8'));
  }
  return [];
}

// Função para criar atividades
async function createActivities() {
  if (!ACTIVITIES_COLLECTION_ID) {
    console.error('Activities collection ID not found in .env.local');
    return [];
  }

  console.log('Creating activities...');
  
  // Verifica se já existem atividades
  const activityExists = await documentExists(ACTIVITIES_COLLECTION_ID, 'name', 'City Tour');
  if (activityExists) {
    console.log('Activities already exist, skipping...');
    const activities = await getRandomDocuments(ACTIVITIES_COLLECTION_ID, 100);
    return activities.map(activity => activity.$id);
  }
  
  // Lista de atividades comuns
  const activitiesList = [
    { 
      name: 'City Tour', 
      description: 'Um passeio guiado pelos principais pontos turísticos da cidade.',
      location: 'Centro da cidade',
      duration: 4,
      price: 50,
      rating: 4.5,
      reviewCount: 120,
      featured: true
    },
    { 
      name: 'Passeio de Barco', 
      description: 'Um relaxante passeio de barco para apreciar a paisagem a partir da água.',
      location: 'Porto local',
      duration: 3,
      price: 70,
      rating: 4.7,
      reviewCount: 85,
      featured: true
    },
    { 
      name: 'Visita a Museu', 
      description: 'Uma visita guiada a um dos principais museus da região.',
      location: 'Distrito cultural',
      duration: 2,
      price: 25,
      rating: 4.3,
      reviewCount: 150,
      featured: false
    },
    { 
      name: 'Trekking', 
      description: 'Uma caminhada por trilhas naturais com vistas deslumbrantes.',
      location: 'Parque nacional',
      duration: 5,
      price: 40,
      rating: 4.8,
      reviewCount: 95,
      featured: true
    },
    { 
      name: 'Tour Gastronômico', 
      description: 'Um passeio para experimentar a culinária local em restaurantes selecionados.',
      location: 'Bairro gastronômico',
      duration: 4,
      price: 80,
      rating: 4.9,
      reviewCount: 110,
      featured: true
    },
    { 
      name: 'Visita a Vinícola', 
      description: 'Conheça o processo de produção de vinhos e participe de uma degustação.',
      location: 'Região vinícola',
      duration: 6,
      price: 90,
      rating: 4.6,
      reviewCount: 75,
      featured: false
    },
    { 
      name: 'Mergulho', 
      description: 'Uma experiência de mergulho para observar a vida marinha local.',
      location: 'Recife de coral',
      duration: 3,
      price: 120,
      rating: 4.7,
      reviewCount: 65,
      featured: true
    },
    { 
      name: 'Passeio de Bicicleta', 
      description: 'Um passeio de bicicleta para explorar a cidade de forma sustentável.',
      location: 'Ciclovias urbanas',
      duration: 3,
      price: 30,
      rating: 4.4,
      reviewCount: 88,
      featured: false
    },
    { 
      name: 'Safari Fotográfico', 
      description: 'Um safari para fotografar a fauna e flora locais.',
      location: 'Reserva natural',
      duration: 8,
      price: 150,
      rating: 4.9,
      reviewCount: 55,
      featured: true
    },
    { 
      name: 'Aula de Culinária', 
      description: 'Aprenda a preparar pratos típicos da culinária local.',
      location: 'Escola de gastronomia',
      duration: 3,
      price: 60,
      rating: 4.5,
      reviewCount: 70,
      featured: false
    },
    { 
      name: 'Show Cultural', 
      description: 'Assista a uma apresentação de música e dança tradicionais.',
      location: 'Teatro local',
      duration: 2,
      price: 45,
      rating: 4.6,
      reviewCount: 90,
      featured: false
    },
    { 
      name: 'Passeio de Helicóptero', 
      description: 'Uma vista panorâmica da região a partir do céu.',
      location: 'Heliporto',
      duration: 1,
      price: 250,
      rating: 4.8,
      reviewCount: 40,
      featured: true
    },
    { 
      name: 'Visita a Mercado Local', 
      description: 'Conheça o mercado local e seus produtos típicos.',
      location: 'Mercado central',
      duration: 2,
      price: 15,
      rating: 4.3,
      reviewCount: 110,
      featured: false
    },
    { 
      name: 'Observação de Aves', 
      description: 'Um passeio para observar as espécies de aves da região.',
      location: 'Reserva ecológica',
      duration: 4,
      price: 35,
      rating: 4.4,
      reviewCount: 50,
      featured: false
    },
    { 
      name: 'Rafting', 
      description: 'Uma aventura de rafting em corredeiras.',
      location: 'Rio local',
      duration: 3,
      price: 85,
      rating: 4.7,
      reviewCount: 75,
      featured: true
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
  
  return activityIds;
}

// Função para criar refeições
async function createMeals() {
  if (!MEALS_COLLECTION_ID) {
    console.error('Meals collection ID not found in .env.local');
    return [];
  }

  console.log('Creating meals...');
  
  // Verifica se já existem refeições
  const mealExists = await documentExists(MEALS_COLLECTION_ID, 'breakfast', true);
  if (mealExists) {
    console.log('Meals already exist, skipping...');
    const meals = await getRandomDocuments(MEALS_COLLECTION_ID, 100);
    return meals.map(meal => meal.$id);
  }
  
  // Prepara os dados para inserção
  const mealsData = Array.from({ length: 10 }, () => ({
    breakfast: faker.datatype.boolean(0.8),
    lunch: faker.datatype.boolean(0.6),
    dinner: faker.datatype.boolean(0.5),
    createdAt: generateISODate(),
    updatedAt: generateISODate()
  }));
  
  // Cria as refeições
  const mealIds = await createDocuments(MEALS_COLLECTION_ID, mealsData);
  console.log(`Created ${mealIds.length} meals successfully`);
  
  return mealIds;
}

// Função para criar acomodações
async function createAccommodations() {
  if (!ACCOMMODATIONS_COLLECTION_ID) {
    console.error('Accommodations collection ID not found in .env.local');
    return [];
  }

  console.log('Creating accommodations...');
  
  // Verifica se já existem acomodações
  const accommodationExists = await documentExists(ACCOMMODATIONS_COLLECTION_ID, 'name', 'Hotel Central');
  if (accommodationExists) {
    console.log('Accommodations already exist, skipping...');
    const accommodations = await getRandomDocuments(ACCOMMODATIONS_COLLECTION_ID, 100);
    return accommodations.map(accommodation => accommodation.$id);
  }
  
  // Lista de tipos de acomodação
  const accommodationTypes = ['Hotel', 'Resort', 'Pousada', 'Hostel', 'Apartamento', 'Casa', 'Chalé', 'Lodge'];
  
  // Lista de nomes de hotéis
  const hotelNames = [
    'Central', 'Royal', 'Imperial', 'Panorama', 'Sunset', 'Ocean View', 'Mountain View', 
    'Plaza', 'Grand', 'Comfort', 'Luxury', 'Boutique', 'Palace', 'Oasis', 'Paradise'
  ];
  
  // Prepara os dados para inserção
  const accommodationsData = Array.from({ length: 15 }, () => {
    const type = faker.helpers.arrayElement(accommodationTypes);
    const name = `${type} ${faker.helpers.arrayElement(hotelNames)}`;
    
    return {
      type,
      name,
      rating: faker.number.float({ min: 3, max: 5, precision: 0.5 }),
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    };
  });
  
  // Cria as acomodações
  const accommodationIds = await createDocuments(ACCOMMODATIONS_COLLECTION_ID, accommodationsData);
  console.log(`Created ${accommodationIds.length} accommodations successfully`);
  
  return accommodationIds;
}

// Função principal para criar os itinerários
async function seedItineraries() {
  if (!ITINERARY_COLLECTION_ID) {
    console.error('Itinerary collection ID not found in .env.local');
    return;
  }

  if (!PACKAGES_COLLECTION_ID) {
    console.error('Packages collection ID not found in .env.local');
    return;
  }

  console.log('Creating itineraries...');
  
  // Verifica se já existem itinerários
  const itineraryExists = await documentExists(ITINERARY_COLLECTION_ID, 'day', 1);
  if (itineraryExists) {
    console.log('Itineraries already exist, skipping...');
    return;
  }
  
  // Obtém pacotes
  let packages = [];
  try {
    // Tenta obter os pacotes do banco de dados
    packages = await getRandomDocuments(PACKAGES_COLLECTION_ID, 100);
    
    // Se não conseguir, tenta carregar do arquivo
    if (packages.length === 0) {
      const packageIds = loadPackageIds();
      if (packageIds.length > 0) {
        console.log(`Loaded ${packageIds.length} package IDs from file`);
      } else {
        console.warn('No packages found. Run seed-packages.js first.');
        return;
      }
    }
  } catch (error) {
    console.error('Error getting packages:', error);
    return;
  }
  
  // Cria atividades, refeições e acomodações
  const activityIds = await createActivities();
  const mealIds = await createMeals();
  const accommodationIds = await createAccommodations();
  
  // Prepara os dados para inserção
  const itinerariesData = [];
  
  for (const pkg of packages) {
    const duration = pkg.duration || faker.number.int({ min: 3, max: 10 });
    
    for (let day = 1; day <= duration; day++) {
      // Gera títulos baseados no dia
      let title;
      if (day === 1) {
        title = 'Chegada e Boas-vindas';
      } else if (day === duration) {
        title = 'Despedida e Retorno';
      } else {
        const titleOptions = [
          `Explorando ${pkg.name.split(' ')[0]}`,
          `Aventura em ${pkg.name.split(' ')[0]}`,
          `Descobrindo ${pkg.name.split(' ')[0]}`,
          `Dia de Passeios`,
          `Experiência Cultural`,
          `Dia Livre`,
          `Atividades Opcionais`,
          `Visita Guiada`,
          `Natureza e Aventura`,
          `Gastronomia Local`
        ];
        title = faker.helpers.arrayElement(titleOptions);
      }
      
      // Gera descrição baseada no dia
      let description;
      if (day === 1) {
        description = `Chegada ao destino, recepção no aeroporto e traslado para o hotel. Check-in e tempo livre para descanso. À noite, jantar de boas-vindas para conhecer o guia e os outros participantes da viagem.`;
      } else if (day === duration) {
        description = `Café da manhã no hotel. Tempo livre para as últimas compras ou atividades. Check-out do hotel e traslado para o aeroporto. Embarque no voo de retorno.`;
      } else {
        description = faker.lorem.paragraphs(2);
      }
      
      itinerariesData.push({
        package: pkg.$id,
        day,
        title,
        description,
        activities: faker.helpers.maybe(() => 
          faker.helpers.arrayElements(activityIds, faker.number.int({ min: 1, max: 3 })),
          { probability: 0.8 }
        ),
        meals: faker.helpers.maybe(() => 
          faker.helpers.arrayElement(mealIds),
          { probability: 0.9 }
        ),
        accommodation: faker.helpers.maybe(() => 
          faker.helpers.arrayElement(accommodationIds),
          { probability: 0.9 }
        ),
        createdAt: generateISODate(),
        updatedAt: generateISODate()
      });
    }
  }
  
  // Cria os itinerários
  const itineraryIds = await createDocuments(ITINERARY_COLLECTION_ID, itinerariesData);
  console.log(`Created ${itineraryIds.length} itineraries successfully`);
}

// Executa a função principal
seedItineraries().catch(error => {
  console.error('Error seeding itineraries:', error);
});
