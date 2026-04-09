'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Clock, Star, LayoutList, Map } from 'lucide-react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { DiscoverSkeleton } from '@/components/ui/Skeleton'
import { mockVenues } from '@/lib/mock-data'

const filters = ['Nearby', 'Favorite', 'Price Low-High', 'Top Rated']

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } },
  },
}

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Nearby')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [search, setSearch] = useState('')

  useEffect(() => { setTimeout(() => setLoading(false), 1200) }, [])

  const filtered = mockVenues.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="min-h-screen pb-20"><DiscoverSkeleton /></div>

  return (
    <PageWrapper>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ── HEADER ── */}
        <motion.div variants={stagger.item} className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-black text-white tracking-tight font-heading">Discover Courts</h1>
        </motion.div>

        {/* ── SEARCH ── */}
        <motion.div variants={stagger.item} className="px-4 mb-3">
          <div className="flex items-center gap-3 h-12 rounded-2xl px-4"
               style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}>
            <Search size={16} color="#9E9E9E" />
            <input
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral"
              placeholder="Search by venue name or area"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* ── FILTER CHIPS + VIEW TOGGLE ── */}
        <motion.div variants={stagger.item} className="flex items-center gap-2 px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 pb-0.5">
            {filters.map(f => (
              <motion.button key={f} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className="flex-none px-4 h-8 rounded-full text-xs font-semibold transition-all"
                style={activeFilter === f
                  ? { background: '#00FF41', color: '#020202' }
                  : { background: '#1E1E1E', color: '#9E9E9E', border: '1px solid #2A2A2A' }
                }>
                {f}
              </motion.button>
            ))}
          </div>
          <div className="flex rounded-xl overflow-hidden flex-none" style={{ border: '1px solid #2A2A2A' }}>
            {(['list', 'map'] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className="w-9 h-8 flex items-center justify-center transition-all"
                style={{ background: viewMode === m ? '#00FF41' : '#1E1E1E' }}>
                {m === 'list'
                  ? <LayoutList size={14} color={viewMode === m ? '#020202' : '#9E9E9E'} />
                  : <Map size={14} color={viewMode === m ? '#020202' : '#9E9E9E'} />
                }
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── RESULT COUNT ── */}
        <motion.p variants={stagger.item} className="px-4 mb-3 text-xs text-neutral">
          {filtered.length} venues found
        </motion.p>

        {/* ── VENUE CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter} className="px-4 space-y-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {filtered.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22,1,0.36,1] }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl overflow-hidden cursor-pointer tap-highlight"
                style={{ background: '#20201F' }}>

                {/* Image */}
                <div className="relative h-48">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0"
                       style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                       style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
                    <Star size={11} fill="#FFB800" color="#FFB800" />
                    <span className="text-xs font-bold text-white">{v.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-white mb-1">{v.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin size={11} color="#9E9E9E" />
                    <span className="text-xs text-neutral">{v.location} • {v.distance}</span>
                  </div>
                  <div className="flex justify-between items-center"
                       style={{ borderTop: '1px solid #2A2A2A', paddingTop: 12 }}>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} color="#9E9E9E" />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral font-semibold">Operational Hours</p>
                        <p className="text-xs font-bold text-white">{v.hours}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-neutral font-semibold">Starting From</p>
                      <p className="text-sm font-black" style={{ color: '#00FF41' }}>{v.priceFrom}<span className="text-neutral text-[10px] font-normal">/hr</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Map placeholder when map view */}
        {viewMode === 'map' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mx-4 rounded-2xl flex items-center justify-center h-64 mt-4"
            style={{ background: '#1A1A1A', border: '1px dashed #2A2A2A' }}>
            <p className="text-neutral text-sm">Map integration coming soon</p>
          </motion.div>
        )}

        <div className="h-6" />
      </motion.div>
    </PageWrapper>
  )
}
