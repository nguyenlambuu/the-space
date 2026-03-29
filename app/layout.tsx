// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Space Project | Trinh Chau Fashion Design',
  description: 'A 3D museum experience showcasing the fashion design work of Trinh Chau.',
  openGraph: {
    title: 'The Space Project | Trinh Chau',
    description: 'Enter the museum. Explore collections of hand-crafted fashion design.',
    type: 'website',
    url: 'https://thespacepy.com',
    images: [{
      url: 'https://thespacepy.com/og-image.jpg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Space Project',
    description: 'A 3D fashion museum experience',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#F8F7F4" />
      </head>
      <body className="bg-bg text-text antialiased" style={{
        fontFamily: 'Georgia, serif',
      }}>
        {children}
      </body>
    </html>
  )
}
