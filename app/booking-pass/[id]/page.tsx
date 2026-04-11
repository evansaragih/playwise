'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { LuChevronLeft, LuWallet, LuReceiptText, LuBell } from 'react-icons/lu'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { GrLocation } from 'react-icons/gr'
import { mockVenues } from '@/lib/mock-data'

/* ── Mock booking passes & Dynamic Dates ── */
const TODAY = new Date()
const TOMORROW = new Date()
TOMORROW.setDate(TODAY.getDate() + 1)
const PAST_DATE = new Date()
PAST_DATE.setDate(TODAY.getDate() - 3)

const formatDateFull = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const passDateToday = formatDateFull(TODAY)
const passDateTomorrow = formatDateFull(TOMORROW)
const passDatePast = formatDateFull(PAST_DATE)

const PASSES = [
  {
    id: 'h1',
    court: 'Court 2 - Tennis',
    venue: 'Elite Tennis Court',
    sport: 'Tennis',
    date: passDatePast,
    time: '09:00 - 10:00',
    players: null,
  },
  {
    id: 't1',
    court: 'Court 1 - Padel',
    venue: 'SportHub Arena',
    sport: 'Padel',
    date: passDateToday,
    time: '10:00 - 12:00',
    players: null,   // solo
  },
  {
    id: 't2',
    court: 'Court 4 - Padel',
    venue: 'SportHub Arena',
    sport: 'Padel',
    date: passDateToday,
    time: '16:30 - 18:00',
    players: [
      { id:'me', name:'Alex Johnson', avatar:'AJ', role:'HOST',   status:'paid' },
      { id:'p2', name:'Marcus Chen',  avatar:'MC', role:'PLAYER', status:'pending' },
      { id:'p3', name:'Sarah',        avatar:'S',  role:'PLAYER', status:'pending' },
      { id:'p4', name:'Eric Cloe',    avatar:'EC', role:'PLAYER', status:'pending' },
    ],
  },
  {
    id: 'tm1',
    court: 'Court 4 - Padel',
    venue: 'Metro Sports Center',
    sport: 'Padel',
    date: passDateTomorrow,
    time: '16:30 - 18:00',
    players: [
      { id:'me', name:'Alex Johnson', avatar:'AJ', role:'HOST',   status:'paid' },
      { id:'p2', name:'Marcus Chen',  avatar:'MC', role:'PLAYER', status:'paid' },
      { id:'p3', name:'Sarah',        avatar:'S',  role:'PLAYER', status:'paid' },
    ],
  },
]

const stagger = {
  container: { animate:{ transition:{ staggerChildren:0.06 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.38, ease:[0.22,1,0.36,1] } } },
}

/* Simple QR code SVG — a realistic-looking static QR */
function QRCode() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {/* Outer finder patterns */}
      {/* Top-left */}
      <rect x="10" y="10" width="60" height="60" rx="4" fill="#000"/>
      <rect x="18" y="18" width="44" height="44" rx="2" fill="#fff"/>
      <rect x="26" y="26" width="28" height="28" rx="1" fill="#000"/>
      {/* Top-right */}
      <rect x="130" y="10" width="60" height="60" rx="4" fill="#000"/>
      <rect x="138" y="18" width="44" height="44" rx="2" fill="#fff"/>
      <rect x="146" y="26" width="28" height="28" rx="1" fill="#000"/>
      {/* Bottom-left */}
      <rect x="10" y="130" width="60" height="60" rx="4" fill="#000"/>
      <rect x="18" y="138" width="44" height="44" rx="2" fill="#fff"/>
      <rect x="26" y="146" width="28" height="28" rx="1" fill="#000"/>
      {/* Data modules — random pattern */}
      {[
        [82,10],[90,10],[98,10],[106,10],[114,10],[122,10],
        [82,18],[98,18],[106,18],[114,18],
        [82,26],[90,26],[106,26],[122,26],
        [82,34],[98,34],[106,34],[114,34],
        [82,42],[90,42],[98,42],[106,42],[122,42],
        [82,50],[90,50],[114,50],[122,50],
        [82,58],[106,58],[114,58],[122,58],
        [10,82],[18,82],[26,82],[42,82],[50,82],[58,82],[66,82],[74,82],[82,82],[90,82],[98,82],[114,82],[130,82],[146,82],[162,82],[170,82],[186,82],
        [10,90],[34,90],[50,90],[66,90],[82,90],[98,90],[114,90],[130,90],[146,90],[162,90],[178,90],
        [10,98],[18,98],[34,98],[58,98],[74,98],[90,98],[106,98],[130,98],[146,98],[170,98],[186,98],
        [10,106],[26,106],[42,106],[58,106],[82,106],[98,106],[114,106],[130,106],[154,106],[170,106],
        [10,114],[18,114],[34,114],[50,114],[66,114],[90,114],[106,114],[130,114],[146,114],[162,114],[178,114],
        [10,122],[26,122],[42,122],[66,122],[82,122],[98,122],[114,122],[138,122],[154,122],[170,122],[186,122],
        [90,130],[106,130],[114,130],[130,130],[154,130],[170,130],
        [82,138],[90,138],[106,138],[130,138],[146,138],[162,138],[178,138],
        [82,146],[98,146],[114,146],[138,146],[154,146],[186,146],
        [82,154],[106,154],[122,154],[130,154],[146,154],[162,154],[170,154],
        [90,162],[98,162],[114,162],[130,162],[154,162],[162,162],[186,162],
        [82,170],[98,170],[106,170],[122,170],[138,170],[162,170],[170,170],[178,170],
        [82,178],[90,178],[106,178],[122,178],[146,178],[162,178],[178,178],[186,178],
      ].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width="8" height="8" fill="#000"/>
      ))}
      {/* Green scan line */}
      <rect x="10" y="99" width="180" height="3" rx="1.5" fill="rgba(156,255,147,0.5)"/>
    </svg>
  )
}

export default function BookingPassPage() {
  const { id }  = useParams<{ id:string }>()
  const router   = useRouter()
  const [reminded, setReminded] = useState<Set<string>>(new Set())

  const pass = PASSES.find(p => p.id === id) || PASSES[0]
  const isMulti = !!pass.players && pass.players.length > 1
  
  // Date logic
  const isToday = pass.date === passDateToday
  const passDateTime = Date.parse(pass.date)
  const todayTime = Date.parse(passDateToday)
  const isPast = passDateTime < todayTime

  const sendReminder = (pid: string) => {
    setReminded(prev => { const n = new Set(prev); n.add(pid); return n })
  }

  return (
    <div className="bg-[#020202]"
         style={{ paddingBottom:'calc(160px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))', background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4" style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2}/>
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Booking Pass
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 56px)' }} />

      {/* ══ SCROLLABLE CONTENT ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 pt-4 flex flex-col gap-6">

        {/* ── THE TICKET CARD ──
            bg rgba(32,32,31,0.80) r:32
            Top: white bg QR container
            Middle: notch cutout line
            Bottom: detail grid  */}
        <motion.div variants={stagger.item}
          className="overflow-hidden flex flex-col"
          style={{ background:'rgba(32,32,31,0.80)', borderRadius:32 }}>

          {/* Top section — header + QR — p:24 gap:24 */}
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
            {/* GAME ENTRY PASS — Space Grotesk Bold 30px */}
            <p className="font-heading font-bold text-white text-center" style={{ fontSize:30 }}>
              GAME ENTRY PASS
            </p>

            {/* QR Code box — conditionally locked for future dates */}
            <div className="rounded-2xl overflow-hidden relative flex flex-col items-center justify-center"
                 style={{
                   background: isToday ? '#FFFFFF' : '#131313',
                   padding: 24,
                   border: isToday ? 'none' : '1px solid #2A2A2A'
                 }}>
                 
              {/* QR Code graphic */}
              <div style={{ 
                width:'100%', 
                aspectRatio:'1', 
                opacity: isToday ? 1 : 0.08, 
                filter: isToday ? 'none' : 'grayscale(100%)' 
              }}>
                <QRCode />
              </div>

              {/* Overlay for non-today games (future or past) */}
              {!isToday && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                     style={{ zIndex: 10 }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                       style={{ background:'rgba(255,255,255,0.05)' }}>
                    <LuReceiptText size={24} color="#ADAAAA" />
                  </div>
                  <p className="font-heading font-bold text-white mb-2" style={{ fontSize:18 }}>
                    {isPast ? 'QR Expired' : 'QR Secured'}
                  </p>
                  <p className="font-ui text-[14px]" style={{ color:'#808080', lineHeight: 1.5 }}>
                    {isPast 
                      ? <>This code has already expired<br/>and is no longer valid.</>
                      : <>Your code will be generated<br/>on the day of the game.</>}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Perforation / notch line */}
          <div className="relative flex items-center" style={{ height:28, marginLeft:-14, marginRight:-14 }}>
            {/* Left circle notch */}
            <div className="absolute left-0 rounded-full"
                 style={{ width:28, height:28, background:'#020202' }} />
            {/* Dashed line */}
            <div className="flex-1 mx-4" style={{ borderTop:'2px dashed rgba(72,72,71,0.4)', marginLeft:20, marginRight:20 }} />
            {/* Right circle notch */}
            <div className="absolute right-0 rounded-full"
                 style={{ width:28, height:28, background:'#020202' }} />
          </div>

          {/* Bottom section — details + tip — p:24 gap:32 */}
          <div style={{ padding:24, paddingTop:12, display:'flex', flexDirection:'column', gap:28, background:'rgba(32,32,31,0.40)' }}>
            {/* 2×2 detail grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <DetailField label="VENUE" value={`${pass.venue}`} wide />
              <DetailField label="SPORT" value={pass.sport} />
              <DetailField label="DATE"  value={pass.date} />
              <DetailField label="TIME"  value={pass.time} />
            </div>

            {/* Quick Tip box — bg rgba(156,255,147,0.05) r:12 p:24 gap:16 */}
            <div className="rounded-xl p-6 flex flex-col gap-3"
                 style={{ background:'rgba(156,255,147,0.05)', border:'1px solid rgba(156,255,147,0.1)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-none"
                     style={{ background:'rgba(156,255,147,0.15)', border:'1px solid rgba(156,255,147,0.3)' }}>
                  <span style={{ fontSize:12, color:'#9CFF93' }}>ℹ</span>
                </div>
                {/* Quick Tip — Space Grotesk Bold 18px */}
                <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Quick Tip</p>
              </div>
              {/* Body — Lexend Regular 14px #9E9E9E */}
              <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#9E9E9E' }}>
                Selected sports will automatically filter for compatible venues in the next step.
                High-demand times are usually weekends between 10 AM and 4 PM.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── PLAYERS SECTION (multi only) ── */}
        {isMulti && pass.players && (
          <motion.div variants={stagger.item} className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                 style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Players</p>
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>
                {pass.players.length} of 8
              </p>
            </div>

            {/* Player rows */}
            <div className="flex flex-col gap-3">
              {pass.players.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.06 }}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                  style={{
                    background: p.role==='HOST' ? '#20201F' : '#131313',
                    border: p.role==='HOST' ? '1px solid rgba(156,255,147,0.2)' : '1px solid transparent',
                  }}>
                  {/* Avatar */}
                  <div className="flex items-center justify-center flex-none rounded-full font-ui font-bold text-[12px]"
                       style={{ width:40, height:40,
                         background: p.role==='HOST' ? 'rgba(156,255,147,0.20)' : '#262626',
                         color: p.role==='HOST' ? '#9CFF93' : '#ADAAAA' }}>
                    {p.id==='me' ? 'Me' : p.avatar}
                  </div>
                  {/* Name + role */}
                  <div className="flex flex-col gap-0.5 flex-1">
                    <p className="font-ui font-semibold text-[14px] text-white">{p.name}</p>
                    <p className="font-ui text-[12px]"
                       style={{ color: p.role==='HOST' ? '#9CFF93' : '#9E9E9E' }}>
                      {p.role}
                    </p>
                  </div>
                  {/* Action */}
                  {p.role !== 'HOST' && (
                    reminded.has(p.id) ? (
                      <div className="flex items-center gap-1.5">
                        <BsFillCheckCircleFill size={12} color="#9CFF93"/>
                        <span className="font-ui font-semibold text-[12px]" style={{ color:'#9CFF93' }}>Sent!</span>
                      </div>
                    ) : (
                      <motion.button whileTap={{ scale:0.95 }}
                        onClick={() => sendReminder(p.id)}
                        className="font-ui font-semibold text-[12px] px-3 py-2 rounded-xl tap-highlight"
                        style={{ background:'#20201F', color:'#ADAAAA', border:'1px solid #2A2A2A' }}>
                        Send Reminder
                      </motion.button>
                    )
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ══ FIXED BOTTOM BUTTONS ══ */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding:'20px 16px 0' }}>

        {/* ADD TO WALLET — Conditional logic based on isToday */}
        <motion.button whileTap={isToday ? { scale:0.97 } : undefined}
          disabled={!isToday}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold mb-4"
          style={{ 
            background: isToday ? '#9CFF93' : '#20201F', 
            color: isToday ? '#006413' : '#555', 
            height:64, borderRadius:9999, fontSize:18,
            transition: 'background 0.25s, color 0.25s',
            cursor: !isToday ? 'not-allowed' : 'pointer'
          }}>
          <LuWallet size={20} color={isToday ? "#006413" : "#555"} strokeWidth={1.8}/>
          ADD TO WALLET
        </motion.button>

        {/* CHECK PAYMENT DETAIL — ghost */}
        <motion.button whileTap={{ scale:0.97 }}
          onClick={() => router.push(`/receipt/${pass.id}`)}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{ background:'rgba(38,38,38,0.10)', border:'1px solid #2A2A2A',
            color:'#9E9E9E', height:64, borderRadius:9999, fontSize:18,
            marginBottom:'max(24px, var(--sab,24px))' }}>
          <LuReceiptText size={20} color="#9E9E9E" strokeWidth={1.8}/>
          CHECK PAYMENT DETAIL
        </motion.button>
      </div>
    </div>
  )
}

function DetailField({ label, value, wide }: { label:string; value:string; wide?:boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${wide ? '' : ''}`}>
      {/* Label — Lexend Regular 12px #ADAAAA */}
      <span className="font-ui text-[12px] uppercase tracking-wider" style={{ color:'#ADAAAA', letterSpacing:'0.08em' }}>
        {label}
      </span>
      {/* Value — Space Grotesk Bold 18px white */}
      <p className="font-heading font-bold text-white" style={{ fontSize:18, lineHeight:1.25 }}>
        {value}
      </p>
    </div>
  )
}
