import { Client, Databases, ID, Query } from "node-appwrite";
import { faker } from '@faker-js/faker';
import slugify from 'slugify';
import { format, addDays, subDays, addMonths } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

// Configuração do cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Função para carregar IDs de coleções do .env.local
export function loadCollectionIds(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  
  const collectionIds: Record<string, string> = {};
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_COLLECTION_')) {
      const [key, value] = line.split('=');
      if (key && value) {
        collectionIds[key] = value.trim();
      }
    }
  }
  
  return collectionIds;
}

// Função para criar um documento
export async function createDocument(collectionId: string, data: any): Promise<string> {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data
    );
    return document.$id;
  } catch (error) {
    console.error(`Error creating document in collection ${collectionId}:`, error);
    throw error;
  }
}

// Função para criar múltiplos documentos
export async function createDocuments(collectionId: string, dataArray: any[]): Promise<string[]> {
  const documentIds: string[] = [];
  
  for (const data of dataArray) {
    try {
      const id = await createDocument(collectionId, data);
      documentIds.push(id);
    } catch (error) {
      console.error(`Error creating one of the documents in collection ${collectionId}:`, error);
    }
  }
  
  return documentIds;
}

// Função para verificar se um documento existe
export async function documentExists(collectionId: string, attribute: string, value: any): Promise<boolean> {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      [Query.equal(attribute, value)]
    );
    
    return documents.total > 0;
  } catch (error) {
    console.error(`Error checking if document exists in collection ${collectionId}:`, error);
    return false;
  }
}

// Função para obter documentos de uma coleção
export async function getDocuments(collectionId: string, queries: string[] = []): Promise<any[]> {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      queries
    );
    
    return documents.documents;
  } catch (error) {
    console.error(`Error getting documents from collection ${collectionId}:`, error);
    return [];
  }
}

// Função para obter um documento aleatório de uma coleção
export async function getRandomDocument(collectionId: string): Promise<any> {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      collectionId
    );
    
    if (documents.total === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * documents.total);
    return documents.documents[randomIndex];
  } catch (error) {
    console.error(`Error getting random document from collection ${collectionId}:`, error);
    return null;
  }
}

// Função para obter múltiplos documentos aleatórios de uma coleção
export async function getRandomDocuments(collectionId: string, count: number): Promise<any[]> {
  try {
    const documents = await databases.listDocuments(
      DATABASE_ID,
      collectionId
    );
    
    if (documents.total === 0) {
      return [];
    }
    
    // Embaralha os documentos e pega os primeiros 'count'
    const shuffled = [...documents.documents].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, documents.total));
  } catch (error) {
    console.error(`Error getting random documents from collection ${collectionId}:`, error);
    return [];
  }
}

// Função para gerar um slug único
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });
}

// Função para gerar uma data ISO formatada
export function generateISODate(daysOffset: number = 0): string {
  const date = daysOffset ? 
    (daysOffset > 0 ? addDays(new Date(), daysOffset) : subDays(new Date(), Math.abs(daysOffset))) 
    : new Date();
  return date.toISOString();
}

// Função para gerar uma data futura para viagens
export function generateFutureTravelDate(minDays: number = 30, maxDays: number = 180): string {
  const daysToAdd = faker.number.int({ min: minDays, max: maxDays });
  return addDays(new Date(), daysToAdd).toISOString();
}

// Exporta o faker para uso nos scripts de seed
export { faker };

// Exporta funções de data-fns para uso nos scripts de seed
export { format, addDays, subDays, addMonths };
