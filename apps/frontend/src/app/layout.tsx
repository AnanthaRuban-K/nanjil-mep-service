// src/app/layout.tsx - ULTRA MINIMAL VERSION
import './global.css'
import { ReactNode } from 'react'

// FORCE EVERYTHING TO BE DYNAMIC
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const metadata = {
  title: 'நாஞ்சில் MEP சேவை',
  description: 'நாஞ்சில் மின்சாரம் மற்றும் பிளம்பிங் சேவைகள்',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}