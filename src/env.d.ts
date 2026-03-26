/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_BACKEND_URL: string
  readonly VITE_PROD_BACKEND_URL: string
  readonly VITE_PRODUCTION: int
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export { ImportMetaEnv, ImportMeta };