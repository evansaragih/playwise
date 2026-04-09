'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Gamepad2, BarChart3, User } from 'lucide-react'

const tabs = [
  { href: '/home',     label: 'Home',     Icon: Home },
  { href: '/discover', label: 'Discover', Icon: Compass },
  { href: '/games',    label: 'Games',    Icon: Gamepad2 },
  { href: '/insights', label: 'Insights', Icon: BarChart3 },
  { href: '/profile',  label: 'Profile',  Icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 safe-bottom"
         style={{ background: '#1A1A1A', borderTop: '1px solid #2A2A2A' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 flex-1 py-2 tap-highlight transition-all duration-200 active:scale-95">
              <Icon size={22} color={active ? '#00FF41' : '#9E9E9E'} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-semibold tracking-wide"
                    style={{ color: active ? '#00FF41' : '#9E9E9E' }}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
