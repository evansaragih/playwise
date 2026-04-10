'use client'
import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GrLocation } from 'react-icons/gr'
import { LuChevronLeft, LuChevronRight, LuClock, LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu'
import { mockVenues } from '@/lib/mock-data'

const MON_SHORT  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

interface BookingSlot {
  id: string
  court: number
  hours: number[]   // e.g. [10,11] = 10:00–12:00
  date: Date
}

function fmtSlotTime(hours: number[]) {
  const sorted = [...hours].sort((a,b)=>a-b)
  return `${String(sorted[0]).padStart(2,'0')}:00 - ${String(sorted[sorted.length-1]+1).padStart(2,'0')}:00`
}
function fmtDate(d: Date) {
  return `${MON_SHORT[d.getMonth()].toUpperCase()} ${d.getDate()}`
}

const stagger = {
  container: { animate: { transition: { staggerChildren:0.06 } } },
  item: { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0, transition:{ duration:0.35, ease:[0.22,1,0.36,1] } } },
}

export default function BookingSummaryPage() {
  const { id }       = useParams<{ id: string }>()
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const venue         = mockVenues.find(v => v.id === id)

  /* Build initial booking from query params */
  const initialSlots = useMemo(() => {
    let baseCart: BookingSlot[] = []
    const cartParam = searchParams.get('cart')
    if (cartParam) {
       try {
         baseCart = JSON.parse(cartParam)
         baseCart.forEach((b: any) => b.date = new Date(b.date))
       } catch(e){}
    }

    const slotsParam = searchParams.get('slots')
    if (!slotsParam) return baseCart

    const courtParam = parseInt(searchParams.get('court') || '1')
    const dateParam  = searchParams.get('date')
    const date       = dateParam ? new Date(dateParam) : new Date()
    const rawHours   = slotsParam.split(',').map(Number)

    const sorted = [...rawHours].sort((a,b)=>a-b)
    const segments: number[][] = []
    let currentSegment: number[] = []
    
    sorted.forEach((hour) => {
      if (currentSegment.length === 0) {
        currentSegment.push(hour)
      } else {
        const last = currentSegment[currentSegment.length - 1]
        if (hour === last + 1) {
          currentSegment.push(hour)
        } else {
          segments.push(currentSegment)
          currentSegment = [hour]
        }
      }
    })
    if (currentSegment.length > 0) {
      segments.push(currentSegment)
    }

    const newSlots = segments.map((hoursGroup, idx) => ({
      // Use deterministic ID instead of Date.now() to prevent Hydration layout breakage
      id: `slot-${courtParam}-${hoursGroup[0]}-${idx}`,
      court: courtParam,
      hours: hoursGroup,
      date,
    })) as BookingSlot[]

    return [...baseCart, ...newSlots]
  }, [searchParams])

  const [bookings, setBookings] = useState<BookingSlot[]>(initialSlots)
  const [removing, setRemoving] = useState<string | null>(null)

  // Sync state if softly navigated backward/forward with different queries
  useEffect(() => {
    setBookings(initialSlots)
  }, [initialSlots])

  if (!venue) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <p className="font-ui text-[#ADAAAA]">Venue not found</p>
    </div>
  )

  const pricePerSlot = parseInt(venue.price.replace(/[^0-9]/g,'')) || 200000
  const totalSlots   = bookings.reduce((acc, b) => acc + b.hours.length, 0)
  const totalAmount  = totalSlots * pricePerSlot
  const fmtTotal     = `Rp ${totalAmount.toLocaleString('id-ID')}`

  /* Group bookings by date */
  const grouped = useMemo(() => {
    const map = new Map<string, BookingSlot[]>()
    bookings.forEach(b => {
      const key = b.date.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(b)
    })
    return Array.from(map.entries()).map(([key, slots]) => ({
      date: slots[0].date,
      key,
      slots,
    }))
  }, [bookings])

  const removeSlot = (slotId: string) => {
    setRemoving(slotId)
    setTimeout(() => {
      setBookings(prev => prev.filter(b => b.id !== slotId))
      setRemoving(null)
    }, 320)
  }

  const editSlot = (slot: BookingSlot) => {
    const otherBookings = bookings.filter(b => b.id !== slot.id)
    const params = new URLSearchParams({
      slots: slot.hours.join(','),
      court: String(slot.court),
      date:  slot.date.toISOString(),
      cart:  JSON.stringify(otherBookings)
    })
    router.push(`/schedule/${venue.id}?${params.toString()}`)
  }

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(160px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4 py-4">
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Booking Summary
          </p>
        </div>
      </div>

      <div style={{ height:'calc(var(--sat,0px) + 72px)' }} />

      {/* ══ SCROLLABLE CONTENT ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 flex flex-col gap-6 pt-6">

        {/* ── VENUE HEADER CARD ── */}
        <motion.div variants={stagger.item}
          className="relative flex flex-col items-start overflow-hidden"
          style={{
            background: '#20201F',
            borderRadius: 24,
            padding: '16px 24px',
            isolation: 'isolate'
          }}>
          
          {/* Overlay+Blur */}
          <div className="absolute pointer-events-none"
               style={{
                 width: 128, height: 128,
                 right: -64, top: -64,
                 background: 'rgba(156, 255, 147, 0.1)',
                 filter: 'blur(32px)',
                 borderRadius: 9999,
                 zIndex: 0
               }} />

          {/* Container (gap 12px) */}
          <div className="flex flex-col items-start relative z-10 w-full" style={{ gap: 12 }}>
            {/* Upcoming Session */}
            <div className="font-ui font-normal text-[12px] leading-[16px] text-[#ADAAAA]">
              Upcoming Session
            </div>

            {/* Title + Location (gap 4px) */}
            <div className="flex flex-col items-start w-full" style={{ gap: 4 }}>
              {/* Heading 2 */}
              <div className="font-heading font-bold text-[22px] leading-[28px] text-white">
                {venue.name}
              </div>

              {/* Location Row */}
              <div className="flex flex-row items-center" style={{ gap: 4 }}>
                <GrLocation size={16} color="#ADAAAA" />
                <div className="font-ui font-normal text-[14px] leading-[20px] text-[#ADAAAA]">
                  {venue.location} • {venue.distance}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── BOOKED SCHEDULE ── */}
        <motion.div variants={stagger.item} className="flex flex-col gap-4">
          <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
             style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Booked Schedule</p>

          <AnimatePresence>
            {grouped.map(group => (
              <div key={group.key} className="flex flex-col gap-3">
                {/* Date header row */}
                <div className="flex justify-between items-baseline">
                  <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>
                    {fmtDate(group.date)}
                  </p>
                  <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>
                    {DAY_NAMES[group.date.getDay()]}
                  </p>
                </div>

                {/* Slot cards */}
                {group.slots.map(slot => (
                  <AnimatePresence key={slot.id}>
                    {removing !== slot.id && (
                      <motion.div
                        initial={{ opacity:0, y:12, scale:1 }}
                        animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, scale:0.95, height:0, marginBottom:0 }}
                        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
                        className="rounded-xl overflow-hidden"
                        style={{ background:'#131313' }}>
                        <div className="p-5 flex flex-col gap-3">
                          {/* Court + slots + price row */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                              {/* Court name — Space Grotesk Bold 18px */}
                              <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>
                                Court {slot.court}
                              </p>
                              {/* Time — Lexend SemiBold 14px white, with clock icon */}
                              <div className="flex items-center gap-1.5">
                                <LuClock size={13} color="#9CFF93" strokeWidth={1.5} />
                                <span className="font-ui font-semibold text-[14px] text-white">
                                  {fmtSlotTime(slot.hours)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              {/* Slots count — Lexend Regular 12px #ADAAAA */}
                              <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>
                                {slot.hours.length} SLOT{slot.hours.length > 1 ? 'S' : ''}
                              </span>
                              {/* Price — Space Grotesk Bold 18px #9CFF93 */}
                              <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>
                                Rp {(slot.hours.length * pricePerSlot).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons row */}
                          <div className="flex gap-3 pt-3"
                               style={{ borderTop:'1px solid #1E1E1E' }}>
                            {/* Edit Slot — goes back to schedule with pre-filled state */}
                            <motion.button whileTap={{ scale:0.95 }}
                              onClick={() => editSlot(slot)}
                              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl font-ui font-semibold text-[12px] tap-highlight"
                              style={{ background:'#1E1E1E', color:'#ADAAAA', border:'1px solid #2A2A2A' }}>
                              <LuPencil size={13} color="#ADAAAA" strokeWidth={1.5} />
                              Edit Slot
                            </motion.button>
                            {/* Remove Slot */}
                            <motion.button whileTap={{ scale:0.95 }}
                              onClick={() => removeSlot(slot.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl font-ui font-semibold text-[12px] tap-highlight"
                              style={{ background:'rgba(255,68,68,0.08)', color:'#FF4444', border:'1px solid rgba(255,68,68,0.25)' }}>
                              <LuTrash2 size={13} color="#FF4444" strokeWidth={1.5} />
                              Remove Slot
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            ))}
          </AnimatePresence>

          {/* ── Add More Slots ── */}
          {bookings.length > 0 && (
            <motion.button
              whileTap={{ scale:0.98 }}
              onClick={() => {
                const params = new URLSearchParams({ cart: JSON.stringify(bookings) })
                router.push(`/schedule/${venue.id}?${params.toString()}`)
              }}
              className="w-full flex items-center justify-center gap-2 font-ui font-semibold text-[16px] tap-highlight"
              style={{ height:54, borderRadius:12,
                border:'1px dashed #2A2A2A', background:'transparent', color:'#ADAAAA' }}>
              <LuPlus size={20} color="#ADAAAA" strokeWidth={1.5} />
              Add more slots
            </motion.button>
          )}

          {/* Empty state */}
          {bookings.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex flex-col items-center gap-4 py-8">
              <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>No slots selected</p>
              <p className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>Go back to add booking slots</p>
              <motion.button whileTap={{ scale:0.97 }}
                onClick={() => router.push(`/schedule/${venue.id}`)}
                className="font-ui font-semibold text-[14px] px-6 py-3 rounded-full"
                style={{ background:'rgba(156,255,147,0.15)', color:'#9CFF93',
                  border:'1px solid rgba(156,255,147,0.3)' }}>
                Add Slots
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* ══ FIXED BOTTOM — Summary + PROCEED BOOKING ══ */}
      {bookings.length > 0 && (
        <div className="fixed z-50"
             style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
               background:'linear-gradient(to top, #020202 55%, transparent 100%)',
               padding:'20px 16px 24px' }}>

          {/* Summary row */}
          <div className="flex justify-between items-center mb-3 px-1">
            <div>
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Selected Slots</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading font-bold" style={{ fontSize:22 }}>{totalSlots}</span>
                <span className="font-ui font-semibold text-[14px]" style={{ color:'#9CFF93' }}>x 60 MIN</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Total Amount</p>
              <p className="font-heading font-bold mt-0.5" style={{ fontSize:22 }}>{fmtTotal}</p>
            </div>
          </div>

          {/* PROCEED BOOKING — bg:#9CFF93 r:9999 h:64 */}
          <motion.button whileTap={{ scale:0.97 }}
            className="w-full flex items-center justify-center gap-2 font-heading font-bold"
            style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18 }}>
            PROCEED BOOKING
            <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
