// apps/frontend/src/hooks/useHydrationSafe.ts
import { useState, useEffect } from 'react'

/**
 * Hook to prevent hydration mismatches by ensuring components 
 * only render client-side content after hydration is complete
 */
export const useHydrationSafe = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

// Usage example:
/*
export default function MyComponent() {
  const isMounted = useHydrationSafe()
  
  if (!isMounted) {
    // Return server-safe JSX during SSR
    return <div>Loading...</div>
  }
  
  // Return client-specific JSX after hydration
  return <div>{new Date().toLocaleDateString()}</div>
}
*/