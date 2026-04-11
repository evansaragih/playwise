'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import { LuCoins, LuTimer, LuTrendingDown, LuCircleCheck, LuChartSpline } from 'react-icons/lu'
import { HiArrowNarrowDown } from 'react-icons/hi'
import { MdSportsTennis } from 'react-icons/md'
import { IoTennisball, IoFootball, IoBasketball } from 'react-icons/io5'
import { MdSportsCricket } from 'react-icons/md'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
import { InsightsSkeleton } from '@/components/ui/Skeleton'

/* ── Exact Figma bar data: heights in px out of 128 container ── */
const CHART_BARS = [
  { month:'jan', h:51,  active:false },
  { month:'feb', h:83,  active:false },
  { month:'mar', h:58,  active:false },
  { month:'apr', h:109, active:false },
  { month:'May', h:128, active:true  },
]

const SPORT_FILTERS = ['All','Padel','Tennis','Futsal','Cricket','Basket']

const SPORT_FILTER_ICONS: Record<string, React.ReactNode> = {
  All:     <IoFootball size={12} />,
  Padel:   <MdSportsTennis size={12} />,
  Tennis:  <IoTennisball size={12} />,
  Futsal:  <IoFootball size={12} />,
  Cricket: <MdSportsCricket size={12} />,
  Basket:  <IoBasketball size={12} />,
}

const VENUE_PRICES = [
  { name:'Padel City',     type:'Member Price',  price:'Rp 280,000', badge:'Lowest', badgeColor:'#9CFF93',  priceColor:'#9CFF93' },
  { name:'The Smash Club', type:'Public Rate',   price:'Rp 350,000', badge:'-25%',   badgeColor:'#FF4444',  priceColor:'#FFFFFF' },
  { name:'Vista Padel',    type:'Public Rate',   price:'Rp 420,000', badge:'Peak Hours', badgeColor:'#ADAAAA', priceColor:'#FFFFFF' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren:0.07 } } },
  item: { initial:{ opacity:0, y:20 }, animate:{ opacity:1, y:0, transition:{ duration:0.4, ease:[0.22,1,0.36,1] } } },
}

export default function InsightsPage() {
  const [loading, setLoading]     = useState(true)
  const [activeSport, setSport]   = useState('Padel')
  const chartRef                  = useRef<HTMLDivElement>(null)
  const chartInView               = useInView(chartRef, { once:true, margin:'-50px' })

  useEffect(() => { setTimeout(()=>setLoading(false), 1300) }, [])
  if (loading) return <div className="min-h-screen bg-[#020202] pb-24"><InsightsSkeleton /></div>

  return (
    <div className="bg-[#020202] min-h-screen page-fade-bottom" style={{ paddingBottom: "calc(88px + var(--sab, 0px))" }}>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ══ TOP BAR ══ */}
        <motion.div variants={stagger.item} style={{ background:'#0E0E0E' }}>
          <div className="status-bar-spacer" />
          <div className="px-4 pb-4 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 h-[46px] rounded-xl px-4 flex-1"
                 style={{ background:'#000000' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Find your next arena...</span>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <Link href="/notifications">
                <div className="liquid-glass-icon flex items-center justify-center relative cursor-pointer tap-highlight"
                     style={{ width:46, height:46, borderRadius:9999 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    <path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8a10 10 0 0 0-2-6"/>
                  </svg>
                  <span className="absolute top-[10px] right-[10px] w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6 px-4 pt-6">

          {/* ══ SECTION 1 — MONTHLY SPENDING ══ */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap:16 }}>
            {/* Header row */}
            <div className="flex items-end justify-between">
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {/* "MONTHLY SPENDING" — Lexend SemiBold 12px #ADAAAA */}
                <span className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                      style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Monthly Spending</span>
                {/* Amount — Space Grotesk Bold 32px white */}
                <p className="font-heading font-bold" style={{ fontSize:32, lineHeight:1 }}>Rp 4,482,500</p>
              </div>
              {/* +12% chip — bg rgba(156,255,147,0.20) r:4 */}
              <span className="font-ui font-semibold text-[12px] px-3 py-1 rounded"
                    style={{ background:'rgba(156,255,147,0.20)', color:'#9CFF93' }}>
                +12% vs Last Month
              </span>
            </div>

            {/* ── BAR CHART — bg:#201F1F r:12 p:20 ── */}
            <div ref={chartRef} className="rounded-xl p-5 flex flex-col" style={{ background:'#201F1F', gap:12 }}>
              <div className="flex items-end gap-3" style={{ height:128 }}>
                {CHART_BARS.map((bar, i) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center justify-end">
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{ background: bar.active ? '#9CFF93' : '#262626' }}
                      initial={{ height:0 }}
                      animate={{ height: chartInView ? bar.h : 0 }}
                      transition={{ delay:i*0.08+0.2, duration:0.65, ease:[0.22,1,0.36,1] }}
                    />
                  </div>
                ))}
              </div>
              {/* Month labels */}
              <div className="flex gap-3">
                {CHART_BARS.map(bar => (
                  <div key={bar.month} className="flex-1 text-center">
                    {/* Space Grotesk: Regular for inactive, Bold #9CFF93 for active */}
                    <span className="font-heading text-[10px]"
                          style={{ fontWeight: bar.active ? 700 : 400, color: bar.active ? '#9CFF93' : '#ADAAAA' }}>
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ══ SECTION 2 — AI RECOMMENDATION ══
              bg:#20201F@40%, r:24, p:24, with green glow orb overlay
          ══ */}
          <motion.div variants={stagger.item}
            className="relative overflow-hidden rounded-3xl p-6 flex flex-col"
            style={{ background:'rgba(32,32,31,0.40)', border:'1px solid #2A2A2A', gap:24 }}>
            {/* Glow orb — bg rgba(156,255,147,0.10) r:9999 absolute */}
            <div className="absolute" style={{ width:192, height:192, background:'rgba(156,255,147,0.10)', borderRadius:9999, top:-40, right:-40, pointerEvents:'none' }} />
            <div className="relative flex flex-col" style={{ gap:8 }}>
              {/* "Best Value for your habits" — Space Grotesk Bold 18px #9CFF93 */}
              <p className="font-heading font-bold text-[18px]" style={{ color:'#9CFF93' }}>
                Best Value for your habits
              </p>
              {/* Venue name — Space Grotesk Bold 22px white */}
              <p className="font-heading font-bold" style={{ fontSize:22, color:'#FFFFFF' }}>
                Smash Hub Kuningan
              </p>
              {/* Description — Lexend Regular 14px #ADAAAA */}
              <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#ADAAAA' }}>
                Based on your Tuesday night patterns, this venue offers the best loyalty rate today.
              </p>
            </div>
            {/* Price row */}
            <div className="flex items-center justify-between relative">
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-[18px]" style={{ color:'#9CFF93' }}>Rp 120.000</span>
                <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>/hr</span>
              </div>
              {/* "32% Below Market" badge — Inter Bold 10px #9CFF93 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                   style={{ background:'rgba(156,255,147,0.15)', border:'1px solid rgba(156,255,147,0.3)' }}>
                <LuCircleCheck size={12} color="#9CFF93" />
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:700, color:'#9CFF93' }}>
                  32% Below Market
                </span>
              </div>
            </div>
          </motion.div>

          {/* ══ SECTION 3 — SPORT BREAKDOWN ══ */}
          <motion.div variants={stagger.item}
            className="rounded-2xl p-6 flex flex-col"
            style={{ background:'#20201F', gap:16 }}>
            <div className="flex items-center justify-between">
              {/* "Sport Breakdown" — Space Grotesk Bold 18px */}
              <p className="font-heading font-bold text-white text-[18px]">Sport Breakdown</p>
              <LuChartSpline size={18} color="#ADAAAA" />
            </div>
            {/* Padel bar */}
            <SportBreakdownBar sport="Padel" amount="Rp 2,913,625 (65%)" pct={65} color="#9CFF93" />
            {/* Tennis bar */}
            <SportBreakdownBar sport="Tennis" amount="Rp 1,568,875 (35%)" pct={35} color="#0EEAFD" />
          </motion.div>

          {/* ══ SECTION 4 — BENTO STATS GRID ══ */}
          <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
            {/* Average Cost */}
            <div className="rounded-2xl p-5 flex flex-col" style={{ background:'#20201F', gap:8 }}>
              <div className="flex items-center gap-2">
                <LuCoins size={16} color="#00CFFC" />
                {/* "Average Cost" — Space Grotesk Bold 18px #00CFFC */}
                <p className="font-heading font-bold text-[14px]" style={{ color:'#00CFFC' }}>Average Cost</p>
              </div>
              <p className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Per game played</p>
              {/* Amount — Space Grotesk Bold 32px white */}
              <p className="font-heading font-bold" style={{ fontSize:28, color:'#FFFFFF', lineHeight:1 }}>Rp 222,440</p>
              <div className="flex items-center gap-1">
                <HiArrowNarrowDown size={12} color="#9CFF93" />
                <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>-4% efficiency</span>
              </div>
            </div>
            {/* Peak Hour Trend */}
            <div className="rounded-2xl p-5 flex flex-col" style={{ background:'#20201F', gap:8 }}>
              <div className="flex items-center gap-2">
                <LuTimer size={16} color="#9CFF93" />
                {/* "Peak Hour Trend" — Space Grotesk Bold 18px #9CFF93 */}
                <p className="font-heading font-bold text-[14px]" style={{ color:'#9CFF93' }}>Peak Hour</p>
              </div>
              <p className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Per game played</p>
              {/* Value — Space Grotesk Bold 32px white */}
              <p className="font-heading font-bold" style={{ fontSize:32, color:'#FFFFFF', lineHeight:1 }}>-12%</p>
              <div className="flex items-center gap-1">
                <HiArrowNarrowDown size={12} color="#9CFF93" />
                <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>-4% efficiency</span>
              </div>
            </div>
          </motion.div>

          {/* ══ SECTION 5 — VENUE PRICE COMPARISON ══ */}
          <motion.div variants={stagger.item} className="flex flex-col" style={{ gap:12 }}>
            {/* Label — Lexend SemiBold 12px #ADAAAA uppercase */}
            <span className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                  style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Venue Price Comparison</span>

            {/* Sport filter chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SPORT_FILTERS.map(s => (
                <motion.button key={s} whileTap={{ scale:0.95 }}
                  onClick={() => setSport(s)}
                  className="flex-none flex items-center gap-1.5 font-ui font-semibold text-[12px] h-8 px-3 rounded-full transition-all"
                  style={activeSport===s || (s==='All' && activeSport==='All')
                    ? { background:'#9CFF93', color:'#006413' }
                    : { background:'#20201F', color:'#ADAAAA' }}>
                  <span style={{ color: activeSport===s ? '#006413' : '#ADAAAA' }}>
                    {SPORT_FILTER_ICONS[s]}
                  </span>
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Price rows */}
            <AnimatePresence mode="wait">
              <motion.div key={activeSport}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }} transition={{ duration:0.2 }}
                className="flex flex-col" style={{ gap:8 }}>
                {VENUE_PRICES.map((v, i) => (
                  <motion.div key={v.name}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i*0.06 }}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background:'#20201F' }}>
                    {/* Avatar circle */}
                    <div className="flex items-center justify-center font-heading font-bold text-[14px] flex-none"
                         style={{ width:40, height:40, background:'#262626', borderRadius:9999, color:'#9E9E9E' }}>
                      {v.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Venue name — Lexend SemiBold 14px white */}
                      <p className="font-ui font-semibold text-[14px] text-white">{v.name}</p>
                      {/* Type — Lexend Regular 12px #ADAAAA */}
                      <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{v.type}</p>
                    </div>
                    <div className="text-right flex-none">
                      {/* Price — Space Grotesk Bold 18px */}
                      <p className="font-heading font-bold text-[18px]" style={{ color:v.priceColor }}>{v.price}</p>
                      {/* Badge — Lexend Regular 12px */}
                      <span className="font-ui text-[12px]" style={{ color:v.badgeColor }}>{v.badge}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="h-2" />
        </div>
      </motion.div>

      <BottomNav />
    </div>
  )
}

/* ── Sport breakdown progress bar ── */
function SportBreakdownBar({ sport, amount, pct, color }: { sport:string; amount:string; pct:number; color:string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-30px' })
  return (
    <div ref={ref} className="flex flex-col" style={{ gap:8 }}>
      <div className="flex justify-between items-center">
        <span className="font-ui text-[14px] text-white">{sport}</span>
        <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{amount}</span>
      </div>
      <div style={{ height:6, background:'#2A2A2A', borderRadius:9999 }}>
        <motion.div style={{ height:6, background:color, borderRadius:9999 }}
          initial={{ width:0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ delay:0.3, duration:0.8, ease:[0.22,1,0.36,1] }} />
      </div>
    </div>
  )
}
