// src/app/layout.tsx
import { Providers } from '@/context/Providers';
import './globals.css';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google'
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
  })
  
  const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-playfair',
    weight: ['700', '800'],
  })
  
  const dancingScript = Dancing_Script({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dancing-script',
    weight: ['700'],
  })
  
  export const metadata = {
    title: 'SheShape - Fitness For Every Woman',
    description: 'Personalized fitness and nutrition plans designed exclusively for women',
  }
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
  );
}