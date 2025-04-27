const { Client, Databases, ID, Query } = require("node-appwrite");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");
const { format, addDays, subDays, addMonths } = require("date-fns");
const fs = require("fs");
const path = require("path");

// Configuração do cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

// Função para carregar IDs de coleções do .env.local
function loadCollectionIds() {
  const envPath = path.join(process.cwd(), ".env.local");
  const envContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : "";

  const collectionIds = {};
  const lines = envContent.split("\n");

  for (const line of lines) {
    if (line.startsWith("NEXT_PUBLIC_COLLECTION_")) {
      const [key, value] = line.split("=");
      if (key && value) {
        collectionIds[key] = value.trim();
      }
    }
  }

  return collectionIds;
}

// Função para criar um documento
async function createDocument(collectionId, data) {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data
    );
    return document.$id;
  } catch (error) {
    console.error(
      `Error creating document in collection ${collectionId}:`,
      error
    );
    throw error;
  }
}

// Função para criar múltiplos documentos
async function createDocuments(collectionId, dataArray) {
  const documentIds = [];

  for (const data of dataArray) {
    try {
      const id = await createDocument(collectionId, data);
      documentIds.push(id);
    } catch (error) {
      console.error(
        `Error creating one of the documents in collection ${collectionId}:`,
        error
      );
    }
  }

  return documentIds;
}

// Função para verificar se um documento existe
async function documentExists(collectionId, attribute, value) {
  try {
    const documents = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal(attribute, value),
    ]);

    return documents.total > 0;
  } catch (error) {
    console.error(
      `Error checking if document exists in collection ${collectionId}:`,
      error
    );
    return false;
  }
}

// Função para obter documentos de uma coleção
async function getDocuments(collectionId, queries = []) {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      queries
    );

    return documents.documents;
  } catch (error) {
    console.error(
      `Error getting documents from collection ${collectionId}:`,
      error
    );
    return [];
  }
}

// Função para obter um documento aleatório de uma coleção
async function getRandomDocument(collectionId) {
  try {
    const documents = await databases.listDocuments(DATABASE_ID, collectionId);

    if (documents.total === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * documents.total);
    return documents.documents[randomIndex];
  } catch (error) {
    console.error(
      `Error getting random document from collection ${collectionId}:`,
      error
    );
    return null;
  }
}

// Função para obter múltiplos documentos aleatórios de uma coleção
async function getRandomDocuments(collectionId, count) {
  try {
    const documents = await databases.listDocuments(DATABASE_ID, collectionId);

    if (documents.total === 0) {
      return [];
    }

    // Embaralha os documentos e pega os primeiros 'count'
    const shuffled = [...documents.documents].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, documents.total));
  } catch (error) {
    console.error(
      `Error getting random documents from collection ${collectionId}:`,
      error
    );
    return [];
  }
}

// Função para gerar um slug único
function generateSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// Função para gerar uma data ISO formatada
function generateISODate(daysOffset = 0) {
  const date = daysOffset
    ? daysOffset > 0
      ? addDays(new Date(), daysOffset)
      : subDays(new Date(), Math.abs(daysOffset))
    : new Date();
  return date.toISOString();
}

// Função para gerar uma data futura para viagens
function generateFutureTravelDate(minDays = 30, maxDays = 180) {
  const daysToAdd = faker.number.int({ min: minDays, max: maxDays });
  return addDays(new Date(), daysToAdd).toISOString();
}

// Função para obter a instância de Databases
function getDatabases() {
  return databases;
}

module.exports = {
  loadCollectionIds,
  createDocument,
  createDocuments,
  documentExists,
  getDocuments,
  getRandomDocument,
  getRandomDocuments,
  generateSlug,
  generateISODate,
  generateFutureTravelDate,
  faker,
  format,
  addDays,
  subDays,
  addMonths,
  getDatabases
};
