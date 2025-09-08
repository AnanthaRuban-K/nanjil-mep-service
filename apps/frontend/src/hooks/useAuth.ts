// apps/frontend/src/hooks/useAuth.ts
import { useUser } from '@clerk/nextjs'

export const useAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  const isAdmin = () => {
    if (!user) return false
    
    // Only use publicMetadata (privateMetadata doesn't exist on UserResource)
    const userRole = user.publicMetadata?.role as string
    return userRole === 'admin'
  }

  return {
    user,
    isSignedIn,
    isLoaded,
    isAdmin: isAdmin(),
    isLoading: !isLoaded
  }
}