require("dotenv").config({ path: ".env.local" });
import { Client, Databases, ID, Query } from "node-appwrite";
import * as fs from 'fs';
import * as path from 'path';

// Inicializar o cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Carregar os IDs das tags e destinos dos arquivos gerados pelos scripts anteriores
let tagIds: Record<string, string> = {};
let destinationIds: Record<string, string> = {};

try {
  const tagIdsPath = path.join(__dirname, 'tag-ids.json');
  if (fs.existsSync(tagIdsPath)) {
    tagIds = JSON.parse(fs.readFileSync(tagIdsPath, 'utf8'));
  } else {
    console.warn("Arquivo tag-ids.json não encontrado. Execute o script seed-tags.ts primeiro.");
  }
  
  const destinationIdsPath = path.join(__dirname, 'destination-ids.json');
  if (fs.existsSync(destinationIdsPath)) {
    destinationIds = JSON.parse(fs.readFileSync(destinationIdsPath, 'utf8'));
  } else {
    console.warn("Arquivo destination-ids.json não encontrado. Execute o script seed-destinations.ts primeiro.");
  }
} catch (error) {
  console.error("Erro ao carregar os IDs:", error);
}

// Dados de pacotes para serem inseridos
const packagesData = [
  {
    name: "Rio de Janeiro Completo",
    description: "Pacote completo para conhecer o melhor do Rio de Janeiro, incluindo visitas ao Cristo Redentor, Pão de Açúcar, praias e muito mais.",
    destinationNames: ["Rio de Janeiro"],
    duration: 5,
    price: 2500,
    discount: 10,
    imageUrl: "https://source.unsplash.com/random/800x600/?rio",
    featured: true,
    inclusions: [
      "Hospedagem em hotel 4 estrelas",
      "Café da manhã",
      "Transfer aeroporto-hotel-aeroporto",
      "City tour com guia local",
      "Ingresso para o Cristo Redentor",
      "Ingresso para o Pão de Açúcar"
    ],
    tagSlugs: ["cidade", "cultural", "all-inclusive"],
    itinerary: [
      {
        day: 1,
        title: "Chegada e Reconhecimento",
        description: "Chegada ao Rio de Janeiro, transfer para o hotel e tempo livre para conhecer os arredores."
      },
      {
        day: 2,
        title: "Cristo Redentor e Centro Histórico",
        description: "Visita ao Cristo Redentor pela manhã e tour pelo centro histórico à tarde."
      },
      {
        day: 3,
        title: "Pão de Açúcar e Praias",
        description: "Visita ao Pão de Açúcar pela manhã e tarde livre nas praias de Copacabana e Ipanema."
      },
      {
        day: 4,
        title: "Maracanã e Lapa",
        description: "Tour pelo estádio do Maracanã e noite livre para conhecer a vida noturna da Lapa."
      },
      {
        day: 5,
        title: "Despedida",
        description: "Tempo livre para compras e retorno."
      }
    ]
  },
  {
    name: "Paraíso em Noronha",
    description: "Pacote exclusivo para Fernando de Noronha, com passeios de barco, mergulho e tempo livre para curtir as praias paradisíacas.",
    destinationNames: ["Fernando de Noronha"],
    duration: 7,
    price: 5800,
    discount: 0,
    imageUrl: "https://source.unsplash.com/random/800x600/?noronha",
    featured: true,
    inclusions: [
      "Hospedagem em pousada premium",
      "Café da manhã e jantar",
      "Transfer aeroporto-pousada-aeroporto",
      "Taxa de preservação ambiental",
      "Passeio de barco ao redor da ilha",
      "Aula de mergulho com cilindro"
    ],
    tagSlugs: ["praia", "relaxamento", "premium", "casal"],
    itinerary: [
      {
        day: 1,
        title: "Chegada ao Paraíso",
        description: "Chegada a Fernando de Noronha, transfer para a pousada e briefing sobre a estadia."
      },
      {
        day: 2,
        title: "Baía do Sancho",
        description: "Visita à Baía do Sancho, eleita várias vezes a praia mais bonita do mundo."
      },
      {
        day: 3,
        title: "Mergulho em Águas Cristalinas",
        description: "Aula e passeio de mergulho com cilindro para observar a rica vida marinha."
      },
      {
        day: 4,
        title: "Passeio de Barco",
        description: "Passeio de barco ao redor da ilha com paradas para mergulho de snorkel."
      },
      {
        day: 5,
        title: "Praia do Leão",
        description: "Visita à Praia do Leão e observação do pôr do sol no Forte de Nossa Senhora dos Remédios."
      },
      {
        day: 6,
        title: "Dia Livre",
        description: "Dia livre para atividades opcionais ou relaxamento."
      },
      {
        day: 7,
        title: "Despedida",
        description: "Últimos momentos na ilha e retorno."
      }
    ]
  },
  {
    name: "Circuito Sul",
    description: "Pacote que combina o melhor do Sul do Brasil, incluindo Gramado, Canela e Foz do Iguaçu.",
    destinationNames: ["Gramado", "Foz do Iguaçu"],
    duration: 8,
    price: 3200,
    discount: 15,
    imageUrl: "https://source.unsplash.com/random/800x600/?gramado",
    featured: true,
    inclusions: [
      "Hospedagem em hotéis 4 estrelas",
      "Café da manhã",
      "Traslados entre cidades",
      "City tour em Gramado e Canela",
      "Ingresso para o Parque Nacional do Iguaçu",
      "Passeio de barco nas Cataratas"
    ],
    tagSlugs: ["montanha", "aventura", "familia", "all-inclusive"],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Gramado",
        description: "Chegada a Gramado e check-in no hotel."
      },
      {
        day: 2,
        title: "Gramado e Canela",
        description: "City tour por Gramado e Canela, visitando o Lago Negro, Mini Mundo e Catedral de Pedra."
      },
      {
        day: 3,
        title: "Parques Temáticos",
        description: "Visita ao Snowland e ao Parque Mundo a Vapor."
      },
      {
        day: 4,
        title: "Rota do Chocolate",
        description: "Passeio pela Rota do Chocolate com visitas às fábricas e degustação."
      },
      {
        day: 5,
        title: "Traslado para Foz do Iguaçu",
        description: "Viagem para Foz do Iguaçu e check-in no hotel."
      },
      {
        day: 6,
        title: "Cataratas Lado Brasileiro",
        description: "Visita às Cataratas do Iguaçu pelo lado brasileiro."
      },
      {
        day: 7,
        title: "Cataratas Lado Argentino",
        description: "Visita às Cataratas do Iguaçu pelo lado argentino."
      },
      {
        day: 8,
        title: "Despedida",
        description: "Visita à Usina de Itaipu e retorno."
      }
    ]
  },
  {
    name: "Aventura na Chapada",
    description: "Pacote de aventura na Chapada dos Veadeiros, com trilhas, cachoeiras e contato com a natureza.",
    destinationNames: ["Chapada dos Veadeiros"],
    duration: 4,
    price: 1800,
    discount: 0,
    imageUrl: "https://source.unsplash.com/random/800x600/?chapada",
    featured: false,
    inclusions: [
      "Hospedagem em pousada ecológica",
      "Café da manhã",
      "Transfer de/para Alto Paraíso",
      "Guia especializado para trilhas",
      "Equipamentos de segurança"
    ],
    tagSlugs: ["montanha", "aventura", "economico", "grupo"],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Alto Paraíso",
        description: "Chegada a Alto Paraíso de Goiás, transfer para a pousada e briefing sobre as trilhas."
      },
      {
        day: 2,
        title: "Vale da Lua",
        description: "Trilha para o Vale da Lua e banho nas piscinas naturais."
      },
      {
        day: 3,
        title: "Cachoeira Santa Bárbara",
        description: "Visita à deslumbrante Cachoeira Santa Bárbara e Cachoeira Capivara."
      },
      {
        day: 4,
        title: "Retorno",
        description: "Última trilha curta pela manhã e retorno."
      }
    ]
  },
  {
    name: "Salvador Cultural",
    description: "Pacote focado na rica cultura e história de Salvador, com visitas ao Pelourinho, igrejas históricas e experiências gastronômicas.",
    destinationNames: ["Salvador"],
    duration: 5,
    price: 2100,
    discount: 5,
    imageUrl: "https://source.unsplash.com/random/800x600/?salvador",
    featured: false,
    inclusions: [
      "Hospedagem em hotel no centro histórico",
      "Café da manhã",
      "Transfer aeroporto-hotel-aeroporto",
      "City tour pelo Pelourinho",
      "Aula de capoeira",
      "Jantar com show folclórico"
    ],
    tagSlugs: ["cidade", "cultural", "economico"],
    itinerary: [
      {
        day: 1,
        title: "Chegada a Salvador",
        description: "Chegada a Salvador, transfer para o hotel e passeio inicial pelo Pelourinho."
      },
      {
        day: 2,
        title: "Centro Histórico",
        description: "Tour completo pelo centro histórico, visitando igrejas, museus e o Elevador Lacerda."
      },
      {
        day: 3,
        title: "Cultura Afro-Brasileira",
        description: "Visita ao Mercado Modelo, aula de capoeira e jantar com show folclórico."
      },
      {
        day: 4,
        title: "Praias de Salvador",
        description: "Passeio pelas praias de Salvador, incluindo o Rio Vermelho e Itapuã."
      },
      {
        day: 5,
        title: "Despedida",
        description: "Tempo livre para compras de artesanato e retorno."
      }
    ]
  }
];

// Função para adicionar pacotes ao banco de dados
async function seedPackages() {
  try {
    console.log("Iniciando a inserção de pacotes...");
    
    // Armazenar os IDs dos pacotes criados para uso posterior
    const packageIds: Record<string, string> = {};
    
    for (const packageItem of packagesData) {
      try {
        // Extrair os slugs das tags e nomes dos destinos e converter para IDs
        const { tagSlugs, destinationNames, itinerary, ...packageData } = packageItem;
        
        // Verificar se o pacote já existe pelo nome
        const existingPackages = await databases.listDocuments(
          DATABASE_ID,
          "Packages",
          [
            Query.equal("name", packageItem.name)
          ]
        );
        
        // Converter slugs de tags para IDs
        const tagIdsArray = tagSlugs
          .map(slug => tagIds[slug])
          .filter(id => id !== undefined);
        
        // Converter nomes de destinos para IDs
        const destinationIdsArray = destinationNames
          .map(name => destinationIds[name])
          .filter(id => id !== undefined);
        
        if (existingPackages.total > 0) {
          console.log(`Pacote '${packageItem.name}' já existe. Atualizando...`);
          
          // Atualizar o pacote existente
          await databases.updateDocument(
            DATABASE_ID,
            "Packages",
            existingPackages.documents[0].$id,
            {
              ...packageData,
              tags: tagIdsArray, // Relação com Tags
              destinations: destinationIdsArray // Relação com Destinations
            }
          );
          
          // Atualizar ou criar itinerários
          await updateItinerary(existingPackages.documents[0].$id, itinerary);
          
          packageIds[packageItem.name] = existingPackages.documents[0].$id;
          console.log(`Pacote '${packageItem.name}' atualizado com sucesso.`);
          continue;
        }
        
        // Criar o pacote
        const newPackage = await databases.createDocument(
          DATABASE_ID,
          "Packages",
          ID.unique(),
          {
            ...packageData,
            tags: tagIdsArray, // Relação com Tags
            destinations: destinationIdsArray // Relação com Destinations
          }
        );
        
        // Criar itinerários
        await createItinerary(newPackage.$id, itinerary);
        
        console.log(`Pacote '${packageItem.name}' criado com sucesso. ID: ${newPackage.$id}`);
        packageIds[packageItem.name] = newPackage.$id;
      } catch (error) {
        console.error(`Erro ao criar pacote '${packageItem.name}':`, error);
      }
    }
    
    console.log("Inserção de pacotes concluída!");
    console.log("IDs dos pacotes criados:", packageIds);
    
    // Salvar os IDs dos pacotes em um arquivo para uso posterior
    fs.writeFileSync(
      path.join(__dirname, 'package-ids.json'), 
      JSON.stringify(packageIds, null, 2)
    );
    console.log("IDs dos pacotes salvos em scripts/package-ids.json");
    
    return packageIds;
  } catch (error) {
    console.error("Erro ao inserir pacotes:", error);
    return {};
  }
}

// Função para criar itinerários para um pacote
async function createItinerary(packageId: string, itineraryItems: any[]) {
  for (const item of itineraryItems) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        "Itinerary",
        ID.unique(),
        {
          package: packageId, // Relação com Packages
          day: item.day,
          title: item.title,
          description: item.description
        }
      );
    } catch (error) {
      console.error(`Erro ao criar itinerário para o dia ${item.day}:`, error);
    }
  }
}

// Função para atualizar itinerários de um pacote
async function updateItinerary(packageId: string, itineraryItems: any[]) {
  try {
    // Buscar itinerários existentes
    const existingItineraries = await databases.listDocuments(
      DATABASE_ID,
      "Itinerary",
      [
        Query.equal("package", packageId)
      ]
    );
    
    // Criar um mapa dos itinerários existentes por dia
    const existingItineraryMap = new Map();
    for (const item of existingItineraries.documents) {
      existingItineraryMap.set(item.day, item);
    }
    
    // Atualizar ou criar itinerários
    for (const item of itineraryItems) {
      if (existingItineraryMap.has(item.day)) {
        // Atualizar itinerário existente
        const existingItem = existingItineraryMap.get(item.day);
        await databases.updateDocument(
          DATABASE_ID,
          "Itinerary",
          existingItem.$id,
          {
            title: item.title,
            description: item.description
          }
        );
      } else {
        // Criar novo itinerário
        await databases.createDocument(
          DATABASE_ID,
          "Itinerary",
          ID.unique(),
          {
            package: packageId,
            day: item.day,
            title: item.title,
            description: item.description
          }
        );
      }
    }
    
    // Remover itinerários que não estão mais no array
    const currentDays = itineraryItems.map(item => item.day);
    for (const [day, item] of existingItineraryMap.entries()) {
      if (!currentDays.includes(day)) {
        await databases.deleteDocument(
          DATABASE_ID,
          "Itinerary",
          item.$id
        );
      }
    }
  } catch (error) {
    console.error(`Erro ao atualizar itinerários para o pacote ${packageId}:`, error);
  }
}

// Executar a função
seedPackages();
