import Ajv2020 from 'ajv/dist/2020.js';

const ajv = new Ajv2020({ allErrors: true, strict: false });

export function validateArchiveSeedData(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  return {
    valid,
    errors: validate.errors ?? [],
  };
}

export function findArchiveSeedConsistencyIssues(data) {
  if (!Array.isArray(data)) {
    return ['Seed payload must be an array of archive projects.'];
  }

  const issues = [];
  const slugCounts = new Map();
  const sortOrderCounts = new Map();

  for (const project of data) {
    if (!project || typeof project !== 'object') {
      continue;
    }

    if (typeof project.slug === 'string') {
      slugCounts.set(project.slug, (slugCounts.get(project.slug) ?? 0) + 1);
    }

    if (typeof project.sortOrder === 'number') {
      sortOrderCounts.set(project.sortOrder, (sortOrderCounts.get(project.sortOrder) ?? 0) + 1);
    }
  }

  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) {
      issues.push(`Duplicate slug detected: ${slug}`);
    }
  }

  for (const [sortOrder, count] of sortOrderCounts.entries()) {
    if (count > 1) {
      issues.push(`Duplicate sortOrder detected: ${sortOrder}`);
    }
  }

  return issues;
}

export function formatValidationErrors(errors) {
  if (!errors || errors.length === 0) {
    return 'Unknown validation error.';
  }

  return errors
    .map((error) => {
      const path = error.instancePath || '/';
      return `- ${path}: ${error.message}`;
    })
    .join('\n');
}