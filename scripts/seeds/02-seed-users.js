require("dotenv").config({ path: ".env.local" });
const { loadCollectionIds, createDocuments, documentExists, generateISODate, faker } = require('./utils');

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const USERS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_USERS'];
const ADDRESSES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_ADDRESSES'];
const USER_PREFERENCES_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_USER_PREFERENCES'];

// Número de usuários a serem criados
const NUM_USERS = 20;

// Função para criar endereços
async function createAddresses() {
  if (!ADDRESSES_COLLECTION_ID) {
    console.error('Addresses collection ID not found in .env.local');
    return [];
  }

  console.log(`Creating ${NUM_USERS} addresses...`);
  
  // Verifica se já existem endereços
  const addressExists = await documentExists(ADDRESSES_COLLECTION_ID, 'street', faker.location.street());
  if (addressExists) {
    console.log('Addresses already exist, skipping...');
    return [];
  }
  
  // Prepara os dados para inserção
  const addressesData = Array.from({ length: NUM_USERS }, () => ({
    street: faker.location.street(),
    number: faker.location.buildingNumber(),
    complement: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.5 }),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode(),
    createdAt: generateISODate(),
    updatedAt: generateISODate()
  }));
  
  // Cria os endereços
  const addressIds = await createDocuments(ADDRESSES_COLLECTION_ID, addressesData);
  console.log(`Created ${addressIds.length} addresses successfully`);
  
  return addressIds;
}

// Função para criar preferências de usuário
async function createUserPreferences() {
  if (!USER_PREFERENCES_COLLECTION_ID) {
    console.error('User preferences collection ID not found in .env.local');
    return [];
  }

  console.log(`Creating ${NUM_USERS} user preferences...`);
  
  // Verifica se já existem preferências
  const preferencesExist = await documentExists(USER_PREFERENCES_COLLECTION_ID, 'newsletter', true);
  if (preferencesExist) {
    console.log('User preferences already exist, skipping...');
    return [];
  }
  
  // Prepara os dados para inserção
  const preferencesData = Array.from({ length: NUM_USERS }, () => {
    const travelStyles = ['Aventura', 'Relaxamento', 'Cultural', 'Gastronômico', 'Ecoturismo'];
    const destinations = ['Europa', 'Ásia', 'América do Norte', 'América do Sul', 'África', 'Oceania'];
    const dietaryRestrictions = ['Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose', 'Kosher', 'Halal'];
    
    return {
      newsletter: faker.datatype.boolean(),
      notifications: JSON.stringify({
        email: faker.datatype.boolean(0.8),
        push: faker.datatype.boolean(0.7),
        sms: faker.datatype.boolean(0.3)
      }),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'BRL', 'GBP', 'JPY']),
      language: faker.helpers.arrayElement(['en-US', 'pt-BR', 'es-ES', 'fr-FR', 'de-DE']),
      preferredDestinations: faker.helpers.arrayElements(destinations, faker.number.int({ min: 1, max: 3 })),
      dietaryRestrictions: faker.helpers.maybe(() => faker.helpers.arrayElements(dietaryRestrictions, faker.number.int({ min: 0, max: 2 })), { probability: 0.4 }),
      travelStyle: faker.helpers.arrayElements(travelStyles, faker.number.int({ min: 1, max: 3 })),
      priceRange: faker.helpers.arrayElement(['Econômico', 'Moderado', 'Luxo']),
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    };
  });
  
  // Cria as preferências
  const preferenceIds = await createDocuments(USER_PREFERENCES_COLLECTION_ID, preferencesData);
  console.log(`Created ${preferenceIds.length} user preferences successfully`);
  
  return preferenceIds;
}

// Função principal para criar os usuários
async function seedUsers() {
  if (!USERS_COLLECTION_ID) {
    console.error('Users collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${NUM_USERS} users...`);
  
  // Verifica se já existem usuários
  const userExists = await documentExists(USERS_COLLECTION_ID, 'email', 'admin@example.com');
  if (userExists) {
    console.log('Users already exist, skipping...');
    return;
  }
  
  // Cria endereços e preferências
  const addressIds = await createAddresses();
  const preferenceIds = await createUserPreferences();
  
  // Prepara os dados para inserção
  const usersData = [
    // Usuário admin
    {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      phone: '+1234567890',
      address: addressIds[0] || null,
      preferences: preferenceIds[0] || null,
      createdAt: generateISODate(-30),
      updatedAt: generateISODate()
    },
    // Usuários regulares
    ...Array.from({ length: NUM_USERS - 1 }, (_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      
      return {
        name,
        email,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        phone: faker.phone.number(),
        address: addressIds[i + 1] || null,
        preferences: preferenceIds[i + 1] || null,
        createdAt: generateISODate(faker.number.int({ min: -365, max: -1 })),
        updatedAt: generateISODate()
      };
    })
  ];
  
  // Cria os usuários
  const userIds = await createDocuments(USERS_COLLECTION_ID, usersData);
  console.log(`Created ${userIds.length} users successfully`);
}

// Executa a função principal
seedUsers().catch(error => {
  console.error('Error seeding users:', error);
});
