'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiStar } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr'
import { LuChevronLeft, LuClock, LuCalendar } from 'react-icons/lu'
import { mockVenues } from '@/lib/mock-data'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.38, ease:[0.22,1,0.36,1] } } },
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const venue   = mockVenues.find(v => v.id === id)

  if (!venue) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <p className="font-ui text-[#ADAAAA]">Venue not found</p>
    </div>
  )

  return (
    <div className="bg-[#020202] min-h-screen" style={{ paddingBottom:'calc(32px + var(--sab,0px))' }}>
      {/* Hero image */}
      <div className="relative" style={{ height:280 }}>
        <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
        {/* Dark gradient */}
        <div className="absolute inset-0"
             style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

        {/* Back button */}
        <motion.button
          initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.1 }}
          onClick={() => router.back()}
          whileTap={{ scale:0.9 }}
          className="absolute flex items-center justify-center tap-highlight"
          style={{ top:'max(16px, var(--sat,16px))', left:16, width:40, height:40,
            background:'rgba(0,0,0,0.5)', borderRadius:9999, backdropFilter:'blur(8px)' }}>
          <LuChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
        </motion.button>

        {/* Rating pill */}
        <div className="absolute flex items-center gap-1 px-3 py-1 rounded-full"
             style={{ top:16, right:16, background:'#1E1E1E' }}>
          <HiStar size={12} color="#9CFF93" />
          <span className="font-ui font-semibold text-[12px] text-white">{venue.rating}</span>
        </div>
      </div>

      {/* Content */}
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
          {/* Area badge */}
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

        {/* Sports available */}
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
            {Array.from({length: venue.courts}, (_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: i === 0 ? 'rgba(156,255,147,0.15)' : '#20201F',
                     border: i === 0 ? '1px solid rgba(156,255,147,0.4)' : '1px solid #2A2A2A' }}>
                <span className="font-ui font-semibold text-[11px]"
                      style={{ color: i === 0 ? '#9CFF93' : '#ADAAAA' }}>{i+1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Venue policy */}
        <motion.div variants={stagger.item}
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{ background:'#131313', border:'1px solid #1E1E1E' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
                 style={{ background:'rgba(156,255,147,0.15)' }}>
              <span style={{ fontSize:12 }}>ℹ</span>
            </div>
            <p className="font-heading font-bold text-white" style={{ fontSize:16 }}>Venue Policy</p>
          </div>
          <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#9E9E9E' }}>
            {venue.policy}
          </p>
        </motion.div>
      </motion.div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <motion.button
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4, type:'spring', stiffness:280, damping:24 }}
          whileTap={{ scale:0.97 }}
          onClick={() => router.push(`/schedule/${venue.id}`)}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18 }}>
          <LuCalendar size={20} color="#006413" strokeWidth={2} />
          SET A SCHEDULE
        </motion.button>
      </div>
    </div>
  )
}
