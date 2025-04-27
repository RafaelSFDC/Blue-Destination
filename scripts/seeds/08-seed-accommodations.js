require("dotenv").config({ path: ".env.local" });
const { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } = require('./utils');

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const ACCOMMODATIONS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ACCOMMODATIONS'];

// Número de acomodações a serem criadas
const NUM_ACCOMMODATIONS = 20;

// Função principal para criar as acomodações
async function seedAccommodations() {
  if (!ACCOMMODATIONS_COLLECTION_ID) {
    console.error('Accommodations collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_ACCOMMODATIONS} accommodations...`);
  
  // Verifica se já existem acomodações
  const accommodationExists = await documentExists(ACCOMMODATIONS_COLLECTION_ID, 'name', 'Hotel Central');
  if (accommodationExists) {
    console.log('Accommodations already exist, skipping...');
    return;
  }
  
  // Lista de tipos de acomodação
  const accommodationTypes = ['Hotel', 'Resort', 'Pousada', 'Hostel', 'Apartamento', 'Casa', 'Chalé', 'Lodge', 'Villa', 'Flat'];
  
  // Lista de nomes de hotéis
  const hotelNames = [
    'Central', 'Royal', 'Imperial', 'Panorama', 'Sunset', 'Ocean View', 'Mountain View', 
    'Plaza', 'Grand', 'Comfort', 'Luxury', 'Boutique', 'Palace', 'Oasis', 'Paradise',
    'Seaside', 'Riverside', 'Golden', 'Diamond', 'Emerald', 'Blue Bay', 'Tropical'
  ];
  
  // Prepara os dados para inserção
  const accommodationsData = Array.from({ length: NUM_ACCOMMODATIONS }, () => {
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
}

// Executa a função principal
seedAccommodations().catch(error => {
  console.error('Error seeding accommodations:', error);
});
