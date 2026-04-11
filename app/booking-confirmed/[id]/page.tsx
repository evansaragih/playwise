'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuChevronRight, LuCreditCard } from 'react-icons/lu'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { mockVenues } from '@/lib/mock-data'

function fmtRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}` }

const stagger = {
  container: { animate: { transition: { staggerChildren:0.08 } } },
  item: { initial:{ opacity:0, y:20 }, animate:{ opacity:1, y:0, transition:{ duration:0.4, ease:[0.22,1,0.36,1] } } },
}

export default function BookingConfirmedPage() {
  const { id }  = useParams<{ id:string }>()
  const router   = useRouter()
  const sp       = useSearchParams()
  const venue    = mockVenues.find(v => v.id === id)

  const total  = parseInt(sp.get('total') || '0')
  const method = sp.get('method') || 'Visa **** 4242'

  return (
    <div className="bg-[#020202] min-h-screen flex flex-col">

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
            Booking Confirmed
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 56px)' }} />

      {/* ══ MAIN CONTENT — centred vertically ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-12">

        {/* ── SUCCESS ICON + COPY ── */}
        <motion.div variants={stagger.item} className="flex flex-col items-center gap-8">
          {/* Pulsing green circle */}
          <div className="relative flex items-center justify-center" style={{ width:96, height:96 }}>
            {/* Outer pulse rings */}
            <motion.div
              animate={{ scale:[1,1.5], opacity:[0.3,0] }}
              transition={{ repeat:Infinity, duration:1.8, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(156,255,147,0.20)' }} />
            <motion.div
              animate={{ scale:[1,1.3], opacity:[0.25,0] }}
              transition={{ repeat:Infinity, duration:1.8, delay:0.4, ease:'easeOut' }}
              className="absolute rounded-full"
              style={{ width:96, height:96, background:'rgba(156,255,147,0.15)' }} />
            {/* Icon circle */}
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ delay:0.2, type:'spring', stiffness:280, damping:18 }}
              className="relative flex items-center justify-center rounded-full"
              style={{ width:96, height:96, background:'rgba(156,255,147,0.20)', border:'2px solid rgba(156,255,147,0.4)' }}>
              <BsFillCheckCircleFill size={48} color="#9CFF93" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* PAYMENT SUCCESSFUL! — Space Grotesk Bold 22px */}
            <motion.p variants={stagger.item}
              className="font-heading font-bold text-white text-center" style={{ fontSize:22 }}>
              PAYMENT SUCCESSFUL!
            </motion.p>
            {/* Subtitle — Lexend Regular 14px */}
            <motion.p variants={stagger.item}
              className="font-ui text-[14px] text-center" style={{ color:'#ADAAAA' }}>
              Your booking at{' '}
              <span className="font-semibold text-white">{venue?.name || 'SportHub Arena'}</span>
              {' '}is confirmed.
            </motion.p>
          </div>
        </motion.div>

        {/* ── PAYMENT SUMMARY CARD — bg:#20201F r:16 p:24 ── */}
        <motion.div variants={stagger.item}
          className="w-full rounded-2xl flex flex-col gap-4"
          style={{ background:'#20201F', padding:'24px' }}>
          {/* PAYMENT SUMMARY — Lexend SemiBold 14px #ADAAAA */}
          <p className="font-ui font-semibold text-[14px] uppercase tracking-wider"
             style={{ color:'#ADAAAA', paddingBottom:8, borderBottom:'1px solid #2A2A2A' }}>
            Payment Summary
          </p>

          {/* Total Paid row */}
          <div className="flex justify-between items-center">
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Total Paid</span>
            {/* Space Grotesk Bold 18px white */}
            <span className="font-heading font-bold text-white" style={{ fontSize:18 }}>
              {total > 0 ? fmtRp(total) : 'Rp 1,781,000'}
            </span>
          </div>

          {/* Payment Method row — divider above */}
          <div className="flex justify-between items-center"
               style={{ borderTop:'1px solid #2A2A2A', paddingTop:16 }}>
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Payment Method</span>
            <div className="flex items-center gap-2">
              <LuCreditCard size={14} color="#ADAAAA" strokeWidth={1.5} />
              <span className="font-ui text-[14px] text-white">{method}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ══ FIXED BOTTOM BUTTONS ══ */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding:'20px 16px 0' }}>

        {/* VIEW BOOKING DETAILS — bg:#9CFF93 r:9999 h:64 */}
        <motion.button
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5, type:'spring', stiffness:280, damping:24 }}
          whileTap={{ scale:0.97 }}
          onClick={() => router.push('/games')}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold mb-4"
          style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18 }}>
          VIEW BOOKING DETAILS
          <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />
        </motion.button>

        {/* BACK TO HOME — bg rgba(38,38,38,0.10) #9E9E9E */}
        <motion.button
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.6, type:'spring', stiffness:280, damping:24 }}
          whileTap={{ scale:0.97 }}
          onClick={() => router.push('/home')}
          className="w-full flex items-center justify-center font-heading font-bold"
          style={{ background:'rgba(38,38,38,0.10)', border:'1px solid #2A2A2A',
            color:'#9E9E9E', height:64, borderRadius:9999, fontSize:18,
            marginBottom:'max(24px,var(--sab,24px))' }}>
          BACK TO HOME
        </motion.button>
      </div>
    </div>
  )
}
