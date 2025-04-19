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

async function setupCollections() {
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

    await databases.createStringAttribute(
      DATABASE_ID,
      destinationsCollection.$id,
      "tags",
      50,
      true,
      undefined,
      true
    );

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

    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "destinations",
      36,
      true,
      undefined,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "imageUrl",
      255,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      packagesCollection.$id,
      "tags",
      50,
      true,
      undefined,
      true
    );

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
    await databases.createStringAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "userId",
      36,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      bookingsCollection.$id,
      "packageId",
      36,
      true
    );

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
    await databases.createStringAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      "userId",
      36,
      true
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      testimonialsCollection.$id,
      "packageId",
      36,
      true
    );

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
    await databases.createStringAttribute(
      DATABASE_ID,
      messagesCollection.$id,
      "userId",
      36,
      true
    );

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
    const itineraryCollection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      "Itinerary",
      ['read("any")'],
      false,
      true
    );

    await databases.createStringAttribute(DATABASE_ID, itineraryCollection.$id, "packageId", 36, true);
    await databases.createIntegerAttribute(DATABASE_ID, itineraryCollection.$id, "day", true, 1, 365);
    await databases.createStringAttribute(DATABASE_ID, itineraryCollection.$id, "title", 200, true);
    await databases.createStringAttribute(DATABASE_ID, itineraryCollection.$id, "description", 5000, true);

    // Criar índice para relacionamento
    await databases.createIndex(
      DATABASE_ID,
      itineraryCollection.$id,
      "package_day_index",
      IndexType.Key,
      ["packageId", "day"],
      ["ASC", "ASC"]
    );

    // Criar índices
    await createIndices();

    console.log("Collections and attributes created successfully!");
  } catch (error) {
    console.error("Error creating collections:", error);
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

    // Índices para Bookings
    await databases.createIndex(
      DATABASE_ID,
      bookingsCollection.$id,
      "user_package_index",
      IndexType.Key,
      ["userId", "packageId"],
      ["ASC", "ASC"]
    );

    await databases.createIndex(
      DATABASE_ID,
      bookingsCollection.$id,
      "status_index",
      IndexType.Key,
      ["status"],
      ["ASC"]
    );

    console.log("Indices created successfully!");
  } catch (error) {
    console.error("Error creating indices:", error);
  }
}

// Executar o setup
setupCollections();



