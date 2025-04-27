require("dotenv").config({ path: ".env.local" });
import {
  loadCollectionIds,
  createDocuments,
  documentExists,
  generateISODate,
  generateFutureTravelDate,
  faker,
  getRandomDocuments,
  getDatabases,
} from "./utils";

// Inicializa o cliente Appwrite
const databases = getDatabases();
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Carrega os IDs das coleções
const collectionIds = loadCollectionIds();
const BOOKINGS_COLLECTION_ID = collectionIds["NEXT_PUBLIC_COLLECTION_BOOKINGS"];
const USERS_COLLECTION_ID = collectionIds["NEXT_PUBLIC_COLLECTION_USERS"];
const PACKAGES_COLLECTION_ID = collectionIds["NEXT_PUBLIC_COLLECTION_PACKAGES"];
const PAYMENTS_COLLECTION_ID = collectionIds["NEXT_PUBLIC_COLLECTION_PAYMENTS"];
const PASSENGERS_COLLECTION_ID =
  collectionIds["NEXT_PUBLIC_COLLECTION_PASSENGERS"];

// Número de reservas a serem criadas
const NUM_BOOKINGS = 40;

// Função para criar passageiros
async function createPassengers(numPassengers: number) {
  if (!PASSENGERS_COLLECTION_ID) {
    console.error("Passengers collection ID not found in .env.local");
    return [];
  }

  console.log(`Creating ${numPassengers} passengers...`);

  // Prepara os dados para inserção
  const passengersData = Array.from({ length: numPassengers }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ min: 18, max: 70, mode: "age" });

    return {
      name: `${firstName} ${lastName}`,
      document: faker.helpers.replaceSymbols("###.###.###-##"),
      birthDate: birthDate.toISOString(),
      specialNeeds: faker.helpers.maybe(
        () =>
          faker.helpers.arrayElement([
            "Cadeira de rodas",
            "Restrição alimentar",
            "Assistência médica",
            "Acessibilidade",
            "Alergias",
          ]),
        { probability: 0.15 }
      ),
      createdAt: generateISODate(),
      updatedAt: generateISODate(),
    };
  });

  // Cria os passageiros
  const passengerIds = await createDocuments(
    PASSENGERS_COLLECTION_ID,
    passengersData
  );
  console.log(`Created ${passengerIds.length} passengers successfully`);

  return passengerIds;
}

// Função para criar pagamentos
async function createPayment(
  bookingId: string,
  amount: number,
  status: string
) {
  if (!PAYMENTS_COLLECTION_ID) {
    console.error("Payments collection ID not found in .env.local");
    return null;
  }

  // Prepara os dados para inserção
  const paymentData = {
    booking: bookingId,
    amount,
    method: faker.helpers.arrayElement([
      "Cartão de Crédito",
      "Cartão de Débito",
      "Transferência Bancária",
      "PayPal",
      "Pix",
    ]),
    status,
    createdAt: generateISODate(),
    updatedAt: generateISODate(),
  };

  // Cria o pagamento
  try {
    const paymentId = await createDocuments(PAYMENTS_COLLECTION_ID, [
      paymentData,
    ]);
    return paymentId[0];
  } catch (error) {
    console.error("Error creating payment:", error);
    return null;
  }
}

// Função principal para criar as reservas
async function seedBookings() {
  if (!BOOKINGS_COLLECTION_ID) {
    console.error("Bookings collection ID not found in .env.local");
    return;
  }

  console.log(`Creating ${NUM_BOOKINGS} bookings...`);

  // Verifica se já existem reservas
  const bookingExists = await documentExists(
    BOOKINGS_COLLECTION_ID,
    "status",
    "confirmed"
  );
  if (bookingExists) {
    console.log("Bookings already exist, skipping...");
    return;
  }

  // Obtém usuários e pacotes
  let users: any[] = [];
  let packages: any[] = [];

  try {
    users = await getRandomDocuments(USERS_COLLECTION_ID, 100);
    if (users.length === 0) {
      console.warn("No users found. Run seed-users.ts first.");
      return;
    }

    packages = await getRandomDocuments(PACKAGES_COLLECTION_ID, 100);
    if (packages.length === 0) {
      console.warn("No packages found. Run seed-packages.ts first.");
      return;
    }
  } catch (error) {
    console.error("Error getting data for bookings:", error);
    return;
  }

  // Prepara os dados para inserção
  for (let i = 0; i < NUM_BOOKINGS; i++) {
    const user = faker.helpers.arrayElement(users);
    const pkg = faker.helpers.arrayElement(packages);
    const travelers = faker.number.int({ min: 1, max: 5 });
    const totalPrice = pkg.price * travelers;

    // Status da reserva com distribuição ponderada
    const status = faker.helpers.weightedArrayElement([
      { weight: 40, value: "confirmed" },
      { weight: 30, value: "completed" },
      { weight: 20, value: "pending" },
      { weight: 10, value: "cancelled" },
    ]);

    // Status do pagamento baseado no status da reserva
    let paymentStatus;
    if (status === "confirmed" || status === "completed") {
      paymentStatus = "paid";
    } else if (status === "cancelled") {
      paymentStatus = faker.helpers.arrayElement(["refunded", "failed"]);
    } else {
      paymentStatus = "pending";
    }

    // Cria passageiros
    const passengerIds = await createPassengers(travelers);

    // Prepara os dados da reserva
    const bookingData = {
      user: user.$id,
      packages: pkg.$id,
      status,
      bookingDate: generateISODate(faker.number.int({ min: -90, max: -1 })),
      travelDate: generateFutureTravelDate(),
      travelers,
      totalPrice,
      Passengers: passengerIds,
      createdAt: generateISODate(),
      updatedAt: generateISODate(),
      // O campo payment será atualizado após criar o pagamento
    };

    // Cria a reserva
    try {
      const bookingIds = await createDocuments(BOOKINGS_COLLECTION_ID, [
        bookingData,
      ]);
      const bookingId = bookingIds[0];

      // Cria o pagamento associado à reserva
      const paymentId = await createPayment(
        bookingId,
        totalPrice,
        paymentStatus
      );

      // Atualiza a reserva com o ID do pagamento
      if (paymentId) {
        try {
          // Atualiza o documento da reserva para incluir o ID do pagamento
          await databases.updateDocument(
            DATABASE_ID,
            BOOKINGS_COLLECTION_ID,
            bookingId,
            { payment: paymentId }
          );
          console.log(`Created booking #${i + 1} with payment successfully`);
        } catch (updateError) {
          console.error(
            `Error updating booking #${i + 1} with payment ID:`,
            updateError
          );
          console.log(`Created booking #${i + 1} but failed to link payment`);
        }
      } else {
        console.log(`Created booking #${i + 1} without payment`);
      }
    } catch (error) {
      console.error(`Error creating booking #${i + 1}:`, error);
    }
  }

  console.log("Finished creating bookings");
}

// Executa a função principal
seedBookings().catch((error) => {
  console.error("Error seeding bookings:", error);
});
