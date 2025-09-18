// apps/frontend/src/app/layout.tsx - FIXED PROPERTY NAMES
import { Inter } from "next/font/google";
import "./global.css"; // Make sure this file exists
import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "நாஞ்சில் MEP சேவை",
  description: "நாஞ்சில் மின்சாரம் மற்றும் பிளம்பிங் சேவைகள்",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}