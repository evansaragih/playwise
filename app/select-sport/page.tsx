'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuInfo } from 'react-icons/lu'
import { MdSportsVolleyball, MdSportsSoccer, MdSportsCricket, MdSportsBasketball } from 'react-icons/md'

const stagger = {
  container: { animate: { transition: { staggerChildren:0.07 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.35, ease:[0.22,1,0.36,1] } } },
}

const PadelIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15.5" cy="8.5" r="5.5" />
    <path d="M11.6 12.4l-6.8 6.8a2 2 0 0 0 2.8 2.8l6.8-6.8" />
    <circle cx="6" cy="18" r="1.5" fill="currentColor" />
  </svg>
)

const TennisIcon = () => (
   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 22A10 10 0 0 0 12 2" strokeWidth="2" />
    <path d="M2 12A10 10 0 0 0 22 12" strokeWidth="2" />
  </svg>
)

const SPORTS = [
  { id: 'Padel',   icon: <PadelIcon /> },
  { id: 'Tennis',  icon: <TennisIcon /> },
  { id: 'Volley',  icon: <MdSportsVolleyball size={28} /> },
  { id: 'Futsal',  icon: <MdSportsSoccer size={28} /> },
  { id: 'Cricket', icon: <MdSportsCricket size={28} /> },
  { id: 'Basket',  icon: <MdSportsBasketball size={28} /> },
]

export default function SelectSportPage() {
  const router = useRouter()
  const [selectedSport, setSelectedSport] = useState<string|null>(null)

  return (
    <div className="bg-[#020202] min-h-[100svh] relative flex flex-col"
         style={{ paddingBottom: 'calc(100px + var(--sab,0px))' }}>
      
      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))', background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: '1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon bg-[#1A1A1A]"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wider" style={{ fontSize:15 }}>
            Create Game
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 64px)' }} />

      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 pt-6 flex flex-col gap-8 flex-1">
        
        {/* Title & Subtitle */}
        <motion.div variants={stagger.item} className="flex flex-col gap-2">
          <h1 className="font-heading font-bold text-white uppercase" style={{ fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Select Sport
          </h1>
          <p className="font-ui text-[14px]" style={{ color: '#ADAAAA' }}>
            Choose the discipline for your next match.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
          {SPORTS.map(s => {
            const isSelected = selectedSport === s.id
            return (
              <motion.button key={s.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedSport(s.id)}
                className="flex flex-col items-center justify-center gap-3 overflow-hidden relative tap-highlight transition-all"
                style={{
                  height: 104,
                  borderRadius: 12,
                  background: isSelected ? 'rgba(156,255,147,0.1)' : '#0E0E0E',
                  border: isSelected ? '1px solid #9CFF93' : '1px solid #1E1E1E',
                  color: isSelected ? '#9CFF93' : '#F5F5F5',
                }}>
                {s.icon}
                <span className="font-heading font-bold text-[18px]">{s.id}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Quick Tip */}
       <motion.div variants={stagger.item} 
             className="rounded-xl p-5 flex flex-col gap-3 mt-auto"
             style={{ background: 'rgba(156,255,147,0.03)', border: '1px solid rgba(156,255,147,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-none"
                 style={{ background: 'rgba(156,255,147,0.15)', border: '1px solid rgba(156,255,147,0.3)' }}>
              <LuInfo size={14} color="#9CFF93" />
            </div>
            <p className="font-heading font-bold text-white" style={{ fontSize: 18 }}>Quick Tip</p>
          </div>
          <p className="font-ui text-[14px] leading-relaxed" style={{ color: '#9E9E9E' }}>
            Selected sports will automatically filter for compatible venues in the next step. High-demand times are usually weekends between 10 AM and 4 PM.
          </p>
        </motion.div>

      </motion.div>

      {/* FIXED CONTINUE BUTTON */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding:'20px 16px max(24px, var(--sab,24px))' }}>
        <motion.button 
          whileTap={selectedSport ? { scale:0.97 } : undefined}
          onClick={() => selectedSport && router.push(`/discover?filter=${selectedSport.toLowerCase()}`)}
          disabled={!selectedSport}
          className="w-full flex items-center justify-center font-heading font-bold uppercase transition-all"
          style={{ 
            height:64, borderRadius:9999, fontSize:18,
            background: selectedSport ? '#9CFF93' : '#20201F',
            color: selectedSport ? '#006413' : '#555',
            cursor: selectedSport ? 'pointer' : 'not-allowed'
          }}>
          Continue
        </motion.button>
      </div>
    </div>
  )
}
