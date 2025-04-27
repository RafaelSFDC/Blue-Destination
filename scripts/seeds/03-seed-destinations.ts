require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } from './utils';
import * as fs from 'fs';
import * as path from 'path';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const DESTINATIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_DESTINATIONS'];
const TAGS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_TAGS'];

// Número de destinos a serem criados
const NUM_DESTINATIONS = 30;

// Destinos populares pré-definidos para garantir dados de qualidade
const popularDestinations = [
  {
    name: 'Paris',
    location: 'França',
    description: 'A Cidade Luz, conhecida por sua arquitetura deslumbrante, gastronomia refinada e atmosfera romântica. Visite a Torre Eiffel, o Museu do Louvre e passeie pelos charmosos bairros parisienses.',
    region: 'Europa',
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    weather: { bestTime: 'Primavera e Outono', temperature: { min: 5, max: 25 } }
  },
  {
    name: 'Roma',
    location: 'Itália',
    description: 'A Cidade Eterna, repleta de história, arte e cultura. Explore o Coliseu, o Fórum Romano, a Fontana di Trevi e a Cidade do Vaticano, enquanto desfruta da deliciosa culinária italiana.',
    region: 'Europa',
    coordinates: { latitude: 41.9028, longitude: 12.4964 },
    weather: { bestTime: 'Primavera e Outono', temperature: { min: 8, max: 30 } }
  },
  {
    name: 'Tóquio',
    location: 'Japão',
    description: 'Uma metrópole vibrante que combina tradição e modernidade. Descubra templos antigos, arranha-céus futuristas, tecnologia de ponta e uma cena gastronômica incomparável.',
    region: 'Ásia',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    weather: { bestTime: 'Primavera e Outono', temperature: { min: 5, max: 30 } }
  },
  {
    name: 'Nova York',
    location: 'Estados Unidos',
    description: 'A cidade que nunca dorme, com seus icônicos arranha-céus, museus de classe mundial, teatros da Broadway e bairros diversos. Uma experiência urbana incomparável.',
    region: 'América do Norte',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    weather: { bestTime: 'Primavera e Outono', temperature: { min: -5, max: 30 } }
  },
  {
    name: 'Rio de Janeiro',
    location: 'Brasil',
    description: 'A Cidade Maravilhosa, famosa por suas praias deslumbrantes, o Cristo Redentor, o Pão de Açúcar e o carnaval vibrante. Uma mistura perfeita de beleza natural e cultura animada.',
    region: 'América do Sul',
    coordinates: { latitude: -22.9068, longitude: -43.1729 },
    weather: { bestTime: 'Outono e Inverno', temperature: { min: 20, max: 40 } }
  },
  {
    name: 'Bali',
    location: 'Indonésia',
    description: 'Um paraíso tropical com praias deslumbrantes, templos antigos, terraços de arroz verdejantes e uma cultura rica. O destino perfeito para relaxar e se reconectar.',
    region: 'Ásia',
    coordinates: { latitude: -8.3405, longitude: 115.0920 },
    weather: { bestTime: 'Maio a Setembro', temperature: { min: 23, max: 33 } }
  },
  {
    name: 'Barcelona',
    location: 'Espanha',
    description: 'Uma cidade vibrante conhecida por sua arquitetura única de Gaudí, praias urbanas, gastronomia deliciosa e vida noturna animada. Um destino que combina cultura, história e diversão.',
    region: 'Europa',
    coordinates: { latitude: 41.3851, longitude: 2.1734 },
    weather: { bestTime: 'Primavera e Outono', temperature: { min: 10, max: 30 } }
  },
  {
    name: 'Cidade do Cabo',
    location: 'África do Sul',
    description: 'Uma cidade deslumbrante entre montanhas e oceano, com a icônica Table Mountain, praias de tirar o fôlego, vinícolas próximas e uma rica diversidade cultural.',
    region: 'África',
    coordinates: { latitude: -33.9249, longitude: 18.4241 },
    weather: { bestTime: 'Outubro a Abril', temperature: { min: 10, max: 30 } }
  },
  {
    name: 'Sydney',
    location: 'Austrália',
    description: 'Uma cidade cosmopolita com a icônica Opera House, a Harbour Bridge, praias deslumbrantes como Bondi e uma qualidade de vida invejável.',
    region: 'Oceania',
    coordinates: { latitude: -33.8688, longitude: 151.2093 },
    weather: { bestTime: 'Outubro a Abril', temperature: { min: 15, max: 30 } }
  },
  {
    name: 'Santorini',
    location: 'Grécia',
    description: 'Uma ilha deslumbrante com casas brancas de cúpulas azuis, penhascos vulcânicos, pôr do sol espetaculares e praias únicas. Um destino romântico por excelência.',
    region: 'Europa',
    coordinates: { latitude: 36.3932, longitude: 25.4615 },
    weather: { bestTime: 'Maio a Outubro', temperature: { min: 15, max: 30 } }
  }
];

// Função para carregar os IDs das tags
function loadTagIds(): string[] {
  const tagIdsPath = path.join(process.cwd(), 'scripts', 'tag-ids.json');
  if (fs.existsSync(tagIdsPath)) {
    return JSON.parse(fs.readFileSync(tagIdsPath, 'utf8'));
  }
  return [];
}

// Função principal para criar os destinos
async function seedDestinations() {
  if (!DESTINATIONS_COLLECTION_ID) {
    console.error('Destinations collection ID not found in .env.local');
    return;
  }

  if (!TAGS_COLLECTION_ID) {
    console.error('Tags collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_DESTINATIONS} destinations...`);
  
  // Verifica se já existem destinos
  const destinationExists = await documentExists(DESTINATIONS_COLLECTION_ID, 'name', 'Paris');
  if (destinationExists) {
    console.log('Destinations already exist, skipping...');
    return;
  }
  
  // Obtém tags para destinos
  let destinationTags: any[] = [];
  try {
    // Tenta obter as tags do banco de dados
    destinationTags = await getRandomDocuments(TAGS_COLLECTION_ID, 15);
    
    // Se não conseguir, tenta carregar do arquivo
    if (destinationTags.length === 0) {
      const tagIds = loadTagIds();
      if (tagIds.length > 0) {
        console.log(`Loaded ${tagIds.length} tag IDs from file`);
      } else {
        console.warn('No tags found. Run seed-tags.ts first.');
      }
    }
  } catch (error) {
    console.error('Error getting destination tags:', error);
  }
  
  // Prepara os dados para inserção
  const destinationsData = [
    // Destinos populares pré-definidos
    ...popularDestinations.map((dest, index) => ({
      name: dest.name,
      location: dest.location,
      description: dest.description,
      price: faker.number.int({ min: 500, max: 5000 }),
      rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
      reviewCount: faker.number.int({ min: 100, max: 1000 }),
      imageUrl: `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(dest.name)}`,
      gallery: Array.from({ length: 5 }, (_, i) => 
        `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(dest.name)},travel,${i}`
      ),
      featured: index < 5, // Os primeiros 5 são featured
      popular: true,
      region: dest.region,
      coordinates: JSON.stringify(dest.coordinates),
      weather: JSON.stringify(dest.weather),
      tags: destinationTags.length > 0 
        ? faker.helpers.arrayElements(
            destinationTags.filter(tag => tag.type === 'destination'), 
            faker.number.int({ min: 2, max: 5 })
          ).map(tag => tag.$id)
        : [],
      createdAt: generateISODate(faker.number.int({ min: -365, max: -30 })),
      updatedAt: generateISODate()
    })),
    
    // Destinos gerados aleatoriamente
    ...Array.from({ length: NUM_DESTINATIONS - popularDestinations.length }, () => {
      const name = faker.location.city();
      const location = faker.location.country();
      
      return {
        name,
        location,
        description: faker.lorem.paragraphs(3),
        price: faker.number.int({ min: 300, max: 3000 }),
        rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
        reviewCount: faker.number.int({ min: 10, max: 500 }),
        imageUrl: `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(name)},travel`,
        gallery: faker.helpers.maybe(() => 
          Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, (_, i) => 
            `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(name)},travel,${i}`
          ), 
          { probability: 0.7 }
        ),
        featured: faker.datatype.boolean(0.2),
        popular: faker.datatype.boolean(0.3),
        region: faker.helpers.arrayElement(['Europa', 'Ásia', 'América do Norte', 'América do Sul', 'África', 'Oceania']),
        coordinates: JSON.stringify({
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude()
        }),
        weather: JSON.stringify({
          bestTime: faker.helpers.arrayElement([
            'Primavera', 'Verão', 'Outono', 'Inverno', 
            'Ano todo', 'Maio a Setembro', 'Outubro a Abril'
          ]),
          temperature: {
            min: faker.number.int({ min: -10, max: 20 }),
            max: faker.number.int({ min: 20, max: 40 })
          }
        }),
        tags: destinationTags.length > 0 
          ? faker.helpers.arrayElements(
              destinationTags.filter(tag => tag.type === 'destination'), 
              faker.number.int({ min: 1, max: 4 })
            ).map(tag => tag.$id)
          : [],
        createdAt: generateISODate(faker.number.int({ min: -365, max: -1 })),
        updatedAt: generateISODate()
      };
    })
  ];
  
  // Cria os destinos
  const destinationIds = await createDocuments(DESTINATIONS_COLLECTION_ID, destinationsData);
  console.log(`Created ${destinationIds.length} destinations successfully`);
  
  // Salva os IDs dos destinos em um arquivo JSON
  const destinationIdsPath = path.join(process.cwd(), 'scripts', 'destination-ids.json');
  fs.writeFileSync(destinationIdsPath, JSON.stringify(destinationIds, null, 2));
  console.log(`Destination IDs saved to ${destinationIdsPath}`);
}

// Executa a função principal
seedDestinations().catch(error => {
  console.error('Error seeding destinations:', error);
});
