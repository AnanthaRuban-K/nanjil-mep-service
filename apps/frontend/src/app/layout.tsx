// File: app/layout.tsx - Root Layout with Clerk Provider
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'நாஞ்சில் MEP Services - Professional Electrical & Plumbing',
  description: 'Professional electrical and plumbing services in Nagercoil, Kanyakumari. 24/7 emergency service available.',
  keywords: 'electrical service, plumbing service, Nagercoil, Kanyakumari, emergency repair',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600',
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}