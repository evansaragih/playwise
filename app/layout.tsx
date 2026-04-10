import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlayWise',
  description: 'Smart Sports Booking — discover courts, book games, track your play.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',  // makes status bar transparent on iOS
    title: 'PlayWise',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  other: {
    // iOS PWA full-screen
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    // Android chrome
    'mobile-web-app-capable': 'yes',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,          // prevent pinch-zoom on the app shell
  viewportFit: 'cover',         // extend under iOS notch + home bar
  themeColor: '#020202',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  )
}
