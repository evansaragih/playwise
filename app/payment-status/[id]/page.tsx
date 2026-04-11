'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LuChevronLeft, LuChevronRight, LuBell } from 'react-icons/lu'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { TiWarning } from 'react-icons/ti'
import { MdTimer } from 'react-icons/md'
import { mockVenues } from '@/lib/mock-data'

interface Player {
  id: string; name: string; avatar: string
  role: 'host' | 'player'
  status: 'paid' | 'pending'
}

const PLAYERS: Player[] = [
  { id:'me', name:'Alex Johnson', avatar:'AJ', role:'host',   status:'paid' },
  { id:'p2', name:'Marcus Chen',  avatar:'MC', role:'player', status:'paid' },
  { id:'p3', name:'Sarah',        avatar:'S',  role:'player', status:'pending' },
  { id:'p4', name:'Eric Cloe',    avatar:'EC', role:'player', status:'pending' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren:0.07 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.35, ease:[0.22,1,0.36,1] } } },
}

export default function PaymentStatusPage() {
  const { id } = useParams<{ id:string }>()
  const router  = useRouter()
  const sp      = useSearchParams()

  const [seconds, setSeconds] = useState(15*60+42)
  const [players, setPlayers] = useState<Player[]>(PLAYERS)
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [remindAll, setRemindAll] = useState(false)

  useEffect(()=>{
    const t = setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000)
    return ()=>clearInterval(t)
  },[])
  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  const paidCount    = players.filter(p=>p.status==='paid').length
  const pendingCount = players.filter(p=>p.status==='pending').length

  const sendReminder = (pid: string) => {
    setReminded(prev=>{ const n=new Set(prev); n.add(pid); return n })
    // simulate: after 3s flip to paid (demo only)
    setTimeout(()=>{
      setPlayers(prev=>prev.map(p=>p.id===pid ? {...p, status:'paid'} : p))
    }, 3000)
  }
  const sendAll = () => {
    setRemindAll(true)
    players.filter(p=>p.status==='pending').forEach(p=>sendReminder(p.id))
  }

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(160px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))', background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4" style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={()=>router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Payment Status
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 56px)' }} />

      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 flex flex-col gap-6 pt-6">

        {/* ── STATUS ICON + COPY ── */}
        <motion.div variants={stagger.item} className="flex flex-col items-center gap-6 pt-4">
          <div className="relative flex items-center justify-center" style={{ width:96, height:96 }}>
            {/* Amber pulse rings */}
            <motion.div
              animate={{ scale:[1,1.5], opacity:[0.3,0] }}
              transition={{ repeat:Infinity, duration:1.8, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(255,184,0,0.20)' }} />
            <motion.div
              animate={{ scale:[1,1.3], opacity:[0.2,0] }}
              transition={{ repeat:Infinity, duration:1.8, delay:0.4, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(255,184,0,0.15)' }} />
            {/* Warning icon circle */}
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ delay:0.1, type:'spring', stiffness:280, damping:18 }}
              className="relative flex items-center justify-center rounded-full"
              style={{ width:96, height:96, background:'rgba(255,184,0,0.20)', border:'2px solid rgba(255,184,0,0.4)' }}>
              <TiWarning size={48} color="#FFB800" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* AWAITING PAYMENT — Space Grotesk Bold 22px */}
            <p className="font-heading font-bold text-white text-center" style={{ fontSize:22 }}>
              AWAITING PAYMENT
            </p>
            {/* Subtitle — Lexend Regular 14px #ADAAAA */}
            <p className="font-ui text-[14px] text-center" style={{ color:'#ADAAAA' }}>
              The booking is currently on hold
            </p>
          </div>
        </motion.div>

        {/* ── RESERVATION TIMER ──
            bg rgba(38,38,38,0.50) r:9999 px:24 py:12 h:50 */}
        <motion.div variants={stagger.item}
          className="flex items-center gap-3 px-6 rounded-full"
          style={{ background:'rgba(38,38,38,0.50)', height:50, border:'1px solid #2A2A2A' }}>
          <MdTimer size={24} color="#FF4444" />
          <span className="font-ui text-[14px] flex-1" style={{ color:'#ADAAAA' }}>
            Reservation expires in
          </span>
          {/* Countdown — Space Grotesk Bold 18px white */}
          <span className="font-heading font-bold" style={{ fontSize:18, color: seconds < 300 ? '#FF4444' : '#FFFFFF' }}>
            {mm}:{ss}
          </span>
        </motion.div>

        {/* ── PLAYER STATUS ── */}
        <motion.div variants={stagger.item} className="flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
               style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Player Status</p>
            <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>
              {paidCount} of {players.length} Paid
            </p>
          </div>

          {/* Player rows */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {players.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.06 }}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                  style={{ background:'#131313', border:'1px solid #1E1E1E' }}>

                  {/* Avatar */}
                  <div className="flex items-center justify-center flex-none rounded-full font-ui font-bold text-[12px] relative"
                       style={{ width:40, height:40,
                         background: p.status==='paid' && p.role==='host'
                           ? 'rgba(156,255,147,0.20)'
                           : p.status==='paid'
                             ? '#262626'
                             : '#262626',
                         color: p.status==='paid' && p.role==='host' ? '#9CFF93' : '#ADAAAA' }}>
                    {p.role==='host' && p.id==='me'
                      ? <span style={{ fontSize:11, color:'#9CFF93', fontWeight:700 }}>Me</span>
                      : p.avatar}
                  </div>

                  {/* Name + role */}
                  <div className="flex flex-col gap-0.5 flex-1">
                    <p className="font-ui font-semibold text-[14px] text-white">{p.name}</p>
                    <p className="font-ui text-[12px] uppercase"
                       style={{ color: p.role==='host' ? '#9CFF93' : '#9E9E9E' }}>
                      {p.role === 'host' ? 'HOST' : 'PLAYER'}
                    </p>
                  </div>

                  {/* Status or Send Reminder */}
                  {p.status === 'paid' ? (
                    <div className="flex items-center gap-1.5">
                      <BsFillCheckCircleFill size={12} color="#9CFF93" />
                      <span className="font-ui text-[12px]" style={{ color:'#9CFF93' }}>PAID</span>
                    </div>
                  ) : (
                    <motion.button whileTap={{ scale:0.95 }}
                      onClick={() => sendReminder(p.id)}
                      disabled={reminded.has(p.id)}
                      className="flex items-center gap-1.5 font-ui font-semibold text-[12px] px-3 py-2 rounded-xl tap-highlight"
                      style={{
                        background: reminded.has(p.id) ? 'rgba(156,255,147,0.10)' : '#20201F',
                        color: reminded.has(p.id) ? '#9CFF93' : '#ADAAAA',
                        border: reminded.has(p.id) ? '1px solid rgba(156,255,147,0.2)' : '1px solid #2A2A2A',
                        transition:'all 0.2s',
                      }}>
                      {reminded.has(p.id) ? (
                        <><LuBell size={12} color="#9CFF93"/><span>Sent!</span></>
                      ) : (
                        'Send Reminder'
                      )}
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </motion.div>

      {/* ══ FIXED BOTTOM BUTTONS ══ */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding:'20px 16px 0' }}>

        {/* SEND REMINDER TO ALL — bg:#9CFF93 r:9999 h:64 */}
        <motion.button whileTap={{ scale:0.97 }}
          onClick={sendAll}
          disabled={pendingCount === 0}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold mb-4"
          style={{
            background: pendingCount > 0 ? '#9CFF93' : '#20201F',
            color: pendingCount > 0 ? '#006413' : '#555',
            height:64, borderRadius:9999, fontSize:18,
            transition:'background 0.25s, color 0.25s',
            cursor: pendingCount > 0 ? 'pointer' : 'not-allowed',
          }}>
          {pendingCount === 0 ? (
            <><BsFillCheckCircleFill size={18} color="#9CFF93" /><span style={{ color:'#9CFF93' }}>All Paid!</span></>
          ) : (
            <>SEND REMINDER TO ALL<LuChevronRight size={20} color="#006413" strokeWidth={2.5}/></>
          )}
        </motion.button>

        {/* VIEW BOOKING DETAILS — ghost button */}
        <motion.button whileTap={{ scale:0.97 }}
          onClick={() => router.push('/games')}
          className="w-full flex items-center justify-center font-heading font-bold"
          style={{ background:'rgba(38,38,38,0.10)', border:'1px solid #2A2A2A',
            color:'#9E9E9E', height:64, borderRadius:9999, fontSize:18,
            marginBottom:'max(24px,var(--sab,24px))' }}>
          VIEW BOOKING DETAILS
        </motion.button>
      </div>
    </div>
  )
}
