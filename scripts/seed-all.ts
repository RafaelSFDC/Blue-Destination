require("dotenv").config({ path: ".env.local" });
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runScript(scriptPath: string): Promise<void> {
  console.log(`\n\n========== Executando ${scriptPath} ==========\n`);
  try {
    const { stdout, stderr } = await execPromise(`npx ts-node --project tsconfig.node.json ${scriptPath}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Erro ao executar ${scriptPath}:`, error);
    throw error;
  }
}

async function seedAll() {
  try {
    // Executar os scripts na ordem correta
    await runScript('scripts/seed-tags.ts');
    await runScript('scripts/seed-destinations.ts');
    await runScript('scripts/seed-packages.ts');
    
    console.log("\n\n========== Todos os scripts foram executados com sucesso! ==========\n");
  } catch (error) {
    console.error("Erro durante a execução dos scripts:", error);
    process.exit(1);
  }
}

// Executar a função principal
seedAll();
