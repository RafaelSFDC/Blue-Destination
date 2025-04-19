require("dotenv").config({ path: ".env.local" });
import { Client, Databases, ID, Query } from "node-appwrite";
import * as fs from "fs";
import * as path from "path";

// Inicializar o cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const DESTINATIONS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_COLLECTION_DESTINATIONS!;
const TAGS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_TAGS!;

// Carregar os IDs das tags do arquivo gerado pelo script seed-tags.ts
let tagIds: Record<string, string> = {};
try {
  const tagIdsPath = path.join(__dirname, "tag-ids.json");
  if (fs.existsSync(tagIdsPath)) {
    tagIds = JSON.parse(fs.readFileSync(tagIdsPath, "utf8"));
  } else {
    console.warn(
      "Arquivo tag-ids.json não encontrado. Execute o script seed-tags.ts primeiro."
    );
  }
} catch (error) {
  console.error("Erro ao carregar os IDs das tags:", error);
}

// Dados de destinos para serem inseridos
const destinationsData = [
  {
    name: "Rio de Janeiro",
    location: "Rio de Janeiro, Brasil",
    description:
      "Cidade maravilhosa com praias deslumbrantes, o Cristo Redentor e uma vida noturna vibrante.",
    price: 1500,
    rating: 4.7,
    reviewCount: 1250,
    imageUrl: "https://source.unsplash.com/random/800x600/?rio",
    featured: true,
    region: "Sudeste",
    tagSlugs: ["praia", "cidade", "cultural"], // Será convertido para tagIds
  },
  {
    name: "Fernando de Noronha",
    location: "Pernambuco, Brasil",
    description:
      "Arquipélago paradisíaco com as mais belas praias do Brasil, ideal para mergulho e contato com a natureza.",
    price: 3200,
    rating: 4.9,
    reviewCount: 850,
    imageUrl: "https://source.unsplash.com/random/800x600/?noronha",
    featured: true,
    region: "Nordeste",
    tagSlugs: ["praia", "relaxamento", "premium"],
  },
  {
    name: "Gramado",
    location: "Rio Grande do Sul, Brasil",
    description:
      "Cidade com arquitetura europeia, gastronomia refinada e atrações para toda a família.",
    price: 1800,
    rating: 4.8,
    reviewCount: 1100,
    imageUrl: "https://source.unsplash.com/random/800x600/?gramado",
    featured: true,
    region: "Sul",
    tagSlugs: ["montanha", "familia", "cultural"],
  },
  {
    name: "Chapada dos Veadeiros",
    location: "Goiás, Brasil",
    description:
      "Parque nacional com cachoeiras cristalinas, trilhas e paisagens de tirar o fôlego.",
    price: 1200,
    rating: 4.6,
    reviewCount: 780,
    imageUrl: "https://source.unsplash.com/random/800x600/?chapada",
    featured: false,
    region: "Centro-Oeste",
    tagSlugs: ["montanha", "aventura", "economico"],
  },
  {
    name: "Salvador",
    location: "Bahia, Brasil",
    description:
      "Capital baiana com rica história, cultura afro-brasileira, praias e culinária única.",
    price: 1400,
    rating: 4.5,
    reviewCount: 950,
    imageUrl: "https://source.unsplash.com/random/800x600/?salvador",
    featured: false,
    region: "Nordeste",
    tagSlugs: ["praia", "cidade", "cultural"],
  },
  {
    name: "Bonito",
    location: "Mato Grosso do Sul, Brasil",
    description:
      "Destino ecoturístico com rios de águas cristalinas, grutas e rica biodiversidade.",
    price: 1600,
    rating: 4.7,
    reviewCount: 820,
    imageUrl: "https://source.unsplash.com/random/800x600/?bonito",
    featured: false,
    region: "Centro-Oeste",
    tagSlugs: ["aventura", "familia", "economico"],
  },
  {
    name: "Jericoacoara",
    location: "Ceará, Brasil",
    description:
      "Vila de pescadores transformada em paraíso turístico, com dunas, lagoas e pôr do sol inesquecível.",
    price: 2200,
    rating: 4.8,
    reviewCount: 760,
    imageUrl: "https://source.unsplash.com/random/800x600/?jericoacoara",
    featured: true,
    region: "Nordeste",
    tagSlugs: ["praia", "relaxamento", "casal"],
  },
  {
    name: "Foz do Iguaçu",
    location: "Paraná, Brasil",
    description:
      "Lar das impressionantes Cataratas do Iguaçu e da Usina de Itaipu.",
    price: 1700,
    rating: 4.9,
    reviewCount: 1300,
    imageUrl: "https://source.unsplash.com/random/800x600/?iguacu",
    featured: true,
    region: "Sul",
    tagSlugs: ["aventura", "familia", "all-inclusive"],
  },
];

// Função para adicionar destinos ao banco de dados
async function seedDestinations() {
  try {
    console.log("Iniciando a inserção de destinos...");

    // Armazenar os IDs dos destinos criados para uso posterior
    const destinationIds: Record<string, string> = {};

    for (const destination of destinationsData) {
      try {
        // Extrair os slugs das tags e converter para IDs
        const { tagSlugs, ...destinationData } = destination;

        // Verificar se o destino já existe pelo nome
        const existingDestinations = await databases.listDocuments(
          DATABASE_ID,
          DESTINATIONS_COLLECTION_ID,
          [Query.equal("name", destination.name)]
        );

        if (existingDestinations.total > 0) {
          console.log(
            `Destino '${destination.name}' já existe. Atualizando...`
          );

          // Converter slugs de tags para IDs
          const tagIdsArray = tagSlugs
            .map((slug) => tagIds[slug])
            .filter((id) => id !== undefined);

          // Atualizar o destino existente
          await databases.updateDocument(
            DATABASE_ID,
            DESTINATIONS_COLLECTION_ID,
            existingDestinations.documents[0].$id,
            {
              ...destinationData,
              tags: tagIdsArray, // Relação com Tags
            }
          );

          destinationIds[destination.name] =
            existingDestinations.documents[0].$id;
          console.log(`Destino '${destination.name}' atualizado com sucesso.`);
          continue;
        }

        // Converter slugs de tags para IDs
        const tagIdsArray = tagSlugs
          .map((slug) => tagIds[slug])
          .filter((id) => id !== undefined);

        // Criar o destino
        const newDestination = await databases.createDocument(
          DATABASE_ID,
          DESTINATIONS_COLLECTION_ID,
          ID.unique(),
          {
            ...destinationData,
            tags: tagIdsArray, // Relação com Tags
          }
        );

        console.log(
          `Destino '${destination.name}' criado com sucesso. ID: ${newDestination.$id}`
        );
        destinationIds[destination.name] = newDestination.$id;
      } catch (error) {
        console.error(`Erro ao criar destino '${destination.name}':`, error);
      }
    }

    console.log("Inserção de destinos concluída!");
    console.log("IDs dos destinos criados:", destinationIds);

    // Salvar os IDs dos destinos em um arquivo para uso posterior
    fs.writeFileSync(
      path.join(__dirname, "destination-ids.json"),
      JSON.stringify(destinationIds, null, 2)
    );
    console.log("IDs dos destinos salvos em scripts/destination-ids.json");

    return destinationIds;
  } catch (error) {
    console.error("Erro ao inserir destinos:", error);
    return {};
  }
}

// Executar a função
seedDestinations();
