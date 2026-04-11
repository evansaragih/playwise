'use client'
import { useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuChevronRight, LuCreditCard } from 'react-icons/lu'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { mockVenues } from '@/lib/mock-data'

function fmtRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}` }

export default function BookingConfirmedPage() {
  const { id }  = useParams<{ id: string }>()
  const router   = useRouter()
  const sp       = useSearchParams()
  const venue    = mockVenues.find(v => v.id === id)

  const total  = parseInt(sp.get('total') || '0')
  const method = sp.get('method') || 'Visa **** 4242'

  /* ── Clear history so back can't go to booking summary ──
     Replace the entire history stack with just this page.
     On iOS PWA, history.pushState tricks don't work reliably,
     so we intercept the popstate as a fallback.            */
  useEffect(() => {
    // Replace all previous history entries so the back gesture goes to /home
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.href)
      const onPop = () => { router.replace('/home') }
      window.addEventListener('popstate', onPop)
      return () => window.removeEventListener('popstate', onPop)
    }
  }, [router])

  return (
    /*
      Layout mirrors Figma exactly:
      - Full screen column (100svh)
      - Status bar spacer at top
      - Fixed top bar (56px)
      - Main content: flex-col with big icon/text block centred
        in the TOP half, payment summary card in the MIDDLE,
        then flex-1 spacer pushing buttons to the BOTTOM
    */
    <div className="bg-[#020202] flex flex-col"
         style={{ height:'100svh', overflow:'hidden' }}>

      {/* ══ TOP BAR (fixed-in-flow, not position:fixed) ══ */}
      <div style={{ background:'#0E0E0E', flexShrink:0 }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4"
             style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          {/* Back goes home, not to booking summary */}
          <motion.button whileTap={{ scale:0.9 }}
            onClick={() => router.replace('/home')}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide"
             style={{ fontSize:16 }}>
            Booking Confirmed
          </p>
        </div>
      </div>

      {/* ══ SCROLLABLE BODY ══ */}
      <div className="flex-1 flex flex-col px-4 overflow-y-auto"
           style={{ paddingBottom:'max(24px, var(--sab,24px))' }}>

        {/* ── Icon + copy — centred in top area ── */}
        <motion.div
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
          className="flex flex-col items-center pt-12 pb-10">

          {/* Pulsing green circle — Figma: 96×96, rgba(156,255,147,0.20) bg */}
          <div className="relative flex items-center justify-center mb-8"
               style={{ width:96, height:96 }}>
            {/* Outer pulse */}
            <motion.div
              animate={{ scale:[1, 1.55], opacity:[0.35, 0] }}
              transition={{ repeat:Infinity, duration:1.8, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(156,255,147,0.20)' }} />
            <motion.div
              animate={{ scale:[1, 1.3], opacity:[0.25, 0] }}
              transition={{ repeat:Infinity, duration:1.8, delay:0.35, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(156,255,147,0.15)' }} />
            {/* Icon circle */}
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ delay:0.15, type:'spring', stiffness:280, damping:18 }}
              className="relative flex items-center justify-center rounded-full"
              style={{ width:96, height:96,
                background:'rgba(156,255,147,0.20)',
                border:'2px solid rgba(156,255,147,0.35)' }}>
              <BsFillCheckCircleFill size={48} color="#9CFF93" />
            </motion.div>
          </div>

          {/* PAYMENT SUCCESSFUL! — Space Grotesk Bold 22px white */}
          <motion.p
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.25 }}
            className="font-heading font-bold text-white text-center"
            style={{ fontSize:22, marginBottom:8 }}>
            PAYMENT SUCCESSFUL!
          </motion.p>

          {/* Subtitle — Lexend Regular 14px #ADAAAA */}
          <motion.p
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.32 }}
            className="font-ui text-[14px] text-center"
            style={{ color:'#ADAAAA' }}>
            Your booking at{' '}
            <span className="font-semibold text-white">
              {venue?.name || 'SportHub Arena'}
            </span>
            {' '}is confirmed.
          </motion.p>
        </motion.div>

        {/* ── PAYMENT SUMMARY CARD — bg:#20201F r:16 p:24 ── */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.38, duration:0.4, ease:[0.22,1,0.36,1] }}
          className="rounded-2xl px-6 py-6 flex flex-col gap-0"
          style={{ background:'#20201F' }}>

          {/* PAYMENT SUMMARY — Lexend SemiBold 14px #ADAAAA */}
          <p className="font-ui font-semibold text-[14px] uppercase tracking-wider mb-4"
             style={{ color:'#ADAAAA', letterSpacing:'0.05em' }}>
            Payment Summary
          </p>

          {/* Total Paid */}
          <div className="flex justify-between items-center py-3"
               style={{ borderBottom:'1px solid #2A2A2A' }}>
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>
              Total Paid
            </span>
            {/* Space Grotesk Bold 18px white */}
            <span className="font-heading font-bold text-white" style={{ fontSize:18 }}>
              {total > 0 ? fmtRp(total) : 'Rp 1,781,000'}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center pt-3">
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>
              Payment Method
            </span>
            <div className="flex items-center gap-2">
              <LuCreditCard size={14} color="#ADAAAA" strokeWidth={1.5} />
              <span className="font-ui text-[14px] text-white">{method}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Spacer — pushes buttons to the bottom like Figma ── */}
        <div className="flex-1" />

        {/* ── BUTTONS at the very bottom ── */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5, duration:0.4, ease:[0.22,1,0.36,1] }}
          className="flex flex-col gap-4 pb-6">

          {/* VIEW BOOKING DETAILS — bg:#9CFF93 r:9999 h:64 */}
          <motion.button whileTap={{ scale:0.97 }}
            onClick={() => router.push('/games')}
            className="w-full flex items-center justify-center gap-2 font-heading font-bold"
            style={{ background:'#9CFF93', color:'#006413',
              height:64, borderRadius:9999, fontSize:18 }}>
            VIEW BOOKING DETAILS
            <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />
          </motion.button>

          {/* BACK TO HOME — ghost, rgba(38,38,38,0.10), #9E9E9E */}
          <motion.button whileTap={{ scale:0.97 }}
            onClick={() => router.replace('/home')}
            className="w-full flex items-center justify-center font-heading font-bold"
            style={{ background:'rgba(38,38,38,0.10)',
              border:'1px solid #2A2A2A',
              color:'#9E9E9E',
              height:64, borderRadius:9999, fontSize:18 }}>
            BACK TO HOME
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}
