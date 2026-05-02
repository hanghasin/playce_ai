import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Playce AI | Find What Moves You',
  description: 'Discover your perfect sport and destination with AI-powered recommendations. Not more choices, just the one.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <head>
        {/* Editorial New - thin editorial font for headings */}
        <link 
          href="https://fonts.cdnfonts.com/css/pp-editorial-new" 
          rel="stylesheet"
        />
        {/* Monument Grotesk fallback to system fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="antialiased bg-black text-white overflow-x-hidden"
        style={{
          fontFamily: "'Monument Grotesk', 'Inter', Arial, system-ui, sans-serif",
          letterSpacing: '-0.02em',
        }}
      >
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
