require("dotenv").config({ path: ".env.local" });
const { loadCollectionIds, createDocuments, documentExists, generateSlug, generateISODate } = require('./utils');
const fs = require('fs');
const path = require('path');

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const TAGS_COLLECTION_ID = collectionIds['NEXT_PUBLIC_COLLECTION_TAGS'];

// Tags para destinos
const destinationTags = [
  { name: 'Praia', type: 'destination', color: '#0ea5e9', icon: 'umbrella-beach' },
  { name: 'Montanha', type: 'destination', color: '#84cc16', icon: 'mountain' },
  { name: 'Cidade', type: 'destination', color: '#6366f1', icon: 'city' },
  { name: 'Natureza', type: 'destination', color: '#22c55e', icon: 'leaf' },
  { name: 'Histórico', type: 'destination', color: '#f59e0b', icon: 'landmark' },
  { name: 'Cultural', type: 'destination', color: '#ec4899', icon: 'masks-theater' },
  { name: 'Aventura', type: 'destination', color: '#f97316', icon: 'person-hiking' },
  { name: 'Relaxamento', type: 'destination', color: '#06b6d4', icon: 'spa' },
  { name: 'Romântico', type: 'destination', color: '#e11d48', icon: 'heart' },
];

// Tags para pacotes
const packageTags = [
  { name: 'Lua de Mel', type: 'package', color: '#e11d48', icon: 'heart' },
  { name: 'Férias em Família', type: 'package', color: '#8b5cf6', icon: 'people-group' },
  { name: 'Aventura Radical', type: 'package', color: '#f97316', icon: 'person-hiking' },
  { name: 'Relaxamento Total', type: 'package', color: '#06b6d4', icon: 'spa' },
  { name: 'Experiência Cultural', type: 'package', color: '#ec4899', icon: 'masks-theater' },
  { name: 'Viagem Gastronômica', type: 'package', color: '#f59e0b', icon: 'utensils' },
  { name: 'Ecoturismo', type: 'package', color: '#22c55e', icon: 'leaf' },
  { name: 'Turismo Histórico', type: 'package', color: '#f59e0b', icon: 'landmark' },
  { name: 'Cruzeiro', type: 'package', color: '#0ea5e9', icon: 'ship' },
  { name: 'Safari', type: 'package', color: '#ca8a04', icon: 'paw' },
  { name: 'Mergulho', type: 'package', color: '#0284c7', icon: 'water' },
  { name: 'Esqui', type: 'package', color: '#94a3b8', icon: 'person-skiing' },
  { name: 'Trekking', type: 'package', color: '#84cc16', icon: 'person-walking' },
  { name: 'Pacote Completo', type: 'package', color: '#6366f1', icon: 'check-double' },
  { name: 'Promoção', type: 'package', color: '#ef4444', icon: 'tag' },
];

// Combina todas as tags
const allTags = [...destinationTags, ...packageTags];

// Prepara os dados para inserção
const tagsData = allTags.map(tag => ({
  name: tag.name,
  slug: generateSlug(tag.name),
  type: tag.type,
  description: `Tags para ${tag.type === 'destination' ? 'destinos' : 'pacotes'} do tipo ${tag.name}`,
  color: tag.color,
  icon: tag.icon,
  createdAt: generateISODate(),
  updatedAt: generateISODate()
}));

// Função para salvar os IDs das tags em um arquivo JSON
async function saveTagIds(tagIds) {
  const tagIdsPath = path.join(process.cwd(), 'scripts', 'tag-ids.json');
  fs.writeFileSync(tagIdsPath, JSON.stringify(tagIds, null, 2));
  console.log(`Tag IDs saved to ${tagIdsPath}`);
}

// Função principal para criar as tags
async function seedTags() {
  if (!TAGS_COLLECTION_ID) {
    console.error('Tags collection ID not found in .env.local');
    return;
  }

  console.log(`Creating ${tagsData.length} tags...`);
  
  // Verifica se já existem tags
  const tagExists = await documentExists(TAGS_COLLECTION_ID, 'name', tagsData[0].name);
  if (tagExists) {
    console.log('Tags already exist, skipping...');
    return;
  }
  
  // Cria as tags
  const tagIds = await createDocuments(TAGS_COLLECTION_ID, tagsData);
  console.log(`Created ${tagIds.length} tags successfully`);
  
  // Salva os IDs das tags
  await saveTagIds(tagIds);
}

// Executa a função principal
seedTags().catch(error => {
  console.error('Error seeding tags:', error);
});
