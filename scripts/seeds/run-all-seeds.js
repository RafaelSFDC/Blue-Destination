require("dotenv").config({ path: ".env" });
const { execSync } = require("child_process");
const path = require("path");

// Lista de scripts de seed em ordem de execução
const seedScripts = [
  "01-seed-tags.js",
  "02-seed-users.js",
  "03-seed-destinations.js",
  "04-seed-packages.js",
  "08-seed-accommodations.js",
  "09-seed-activities.js",
  "10-seed-availability.js",
  "11-seed-discounts.js",
  "12-seed-meals.js",
  "05-seed-itineraries.js",
  "13-seed-testimonials.js",
  "06-seed-testimonials.js",
  "07-seed-bookings.js",
];

// Função para executar um script
function runScript(scriptName) {
  console.log(`\n========== RUNNING ${scriptName} ==========\n`);
  try {
    execSync(`node ${path.join("scripts", "seeds", scriptName)}`, {
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
