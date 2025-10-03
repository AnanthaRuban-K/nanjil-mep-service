import { ClerkClient } from '@clerk/clerk-sdk-node'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    sessionId?: string
    clerkClient?: ClerkClient
  }
}