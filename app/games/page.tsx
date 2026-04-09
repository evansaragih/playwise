'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, QrCode, ChevronRight, MapPin, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { GamesSkeleton } from '@/components/ui/Skeleton'
import { StatusChip } from '@/components/ui/StatusChip'
import { mockGames } from '@/lib/mock-data'

type Game = typeof mockGames.upcoming[0]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
}

// Group upcoming games by date label
function groupByDate(games: Game[]) {
  const groups: Record<string, Game[]> = {}
  games.forEach(g => {
    const key = g.date
    if (!groups[key]) groups[key] = []
    groups[key].push(g)
  })
  return groups
}

export default function GamesPage() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => { setTimeout(() => setLoading(false), 1100) }, [])

  if (loading) return <div className="min-h-screen pb-20"><GamesSkeleton /></div>

  const upcomingGroups = groupByDate(mockGames.upcoming)

  return (
    <PageWrapper>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ── HEADER ── */}
        <motion.div variants={stagger.item}
          className="flex items-center justify-between px-4 pt-6 pb-2">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight font-heading">My Games</h1>
            <p className="text-xs text-[#ADAAAA] mt-0.5 font-ui">Organize and track your games</p>
          </div>
          <button className="relative h-10 w-10 rounded-full flex items-center justify-center tap-highlight"
                  style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}>
            <Bell size={18} color="#F3F3F3" />
          </button>
        </motion.div>

        {/* ── TABS ── */}
        <motion.div variants={stagger.item} className="flex gap-2 px-4 py-3">
          {(['upcoming', 'past'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 h-9 rounded-full text-sm font-bold capitalize transition-all tap-highlight"
              style={tab === t
                ? { background: '#00FF41', color: '#020202' }
                : { background: '#1E1E1E', color: '#9E9E9E', border: '1px solid #2A2A2A' }
              }>
              {t === 'upcoming' ? 'Upcoming' : 'Past Game'}
            </button>
          ))}
        </motion.div>

        {/* ── CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, x: tab === 'upcoming' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'upcoming' ? 20 : -20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="px-4">

            {tab === 'upcoming' && (
              <div className="space-y-1">
                {/* Pending payment section */}
                {mockGames.upcoming.filter(g => g.status === 'PENDING').length > 0 && (
                  <div className="mb-4">
                    <SectionLabel label="PENDING PAYMENT" />
                    {mockGames.upcoming
                      .filter(g => g.status === 'PENDING')
                      .map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
                  </div>
                )}

                {/* Grouped by date */}
                {Object.entries(upcomingGroups)
                  .filter(([date]) => date !== 'Today' || mockGames.upcoming.filter(g=>g.date==='Today'&&g.status!=='PENDING').length > 0)
                  .map(([date, games]) => {
                    const nonPending = games.filter(g => g.status !== 'PENDING')
                    if (nonPending.length === 0) return null
                    const dateLabel = nonPending[0].dateLabel
                    return (
                      <div key={date} className="mb-4">
                        <SectionLabel label={date.toUpperCase()} sublabel={dateLabel} />
                        {nonPending.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
                      </div>
                    )
                  })}
              </div>
            )}

            {tab === 'past' && (
              <div className="space-y-3">
                {mockGames.past.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="h-6" />
      </motion.div>

      {/* ── FAB ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-24 right-4 z-40">
        <motion.button whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-lg tap-highlight glow-primary"
          style={{ background: '#00FF41', color: '#020202' }}>
          +
        </motion.button>
      </motion.div>
    </PageWrapper>
  )
}

function SectionLabel({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <div className="flex items-center justify-between py-2 mb-2">
      <span className="text-xs font-bold tracking-widest text-neutral uppercase">{label}</span>
      {sublabel && <span className="text-xs text-neutral">{sublabel}</span>}
    </div>
  )
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const isPending = game.status === 'PENDING'
  const isCompleted = game.status === 'COMPLETED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl overflow-hidden relative mb-3 cursor-pointer tap-highlight"
      style={{ background: '#20201F' }}>

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
           style={{ background: game.statusColor }} />

      <div className="p-4 pl-5">
        {/* Top row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <StatusChip status={game.status} />
            <h3 className="text-base font-bold text-white mt-2">{game.court}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} color="#9E9E9E" />
              <span className="text-xs text-neutral">{game.venue}</span>
            </div>
          </div>
          {/* QR icon or action icon */}
          {game.hasQR && !isPending && (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: '#262626' }}>
              <QrCode size={22} color="#9E9E9E" />
            </div>
          )}
          {isPending && (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: '#262626' }}>
              <Clock size={22} color="#FFB800" />
            </div>
          )}
          {isCompleted && (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: '#262626' }}>
              <Calendar size={22} color="#9E9E9E" />
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-center pt-3"
             style={{ borderTop: '1px solid #2A2A2A' }}>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-neutral font-semibold">Schedule</p>
            <p className="text-sm font-bold text-white mt-0.5">{game.schedule}</p>
          </div>

          {isPending ? (
            <motion.button whileTap={{ scale: 0.95 }}
              className="px-5 h-9 rounded-full font-bold text-xs tap-highlight"
              style={{ background: '#FFB800', color: '#715200' }}>
              PAY NOW
            </motion.button>
          ) : game.action === 'VIEW PASS' ? (
            <motion.button whileTap={{ scale: 0.95 }}
              className="px-5 h-9 rounded-full font-bold text-xs tap-highlight"
              style={{ background: '#006413', color: '#00FF41', border: '1px solid #00FF41' }}>
              VIEW PASS
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 h-9 rounded-full font-bold text-xs tap-highlight"
              style={{ background: '#1E1E1E', color: '#9E9E9E', border: '1px solid #2A2A2A' }}>
              DETAILS
              <ChevronRight size={13} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
