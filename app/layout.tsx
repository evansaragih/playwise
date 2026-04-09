import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlayWise',
  description: 'Smart Sports Booking',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
