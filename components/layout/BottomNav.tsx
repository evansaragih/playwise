'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Users, BarChart2 } from 'lucide-react'

// EXACTLY 4 tabs per Figma — Home, Discover, Games, Insights (NO Profile)
const TABS = [
  { href: '/home',     label: 'Home',     Icon: Home },
  { href: '/discover', label: 'Discover', Icon: BookOpen },
  { href: '/games',    label: 'Games',    Icon: Users },
  { href: '/insights', label: 'Insights', Icon: BarChart2 },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    /*
      Outer: floats at bottom, full width capped at 393px, px-4 pb-3
      Inner pill: "Liquid Glass Tab"
        bg: #1A1A1A @ 20% = rgba(26,26,26,0.20)
        backdrop-blur: 26px (radius 52/2)
        border-radius: 433px
        3 inner shadows
        padding: 4px
        h: 64px
    */
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50 px-4 pb-3">
      <div
        className="liquid-glass-nav flex items-center h-16"
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
                Active: "Liquid Glass Default" variant
                  bg: #9CFF93, r:999
                  drop-shadow: rgba(0,0,0,0.25) y:8 blur:10 spread:-1.8
                  drop-shadow glow: rgba(156,255,147,0.30) blur:20
                  inner-shadow: rgba(0,255,0,0.10) blur:4
                  icon + label: #006413

                Inactive: "Liquid Glass Variant2"
                  no fill, r:999
                  icon + label: #F3F3F3
              */}
              <div
                className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-full transition-all duration-300"
                style={active ? {
                  background: '#9CFF93',
                  borderRadius: 999,
                  boxShadow: '0 8px 10px -2px rgba(0,0,0,0.25), 0 0 20px 0 rgba(156,255,147,0.30), inset 0 0 4px 0 rgba(0,255,0,0.10)',
                  margin: '0 2px',
                } : {}}
              >
                <Icon
                  size={22}
                  color={active ? '#006413' : '#F3F3F3'}
                  fill={active ? '#006413' : 'none'}
                  strokeWidth={active ? 0 : 1.5}
                />
                {/* Lexend Regular 12px */}
                <span
                  className="font-ui text-[12px] font-normal leading-none"
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
