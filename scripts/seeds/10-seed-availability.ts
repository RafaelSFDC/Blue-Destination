require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments, addDays } from './utils';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const AVAILABILITY_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_AVAILABILITY'];
const PACKAGES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_PACKAGES'];

// Número de disponibilidades a serem criadas
const NUM_AVAILABILITY_PER_PACKAGE = 5;

// Função principal para criar as disponibilidades
async function seedAvailability() {
  if (!AVAILABILITY_COLLECTION_ID) {
    console.error('Availability collection ID not found in .env.local');
    return;
  }

  if (!PACKAGES_COLLECTION_ID) {
    console.error('Packages collection ID not found in .env.local');
    return;
  }

  console.log('Creating availability entries...');
  
  // Verifica se já existem disponibilidades
  const availabilityExists = await documentExists(AVAILABILITY_COLLECTION_ID, 'status', 'available');
  if (availabilityExists) {
    console.log('Availability entries already exist, skipping...');
    return;
  }
  
  // Obtém pacotes para associar disponibilidades
  const packages = await getRandomDocuments(PACKAGES_COLLECTION_ID, 100);
  if (packages.length === 0) {
    console.error('No packages found to associate with availability');
    return;
  }
  
  // Prepara os dados para inserção
  const availabilityData = [];
  
  for (const pkg of packages) {
    // Cria múltiplas disponibilidades para cada pacote
    for (let i = 0; i < NUM_AVAILABILITY_PER_PACKAGE; i++) {
      const startDate = faker.date.future({ years: 1 });
      const endDate = addDays(new Date(startDate), pkg.duration || 7);
      const isAvailable = faker.datatype.boolean(0.8); // 80% de chance de estar disponível
      
      availabilityData.push({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        slots: isAvailable ? faker.number.int({ min: 1, max: 20 }) : 0,
        status: isAvailable ? 'available' : 'unavailable',
        createdAt: generateISODate(),
        updatedAt: generateISODate()
      });
    }
  }
  
  // Cria as disponibilidades
  const availabilityIds = await createDocuments(AVAILABILITY_COLLECTION_ID, availabilityData);
  console.log(`Created ${availabilityIds.length} availability entries successfully`);
}

// Executa a função principal
seedAvailability().catch(error => {
  console.error('Error seeding availability:', error);
});
