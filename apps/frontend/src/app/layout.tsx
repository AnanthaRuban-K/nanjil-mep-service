import { Inter } from 'next/font/google';
import './global.css';
import { ReactNode } from 'react';
import { ClientProviders } from './ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'நாஞ்சில் MEP சேவை',
  description: 'நாஞ்சில் மின்சாரம் மற்றும் பிளம்பிங் சேவைகள்',
};

// Keep dynamic rendering to avoid Html import issues
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}