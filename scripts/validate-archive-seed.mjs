import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  findArchiveSeedConsistencyIssues,
  formatValidationErrors,
  validateArchiveSeedData,
} from './utils/archive-seed-validation.mjs';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

async function main() {
  const [schemaRaw, seedRaw] = await Promise.all([
    readFile(path.join(currentDir, 'archiveProjects.schema.json'), 'utf8'),
    readFile(path.join(currentDir, 'archiveProjects.seed.json'), 'utf8'),
  ]);

  const schema = JSON.parse(schemaRaw);
  const seedData = JSON.parse(seedRaw);
  const result = validateArchiveSeedData(schema, seedData);
  const consistencyIssues = findArchiveSeedConsistencyIssues(seedData);

  if (!result.valid) {
    console.error('Archive seed validation failed.');
    console.error(formatValidationErrors(result.errors));
    process.exitCode = 1;
    return;
  }

  if (consistencyIssues.length > 0) {
    console.error('Archive seed consistency checks failed.');
    for (const issue of consistencyIssues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Archive seed validation passed for ${seedData.length} projects.`);
}

main().catch((error) => {
  console.error('Archive seed validation failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});