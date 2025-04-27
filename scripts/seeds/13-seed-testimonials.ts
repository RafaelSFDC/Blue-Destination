require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } from './utils';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const TESTIMONIALS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_TESTIMONIALS'];
const USERS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_USERS'];
const PACKAGES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_PACKAGES'];
const DESTINATIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_DESTINATIONS'];

// Número de depoimentos a serem criados
const NUM_TESTIMONIALS = 50;

// Função principal para criar os depoimentos
async function seedTestimonials() {
  if (!TESTIMONIALS_COLLECTION_ID) {
    console.error('Testimonials collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_TESTIMONIALS} testimonials...`);
  
  // Verifica se já existem depoimentos
  const testimonialExists = await documentExists(TESTIMONIALS_COLLECTION_ID, 'rating', 5);
  if (testimonialExists) {
    console.log('Testimonials already exist, skipping...');
    return;
  }
  
  // Obtém usuários, pacotes e destinos para associar aos depoimentos
  const users = await getRandomDocuments(USERS_COLLECTION_ID, 100);
  const packages = await getRandomDocuments(PACKAGES_COLLECTION_ID, 100);
  const destinations = await getRandomDocuments(DESTINATIONS_COLLECTION_ID, 100);
  
  if (users.length === 0 || (packages.length === 0 && destinations.length === 0)) {
    console.error('No users, packages or destinations found to associate with testimonials');
    return;
  }
  
  // Comentários positivos para depoimentos
  const positiveComments = [
    "Uma experiência incrível! Superou todas as minhas expectativas.",
    "Viagem perfeita do início ao fim. Recomendo a todos!",
    "Os guias eram extremamente conhecedores e atenciosos.",
    "A melhor viagem que já fiz. Momentos inesquecíveis.",
    "Excelente custo-benefício. Valeu cada centavo investido.",
    "Organização impecável. Tudo ocorreu conforme o planejado.",
    "Acomodações de primeira linha e serviço excepcional.",
    "Conheci lugares maravilhosos que jamais esquecerei.",
    "A agência cuidou de todos os detalhes, o que tornou a viagem muito tranquila.",
    "Experiência gastronômica incrível durante toda a viagem."
  ];
  
  // Comentários médios para depoimentos
  const averageComments = [
    "Boa viagem, mas alguns aspectos poderiam ser melhorados.",
    "Gostei da experiência, mas esperava um pouco mais das acomodações.",
    "O roteiro foi bom, mas um pouco corrido em alguns momentos.",
    "Valeu a pena, mas o preço poderia ser um pouco menor.",
    "Os guias eram bons, mas às vezes não muito organizados.",
    "Experiência agradável, mas com alguns contratempos.",
    "Bom serviço, mas a comunicação poderia ser melhor."
  ];
  
  // Prepara os dados para inserção
  const testimonialsData = Array.from({ length: NUM_TESTIMONIALS }, () => {
    const user = faker.helpers.arrayElement(users);
    const rating = faker.number.int({ min: 3, max: 5 });
    const isPackage = faker.datatype.boolean();
    const date = faker.date.past({ years: 1 });
    
    // Seleciona comentário baseado na avaliação
    let comment;
    if (rating >= 4.5) {
      comment = faker.helpers.arrayElement(positiveComments);
    } else {
      comment = faker.helpers.arrayElement(averageComments);
    }
    
    // Adiciona detalhes ao comentário
    comment += " " + faker.lorem.paragraph();
    
    return {
      user: user.$id,
      package: isPackage ? faker.helpers.arrayElement(packages).$id : undefined,
      destinations: !isPackage ? faker.helpers.arrayElement(destinations).$id : undefined,
      rating,
      comment,
      date: date.toISOString(),
      featured: faker.datatype.boolean(0.2), // 20% de chance de ser destacado
      likes: faker.number.int({ min: 0, max: 50 }),
      helpful: faker.number.int({ min: 0, max: 30 }),
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    };
  });
  
  // Cria os depoimentos
  const testimonialIds = await createDocuments(TESTIMONIALS_COLLECTION_ID, testimonialsData);
  console.log(`Created ${testimonialIds.length} testimonials successfully`);
}

// Executa a função principal
seedTestimonials().catch(error => {
  console.error('Error seeding testimonials:', error);
});
