require("dotenv").config({ path: ".env.local" });
const { Client, Databases, ID, IndexType } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Declaração das variáveis de coleção no escopo global
let usersCollection: any;
let destinationsCollection: any;
let packagesCollection: any;
let bookingsCollection: any;
let testimonialsCollection: any;
let messagesCollection: any;
let tagsCollection: any;
let itineraryCollection: any;

// Função para criar todas as coleções primeiro
async function createAllCollections(): Promise<boolean> {
  try {
    // Users Collection
    usersCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Users",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Users
    await databases.createStringAttribute(
      DATABASE_ID,
      usersCollection.$id,
      "name",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      usersCollection.$id,
      "email",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      usersCollection.$id,
      "role",
      20,
      false, // mudando para false já que terá valor padrão
      "user"
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      usersCollection.$id,
      "avatar",
      255,
      false
    );

    // Destinations Collection
    destinationsCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Destinations",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Destinations
    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "name",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "description",
      5000,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "location",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "imageUrl",
      255,
      true
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "price",
      true,
      0,
      1000000
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "rating",
      true,
      0,
      5
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "reviewCount",
      true,
      0,
      1000000
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "featured",
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "region",
      50,
      true
    );

    // Removido o atributo de string "tags" pois será substituído por uma relação na função createRelationships

    // Packages Collection
    packagesCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Packages",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Packages
    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "name",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "description",
      5000,
      true
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "price",
      true,
      0,
      1000000
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "duration",
      true,
      1,
      365
    );

    // Removido o atributo de string "destinations" pois será substituído por uma relação na função createRelationships

    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "imageUrl",
      255,
      true
    );

    // Removido o atributo de string "tags" pois será substituído por uma relação na função createRelationships

    // Bookings Collection
    bookingsCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Bookings",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Bookings
    // Relações serão criadas na função createRelationships

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "startDate",
      true
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "numberOfPeople",
      true,
      1,
      100
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "totalPrice",
      true,
      0,
      1000000
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "status",
      20,
      false, // mudando para false já que terá valor padrão
      "pending"
    );

    // Testimonials Collection
    testimonialsCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Testimonials",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Testimonials
    // Relações serão criadas na função createRelationships

    await databases.createStringAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      "content",
      1000,
      true
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      "rating",
      true,
      1,
      5
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      "date",
      true
    );

    // Messages Collection
    messagesCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Messages",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Messages
    // Relações serão criadas na função createRelationships

    await databases.createStringAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      "subject",
      200,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      "content",
      5000,
      true
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      "date",
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      "status",
      20,
      false, // mudando para false já que terá valor padrão
      "unread"
    );

    // Itinerary Collection
    itineraryCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Itinerary",
      ['read("any")'],
      false,
      true
    );

    // Relações serão criadas na função createRelationships
    await databases.createIntegerAttribute(
      DATABASE_ID,
      itineraryCollection.$id,
      "day",
      true,
      1,
      365
    );
    await databases.createStringAttribute(
      DATABASE_ID,
      itineraryCollection.$id,
      "title",
      200,
      true
    );
    await databases.createStringAttribute(
      DATABASE_ID,
      itineraryCollection.$id,
      "description",
      5000,
      true
    );

    // O índice para relacionamento será criado depois que a relação for estabelecida

    // Tags Collection
    tagsCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Tags",
      ['read("any")'],
      false,
      true
    );

    // Criar atributos para Tags
    await databases.createStringAttribute(
      DATABASE_ID,
      tagsCollection.$id,
      "name",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      tagsCollection.$id,
      "slug",
      100,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      tagsCollection.$id,
      "type",
      20,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      tagsCollection.$id,
      "description",
      500,
      false
    );

    // Criar índice para Tags
    await databases.createIndex(
      DATABASE_ID,
      tagsCollection.$id,
      "slug_index",
      IndexType.Key,
      ["slug"],
      ["ASC"]
    );

    console.log("Coleções e atributos criados com sucesso!");
    return true;
  } catch (error) {
    console.error("Error creating collections:", error);
    return false;
  }
}

// Função para criar as relações entre as coleções
async function createRelationships() {
  try {
    console.log("Criando relação entre Destinations e Tags...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      tagsCollection.$id, // relatedCollectionId
      "manyToMany", // type
      false, // twoWay (opcional)
      "tags" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Packages e Tags...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      tagsCollection.$id, // relatedCollectionId
      "manyToMany", // type
      false, // twoWay (opcional)
      "tags" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Packages e Destinations...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      destinationsCollection.$id, // relatedCollectionId
      "manyToMany", // type
      false, // twoWay (opcional)
      "destinations" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Bookings e Users...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      usersCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "user" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Bookings e Packages...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      packagesCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "package" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Testimonials e Users...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      usersCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "user" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Testimonials e Packages...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      packagesCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "package" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Testimonials e Destinations...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      destinationsCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "destination" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Messages e Users...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      usersCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "user" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Criando relação entre Itinerary e Packages...");
    await databases.createRelationshipAttribute(
      DATABASE_ID,
      itineraryCollection.$id,
      packagesCollection.$id, // relatedCollectionId
      "manyToOne", // type
      false, // twoWay (opcional)
      "package" // key (opcional)
      // Removendo twoWayKey e onDelete para simplificar
    );

    console.log("Todas as relações foram criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar relações:", error);
    throw error;
  }
}

async function createIndices() {
  try {
    // Índices para Users
    await databases.createIndex(
      DATABASE_ID,
      usersCollection.$id,
      "email_index",
      IndexType.Key,
      ["email"],
      ["ASC"]
    );

    // Índices para Destinations
    await databases.createIndex(
      DATABASE_ID,
      destinationsCollection.$id,
      "region_index",
      IndexType.Key,
      ["region"],
      ["ASC"]
    );

    await databases.createIndex(
      DATABASE_ID,
      destinationsCollection.$id,
      "featured_index",
      IndexType.Key,
      ["featured"],
      ["ASC"]
    );

    // Índices para Packages
    await databases.createIndex(
      DATABASE_ID,
      packagesCollection.$id,
      "price_index",
      IndexType.Key,
      ["price"],
      ["ASC"]
    );

    // Índices para Bookings - removido índice para atributos de relacionamento

    await databases.createIndex(
      DATABASE_ID,
      bookingsCollection.$id,
      "status_index",
      IndexType.Key,
      ["status"],
      ["ASC"]
    );

    // Índices para Testimonials - removidos índices para atributos de relacionamento

    // Índices para Messages - removidos índices para atributos de relacionamento

    // Índices para Itinerary - removidos índices para atributos de relacionamento

    // Índice para day
    await databases.createIndex(
      DATABASE_ID,
      itineraryCollection.$id,
      "day_index",
      IndexType.Key,
      ["day"],
      ["ASC"]
    );

    // Adicionar índices adicionais para otimização
    async function createAdditionalIndices() {
      // Tags indices
      await databases.createIndex(
        DATABASE_ID,
        tagsCollection.$id,
        "type_index",
        IndexType.Key,
        ["type"],
        ["ASC"]
      );

      console.log(
        "Nota: Não é necessário criar índices para atributos de relacionamento,"
      );
      console.log(
        "pois o Appwrite já cria automaticamente índices para esses atributos."
      );
    }

    await createAdditionalIndices();

    console.log("Indices created successfully!");
  } catch (error) {
    console.error("Error creating indices:", error);
  }
}

// Função principal que coordena o processo de setup
async function setupCollections() {
  try {
    console.log("Iniciando a criação das coleções...");
    const collectionsCreated = await createAllCollections();

    if (collectionsCreated) {
      console.log("Criando relações entre coleções...");
      await createRelationships();

      console.log("Criando índices...");
      await createIndices();

      console.log("Setup concluído com sucesso!");
    } else {
      console.error(
        "Não foi possível criar as coleções. Abortando o processo."
      );
    }
  } catch (error) {
    console.error("Erro durante o setup:", error);
  }
}

// Executar o setup
setupCollections();
