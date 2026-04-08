import { copyFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const workspaceRoot = path.resolve(currentDir, '..');
const credentialsDir = path.join(workspaceRoot, '.credentials');
const templatePath = path.join(currentDir, 'service-account.template.json');
const examplePath = path.join(credentialsDir, 'graphic-designer-portfol-baf47.service-account.json.example');
const targetPath = path.join(credentialsDir, 'graphic-designer-portfol-baf47.service-account.json');

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(credentialsDir, { recursive: true });

  if (!(await exists(examplePath))) {
    await copyFile(templatePath, examplePath);
  }

  console.log(`Credentials directory is ready: ${credentialsDir}`);

  if (await exists(targetPath)) {
    console.log(`Detected existing service-account target file: ${targetPath}`);
    console.log('Run npm run seed:archive:check next.');
    return;
  }

  console.log(`Template copied to: ${examplePath}`);
  console.log('Next steps:');
  console.log(`1. Replace the placeholder values and save the real key as ${targetPath}`);
  console.log('2. Run npm run seed:archive:check');
  console.log('3. Run npm run seed:archive:bootstrap');
}

main().catch((error) => {
  console.error('Failed to prepare the Firebase admin credential workspace.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});