# Firebase Firestore Workflow

This project uses Firebase in two separate roles:

- The public site reads archive content from the `archiveProjects` Firestore collection.
- Archive seeding is done with the Firebase Admin SDK, not with the client SDK.

## Firestore Rules

The Firestore rules in `firestore.rules` are intentionally strict:

- Public read access is allowed for `archiveProjects`.
- All client-side writes are denied.

This keeps the public portfolio readable while forcing content changes through an administrative path.

## Seed Data

- Seed documents: `scripts/archiveProjects.seed.json`
- Schema reference: `scripts/archiveProjects.schema.json`
- Credential preflight: `npm run seed:archive:check`
- Seed command: `npm run seed:archive`
- Validation-only command: `npm run seed:archive:dry-run`

## Admin Credentials

Use one of these before running the real seed:

1. Place a service account at `.credentials/graphic-designer-portfol-baf47.service-account.json`
2. `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json`
3. `FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json`
4. `FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'`

The service account should have Firestore write access for project `graphic-designer-portfol-baf47`.

You can use `scripts/service-account.template.json` as the shape reference when creating the local file. Do not commit real credentials.

## Recommended Flow

1. Download a Firebase or Google Cloud service-account key with Firestore access.
2. Save it to `.credentials/graphic-designer-portfol-baf47.service-account.json`.
3. Run `npm run seed:archive:check`.
4. Run `npm run seed:archive:dry-run` to validate the seed payload.
5. Run `npm run seed:archive`.
6. If you use the Firebase CLI later, deploy rules with `firebase deploy --only firestore:rules`.

## Why This Setup

This avoids using browser credentials for administrative writes, which is the correct production model for a public site.