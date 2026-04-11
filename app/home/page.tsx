'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Search, MapPin, TrendingUp, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'
import PendingPaymentCard from '@/components/ui/PendingPaymentCard'
import { HomeScreenSkeleton } from '@/components/ui/Skeleton'
import {
  mockUser, mockPendingPayments, mockMonthlySpend,
  mockUpcomingGames, mockNearbyVenues,
} from '@/lib/mock-data'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  },
}

const SPORTS = [
  { id: 'padel',  label: 'Padel',  emoji: '🏓', bg: '#006413' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾', bg: 'rgba(255,193,0,0.80)' },
  { id: 'volley', label: 'Volley', emoji: '🏐', bg: 'rgba(0,171,181,0.80)' },
  { id: 'futsal', label: 'Futsal', emoji: '⚽', bg: 'rgba(254,140,106,0.80)' },
]

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [expiresAt] = useState(() => new Date(Date.now() + 19 * 60 * 1000 + 54 * 1000))
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])
  if (loading) return <div className="min-h-screen bg-[#020202] pb-24"><HomeScreenSkeleton /></div>

  return (
    <div className="bg-[#020202] min-h-screen page-fade-bottom" style={{ paddingBottom: "calc(88px + var(--sab, 0px))" }}>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ══ TOP BAR ══ */}
        <motion.div variants={stagger.item} className="fixed z-50"
          style={{ background: '#0E0E0E', top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))' }}>
          {/* Fills iOS status bar height exactly */}
          <div className="status-bar-spacer" />
          {/* Content below status bar */}
          <div className="flex items-center gap-6 px-4 pt-4 pb-4">
            {/* Search bar */}
            <div className="flex items-center gap-3 h-[46px] rounded-xl px-4 flex-1"
                 style={{ background: '#000000' }}>
              <Search size={16} color="#ADAAAA" strokeWidth={1.5} />
              <input type="text" placeholder="Find your next arena..."
                className="flex-1 bg-transparent outline-none font-ui text-[14px] text-white"
                style={{ caretColor: '#9CFF93' }} />
            </div>
            {/* Right icons */}
            <div className="flex items-center gap-3 flex-none">
              <Link href="/notifications">
                <div className="liquid-glass-icon relative flex items-center justify-center cursor-pointer tap-highlight"
                     style={{ width:46, height:46, borderRadius:9999 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    <path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8a10 10 0 0 0-2-6"/>
                  </svg>
                  <span className="absolute top-[11px] right-[11px] w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
                </div>
              </Link>
              <Link href="/profile">
                <div className="liquid-glass-icon flex items-center justify-center overflow-hidden"
                     style={{ width:46, height:46, borderRadius:9999 }}>
                  <img src="/avatar.png"
                       alt="avatar" className="w-full h-full object-cover" style={{ borderRadius:9999 }} />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* Spacer for fixed top bar */}
        <div style={{ height: 'calc(var(--sat, 0px) + 78px)' }} />

        {/* ══ SCROLL BODY px-4 gap-6 ══ */}
        <div className="flex flex-col gap-6 px-4 pt-6">

          {/* ── ACTIVITY STREAK bg:#20201F r:16 px:24 py:16 gap:8 ── */}
          <AnimatedStreakCard />

          {/* ── PENDING PAYMENT ── */}
          <motion.div variants={stagger.item} className="flex flex-col gap-3">
            <SectionRow title="Pending Payment" />
            {mockPendingPayments.map(p => (
              <PendingPaymentCard key={p.id}
                court={p.court} venue={p.venue} schedule={p.schedule}
                expiresAt={expiresAt} />
            ))}
          </motion.div>

          {/* ── QUICK BOOK ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16 }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-heading font-bold text-white text-[18px]">Quick Book</p>
                <p className="font-ui text-[14px] mt-0.5" style={{ color: '#ADAAAA' }}>Ready for your 2-minute booking?</p>
              </div>
              <button className="font-ui font-semibold text-[12px] mt-0.5" style={{ color: '#9CFF93' }}>View All</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SPORTS.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center justify-center rounded-xl cursor-pointer tap-highlight"
                  style={{ background: s.bg, height: 108, gap: 12 }}>
                  <span style={{ fontSize: 26 }}>{s.emoji}</span>
                  <span className="font-heading font-bold text-white text-[18px]">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── MONTHLY SPEND bg:#00677F r:16 ── */}
          <AnimatedSpendCard />

          {/* ── UPCOMING GAMES ──
              Card: 361×226, r:16, overflow-hidden
              Content sits at bottom: p:24 gap:8
              Chip: bg #9CFF93@20%, text #9CFF93, Lexend SemiBold 12px, r:4
              Title: Space Grotesk Bold 18px white
              Meta: calendar icon + Lexend Regular 14px #ADAAAA
              Arrow button: 48×48, bg:#9CFF93, r:12, chevron #006413
          ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16 }}>
            <SectionRow title="Upcoming Games" href="/games" />
            {mockUpcomingGames.map(g => (
              <motion.div key={g.id} whileTap={{ scale: 0.985 }}
                className="overflow-hidden relative cursor-pointer"
                style={{ borderRadius: 16, height: 226 }}>
                {/* Background image */}
                <img
                  src={g.image}
                  alt={g.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark gradient overlay — bottom half darkens */}
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.10) 100%)' }} />
                {/* Content anchored to bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ gap: 8 }}>
                  {/* Status chip: bg rgba(156,255,147,0.20) r:4 px:8 py:2 */}
                  <div className="inline-flex items-center mb-2"
                       style={{
                         background: 'rgba(156,255,147,0.20)',
                         borderRadius: 4,
                         padding: '2px 8px',
                       }}>
                    <span className="font-ui font-semibold text-[12px]" style={{ color: '#9CFF93' }}>
                      UPCOMING GAME
                    </span>
                  </div>
                  {/* Title */}
                  <p className="font-heading font-bold text-white text-[18px] leading-snug whitespace-pre-line">
                    {g.title}
                  </p>
                  {/* Meta row */}
                  <div className="flex items-center gap-1 mt-1">
                    {/* Calendar icon matching li:calendar-days */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="font-ui text-[14px]" style={{ color: '#ADAAAA' }}>{g.date}</span>
                  </div>
                </div>
                {/* Arrow button — 48×48 bg:#9CFF93 r:12 */}
                <motion.div whileTap={{ scale: 0.9 }}
                  className="absolute bottom-6 right-6 flex items-center justify-center"
                  style={{ width: 48, height: 48, background: '#9CFF93', borderRadius: 12 }}>
                  <ChevronRight size={20} color="#006413" strokeWidth={2.5} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── NEARBY VENUES ──
              Card: 300×344, bg:#1E1E1E, r:24
              Image: 300×192 at top (no text overlay)
              Rating pill: absolute top-4 right-4, bg:#1E1E1E r:9999, px:12 py:4
                Star: #9CFF93 filled; text: Lexend SemiBold 12px white
              Body: p:24 gap:16
              Venue name: Space Grotesk Bold 18px white
              Location: GrLocation icon + Lexend Regular 14px #ADAAAA
              AVAILABLE: Lexend SemiBold 12px #ADAAAA
              Time: Lexend SemiBold 16px WHITE (#FFFFFF)
              From: Lexend SemiBold 12px #ADAAAA
              Price: Lexend SemiBold 16px #9CFF93 (GREEN!)
              /hr: Lexend Regular 12px #ADAAAA
          ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16, paddingBottom: 8 }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-heading font-bold text-white text-[18px]">Nearby Venues</p>
                <p className="font-ui text-[14px] mt-0.5" style={{ color: '#ADAAAA' }}>Top rated spots in Madrid</p>
              </div>
              <Link href="/discover">
                <button className="font-ui font-semibold text-[12px] mt-0.5" style={{ color: '#9CFF93' }}>View All</button>
              </Link>
            </div>

            {/* Horizontal scroll bleeds to screen edge */}
            <div className="-mx-4 overflow-x-auto scrollbar-hide">
              <div className="flex pl-4" style={{ gap: 16, width: 'max-content', paddingRight: 16 }}>
                {mockNearbyVenues.map((v, i) => (
                  <Link key={v.id} href={`/venue/${v.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.09 + 0.1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-none flex flex-col cursor-pointer"
                    style={{ width: 300, background: '#1E1E1E', borderRadius: 24 }}>

                    {/* Image — 300×192 top section */}
                    <div className="relative flex-none overflow-hidden"
                         style={{ height: 192, borderRadius: '24px 24px 0 0' }}>
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Rating pill — absolute top-4 right-4
                          bg:#1E1E1E r:9999 px:12 py:4 gap:4 */}
                      <div className="absolute flex items-center gap-1"
                           style={{ top: 16, right: 16, background: '#1E1E1E', borderRadius: 9999, padding: '4px 12px' }}>
                        <Star size={12} color="#9CFF93" fill="#9CFF93" strokeWidth={0} />
                        <span className="font-ui font-semibold text-[12px] text-white">{v.rating}</span>
                      </div>
                    </div>

                    {/* Body — p:24 gap:16 */}
                    <div className="flex flex-col" style={{ padding: 24, gap: 16 }}>
                      {/* Name + location */}
                      <div className="flex flex-col" style={{ gap: 2 }}>
                        <p className="font-heading font-bold text-white text-[18px] leading-snug">{v.name}</p>
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                          </svg>
                          <span className="font-ui text-[14px]" style={{ color: '#ADAAAA' }}>{v.location}</span>
                        </div>
                      </div>

                      {/* Available + From row */}
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col" style={{ gap: 4 }}>
                          {/* AVAILABLE: Lexend SemiBold 12px #ADAAAA */}
                          <span className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                                style={{ color: '#ADAAAA' }}>Available</span>
                          {/* Time: Lexend SemiBold 16px WHITE */}
                          <span className="font-ui font-semibold text-[16px] text-white">{v.availableFrom}</span>
                        </div>
                        <div className="flex flex-col items-end" style={{ gap: 4 }}>
                          {/* From: Lexend SemiBold 12px #ADAAAA */}
                          <span className="font-ui font-semibold text-[12px]" style={{ color: '#ADAAAA' }}>From</span>
                          <div className="flex items-baseline gap-0.5">
                            {/* Price: Lexend SemiBold 16px #9CFF93 (GREEN) */}
                            <span className="font-ui font-semibold text-[16px]" style={{ color: '#9CFF93' }}>{v.priceFrom}</span>
                            {/* /hr: Lexend Regular 12px #ADAAAA */}
                            <span className="font-ui text-[12px]" style={{ color: '#ADAAAA' }}>/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
      {/* ── FAB: Create New Game ──
          Figma: 56×56, bg:#006413, r:433 (circle), liquid glass effects
          Position: fixed bottom-24 right-4 (above nav, right-aligned)
          Icon: + (lucide Plus), color #9CFF93
      */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 280, damping: 20 }}
        whileTap={{ scale: 0.90 }}
        className="fixed z-40 flex items-center justify-center tap-highlight"
        style={{
          bottom: 'max(88px, calc(env(safe-area-inset-bottom) + 76px))',
          right: 16,
          width: 56, height: 56,
          background: '#006413',
          borderRadius: 9999,
          boxShadow: [
            'inset 0 0 95px 0 rgba(242,242,242,0.50)',
            'inset -9px -9px 9px -12px rgba(179,179,179,0.40)',
            'inset 9px 9px 4px -12px rgba(179,179,179,1.00)',
          ].join(', '),
        }}
      >
        {/* Plus icon — #9CFF93 24×24 */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CFF93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </motion.button>

      <BottomNav />
    </div>
  )
}

function SectionRow({ title, href }: { title: string; href?: string }) {
  const btn = <button className="font-ui font-semibold text-[12px]" style={{ color: '#9CFF93' }}>View All</button>
  return (
    <div className="flex justify-between items-center">
      <p className="font-heading font-bold text-white text-[18px]">{title}</p>
      {href ? <Link href={href}>{btn}</Link> : btn}
    </div>
  )
}

function AnimatedStreakCard() {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const controls = animate(count, mockUser.activityStreak, { duration: 1.2, delay: 0.15, ease: 'easeOut' })
    return controls.stop
  }, [])

  return (
    <motion.div variants={stagger.item}
      className="rounded-2xl px-6 py-4 flex flex-col"
      style={{ background: '#20201F', gap: 8 }}>
      <p className="font-heading font-bold text-white text-[18px] leading-none">Activity Streak</p>
      <div className="flex items-center gap-2">
        <motion.span className="font-heading font-bold text-[32px] leading-none" style={{ color: '#9CFF93' }}>
          {rounded}
        </motion.span>
        <span className="font-ui font-semibold text-[12px]" style={{ color: '#ADAAAA' }}>DAYS ACTIVE</span>
      </div>
      <div className="flex gap-1.5 mt-1">
        {mockUser.activityDays.map((active, i) => (
          <motion.div key={i} className="flex-1 h-2 rounded-full"
               initial={{ background: '#2A2A2A' }}
               animate={{ background: active ? '#9CFF93' : '#2A2A2A' }}
               transition={{ duration: 0.35, delay: i * 0.12 + 0.3 }} />
        ))}
      </div>
    </motion.div>
  )
}

function AnimatedSpendCard() {
  const count = useMotionValue(0)
  
  // Extract number from string (e.g. "Rp 4,482,500" -> 4482500)
  const numericValue = parseInt(mockMonthlySpend.amount.replace(/\D/g, ''), 10)
  
  // Format the evolving number back to Indonesian Rupiah representation
  const formattedCount = useTransform(count, (latest) => {
    return 'Rp ' + Math.round(latest).toLocaleString('en-US')
  })

  useEffect(() => {
    const controls = animate(count, numericValue, { duration: 1.4, delay: 0.25, ease: 'easeOut' })
    return controls.stop
  }, [])

  return (
    <motion.div variants={stagger.item}
      className="rounded-2xl px-6 py-4 flex flex-col"
      style={{ background: '#00677F', gap: 8 }}>
      <div className="flex justify-between items-center">
        <span className="font-heading font-bold text-[18px]" style={{ color: '#EEF9FF' }}>Monthly Spend</span>
        <TrendingUp size={20} color="#EEF9FF" strokeWidth={1.5} />
      </div>
      <motion.p className="font-heading font-bold text-[32px] leading-tight" style={{ color: '#EEF9FF' }}>
        {formattedCount}
      </motion.p>
      <p className="font-ui text-[12px]" style={{ color: '#EEF9FF' }}>{mockMonthlySpend.trend}</p>
    </motion.div>
  )
}
