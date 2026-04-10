'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr'
import { LuChevronLeft, LuClock, LuCalendar, LuChevronRight } from 'react-icons/lu'
import { mockVenues } from '@/lib/mock-data'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.38, ease:[0.22,1,0.36,1] } } },
}

/* Extra images per venue for the slider — using varied Unsplash photos */
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=720&q=85&fit=crop',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=720&q=85&fit=crop',
  'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=720&q=85&fit=crop',
]

export default function VenueDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()
  const venue    = mockVenues.find(v => v.id === id)
  const [slide, setSlide]   = useState(0)
  const [dragX, setDragX]   = useState(0)
  const [dragging, setDrag] = useState(false)

  if (!venue) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <p className="font-ui text-[#ADAAAA]">Venue not found</p>
    </div>
  )

  const images = [venue.image, ...EXTRA_IMAGES]

  const goTo = (idx: number) => setSlide(Math.max(0, Math.min(images.length - 1, idx)))

  /* Swipe detection */
  const onDragEnd = (_: any, info: any) => {
    setDrag(false)
    if (info.offset.x < -50)      goTo(slide + 1)
    else if (info.offset.x > 50)  goTo(slide - 1)
  }

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(96px + var(--sab,0px))' }}>

      {/* ── HERO SLIDER ── */}
      <div className="relative overflow-hidden" style={{ height:300 }}>

        {/* Slides */}
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={slide}
              src={images[slide]}
              alt={venue.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity:0, x: dragX > 0 ? -80 : 80 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x: dragX > 0 ? 80 : -80 }}
              transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
              drag="x"
              dragConstraints={{ left:0, right:0 }}
              dragElastic={0.15}
              onDragStart={() => setDrag(true)}
              onDragEnd={onDragEnd}
              style={{ userSelect:'none', WebkitUserSelect:'none' }}
            />
          </AnimatePresence>
        </div>

        {/* Dark gradient at bottom (for rating + dots) */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.65) 100%)' }} />

        {/* ── BACK BUTTON — position:fixed so it stays on scroll ── */}
        <motion.button
          initial={{ opacity:0, x:-8 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay:0.1 }}
          onClick={() => router.back()}
          whileTap={{ scale:0.9 }}
          className="fixed z-50 flex items-center justify-center tap-highlight"
          style={{
            top: 'max(16px, calc(var(--sat,0px) + 12px))',
            left: 16,
            width: 40, height: 40,
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 9999,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
          <LuChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
        </motion.button>

        {/* ── RATING PILL — bottom-right inside photo ── */}
        <div className="absolute flex items-center gap-1 px-3 py-1 rounded-full"
             style={{
               bottom: 44,   /* above the dots */
               right: 16,
               background: 'rgba(30,30,30,0.85)',
               backdropFilter: 'blur(6px)',
             }}>
          <HiStar size={12} color="#9CFF93" />
          <span className="font-ui font-semibold text-[12px] text-white">{venue.rating}</span>
        </div>

        {/* ── SLIDE DOTS ── */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
          {images.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === slide ? 20 : 6, background: i === slide ? '#9CFF93' : 'rgba(255,255,255,0.4)' }}
              transition={{ duration:0.25 }}
              style={{ height:6, borderRadius:9999 }} />
          ))}
        </div>

        {/* Tap areas for prev/next */}
        <button className="absolute left-0 top-0 bottom-0 w-1/4 tap-highlight"
                onClick={() => goTo(slide - 1)} style={{ background:'transparent' }} />
        <button className="absolute right-0 top-0 bottom-0 w-1/4 tap-highlight"
                onClick={() => goTo(slide + 1)} style={{ background:'transparent' }} />
      </div>

      {/* ── CONTENT ── */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 pt-5 flex flex-col gap-5">

        {/* Name + Location */}
        <motion.div variants={stagger.item}>
          <p className="font-heading font-bold text-white" style={{ fontSize:22 }}>{venue.name}</p>
          <div className="flex items-center gap-1 mt-1">
            <GrLocation size={14} color="#ADAAAA" />
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>
              {venue.location} • {venue.distance}
            </span>
          </div>
          <span className="inline-block mt-2 font-ui font-semibold text-[11px] px-2.5 py-1 rounded-full"
                style={{ background:'rgba(156,255,147,0.12)', color:'#9CFF93', border:'1px solid rgba(156,255,147,0.25)' }}>
            {venue.area}
          </span>
        </motion.div>

        {/* Hours + Price */}
        <motion.div variants={stagger.item}
          className="rounded-2xl p-5 flex justify-between items-center"
          style={{ background:'#20201F' }}>
          <div className="flex flex-col gap-1">
            <span className="font-ui font-semibold text-[11px] uppercase tracking-widest"
                  style={{ color:'#ADAAAA', letterSpacing:'0.08em' }}>Operational Hours</span>
            <div className="flex items-center gap-1.5">
              <LuClock size={14} color="#9CFF93" />
              <span className="font-ui font-semibold text-[16px] text-white">{venue.hours}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="font-ui font-semibold text-[11px] uppercase tracking-widest"
                  style={{ color:'#ADAAAA', letterSpacing:'0.08em' }}>Starting From</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-ui font-semibold text-[18px]" style={{ color:'#9CFF93' }}>{venue.price}</span>
              <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>/hr</span>
            </div>
          </div>
        </motion.div>

        {/* Sports */}
        <motion.div variants={stagger.item} className="flex flex-col gap-3">
          <p className="font-heading font-bold text-white" style={{ fontSize:16 }}>Available Sports</p>
          <div className="flex gap-2 flex-wrap">
            {venue.sports.map(s => (
              <span key={s} className="font-ui font-semibold text-[12px] px-4 py-2 rounded-full capitalize"
                    style={{ background:'#20201F', color:'#9CFF93', border:'1px solid rgba(156,255,147,0.3)' }}>
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Courts */}
        <motion.div variants={stagger.item} className="flex flex-col gap-2">
          <p className="font-heading font-bold text-white" style={{ fontSize:16 }}>
            {venue.courts} Courts Available
          </p>
          <div className="flex gap-2">
            {Array.from({ length: venue.courts }, (_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{
                     background: i === 0 ? 'rgba(156,255,147,0.15)' : '#20201F',
                     border: i === 0 ? '1px solid rgba(156,255,147,0.4)' : '1px solid #2A2A2A',
                   }}>
                <span className="font-ui font-semibold text-[11px]"
                      style={{ color: i === 0 ? '#9CFF93' : '#ADAAAA' }}>{i+1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Venue Policy */}
        <motion.div variants={stagger.item}
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{ background:'#131313', border:'1px solid #1E1E1E' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-none"
                 style={{ background:'rgba(156,255,147,0.15)', border:'1px solid rgba(156,255,147,0.3)' }}>
              <span style={{ fontSize:12, color:'#9CFF93', fontFamily:'sans-serif' }}>ℹ</span>
            </div>
            <p className="font-heading font-bold text-white" style={{ fontSize:16 }}>Venue Policy</p>
          </div>
          <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#9E9E9E' }}>
            {venue.policy}
          </p>
        </motion.div>
      </motion.div>

      {/* ── FIXED BOTTOM CTA — same style as Confirm Booking ── */}
      <div className="fixed z-50"
           style={{
             bottom: 0,
             left:  'max(0px, calc(50% - 215px))',
             right: 'max(0px, calc(50% - 215px))',
             background: 'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding: '20px 16px max(24px, var(--sab,24px))',
           }}>
        <motion.button
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3, type:'spring', stiffness:280, damping:24 }}
          whileTap={{ scale:0.97 }}
          onClick={() => router.push(`/schedule/${venue.id}`)}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18 }}>
          <LuCalendar size={20} color="#006413" strokeWidth={2} />
          SET A SCHEDULE
          <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
