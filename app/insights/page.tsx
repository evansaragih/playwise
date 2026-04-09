'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Star, Zap, Clock } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import { InsightsSkeleton } from '@/components/ui/Skeleton'
import { mockInsights } from '@/lib/mock-data'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  },
}

const sportFilters = ['All', 'Padel', 'Tennis', 'Futsal', 'Cricket', 'Basket']

export default function InsightsPage() {
  const [loading, setLoading] = useState(true)
  const [activeSport, setActiveSport] = useState('Padel')
  const [chartVisible, setChartVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setLoading(false), 1300) }, [])

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setChartVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading) return <div className="min-h-screen pb-20"><InsightsSkeleton /></div>

  const maxChart = Math.max(...mockInsights.chart.map(d => d.value))

  return (
    <PageWrapper>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ── HEADER ── */}
        <motion.div variants={stagger.item} className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Insights</h1>
        </motion.div>

        {/* ── MONTHLY SPENDING CARD ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#20201F' }}>

          <p className="text-[10px] font-bold tracking-widest text-neutral uppercase mb-1">Monthly Spending</p>

          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-black text-white">{mockInsights.monthlySpend}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={12} color="#00FF41" />
                <span className="text-xs font-semibold" style={{ color: '#00FF41' }}>
                  {mockInsights.vsLastMonth}
                </span>
              </div>
            </div>
          </div>

          {/* Animated Bar Chart */}
          <div ref={chartRef} className="flex items-end gap-2 h-24">
            {mockInsights.chart.map((d, i) => {
              const pct = (d.value / maxChart) * 100
              const isLast = i === mockInsights.chart.length - 1
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{ background: isLast ? '#00FF41' : '#2A3A2A' }}
                    initial={{ height: 0 }}
                    animate={{ height: chartVisible ? `${pct}%` : 0 }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="text-[10px] text-neutral">{d.month}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ── BEST VALUE CARD ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#0A1F0A', border: '1px solid #1A3A1A' }}>
          <div className="flex items-start gap-2 mb-2">
            <Star size={14} fill="#00FF41" color="#00FF41" />
            <p className="text-xs font-bold" style={{ color: '#9CFF93' }}>
              {mockInsights.bestValue.title}
            </p>
          </div>
          <p className="text-base font-black text-white mb-1">{mockInsights.bestValue.venue}</p>
          <p className="text-xs text-neutral leading-relaxed mb-3">{mockInsights.bestValue.desc}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">{mockInsights.bestValue.price}</span>
              <span className="text-xs text-neutral">/hr</span>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: '#006413', color: '#00FF41' }}>
              {mockInsights.bestValue.badge}
            </span>
          </div>
        </motion.div>

        {/* ── SPORT BREAKDOWN ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#20201F' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Sport Breakdown</p>
            <TrendingUp size={14} color="#9E9E9E" />
          </div>
          <div className="space-y-4">
            {mockInsights.sportBreakdown.map((s, i) => (
              <div key={s.sport}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-white">{s.sport}</span>
                  <span className="text-sm font-bold" style={{ color: '#9CFF93' }}>{s.amount} ({s.pct}%)</span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: '#2A2A2A' }}>
                  <motion.div className="h-2 rounded-full"
                    style={{ background: i === 0 ? '#00FF41' : '#0EEAFD' }}
                    initial={{ width: 0 }}
                    animate={{ width: chartVisible ? `${s.pct}%` : 0 }}
                    transition={{ delay: i * 0.1 + 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 grid grid-cols-2 gap-3">
          {/* Average Cost */}
          <div className="rounded-2xl p-4" style={{ background: '#20201F' }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} color="#9CFF93" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral">Average Cost</p>
            </div>
            <p className="text-[10px] text-neutral mb-1">Per game played</p>
            <p className="text-xl font-black text-white">{mockInsights.avgCost.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown size={11} color="#9CFF93" />
              <span className="text-[10px] font-semibold" style={{ color: '#9CFF93' }}>
                {mockInsights.avgCost.label}
              </span>
            </div>
          </div>

          {/* Peak Hour Trend */}
          <div className="rounded-2xl p-4" style={{ background: '#20201F' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} color="#0EEAFD" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral">Peak Hour</p>
            </div>
            <p className="text-[10px] text-neutral mb-1">Per game played</p>
            <p className="text-3xl font-black text-white">{mockInsights.peakHour.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown size={11} color="#9CFF93" />
              <span className="text-[10px] font-semibold" style={{ color: '#9CFF93' }}>
                {mockInsights.peakHour.label}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── VENUE PRICE COMPARISON ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral mb-3">
            Venue Price Comparison
          </p>

          {/* Sport filter pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
            {sportFilters.map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSport(s)}
                className="flex-none px-4 h-8 rounded-full text-xs font-semibold transition-all"
                style={activeSport === s
                  ? { background: '#00FF41', color: '#020202' }
                  : { background: '#1E1E1E', color: '#9E9E9E', border: '1px solid #2A2A2A' }
                }>
                {s}
              </motion.button>
            ))}
          </div>

          {/* Price rows */}
          <AnimatePresence mode="wait">
            <motion.div key={activeSport}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="space-y-2">
              {mockInsights.venuePrices.map((v, i) => (
                <motion.div key={v.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: '#20201F' }}>
                  {/* Avatar circle */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-none"
                       style={{ background: '#2A2A2A', color: '#9E9E9E' }}>
                    {v.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{v.name}</p>
                    <p className="text-[10px] text-neutral">{v.type}</p>
                  </div>
                  <div className="text-right flex-none">
                    <p className="text-sm font-black text-white">{v.price}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: v.badgeColor + '22', color: v.badgeColor }}>
                      {v.badge}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </PageWrapper>
  )
}
