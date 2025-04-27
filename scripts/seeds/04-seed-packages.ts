require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } from './utils';
import * as fs from 'fs';
import * as path from 'path';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const PACKAGES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_PACKAGES'];
const DESTINATIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_DESTINATIONS'];
const TAGS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_TAGS'];
const INCLUSIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_INCLUSIONS'];
const DISCOUNTS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_DISCOUNTS'];

// Número de pacotes a serem criados
const NUM_PACKAGES = 20;

// Função para carregar os IDs dos destinos
function loadDestinationIds(): string[] {
  const destinationIdsPath = path.join(process.cwd(), 'scripts', 'destination-ids.json');
  if (fs.existsSync(destinationIdsPath)) {
    return JSON.parse(fs.readFileSync(destinationIdsPath, 'utf8'));
  }
  return [];
}

// Função para criar inclusões
async function createInclusions() {
  if (!INCLUSIONS_COLLECTION_ID) {
    console.error('Inclusions collection ID not found in .env.local');
    return [];
  }

  console.log('Creating inclusions...');
  
  // Verifica se já existem inclusões
  const inclusionExists = await documentExists(INCLUSIONS_COLLECTION_ID, 'name', 'Passagem Aérea');
  if (inclusionExists) {
    console.log('Inclusions already exist, skipping...');
    const inclusions = await getRandomDocuments(INCLUSIONS_COLLECTION_ID, 100);
    return inclusions.map(inclusion => inclusion.$id);
  }
  
  // Lista de inclusões comuns
  const inclusionsList = [
    { name: 'Passagem Aérea', description: 'Passagens aéreas de ida e volta em classe econômica' },
    { name: 'Hospedagem', description: 'Hospedagem em hotel com café da manhã' },
    { name: 'Traslado', description: 'Traslado aeroporto/hotel/aeroporto' },
    { name: 'Seguro Viagem', description: 'Seguro viagem internacional' },
    { name: 'Café da Manhã', description: 'Café da manhã incluso na hospedagem' },
    { name: 'Passeios', description: 'Passeios inclusos conforme itinerário' },
    { name: 'Guia Local', description: 'Acompanhamento de guia local em português' },
    { name: 'Wi-Fi', description: 'Wi-Fi gratuito no hotel' },
    { name: 'Almoço', description: 'Almoços inclusos conforme itinerário' },
    { name: 'Jantar', description: 'Jantares inclusos conforme itinerário' },
    { name: 'Ingressos', description: 'Ingressos para atrações conforme itinerário' },
    { name: 'Transporte Local', description: 'Transporte local entre atrações' },
    { name: 'Kit Viagem', description: 'Kit viagem exclusivo' },
    { name: 'Assistência 24h', description: 'Assistência 24 horas em português' },
    { name: 'Bebidas', description: 'Bebidas inclusas nas refeições' }
  ];
  
  // Prepara os dados para inserção
  const inclusionsData = inclusionsList.map(inclusion => ({
    name: inclusion.name,
    description: inclusion.description,
    createdAt: generateISODate(),
    updatedAt: generateISODate()
  }));
  
  // Cria as inclusões
  const inclusionIds = await createDocuments(INCLUSIONS_COLLECTION_ID, inclusionsData);
  console.log(`Created ${inclusionIds.length} inclusions successfully`);
  
  return inclusionIds;
}

// Função para criar descontos
async function createDiscounts() {
  if (!DISCOUNTS_COLLECTION_ID) {
    console.error('Discounts collection ID not found in .env.local');
    return [];
  }

  console.log('Creating discounts...');
  
  // Verifica se já existem descontos
  const discountExists = await documentExists(DISCOUNTS_COLLECTION_ID, 'type', 'percentage');
  if (discountExists) {
    console.log('Discounts already exist, skipping...');
    const discounts = await getRandomDocuments(DISCOUNTS_COLLECTION_ID, 100);
    return discounts.map(discount => discount.$id);
  }
  
  // Prepara os dados para inserção
  const discountsData = Array.from({ length: 10 }, () => {
    const isPercentage = faker.datatype.boolean();
    const startDate = faker.date.future({ years: 0.5 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 30, max: 90 }));
    
    return {
      type: isPercentage ? 'percentage' : 'fixed',
      value: isPercentage 
        ? faker.number.int({ min: 5, max: 30 }) 
        : faker.number.int({ min: 50, max: 500 }),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    };
  });
  
  // Cria os descontos
  const discountIds = await createDocuments(DISCOUNTS_COLLECTION_ID, discountsData);
  console.log(`Created ${discountIds.length} discounts successfully`);
  
  return discountIds;
}

// Função principal para criar os pacotes
async function seedPackages() {
  if (!PACKAGES_COLLECTION_ID) {
    console.error('Packages collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_PACKAGES} packages...`);
  
  // Verifica se já existem pacotes
  const packageExists = await documentExists(PACKAGES_COLLECTION_ID, 'name', 'Aventura Europeia');
  if (packageExists) {
    console.log('Packages already exist, skipping...');
    return;
  }
  
  // Obtém destinos
  let destinations: any[] = [];
  try {
    // Tenta obter os destinos do banco de dados
    destinations = await getRandomDocuments(DESTINATIONS_COLLECTION_ID, 100);
    
    // Se não conseguir, tenta carregar do arquivo
    if (destinations.length === 0) {
      const destinationIds = loadDestinationIds();
      if (destinationIds.length > 0) {
        console.log(`Loaded ${destinationIds.length} destination IDs from file`);
      } else {
        console.warn('No destinations found. Run seed-destinations.ts first.');
        return;
      }
    }
  } catch (error) {
    console.error('Error getting destinations:', error);
    return;
  }
  
  // Obtém tags para pacotes
  let packageTags: any[] = [];
  try {
    packageTags = await getRandomDocuments(TAGS_COLLECTION_ID, 100);
    packageTags = packageTags.filter(tag => tag.type === 'package');
    
    if (packageTags.length === 0) {
      console.warn('No package tags found. Run seed-tags.ts first.');
    }
  } catch (error) {
    console.error('Error getting package tags:', error);
  }
  
  // Cria inclusões e descontos
  const inclusionIds = await createInclusions();
  const discountIds = await createDiscounts();
  
  // Pacotes pré-definidos para garantir dados de qualidade
  const predefinedPackages = [
    {
      name: 'Aventura Europeia',
      description: 'Uma jornada inesquecível pelas principais capitais europeias. Conheça Paris, Roma, Barcelona e Amsterdã em um único pacote, com hospedagem em hotéis 4 estrelas, passeios guiados e tempo livre para explorar cada cidade ao seu ritmo.',
      duration: 15,
      maxGuests: 20,
      featured: true
    },
    {
      name: 'Paraísos Tropicais',
      description: 'Descubra as mais belas praias e paisagens tropicais do mundo. Este pacote inclui visitas a Bali, Maldivas e Phuket, com hospedagem em resorts à beira-mar, atividades aquáticas e momentos de puro relaxamento.',
      duration: 12,
      maxGuests: 16,
      featured: true
    },
    {
      name: 'Expedição Asiática',
      description: 'Uma imersão cultural pelas maravilhas da Ásia. Visite Tóquio, Kyoto, Seul e Pequim, conhecendo templos antigos, mercados tradicionais e a vibrante vida urbana das metrópoles asiáticas.',
      duration: 14,
      maxGuests: 18,
      featured: true
    },
    {
      name: 'Maravilhas da América do Sul',
      description: 'Uma viagem pelas paisagens deslumbrantes e culturas ricas da América do Sul. Conheça o Rio de Janeiro, Machu Picchu, Buenos Aires e o Atacama, em uma experiência que combina natureza, história e gastronomia.',
      duration: 16,
      maxGuests: 15,
      featured: true
    },
    {
      name: 'Safari Africano',
      description: 'Uma aventura inesquecível pelos parques nacionais da África. Observe a vida selvagem em seu habitat natural, conheça tribos locais e desfrute de hospedagem em lodges exclusivos com vista para a savana.',
      duration: 10,
      maxGuests: 12,
      featured: true
    }
  ];
  
  // Prepara os dados para inserção
  const packagesData = [
    // Pacotes pré-definidos
    ...predefinedPackages.map((pkg, index) => {
      const packageDestinations = faker.helpers.arrayElements(destinations, faker.number.int({ min: 2, max: 4 }));
      const basePrice = faker.number.int({ min: 2000, max: 8000 });
      
      return {
        name: pkg.name,
        description: pkg.description,
        imageUrl: `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(pkg.name.split(' ')[0])},travel`,
        gallery: Array.from({ length: 6 }, (_, i) => 
          `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(pkg.name.split(' ')[0])},travel,${i}`
        ),
        price: basePrice,
        duration: pkg.duration,
        destinations: packageDestinations.map(dest => dest.$id),
        featured: pkg.featured,
        discount: faker.helpers.maybe(() => 
          faker.helpers.arrayElement(discountIds), 
          { probability: 0.3 }
        ),
        tags: packageTags.length > 0 
          ? faker.helpers.arrayElements(packageTags, faker.number.int({ min: 2, max: 5 })).map(tag => tag.$id)
          : [],
        inclusions: faker.helpers.arrayElements(inclusionIds, faker.number.int({ min: 5, max: 10 })),
        maxGuests: pkg.maxGuests,
        excluded: [
          'Despesas pessoais',
          'Gorjetas',
          'Refeições não mencionadas',
          'Passeios opcionais',
          'Taxas de entrada em atrações não incluídas no itinerário'
        ],
        requirements: [
          'Passaporte válido',
          'Seguro viagem',
          'Certificado de vacinação'
        ],
        createdAt: generateISODate(faker.number.int({ min: -180, max: -30 })),
        updatedAt: generateISODate()
      };
    }),
    
    // Pacotes gerados aleatoriamente
    ...Array.from({ length: NUM_PACKAGES - predefinedPackages.length }, () => {
      const packageDestinations = faker.helpers.arrayElements(destinations, faker.number.int({ min: 1, max: 5 }));
      const basePrice = faker.number.int({ min: 1000, max: 10000 });
      const duration = faker.number.int({ min: 3, max: 21 });
      
      // Gera um nome baseado nos destinos ou tipo de viagem
      const nameOptions = [
        `Explorando ${packageDestinations[0]?.name || faker.location.country()}`,
        `Aventura em ${packageDestinations[0]?.name || faker.location.country()}`,
        `${packageDestinations[0]?.name || faker.location.country()} Completo`,
        `O Melhor de ${packageDestinations[0]?.name || faker.location.country()}`,
        `${packageDestinations[0]?.name || faker.location.country()} Inesquecível`,
        `Descobrindo ${packageDestinations[0]?.region || faker.helpers.arrayElement(['Europa', 'Ásia', 'América', 'África', 'Oceania'])}`,
        `Maravilhas da ${packageDestinations[0]?.region || faker.helpers.arrayElement(['Europa', 'Ásia', 'América', 'África', 'Oceania'])}`,
        `Experiência ${faker.helpers.arrayElement(['Cultural', 'Gastronômica', 'Histórica', 'Natural', 'Urbana', 'Relaxante', 'Aventureira'])}`
      ];
      
      const name = faker.helpers.arrayElement(nameOptions);
      
      return {
        name,
        description: faker.lorem.paragraphs(4),
        imageUrl: `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(name.split(' ')[0])},travel`,
        gallery: faker.helpers.maybe(() => 
          Array.from({ length: faker.number.int({ min: 4, max: 10 }) }, (_, i) => 
            `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(name.split(' ')[0])},travel,${i}`
          ), 
          { probability: 0.8 }
        ),
        price: basePrice,
        duration,
        destinations: packageDestinations.map(dest => dest.$id),
        featured: faker.datatype.boolean(0.3),
        discount: faker.helpers.maybe(() => 
          faker.helpers.arrayElement(discountIds), 
          { probability: 0.4 }
        ),
        tags: packageTags.length > 0 
          ? faker.helpers.arrayElements(packageTags, faker.number.int({ min: 1, max: 4 })).map(tag => tag.$id)
          : [],
        inclusions: faker.helpers.arrayElements(inclusionIds, faker.number.int({ min: 3, max: 12 })),
        maxGuests: faker.number.int({ min: 8, max: 30 }),
        excluded: faker.helpers.arrayElements([
          'Despesas pessoais',
          'Gorjetas',
          'Refeições não mencionadas',
          'Passeios opcionais',
          'Taxas de entrada em atrações não incluídas no itinerário',
          'Bebidas alcoólicas',
          'Ligações telefônicas',
          'Lavanderia',
          'Excesso de bagagem',
          'Atividades marcadas como opcionais'
        ], faker.number.int({ min: 3, max: 6 })),
        requirements: faker.helpers.arrayElements([
          'Passaporte válido',
          'Seguro viagem',
          'Certificado de vacinação',
          'Visto para os países visitados',
          'Cartão internacional de vacina contra febre amarela',
          'Condições físicas para caminhadas',
          'Roupa adequada para o clima',
          'Equipamento específico para atividades'
        ], faker.number.int({ min: 2, max: 5 })),
        createdAt: generateISODate(faker.number.int({ min: -365, max: -1 })),
        updatedAt: generateISODate()
      };
    })
  ];
  
  // Cria os pacotes
  const packageIds = await createDocuments(PACKAGES_COLLECTION_ID, packagesData);
  console.log(`Created ${packageIds.length} packages successfully`);
  
  // Salva os IDs dos pacotes em um arquivo JSON
  const packageIdsPath = path.join(process.cwd(), 'scripts', 'package-ids.json');
  fs.writeFileSync(packageIdsPath, JSON.stringify(packageIds, null, 2));
  console.log(`Package IDs saved to ${packageIdsPath}`);
}

// Executa a função principal
seedPackages().catch(error => {
  console.error('Error seeding packages:', error);
});
