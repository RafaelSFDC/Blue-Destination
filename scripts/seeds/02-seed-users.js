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
  const addressesData = Array.from({ length: NUM_USERS }, () => {
    // Limitar o tamanho do país para 50 caracteres
    const country = faker.location.country().substring(0, 50);

    return {
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      complement: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.5 }),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: country,
      zipCode: faker.location.zipCode(),
      createdAt: generateISODate(),
      updatedAt: generateISODate()
    };
  });

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
    return {
      newsletter: faker.datatype.boolean(),
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
  await createAddresses();
  await createUserPreferences();

  // Prepara os dados para inserção
  const usersData = [
    // Usuário admin
    {
      name: 'Admin User',
      email: 'admin@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      phone: '+1234567890',
      role: 'admin',
      createdAt: generateISODate(-30),
      updatedAt: generateISODate()
    },
    // Usuários regulares
    ...Array.from({ length: NUM_USERS - 1 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();

      return {
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        phone: faker.phone.number().substring(0, 20),
        role: 'user',
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
