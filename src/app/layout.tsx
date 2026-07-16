import type { Metadata } from 'next'
import '../styles/globals.css'
import { LanguageProvider } from '@/lib/language'

export const metadata: Metadata = {
  title: 'Neighbourly Luxembourg',
  description: 'Kind, trusted help from people in your community.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>
}
