'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GrLocation } from 'react-icons/gr'
import { MdQrCode2 } from 'react-icons/md'
import { LuBellRing, LuPlus, LuChevronRight, LuTimer, LuClock } from 'react-icons/lu'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

/* ── Types ── */
type GameStatus = 'PENDING' | 'CONFIRMED' | 'PAID'
interface Game {
  id: string
  court: string
  sport: string
  venue: string
  schedule: string
  status: GameStatus
  dateGroup: 'pending' | 'today' | 'tomorrow' | 'future'
  dateLabel?: string
}

/* ── Mock data & Dynamic Dates ── */
const TODAY = new Date()
const TOMORROW = new Date()
TOMORROW.setDate(TODAY.getDate() + 1)
const PAST_DATE = new Date()
PAST_DATE.setDate(TODAY.getDate() - 3)

const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const todayStr = formatDate(TODAY)
const tomorrowStr = formatDate(TOMORROW)
const pastStr = formatDate(PAST_DATE)

const UPCOMING: Game[] = [
  // Pending payment — horizontal scroll section
  { id:'p1', court:'Court 1', sport:'Padel', venue:'SportHub Arena',      schedule:'10:00 - 12:00', status:'PENDING',   dateGroup:'pending' },
  { id:'p2', court:'Court 4', sport:'Padel', venue:'SportHub Arena',      schedule:'16:30 - 18:00', status:'PENDING',   dateGroup:'pending' },
  // Today
  { id:'t1', court:'Court 1', sport:'Padel', venue:'SportHub Arena',      schedule:'10:00 - 12:00', status:'CONFIRMED', dateGroup:'today',    dateLabel:todayStr },
  { id:'t2', court:'Court 4', sport:'Padel', venue:'SportHub Arena',      schedule:'16:30 - 18:00', status:'CONFIRMED', dateGroup:'today',    dateLabel:todayStr },
  // Tomorrow
  { id:'tm1', court:'Court 4', sport:'Padel', venue:'Metro Sports Center', schedule:'16:30 - 18:00', status:'PAID',     dateGroup:'tomorrow', dateLabel:tomorrowStr },
]

const PAST: Game[] = [
  { id:'h1', court:'Court 2', sport:'Tennis', venue:'Elite Tennis Court',   schedule:'09:00 - 10:00', status:'PAID', dateGroup:'today',    dateLabel:pastStr },
]

/* ── Status styling ── */
const STATUS_STYLE: Record<GameStatus, { bg: string; color: string; border: string; accentBar: string }> = {
  PENDING:   { bg:'rgba(255,184,0,0.15)',    color:'#FFB800', border:'rgba(255,184,0,0.3)',    accentBar:'#FFB800' },
  CONFIRMED: { bg:'rgba(156,255,147,0.15)',  color:'#9CFF93', border:'rgba(156,255,147,0.3)',  accentBar:'#9CFF93' },
  PAID:      { bg:'rgba(117,117,117,0.15)',  color:'#757575', border:'rgba(117,117,117,0.3)',  accentBar:'#757575' },
}

const stagger = {
  container: { animate:{ transition:{ staggerChildren:0.06 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.36, ease:[0.22,1,0.36,1] } } },
}

export default function GamesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'upcoming'|'past'>('upcoming')

  const games = tab === 'upcoming' ? UPCOMING : PAST

  const pendingGames  = UPCOMING.filter(g => g.dateGroup === 'pending')
  const todayGames    = UPCOMING.filter(g => g.dateGroup === 'today')
  const tomorrowGames = UPCOMING.filter(g => g.dateGroup === 'tomorrow')

  return (
    <div className="bg-[#020202] page-fade-bottom"
         style={{ paddingBottom:'calc(100px + var(--sab,0px))' }}>

      {/* ══ TOP BAR — FIXED ══ */}
      <div className="fixed z-50"
           style={{ background:'#0E0E0E', top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="px-4 pt-4 pb-4">
          {/* Title row */}
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-heading font-bold text-white" style={{ fontSize:22 }}>My Games</h1>
            <div className="flex items-center gap-3">
              {/* Bell */}
              <Link href="/notifications">
                <div className="liquid-glass-icon flex items-center justify-center relative cursor-pointer tap-highlight"
                     style={{ width:46, height:46, borderRadius:9999 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    <path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8a10 10 0 0 0-2-6"/>
                  </svg>
                  <span className="absolute top-[11px] right-[11px] w-1.5 h-1.5 rounded-full"
                        style={{ background:'#00FF41' }} />
                </div>
              </Link>
              {/* Avatar */}
              <Link href="/profile">
                <div className="liquid-glass-icon overflow-hidden"
                     style={{ width:46, height:46, borderRadius:9999 }}>
                  <img src="/avatar.png"
                       alt="avatar" className="w-full h-full object-cover" />
                </div>
              </Link>
            </div>
          </div>
          {/* Subtitle */}
          <p className="font-ui text-[14px] mb-4" style={{ color:'#9E9E9E' }}>
            Organize and track your games
          </p>
          {/* Tabs — Upcoming / Past Game */}
          <div className="flex gap-4">
            {(['upcoming','past'] as const).map(t => (
              <motion.button key={t} whileTap={{ scale:0.95 }}
                onClick={() => setTab(t)}
                className="flex-1 font-ui font-semibold text-[12px] h-[34px] rounded-full transition-all"
                style={tab === t
                  ? { background:'#9CFF93', color:'#006413' }
                  : { background:'#20201F', color:'#ADAAAA' }}>
                {t === 'upcoming' ? 'Upcoming' : 'Past Game'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed top bar */}
      <div style={{ height: 'calc(var(--sat, 0px) + 152px)', flex: 'none' }} />

      {/* ══ CONTENT ══ */}
      <AnimatePresence mode="wait">
        {tab === 'upcoming' ? (
          <motion.div key="upcoming"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="px-4 flex flex-col gap-6 pt-6">

            {/* ── PENDING PAYMENT — horizontal scroll ── */}
            {pendingGames.length > 0 && (
              <motion.div variants={stagger.container} initial="initial" animate="animate">
                {/* Section header */}
                <motion.div variants={stagger.item}
                  className="flex items-center gap-4 mb-4">
                  <span className="font-ui font-medium text-[14px]" style={{ color:'#ADAAAA' }}>
                    Pending Payment
                  </span>
                  <div className="flex-1 h-px" style={{ background:'rgba(72,72,71,0.20)' }} />
                </motion.div>
                {/* Horizontal scroll */}
                <motion.div variants={stagger.item}
                  className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-4" style={{ width:'max-content', paddingRight:16 }}>
                    {pendingGames.map(g => (
                      <div key={g.id} style={{ width:320, flexShrink:0 }}>
                        <GameCard game={g} onPay={() => router.push(`/payment-status/${g.id}`)} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── TODAY ── */}
            {todayGames.length > 0 && (
              <DateSection label="Today" date={todayGames[0].dateLabel!} games={todayGames} />
            )}

            {/* ── TOMORROW ── */}
            {tomorrowGames.length > 0 && (
              <DateSection label="Tomorrow" date={tomorrowGames[0].dateLabel!} games={tomorrowGames} />
            )}
          </motion.div>
        ) : (
          <motion.div key="past"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="px-4 flex flex-col gap-6 pt-6">
            {/* Group past by date label */}
            {[pastStr].map(dateLabel => {
              const dayGames = PAST.filter(g => g.dateLabel === dateLabel)
              if (!dayGames.length) return null
              return (
                <DateSection key={dateLabel}
                  label={dateLabel}
                  date={dateLabel}
                  games={dayGames}
                  isPast />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — + Create Game */}
      <motion.button
        initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:0.4, type:'spring', stiffness:280, damping:20 }}
        whileTap={{ scale:0.9 }}
        onClick={() => router.push('/select-sport')}
        className="fixed z-40 flex items-center justify-center tap-highlight"
        style={{
          bottom:'max(88px, calc(var(--sab,0px) + 76px))',
          right:16, width:56, height:56,
          background:'#006413', borderRadius:9999,
          boxShadow:'inset 0 0 95px 0 rgba(242,242,242,0.50),inset -9px -9px 9px -12px rgba(179,179,179,0.40),inset 9px 9px 4px -12px rgba(179,179,179,1.00)',
        }}>
        <LuPlus size={24} color="#9CFF93" strokeWidth={2} />
      </motion.button>

      <BottomNav />
    </div>
  )
}

/* ── Date section with header + cards ── */
function DateSection({ label, date, games, isPast }: { label:string; date:string; games:Game[]; isPast?:boolean }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.36, ease:[0.22,1,0.36,1] }}
      className="flex flex-col gap-4">
      {/* Section header row: LABEL — divider — DATE */}
      <div className="flex items-center gap-4">
        <span className="font-ui font-medium text-[14px] uppercase flex-none"
              style={{ color:'#ADAAAA' }}>{label}</span>
        <div className="flex-1 h-px" style={{ background:'rgba(72,72,71,0.20)' }} />
        <span className="font-ui text-[12px] flex-none"
              style={{ color:'rgba(173,170,170,0.60)' }}>{date}</span>
      </div>
      {/* Cards */}
      {games.map((g, i) => (
        <motion.div key={g.id}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:i*0.06, duration:0.34 }}>
          <GameCard game={g} isPast={isPast} />
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── Game Card ── */
function GameCard({ game, onPay, isPast }: { game:Game; onPay?:()=>void; isPast?:boolean }) {
  const router   = useRouter()
  const style    = STATUS_STYLE[game.status]
  const isPending  = game.status === 'PENDING'
  const isConfirmed = game.status === 'CONFIRMED'

  return (
    <motion.div whileTap={{ scale:0.985 }}
      className="relative overflow-hidden rounded-xl"
      style={{ background:'#20201F' }}>

      {/* Left accent bar — 4×172 r:9999 */}
      <div className="absolute left-0 top-6 rounded-full"
           style={{ width:4, height:'calc(100% - 48px)', background:style.accentBar, borderRadius:9999 }} />

      {/* Card content — p:24 */}
      <div style={{ padding:'24px 24px 24px 28px' }}>

        {/* Top row: status chip + icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-2">
            {/* Status chip */}
            <span className="font-ui font-semibold text-[12px] px-2.5 py-1 rounded self-start"
                  style={{ background:style.bg, color:style.color, border:`1px solid ${style.border}` }}>
              {game.status}
            </span>
            {/* Court name — Space Grotesk Bold 22px */}
            <p className="font-heading font-bold text-white" style={{ fontSize:22, lineHeight:1.15 }}>
              {game.court} - {game.sport}
            </p>
            {/* Venue — Lexend Regular 14px #ADAAAA + location icon */}
            <div className="flex items-center gap-1">
              <GrLocation size={14} color="#ADAAAA" />
              <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{game.venue}</span>
            </div>
          </div>
          {/* Right icon box — 64×64 bg:#262626 r:10.67 */}
          <div className="flex items-center justify-center flex-none rounded-xl"
               style={{ width:64, height:64, background:'#262626', borderRadius:10.67 }}>
            {isPending ? (
              <LuTimer size={32} color="#FFB800" strokeWidth={1.2} />
            ) : game.status === 'PAID' && !isPast ? (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#20201F"/>
                <path d="M12 12H16V16H12V12ZM13 13V15H15V13H13Z" fill="#9E9E9E"/>
                <path d="M24 12H28V16H24V12ZM25 13V15H27V13H25Z" fill="#9E9E9E"/>
                <path d="M12 24H16V28H12V24ZM13 25V27H15V25H13Z" fill="#9E9E9E"/>
                <rect x="18" y="12" width="4" height="2" fill="#9E9E9E"/>
                <rect x="18" y="15" width="4" height="2" fill="#9E9E9E"/>
                <rect x="25" y="18" width="3" height="3" fill="#9E9E9E"/>
                <rect x="23" y="24" width="5" height="4" fill="#9E9E9E"/>
                <rect x="19" y="24" width="2" height="4" fill="#9E9E9E"/>
                <rect x="19" y="20" width="3" height="2" fill="#9E9E9E"/>
                <rect x="13" y="19" width="3" height="3" fill="#9E9E9E"/>
              </svg>
            ) : (
              <MdQrCode2 size={48} color="#ADAAAA" />
            )}
          </div>
        </div>

        {/* Divider + schedule + action */}
        <div className="flex items-end justify-between pt-4"
             style={{ borderTop:'1px solid #2A2A2A' }}>
          <div className="flex flex-col gap-0.5">
            {/* SCHEDULE label — Lexend Regular 10px #ADAAAA */}
            <span className="font-ui text-[10px] uppercase tracking-wider" style={{ color:'#ADAAAA' }}>
              Schedule
            </span>
            {/* Time — Space Grotesk Bold 18px white */}
            <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>{game.schedule}</p>
          </div>

          {/* Action button */}
          {isPending && (
            <motion.button whileTap={{ scale:0.94 }}
              onClick={onPay}
              className="font-ui font-semibold text-[12px] px-4 h-[34px] rounded-full"
              style={{ background:'#FFB800', color:'#715200' }}>
              PAY NOW
            </motion.button>
          )}
          {isConfirmed && (
            <motion.button whileTap={{ scale:0.94 }}
              onClick={() => router.push(`/booking-pass/${game.id}`)}
              className="font-ui font-semibold text-[12px] px-4 h-[34px] rounded-full"
              style={{ background:'#9CFF93', color:'#006413' }}>
              VIEW PASS
            </motion.button>
          )}
          {game.status === 'PAID' && !isPast && (
            <motion.button whileTap={{ scale:0.94 }}
              onClick={() => router.push(`/booking-pass/${game.id}`)}
              className="font-ui font-semibold text-[12px] px-6 h-[34px] rounded-full"
              style={{ background:'rgba(38,38,38,0.10)', border:'1px solid #2A2A2A', color:'#9E9E9E' }}>
              DETAILS
            </motion.button>
          )}
          {isPast && (
            <motion.button whileTap={{ scale:0.94 }}
              onClick={() => router.push(`/booking-pass/${game.id}`)}
              className="font-ui font-semibold text-[12px] px-6 h-[34px] rounded-full"
              style={{ background:'rgba(38,38,38,0.10)', border:'1px solid #2A2A2A', color:'#9E9E9E' }}>
              DETAILS
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
