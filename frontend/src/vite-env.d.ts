/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_WATSON_INTEGRATION_ID?: string
  readonly VITE_WATSON_REGION?: string
  readonly VITE_WATSON_SERVICE_INSTANCE_ID?: string
  readonly VITE_WATSON_CLIENT_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
