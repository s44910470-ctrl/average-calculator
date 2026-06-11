const requiredKeys = ['NEXT_PUBLIC_APP_NAME'] as const;

export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'QuantumTrade Platform',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001'
};

export function assertEnv() {
  // Placeholder for future strict validation.
  return requiredKeys.every((key) => Boolean(process.env[key]));
}
