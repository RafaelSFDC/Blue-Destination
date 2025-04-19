require("dotenv").config({ path: ".env.local" });
import { Client, Databases, ID } from "node-appwrite";

// Inicializar o cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Dados de tags para serem inseridos
const tagsData = [
  {
    name: "Praia",
    slug: "praia",
    type: "destination",
    description: "Destinos com belas praias e atividades aquáticas"
  },
  {
    name: "Montanha",
    slug: "montanha",
    type: "destination",
    description: "Destinos com paisagens montanhosas e trilhas"
  },
  {
    name: "Cidade",
    slug: "cidade",
    type: "destination",
    description: "Destinos urbanos com atrações culturais"
  },
  {
    name: "Aventura",
    slug: "aventura",
    type: "activity",
    description: "Pacotes com atividades de aventura"
  },
  {
    name: "Relaxamento",
    slug: "relaxamento",
    type: "activity",
    description: "Pacotes focados em relaxamento e bem-estar"
  },
  {
    name: "Cultural",
    slug: "cultural",
    type: "activity",
    description: "Pacotes com foco em experiências culturais"
  },
  {
    name: "Família",
    slug: "familia",
    type: "audience",
    description: "Ideal para viagens em família"
  },
  {
    name: "Casal",
    slug: "casal",
    type: "audience",
    description: "Perfeito para casais e lua de mel"
  },
  {
    name: "Grupo",
    slug: "grupo",
    type: "audience",
    description: "Adequado para grupos de amigos"
  },
  {
    name: "Econômico",
    slug: "economico",
    type: "price",
    description: "Opções com melhor custo-benefício"
  },
  {
    name: "Premium",
    slug: "premium",
    type: "price",
    description: "Experiências de luxo e conforto"
  },
  {
    name: "All-Inclusive",
    slug: "all-inclusive",
    type: "package",
    description: "Pacotes com tudo incluído"
  }
];

// Função para adicionar tags ao banco de dados
async function seedTags() {
  try {
    console.log("Iniciando a inserção de tags...");
    
    // Armazenar os IDs das tags criadas para uso posterior
    const tagIds: Record<string, string> = {};
    
    for (const tag of tagsData) {
      try {
        // Verificar se a tag já existe pelo slug
        const existingTags = await databases.listDocuments(
          DATABASE_ID,
          "Tags",
          [
            `slug=${tag.slug}`
          ]
        );
        
        if (existingTags.total > 0) {
          console.log(`Tag '${tag.name}' já existe. Pulando...`);
          tagIds[tag.slug] = existingTags.documents[0].$id;
          continue;
        }
        
        // Criar a tag
        const newTag = await databases.createDocument(
          DATABASE_ID,
          "Tags",
          ID.unique(),
          tag
        );
        
        console.log(`Tag '${tag.name}' criada com sucesso. ID: ${newTag.$id}`);
        tagIds[tag.slug] = newTag.$id;
      } catch (error) {
        console.error(`Erro ao criar tag '${tag.name}':`, error);
      }
    }
    
    console.log("Inserção de tags concluída!");
    console.log("IDs das tags criadas:", tagIds);
    
    // Salvar os IDs das tags em um arquivo para uso posterior
    const fs = require('fs');
    fs.writeFileSync(
      'scripts/tag-ids.json', 
      JSON.stringify(tagIds, null, 2)
    );
    console.log("IDs das tags salvos em scripts/tag-ids.json");
    
    return tagIds;
  } catch (error) {
    console.error("Erro ao inserir tags:", error);
    return {};
  }
}

// Executar a função
seedTags();
