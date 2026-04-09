'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BellRing, MapPin, ChevronRight, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
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

  // Demo: booking expires 19 min 54 sec from mount — matches Figma payment screen copy
  const [expiresAt] = useState(() => new Date(Date.now() + 19 * 60 * 1000 + 54 * 1000))

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <div className="min-h-screen bg-[#020202] pb-24"><HomeScreenSkeleton /></div>

  return (
    <div className="bg-[#020202] min-h-screen pb-28">
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ══ TOP BAR bg:#0E0E0E ══ */}
        <motion.div variants={stagger.item}
          className="flex items-center gap-3 px-4 pb-4"
          style={{ background: '#0E0E0E', paddingTop: 52 }}>
          <div className="flex items-center gap-3 h-[46px] rounded-xl px-4 flex-1"
               style={{ background: '#000000' }}>
            <Search size={16} color="#ADAAAA" strokeWidth={1.5} />
            <span className="text-[14px] text-[#ADAAAA] font-normal font-ui">Find your next arena...</span>
          </div>
          <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center relative flex-none"
               style={{ background: '#0E0E0E', border: '1px solid #1E1E1E' }}>
            <BellRing size={20} color="#F3F3F3" strokeWidth={1.5} />
            <span className="absolute top-[10px] right-[10px] w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
          </div>
          <Link href="/profile" className="flex-none">
            <div className="w-[46px] h-[46px] rounded-full overflow-hidden" style={{ background: '#1E1E1E' }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                   alt="avatar" className="w-full h-full object-cover" />
            </div>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6 px-4 pt-6">

          {/* ── ACTIVITY STREAK ── */}
          <motion.div variants={stagger.item}
            className="rounded-2xl px-6 py-4 flex flex-col"
            style={{ background: '#20201F', gap: 8 }}>
            <p className="text-[18px] font-bold text-white leading-none font-heading">Activity Streak</p>
            <div className="flex items-center gap-2">
              <span className="text-[32px] font-bold leading-none font-heading" style={{ color: '#9CFF93' }}>
                {mockUser.activityStreak}
              </span>
              <span className="text-[12px] font-semibold text-[#ADAAAA] font-ui">DAYS ACTIVE</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              {mockUser.activityDays.map((active, i) => (
                <div key={i} className="flex-1 h-2 rounded-full"
                     style={{ background: active ? '#9CFF93' : '#2A2A2A' }} />
              ))}
            </div>
          </motion.div>

          {/* ── PENDING PAYMENT ── */}
          <motion.div variants={stagger.item} className="flex flex-col gap-3">
            <SectionRow title="Pending Payment" />
            {mockPendingPayments.map(p => (
              <PendingPaymentCard
                key={p.id}
                court={p.court}
                venue={p.venue}
                schedule={p.schedule}
                expiresAt={expiresAt}
                onPayNow={() => console.log('pay now', p.id)}
              />
            ))}
          </motion.div>

          {/* ── QUICK BOOK ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16 }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[18px] font-bold text-white font-heading">Quick Book</p>
                <p className="text-[14px] text-[#ADAAAA] mt-0.5 font-ui">Ready for your 2-minute booking?</p>
              </div>
              <button className="text-[12px] font-semibold font-ui mt-0.5" style={{ color: '#9CFF93' }}>View All</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SPORTS.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center justify-center rounded-xl cursor-pointer tap-highlight"
                  style={{ background: s.bg, height: 108, gap: 12 }}>
                  <span style={{ fontSize: 26 }}>{s.emoji}</span>
                  <span className="text-[18px] font-bold text-white font-heading">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── MONTHLY SPEND ── */}
          <motion.div variants={stagger.item}
            className="rounded-2xl px-6 py-4 flex flex-col"
            style={{ background: '#00677F', gap: 8 }}>
            <div className="flex justify-between items-center">
              <span className="text-[18px] font-bold font-heading" style={{ color: '#EEF9FF' }}>Monthly Spend</span>
              <TrendingUp size={20} color="#EEF9FF" strokeWidth={1.5} />
            </div>
            <p className="text-[32px] font-bold leading-tight font-heading" style={{ color: '#EEF9FF' }}>
              {mockMonthlySpend.amount}
            </p>
            <p className="text-[12px] font-ui" style={{ color: '#EEF9FF' }}>{mockMonthlySpend.trend}</p>
          </motion.div>

          {/* ── UPCOMING GAMES ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16 }}>
            <SectionRow title="Upcoming Games" href="/games" />
            {mockUpcomingGames.map(g => (
              <motion.div key={g.id} whileTap={{ scale: 0.985 }}
                className="rounded-2xl overflow-hidden relative cursor-pointer"
                style={{ height: 226 }}>
                <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[12px] font-semibold font-ui px-2.5 py-1 rounded-[4px]"
                        style={{ background: 'rgba(0,100,19,0.85)', color: '#9CFF93' }}>
                    UPCOMING GAME
                  </span>
                  <p className="text-[18px] font-bold text-white mt-2 leading-snug font-heading whitespace-pre-line">
                    {g.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={14} color="#ADAAAA" strokeWidth={1.5} />
                    <span className="text-[14px] text-[#ADAAAA] font-ui">{g.date}</span>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.9 }}
                  className="absolute bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: '#00FF41' }}>
                  <ChevronRight size={18} color="#020202" strokeWidth={2.5} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── NEARBY VENUES ── */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap: 16, paddingBottom: 8 }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[18px] font-bold text-white font-heading">Nearby Venues</p>
                <p className="text-[14px] text-[#ADAAAA] mt-0.5 font-ui">Top rated spots in Madrid</p>
              </div>
              <Link href="/discover">
                <button className="text-[12px] font-semibold font-ui mt-0.5" style={{ color: '#9CFF93' }}>View All</button>
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto scrollbar-hide">
              <div className="flex pl-4" style={{ gap: 16, width: 'max-content', paddingRight: 16 }}>
                {mockNearbyVenues.map((v, i) => (
                  <motion.div key={v.id}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.09 + 0.1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-none flex flex-col rounded-3xl overflow-hidden cursor-pointer"
                    style={{ width: 300, background: '#1E1E1E' }}>
                    <div className="relative" style={{ height: 192 }}>
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full"
                           style={{ background: '#1E1E1E' }}>
                        <Star size={12} color="#9CFF93" fill="#9CFF93" strokeWidth={0} />
                        <span className="text-[12px] font-semibold text-white font-ui">{v.rating}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col" style={{ gap: 16 }}>
                      <div className="flex flex-col" style={{ gap: 2 }}>
                        <p className="text-[18px] font-bold text-white leading-snug font-heading">{v.name}</p>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} color="#ADAAAA" strokeWidth={1.5} />
                          <span className="text-[14px] text-[#ADAAAA] font-ui">{v.location}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col" style={{ gap: 4 }}>
                          <span className="text-[12px] font-semibold text-[#ADAAAA] uppercase tracking-widest font-ui">Available</span>
                          <span className="text-[16px] font-semibold font-ui" style={{ color: '#9CFF93' }}>{v.availableFrom}</span>
                        </div>
                        <div className="flex flex-col items-end" style={{ gap: 4 }}>
                          <span className="text-[12px] font-semibold text-[#ADAAAA] font-ui">From</span>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[16px] font-semibold text-white font-ui">{v.priceFrom}</span>
                            <span className="text-[12px] text-[#ADAAAA] font-ui">/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
      <BottomNav />
    </div>
  )
}

function SectionRow({ title, href }: { title: string; href?: string }) {
  const btn = <button className="text-[12px] font-semibold font-ui" style={{ color: '#9CFF93' }}>View All</button>
  return (
    <div className="flex justify-between items-center">
      <p className="text-[18px] font-bold text-white font-heading">{title}</p>
      {href ? <Link href={href}>{btn}</Link> : btn}
    </div>
  )
}
