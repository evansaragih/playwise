'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Users, BarChart2 } from 'lucide-react'

const TABS = [
  { href: '/home',     label: 'Home',     Icon: Home },
  { href: '/discover', label: 'Discover', Icon: BookOpen },
  { href: '/games',    label: 'Games',    Icon: Users },
  { href: '/insights', label: 'Insights', Icon: BarChart2 },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      className="fixed z-50"
      style={{
        bottom: 0,
        left: 'max(0px, calc(50% - 215px))',
        right: 'max(0px, calc(50% - 215px))',
        background: 'transparent',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingTop: 8,
      }}
    >
      {/*
        Liquid Glass pill — exact Figma specs:
        - bg: rgba(26,26,26,0.20)  → #1A1A1A @ 20% opacity
        - backdrop-filter: blur(26px)
        - border-radius: 433px
        - 3 inner shadows
        - padding: 4px
        - height: 64px
      */}
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
                Active tab: "Liquid Glass Default" variant
                  bg: #9CFF93, r:999
                  drop-shadow glow + depth + inner highlight
                  icon + label: #006413

                Inactive tab: no background, icon + label: #F3F3F3
              */}
              <div
                className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-full transition-all duration-300"
                style={active ? {
                  background: '#9CFF93',
                  borderRadius: 999,
                  boxShadow: [
                    '0 8px 10px -2px rgba(0,0,0,0.25)',
                    '0 0 20px 0 rgba(156,255,147,0.30)',
                    'inset 0 0 4px 0 rgba(0,255,0,0.10)',
                  ].join(', '),
                  margin: '0 2px',
                } : {}}
              >
                <Icon
                  size={22}
                  color={active ? '#006413' : '#F3F3F3'}
                  fill={active ? '#006413' : 'none'}
                  strokeWidth={active ? 0 : 1.5}
                />
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
