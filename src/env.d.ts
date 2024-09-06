/**
 * @file env.d.ts
 * @version 1.1.0
 * @description TypeScript declarations for environment variables
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_COGNITO_USER_POOL_ID: string
  readonly VITE_COGNITO_CLIENT_ID: string
  readonly VITE_LAMBDA_ALPHA_VANTAGE_API_ENDPOINT: string
  readonly VITE_LAMBDA_ALPHA_VANTAGE_API_REGION: string
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}