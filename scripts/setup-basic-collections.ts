require("dotenv").config({ path: ".env" });
import { Client, Databases, ID, Query } from "node-appwrite";
import * as fs from "fs";
import * as path from "path";
import { collections, CollectionConfig } from "../const";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

async function createCollection(config: CollectionConfig): Promise<string> {
  try {
    console.log(`Checking if collection ${config.name} already exists...`);

    // Tenta listar coleções com o mesmo nome para verificar se já existe
    try {
      const existingCollections = await databases.listCollections(DATABASE_ID, [
        Query.equal("name", config.name),
      ]);

      if (existingCollections.total > 0) {
        console.log(
          `Collection ${config.name} already exists with ID: ${existingCollections.collections[0].$id}`
        );
        return existingCollections.collections[0].$id;
      }
    } catch (listError) {
      console.warn(
        `Could not check if collection ${config.name} exists:`,
        listError
      );
    }

    console.log(`Creating collection ${config.name}...`);
    const collection = await databases.createCollection(
      DATABASE_ID,
      ID.unique(),
      config.name,
      ['read("any")'],
      false,
      true
    );
    console.log(`Collection ${config.name} created with ID: ${collection.$id}`);

    for (const attr of config.attributes) {
      try {
        // Verifica se o atributo já existe
        try {
          const existingAttributes = await databases.listAttributes(
            DATABASE_ID,
            collection.$id
          );

          const attributeExists = existingAttributes.attributes.some(
            (existingAttr) => existingAttr.key === attr.name
          );

          if (attributeExists) {
            console.log(
              `Attribute ${attr.name} already exists for collection ${config.name}, skipping...`
            );
            continue;
          }
        } catch (listAttrError) {
          console.warn(
            `Could not check if attribute ${attr.name} exists for collection ${config.name}:`,
            listAttrError
          );
        }

        console.log(
          `Creating attribute ${attr.name} (${attr.type}) for collection ${config.name}...`
        );

        if (attr.type === "string") {
          await databases.createStringAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            attr.size!,
            attr.required ?? false,
            attr.default,
            attr.array
          );
        } else if (attr.type === "integer") {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            attr.required ?? false,
            attr.min,
            attr.max,
            attr.default,
            attr.array
          );
        } else if (attr.type === "double") {
          await databases.createFloatAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            attr.required ?? false,
            attr.min,
            attr.max,
            attr.default,
            attr.array
          );
        } else if (attr.type === "boolean") {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            attr.required ?? false,
            attr.default
          );
        } else if (attr.type === "datetime") {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            attr.required ?? false,
            attr.default
          );
        } else if (attr.type === "json") {
          // Para atributos JSON, usamos string com tamanho grande
          await databases.createStringAttribute(
            DATABASE_ID,
            collection.$id,
            attr.name,
            10000, // Tamanho grande para acomodar objetos JSON
            attr.required ?? false,
            attr.default ? JSON.stringify(attr.default) : undefined,
            attr.array
          );
        }

        console.log(
          `Attribute ${attr.name} created successfully for collection ${config.name}`
        );
      } catch (attrError) {
        console.error(
          `Error creating attribute ${attr.name} for collection ${config.name}:`,
          attrError
        );
        // Continue with other attributes even if one fails
      }
    }

    console.log(
      `All attributes for collection ${config.name} created successfully`
    );
    return collection.$id;
  } catch (error) {
    console.error(`Error creating collection ${config.name}:`, error);
    throw error;
  }
}

async function updateEnvFile(collectionIds: Record<string, string>) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, "utf8")
      : "";

    for (const [key, value] of Object.entries(collectionIds)) {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const newLine = `${key}=${value}`;

      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, newLine);
      } else {
        envContent += `\n${newLine}`;
      }
    }

    fs.writeFileSync(envPath, envContent.trim() + "\n");
    console.log("Environment file updated successfully");
  } catch (error) {
    console.error("Error updating environment file:", error);
    throw error;
  }
}

async function setupCollections() {
  const collectionIds: Record<string, string> = {};
  const failedCollections: string[] = [];

  for (const config of collections) {
    try {
      const collectionId = await createCollection(config);
      collectionIds[config.envKey] = collectionId;
    } catch (error) {
      console.error(`Failed to create collection ${config.name}:`, error);
      failedCollections.push(config.name);
    }
  }

  try {
    if (Object.keys(collectionIds).length > 0) {
      await updateEnvFile(collectionIds);
      console.log("Environment file updated with collection IDs");
    }

    if (failedCollections.length === 0) {
      console.log("All collections created successfully");
    } else {
      console.log(
        `Created ${Object.keys(collectionIds).length} collections successfully`
      );
      console.log(
        `Failed to create ${
          failedCollections.length
        } collections: ${failedCollections.join(", ")}`
      );
    }

    console.log("Collection IDs:", collectionIds);
  } catch (error) {
    console.error("Error updating environment file:", error);
  }
}

setupCollections();
