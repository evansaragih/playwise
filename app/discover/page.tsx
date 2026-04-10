'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr'
import { LuSearch, LuList, LuMap, LuMinus, LuPlus } from 'react-icons/lu'
import { BiCurrentLocation } from 'react-icons/bi'
import dynamic from 'next/dynamic'
import BottomNav from '@/components/layout/BottomNav'
import { DiscoverSkeleton } from '@/components/ui/Skeleton'

/* ── Dynamically import Map to avoid SSR issues ── */
const MapView = dynamic(() => import('@/components/ui/MapView'), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center" style={{ background: '#1A1A1A' }}>
    <div className="skeleton w-full h-full" />
  </div>
)})

const FILTERS = ['Nearby', 'Favorite', 'Price Low-High', 'Top Rated']

const VENUES = [
  { id:'1', name:'SportHub Arena',     location:'Central Jakarta', distance:'1.2km', rating:4.9, hours:'08:00 - 23:00', price:'Rp 400,000', lat:-6.1754,  lng:106.8272, image:'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop' },
  { id:'2', name:'Metro Sports Center',location:'South Jakarta',   distance:'2.8 km',rating:4.9, hours:'08:00 - 23:00', price:'Rp 340,000', lat:-6.2615,  lng:106.8106, image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=720&q=85&fit=crop' },
  { id:'3', name:'The Padel Club',     location:'Kuningan',        distance:'0.8 km',rating:4.9, hours:'08:00 - 23:00', price:'Rp 250,000', lat:-6.2297,  lng:106.8310, image:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=720&q=85&fit=crop' },
  { id:'4', name:'Elite Tennis Court', location:'Menteng',         distance:'3.1 km',rating:4.7, hours:'07:00 - 22:00', price:'Rp 180,000', lat:-6.1964,  lng:106.8317, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=720&q=85&fit=crop' },
]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity:0, y:24 }, animate: { opacity:1, y:0, transition: { duration:0.4, ease:[0.22,1,0.36,1] } } },
}

export default function DiscoverPage() {
  const [loading, setLoading]     = useState(true)
  const [activeFilter, setFilter] = useState('Nearby')
  const [viewMode, setView]       = useState<'list'|'map'>('list')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<string|null>(null)

  useEffect(() => { setTimeout(()=>setLoading(false), 1200) }, [])
  if (loading) return <div className="min-h-screen bg-[#020202] pb-24"><DiscoverSkeleton /></div>

  const filtered = VENUES.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#020202] min-h-screen" style={{ paddingBottom: viewMode === 'list' ? 112 : 0 }}>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ══ TOP BAR bg:#0E0E0E pt:64 px:16 pb:16 ══ */}
        <motion.div variants={stagger.item} className="px-4 pb-4"
          style={{ background:'#0E0E0E', paddingTop:64 }}>

          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-heading font-bold text-white" style={{ fontSize:22 }}>Discover Courts</h1>
            <div className="flex items-center gap-3">
              <div className="liquid-glass-icon flex items-center justify-center relative"
                   style={{ width:46, height:46, borderRadius:9999 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F3F3F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  <path d="M2 8c0-2.2.7-4.3 2-6"/><path d="M22 8a10 10 0 0 0-2-6"/>
                </svg>
                <span className="absolute top-[10px] right-[10px] w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
              </div>
              <div className="liquid-glass-icon overflow-hidden" style={{ width:46, height:46, borderRadius:9999 }}>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=92&h=92&fit=crop&crop=face&q=80" alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Search — full width in map mode too */}
          <div className="flex items-center gap-3 h-[46px] rounded-xl px-4 mb-3"
               style={{ background:'#000000' }}>
            <LuSearch size={16} color="#ADAAAA" />
            <input type="text" placeholder="Search by venue name or area"
              className="flex-1 bg-transparent outline-none font-ui text-[14px] text-white"
              style={{ caretColor:'#9CFF93' }}
              value={search} onChange={e=>setSearch(e.target.value)} />
          </div>

          {/* Filter chips row */}
          <div className="flex gap-[7px] overflow-x-auto scrollbar-hide mb-3">
            {FILTERS.map(f => (
              <motion.button key={f} whileTap={{ scale:0.95 }}
                onClick={() => setFilter(f)}
                className="flex-none font-ui font-semibold text-[12px] h-[34px] px-4 rounded-full transition-all"
                style={activeFilter===f
                  ? { background:'#9CFF93', color:'#006413' }
                  : { background:'#20201F', color:'#ADAAAA' }}>
                {f}
              </motion.button>
            ))}
          </div>

          {/* Count + view toggle row */}
          <div className="flex items-center justify-between">
            <span className="font-ui text-[14px]" style={{ color:'#9E9E9E' }}>{filtered.length} venues found</span>

            {/* Toggle — bg rgba(255,255,255,0.10) r:999 p:4 */}
            <div className="flex items-center rounded-full p-1" style={{ background:'rgba(255,255,255,0.10)' }}>
              {(['list','map'] as const).map(m => (
                <motion.button key={m} whileTap={{ scale:0.92 }}
                  onClick={()=>setView(m)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                  style={viewMode===m ? { background:'rgba(255,255,255,0.15)' } : {}}>
                  {m==='list'
                    ? <LuList size={14} color={viewMode==='list' ? '#F5F5F5' : '#9E9E9E'} />
                    : <LuMap  size={14} color={viewMode==='map'  ? '#F5F5F5' : '#9E9E9E'} />}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══ CONTENT ══ */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            /* ── LIST VIEW ── */
            <motion.div key="list" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="px-4 pt-4 flex flex-col gap-6">
              {filtered.map((v, i) => (
                <motion.div key={v.id}
                  initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.07, duration:0.42, ease:[0.22,1,0.36,1] }}
                  whileTap={{ scale:0.985 }}
                  className="overflow-hidden cursor-pointer tap-highlight"
                  style={{ background:'#1E1E1E', borderRadius:24 }}>
                  <div className="relative" style={{ height:192 }}>
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute flex items-center gap-1"
                         style={{ top:16, right:16, background:'#1E1E1E', borderRadius:9999, padding:'4px 12px' }}>
                      <HiStar size={12} color="#9CFF93" />
                      <span className="font-ui font-semibold text-[12px] text-white">{v.rating}</span>
                    </div>
                  </div>
                  <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>{v.name}</p>
                      <div className="flex items-center gap-1">
                        <GrLocation size={14} color="#ADAAAA" />
                        <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{v.location} • {v.distance}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end" style={{ borderTop:'1px solid #2A2A2A', paddingTop:12 }}>
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <span className="font-ui font-semibold text-[12px] uppercase" style={{ color:'#ADAAAA', letterSpacing:'0.08em' }}>Operational Hours</span>
                        <span className="font-ui font-semibold text-[16px] text-white">{v.hours}</span>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                        <span className="font-ui font-semibold text-[12px] uppercase" style={{ color:'#ADAAAA', letterSpacing:'0.08em' }}>Starting From</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-ui font-semibold text-[16px]" style={{ color:'#9CFF93' }}>{v.price}</span>
                          <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="h-2" />
            </motion.div>
          ) : (
            /* ── MAP VIEW — fullscreen, no bottom nav ── */
            <motion.div key="map" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ height:'calc(100svh - 232px)', position:'relative', minHeight:400 }}>
              <MapView
                venues={filtered}
                selected={selected}
                onSelect={setSelected}
              />
              {/* Selected venue bottom sheet */}
              <AnimatePresence>
                {selected && (() => {
                  const v = VENUES.find(x=>x.id===selected)!
                  return (
                    <motion.div
                      initial={{ y:120, opacity:0 }}
                      animate={{ y:0, opacity:1 }}
                      exit={{ y:120, opacity:0 }}
                      transition={{ type:'spring', stiffness:320, damping:32 }}
                      className="absolute left-4 right-4 z-[1000]"
                      style={{ bottom:16 }}>
                      {/* Bottom card — bg:#20201F r:16 p:16 gap:16 */}
                      <div className="flex items-center gap-4 rounded-2xl mb-3"
                           style={{ background:'#20201F', padding:16, gap:16 }}>
                        <div className="flex-none overflow-hidden" style={{ width:70, height:70, background:'#262626', borderRadius:13 }}>
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                          {/* SELECTED VENUE chip: bg rgba(156,255,147,0.20) r:4 px:8 py:2 */}
                          <span className="font-ui font-semibold text-[12px] self-start px-2 py-[2px] rounded-[4px]"
                                style={{ background:'rgba(156,255,147,0.20)', color:'#9CFF93' }}>
                            SELECTED VENUE
                          </span>
                          {/* Venue name: Space Grotesk Bold 18px */}
                          <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>{v.name}</p>
                          {/* Location: Lexend Regular 12px #ADAAAA */}
                          <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{v.location} • {v.distance}</p>
                        </div>
                      </div>

                      {/* CTA: bg:#9CFF93 r:9999 h:64 — ONE trailing chevron only */}
                      <motion.button whileTap={{ scale:0.97 }}
                        className="w-full flex items-center justify-center font-heading font-bold"
                        style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18, gap:8 }}>
                        CONTINUE
                        {/* Single trailing chevron — li:chevron-right */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006413" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </motion.button>
                    </motion.div>
                  )
                })()}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nav only in list view */}
      {viewMode === 'list' && <BottomNav />}

      {/* FAB — only in list view */}
      {viewMode === 'list' && (
        <motion.button initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.5, type:'spring', stiffness:280, damping:20 }}
          whileTap={{ scale:0.90 }}
          className="fixed z-40 flex items-center justify-center"
          style={{ bottom:88, right:16, width:56, height:56, background:'#006413', borderRadius:9999,
            boxShadow:'inset 0 0 95px 0 rgba(242,242,242,0.50),inset -9px -9px 9px -12px rgba(179,179,179,0.40),inset 9px 9px 4px -12px rgba(179,179,179,1.00)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CFF93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </motion.button>
      )}
    </div>
  )
}
