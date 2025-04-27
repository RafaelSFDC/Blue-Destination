require("dotenv").config({ path: ".env" });
import { execSync } from "child_process";
import * as path from "path";

// Lista de scripts de seed em ordem de execução
const seedScripts = [
  "01-seed-tags.ts",
  "02-seed-users.ts",
  "03-seed-destinations.ts",
  "04-seed-packages.ts",
  "08-seed-accommodations.ts",
  "09-seed-activities.ts",
  "10-seed-availability.ts",
  "11-seed-discounts.ts",
  "12-seed-meals.ts",
  "05-seed-itineraries.ts",
  "13-seed-testimonials.ts",
  "06-seed-testimonials.ts",
  "07-seed-bookings.ts",
];

// Função para executar um script
function runScript(scriptName: string) {
  console.log(`\n========== RUNNING ${scriptName} ==========\n`);
  try {
    execSync(`npx ts-node ${path.join("scripts", "seeds", scriptName)}`, {
      stdio: "inherit",
      env: process.env,
    });
    console.log(`\n========== COMPLETED ${scriptName} ==========\n`);
    return true;
  } catch (error) {
    console.error(`\n========== ERROR IN ${scriptName} ==========\n`);
    console.error(error);
    return false;
  }
}

// Função principal para executar todos os scripts
async function runAllSeeds() {
  console.log("Starting seed process...");

  let success = true;
  for (const script of seedScripts) {
    const result = runScript(script);
    if (!result) {
      success = false;
      console.error(`Failed to run ${script}. Continuing with next script...`);
    }
  }

  if (success) {
    console.log("\n========== ALL SEEDS COMPLETED SUCCESSFULLY ==========\n");
  } else {
    console.log("\n========== SEED PROCESS COMPLETED WITH ERRORS ==========\n");
    console.log("Check the logs above for details on the errors.");
  }
}

// Executa a função principal
runAllSeeds().catch((error) => {
  console.error("Unhandled error in seed process:", error);
});
