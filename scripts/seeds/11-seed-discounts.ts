require("dotenv").config({ path: ".env.local" });
import { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } from './utils';

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const DISCOUNTS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_DISCOUNTS'];

// Número de descontos a serem criados
const NUM_DISCOUNTS = 15;

// Função principal para criar os descontos
async function seedDiscounts() {
  if (!DISCOUNTS_COLLECTION_ID) {
    console.error('Discounts collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_DISCOUNTS} discounts...`);
  
  // Verifica se já existem descontos
  const discountExists = await documentExists(DISCOUNTS_COLLECTION_ID, 'type', 'percentage');
  if (discountExists) {
    console.log('Discounts already exist, skipping...');
    return;
  }
  
  // Prepara os dados para inserção
  const discountsData = Array.from({ length: NUM_DISCOUNTS }, () => {
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
}

// Executa a função principal
seedDiscounts().catch(error => {
  console.error('Error seeding discounts:', error);
});
