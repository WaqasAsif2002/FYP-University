import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pre-Parking management',
  description: 'Created By Waqas & group',
  generator: 'waqas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
