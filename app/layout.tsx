import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlayWise',
  description: 'Smart Sports Booking',
  manifest: '/manifest.json',
  icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020202',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Raw meta tags — Next.js Metadata API doesn't always emit these
            correctly for iOS Safari standalone PWA mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  )
}
