/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_ARCHIVE_COLLECTION?: string;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
