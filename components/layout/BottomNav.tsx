'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Users, BarChart2, User } from 'lucide-react'

const TABS = [
  { href: '/home',     label: 'Home',     Icon: Home },
  { href: '/discover', label: 'Discover', Icon: BookOpen },
  { href: '/games',    label: 'Games',    Icon: Users },
  { href: '/insights', label: 'Insights', Icon: BarChart2 },
  { href: '/profile',  label: 'Profile',  Icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    /*
      Outer wrapper: floats above the page, horizontally centred,
      max-width 393 px to match the mobile frame.
      Padding keeps it off the screen edges (16px) and bottom (12px).
    */
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 px-4 pb-3"
      style={{ background: 'transparent' }}
    >
      {/*
        Pill container — exactly what Figma calls "Liquid Glass Tab":
          • w-360 h-64 (we use full-width inside the 393px frame)
          • bg #1A1A1A @ 20 %  →  rgba(26,26,26,0.20)
          • backdrop-blur 26 px  (Figma radius 52 / 2)
          • border-radius 433 px
          • 3 inner shadows (see globals.css .liquid-glass-nav)
          • padding 4px all sides
      */}
      <div
        className="liquid-glass-nav flex items-center h-16 px-1"
        style={{ padding: 4 }}
      >
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex items-center justify-center h-full tap-highlight"
            >
              {/*
                Active tab pill — "Liquid Glass" variant 2:
                  • bg #9CFF93
                  • border-radius 999 px
                  • drop-shadow green glow + depth
                  • inner-shadow subtle green highlight
                  • icon + label color #006413

                Inactive tab:
                  • no background
                  • icon + label #F3F3F3
              */}
              <div
                className={`
                  flex flex-col items-center justify-center gap-1 w-full h-full rounded-full
                  transition-all duration-300
                  ${active ? 'liquid-glass-active' : ''}
                `}
                style={active ? { margin: '0 2px' } : {}}
              >
                <Icon
                  size={22}
                  color={active ? '#006413' : '#F3F3F3'}
                  strokeWidth={active ? 2.5 : 1.5}
                  fill={active ? '#006413' : 'none'}
                />
                <span
                  className="text-[12px] font-lexend font-normal leading-none"
                  style={{ color: active ? '#006413' : '#F3F3F3' }}
                >
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
