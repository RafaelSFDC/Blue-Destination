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
  
  // Obtém usuários, pacotes e destinos
  let users: any[] = [];
  let packages: any[] = [];
  let destinations: any[] = [];
  
  try {
    users = await getRandomDocuments(USERS_COLLECTION_ID, 100);
    if (users.length === 0) {
      console.warn('No users found. Run seed-users.ts first.');
      return;
    }
    
    packages = await getRandomDocuments(PACKAGES_COLLECTION_ID, 100);
    if (packages.length === 0) {
      console.warn('No packages found. Run seed-packages.ts first.');
      return;
    }
    
    destinations = await getRandomDocuments(DESTINATIONS_COLLECTION_ID, 100);
    if (destinations.length === 0) {
      console.warn('No destinations found. Run seed-destinations.ts first.');
      return;
    }
  } catch (error) {
    console.error('Error getting data for testimonials:', error);
    return;
  }
  
  // Comentários positivos pré-definidos para garantir qualidade
  const positiveComments = [
    "Uma experiência incrível! O atendimento foi impecável e os lugares visitados superaram todas as expectativas. Recomendo fortemente!",
    "Viagem perfeita do início ao fim. Os guias eram extremamente conhecedores e atenciosos. Voltarei com certeza!",
    "Melhor viagem da minha vida! Tudo foi organizado com perfeição e não tivemos nenhum contratempo. Vale cada centavo investido.",
    "Superou todas as minhas expectativas. A agência cuidou de cada detalhe e pude aproveitar cada momento sem preocupações.",
    "Uma jornada inesquecível! Os hotéis eram excelentes e as atividades muito bem planejadas. Já estou planejando a próxima viagem!",
    "Experiência transformadora! Conheci lugares incríveis e fiz amizades que levarei para a vida toda. Obrigado por tornar isso possível!",
    "Viagem dos sonhos realizada com perfeição. O roteiro foi muito bem elaborado, permitindo conhecer o melhor de cada lugar.",
    "Atendimento excepcional do início ao fim. Todos os detalhes foram cuidados com atenção e carinho. Recomendo a todos!",
    "Uma aventura incrível com momentos inesquecíveis. A equipe foi extremamente profissional e atenciosa durante toda a viagem.",
    "Férias perfeitas! Tudo correu conforme o planejado e ainda tivemos surpresas agradáveis ao longo do caminho. Voltarei com certeza!"
  ];
  
  // Comentários mistos (positivos com algumas ressalvas)
  const mixedComments = [
    "Viagem muito boa, mas o hotel poderia ser melhor. As atividades e passeios foram excelentes e compensaram esse pequeno detalhe.",
    "Experiência incrível, apesar de alguns atrasos no cronograma. A beleza dos lugares visitados fez valer cada minuto de espera.",
    "Gostei muito da viagem, mas senti falta de mais tempo livre para explorar por conta própria. Os guias eram excelentes e muito informativos.",
    "Ótima experiência no geral. Alguns passeios poderiam ter sido mais longos, mas a organização foi impecável.",
    "Viagem maravilhosa, embora o clima não tenha colaborado em alguns dias. A equipe soube contornar bem a situação com alternativas interessantes."
  ];
  
  // Prepara os dados para inserção
  const testimonialsData = Array.from({ length: NUM_TESTIMONIALS }, () => {
    const user = faker.helpers.arrayElement(users);
    const isPackage = faker.datatype.boolean(0.7);
    const rating = faker.helpers.weightedArrayElement([
      { weight: 50, value: 5 },
      { weight: 30, value: 4 },
      { weight: 15, value: 4.5 },
      { weight: 5, value: 3.5 }
    ]);
    
    // Seleciona comentário baseado na avaliação
    let comment;
    if (rating >= 4.5) {
      comment = faker.helpers.arrayElement(positiveComments);
    } else {
      comment = faker.helpers.arrayElement(mixedComments);
    }
    
    // Data do depoimento (entre 1 e 180 dias atrás)
    const date = generateISODate(faker.number.int({ min: -180, max: -1 }));
    
    return {
      user: user.$id,
      package: isPackage ? faker.helpers.arrayElement(packages).$id : null,
      destination: !isPackage ? faker.helpers.arrayElement(destinations).$id : null,
      rating,
      comment,
      date,
      featured: faker.datatype.boolean(0.2),
      imageUrl: faker.helpers.maybe(() => 
        `https://source.unsplash.com/featured/800x600?travel,${faker.number.int(100)}`,
        { probability: 0.3 }
      ),
      likes: faker.number.int({ min: 0, max: 50 }),
      helpful: faker.number.int({ min: 0, max: 30 }),
      createdAt: date,
      updatedAt: date
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
