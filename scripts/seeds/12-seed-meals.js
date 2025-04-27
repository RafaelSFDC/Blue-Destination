require("dotenv").config({ path: ".env.local" });
const { loadCollectionIds, createDocuments, documentExists, generateISODate, faker, getRandomDocuments } = require('./utils');

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const MEALS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_MEALS'];

// Número de refeições a serem criadas
const NUM_MEALS = 12;

// Função principal para criar as refeições
async function seedMeals() {
  if (!MEALS_COLLECTION_ID) {
    console.error('Meals collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_MEALS} meal options...`);
  
  // Verifica se já existem refeições
  const mealExists = await documentExists(MEALS_COLLECTION_ID, 'breakfast', true);
  if (mealExists) {
    console.log('Meals already exist, skipping...');
    return;
  }
  
  // Prepara os dados para inserção
  const mealsData = Array.from({ length: NUM_MEALS }, () => ({
    breakfast: faker.datatype.boolean(0.8), // 80% de chance de incluir café da manhã
    lunch: faker.datatype.boolean(0.6),     // 60% de chance de incluir almoço
    dinner: faker.datatype.boolean(0.5),    // 50% de chance de incluir jantar
    createdAt: generateISODate(),
    updatedAt: generateISODate()
  }));
  
  // Adiciona algumas combinações específicas para garantir variedade
  mealsData.push(
    {
      breakfast: true,
      lunch: true,
      dinner: true,
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    },
    {
      breakfast: true,
      lunch: false,
      dinner: false,
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    },
    {
      breakfast: false,
      lunch: true,
      dinner: false,
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    },
    {
      breakfast: false,
      lunch: false,
      dinner: true,
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    }
  );
  
  // Cria as refeições
  const mealIds = await createDocuments(MEALS_COLLECTION_ID, mealsData);
  console.log(`Created ${mealIds.length} meal options successfully`);
}

// Executa a função principal
seedMeals().catch(error => {
  console.error('Error seeding meals:', error);
});
