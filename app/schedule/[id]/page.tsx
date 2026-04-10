'use client'
import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSportsTennis, MdSportsCricket } from 'react-icons/md'
import { IoTennisball, IoFootball, IoBasketball } from 'react-icons/io5'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { mockVenues } from '@/lib/mock-data'

/* ── helpers ── */
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MON_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDaysFrom(baseDate: Date, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + i)
    return d
  })
}

const SPORT_ICONS: Record<string, React.ReactNode> = {
  padel:     <MdSportsTennis size={14} />,
  tennis:    <IoTennisball   size={14} />,
  futsal:    <IoFootball     size={14} />,
  badminton: <IoBasketball   size={14} />,
  cricket:   <MdSportsCricket size={14} />,
  basket:    <IoBasketball   size={14} />,
}

/* Deterministic slot status seeded by court + hour so it's consistent */
function slotStatus(court: number, hour: number): 'available' | 'booked' {
  const seed = (court * 13 + hour * 7) % 10
  return seed < 3 ? 'booked' : 'available'
}

const ALL_HOURS = [8,9,10,11,12,13,14,15,16,17,18,19,20]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: { initial:{ opacity:0, y:12 }, animate:{ opacity:1, y:0, transition:{ duration:0.3 } } },
}

export default function SchedulePage() {
  const { id }  = useParams<{ id: string }>()
  const router   = useRouter()
  const venue    = mockVenues.find(v => v.id === id)

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const days  = useMemo(() => getDaysFrom(today, 14), [today])

  const [selectedDay,    setDay]    = useState<Date>(today)
  const [selectedSport,  setSport]  = useState<string>(() => venue?.sports[0] ?? 'padel')
  const [selectedCourt,  setCourt]  = useState(1)
  const [selectedSlots,  setSlots]  = useState<number[]>([])

  if (!venue) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <p className="font-ui text-[#ADAAAA]">Venue not found</p>
    </div>
  )

  const pricePerSlot = parseInt(venue.price.replace(/[^0-9]/g, '')) || 200000
  const totalAmount  = selectedSlots.length * pricePerSlot
  const fmtAmount    = `Rp ${totalAmount.toLocaleString('id-ID')}`

  const toggleSlot = (hour: number) => {
    if (slotStatus(selectedCourt, hour) === 'booked') return
    setSlots(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    )
  }

  const monthLabel = MON_NAMES[selectedDay.getMonth()] + ' ' + selectedDay.getFullYear()

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(140px + var(--sab,0px))' }}>

      {/* ── TOP BAR ── */}
      <div style={{ background:'#020202' }}>
        <div className="status-bar-spacer" />
        <div className="flex items-center gap-4 px-4 py-4">
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight"
            style={{ width:36, height:36, background:'#20201F', borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F3F3F3" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Set a Schedule
          </p>
        </div>
      </div>

      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 flex flex-col gap-6">

        {/* ── SELECT DATE ── */}
        <motion.div variants={stagger.item} className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Select Date</p>
            <p className="font-ui text-[14px]" style={{ color:'#9E9E9E' }}>{monthLabel}</p>
          </div>

          {/* Date scroller — horizontal scroll, 64×99 tiles */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2" style={{ width:'max-content', paddingRight:16 }}>
              {days.map((day) => {
                const isSelected = day.toDateString() === selectedDay.toDateString()
                const isToday    = day.toDateString() === today.toDateString()
                return (
                  <motion.button key={day.toISOString()} whileTap={{ scale:0.92 }}
                    onClick={() => { setDay(day); setSlots([]) }}
                    className="flex flex-col items-center justify-center rounded-2xl flex-none transition-all"
                    style={{
                      width:64, height:99,
                      background: isSelected ? 'rgba(156,255,147,0.10)' : '#20201F',
                      border: isSelected ? '1px solid rgba(156,255,147,0.4)' : '1px solid transparent',
                    }}>
                    {/* Month abbr — Lexend Regular 12px */}
                    <span className="font-ui text-[12px]"
                          style={{ color: isSelected ? '#9CFF93' : '#ADAAAA' }}>
                      {day.toLocaleDateString('en', { month:'short' })}
                    </span>
                    {/* Day number — Space Grotesk Bold 24px */}
                    <span className="font-heading font-bold" style={{ fontSize:24, color: isSelected ? '#9CFF93' : '#ADAAAA', lineHeight:1.1 }}>
                      {day.getDate()}
                    </span>
                    {/* Weekday — Lexend Medium 10px */}
                    <span className="font-ui text-[10px] font-medium"
                          style={{ color: isSelected ? '#9CFF93' : '#ADAAAA' }}>
                      {DAY_NAMES[day.getDay()]}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* ── SPORT FILTER ── */}
        <motion.div variants={stagger.item}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {/* All chip */}
            <motion.button whileTap={{ scale:0.95 }}
              onClick={() => setSport('all')}
              className="flex-none flex items-center gap-1.5 font-ui font-semibold text-[12px] h-[34px] px-4 rounded-full transition-all"
              style={selectedSport==='all'
                ? { background:'#9CFF93', color:'#006413' }
                : { background:'#20201F', color:'#ADAAAA' }}>
              <MdSportsTennis size={14} style={{ color: selectedSport==='all' ? '#006413' : '#9E9E9E' }} />
              All
            </motion.button>
            {venue.sports.map(s => (
              <motion.button key={s} whileTap={{ scale:0.95 }}
                onClick={() => setSport(s)}
                className="flex-none flex items-center gap-1.5 font-ui font-semibold text-[12px] h-[34px] px-4 rounded-full capitalize transition-all"
                style={selectedSport===s
                  ? { background:'#9CFF93', color:'#006413' }
                  : { background:'#20201F', color:'#ADAAAA' }}>
                <span style={{ color: selectedSport===s ? '#006413' : '#9E9E9E' }}>
                  {SPORT_ICONS[s]}
                </span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── SELECT COURT ── */}
        <motion.div variants={stagger.item} className="flex flex-col gap-3">
          {/* "Select Court" — Space Grotesk Bold 14px #ADAAAA */}
          <p className="font-heading font-bold" style={{ fontSize:14, color:'#ADAAAA', textTransform:'uppercase', letterSpacing:'0.06em' }}>
            Select Court
          </p>
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: venue.courts }, (_, i) => i + 1).map(c => {
              const isActive = selectedCourt === c
              return (
                <motion.button key={c} whileTap={{ scale:0.92 }}
                  onClick={() => { setCourt(c); setSlots([]) }}
                  className="flex items-center gap-2 font-ui font-semibold text-[12px] h-[34px] px-3 rounded-xl transition-all"
                  style={isActive
                    ? { background:'rgba(156,255,147,0.10)', border:'1px solid rgba(156,255,147,0.4)', color:'#9CFF93' }
                    : { background:'#20201F', border:'1px solid transparent', color:'#ADAAAA' }}>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background:'#9CFF93' }} />}
                  Court {c}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* ── LEGEND ── */}
        <motion.div variants={stagger.item}
          className="flex items-center gap-6 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background:'#262626' }} />
            <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ border:'1.5px solid #9E9E9E', display:'inline-block' }} />
            <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background:'#9CFF93' }} />
            <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Selected</span>
          </div>
        </motion.div>

        {/* ── TIME SLOTS GRID — 2 columns ── */}
        <motion.div variants={stagger.item}>
          <AnimatePresence mode="wait">
            <motion.div key={`${selectedCourt}-${selectedDay.toDateString()}`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              className="grid grid-cols-2 gap-[15px]">
              {ALL_HOURS.map((hour, i) => {
                const status  = slotStatus(selectedCourt, hour)
                const isBooked   = status === 'booked'
                const isSelected = selectedSlots.includes(hour)
                return (
                  <motion.button key={hour}
                    initial={{ opacity:0, y:12 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={isBooked ? {} : { scale:0.95 }}
                    onClick={() => toggleSlot(hour)}
                    disabled={isBooked}
                    className="flex flex-col items-center justify-center rounded-2xl transition-all"
                    style={{
                      height:89,
                      gap:4,
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      background: isSelected
                        ? '#9CFF93'
                        : isBooked
                          ? 'rgba(38,38,38,0.30)'
                          : '#131313',
                    }}>
                    {/* Time — Space Grotesk Bold 18px */}
                    <span className="font-heading font-bold" style={{
                      fontSize:18,
                      color: isSelected ? '#006413' : isBooked ? '#ADAAAA' : '#FFFFFF'
                    }}>
                      {String(hour).padStart(2,'0')}:00
                    </span>
                    {/* Status label — Lexend 10px */}
                    <span className="font-ui text-[10px]" style={{
                      fontWeight: isSelected ? 700 : 400,
                      color: isSelected ? '#006413' : '#ADAAAA'
                    }}>
                      {isSelected ? 'Selected' : isBooked ? 'Reserved' : 'Available'}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── ARENA POLICY ── */}
        <motion.div variants={stagger.item}
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{ background:'#131313', border:'1px solid #1E1E1E' }}>
          {/* Decorative padel icon watermark */}
          <div className="absolute right-4 bottom-4 opacity-10 text-[80px] pointer-events-none select-none">
            🎾
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-none"
                 style={{ background:'rgba(156,255,147,0.15)', border:'1px solid rgba(156,255,147,0.3)' }}>
              <span style={{ fontSize:12, color:'#9CFF93' }}>ℹ</span>
            </div>
            <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Arena Policy</p>
          </div>
          <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#9E9E9E' }}>
            {venue.policy}
          </p>
        </motion.div>

      </motion.div>

      {/* ── STICKY BOTTOM SUMMARY + CTA ── */}
      <div className="fixed z-50"
           style={{
             bottom: 0,
             left:  'max(0px, calc(50% - 215px))',
             right: 'max(0px, calc(50% - 215px))',
             background: 'linear-gradient(to top, #020202 60%, transparent 100%)',
             padding: '20px 16px max(24px, var(--sab,24px))',
           }}>
        {/* Summary row */}
        {selectedSlots.length > 0 && (
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="flex justify-between items-center mb-3 px-1">
            <div>
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Selected Slots</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading font-bold" style={{ fontSize:22, color:'#FFFFFF' }}>
                  {selectedSlots.length}
                </span>
                <span className="font-ui font-semibold text-[14px]" style={{ color:'#9CFF93' }}>
                  x 60 MIN
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Total Amount</p>
              <p className="font-heading font-bold mt-0.5" style={{ fontSize:22, color:'#FFFFFF' }}>
                {fmtAmount}
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA button — disabled state if no slots */}
        <motion.button
          whileTap={selectedSlots.length > 0 ? { scale:0.97 } : {}}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{
            background: selectedSlots.length > 0 ? '#9CFF93' : '#20201F',
            color: selectedSlots.length > 0 ? '#006413' : '#555',
            height: 64, borderRadius: 9999, fontSize: 18,
            cursor: selectedSlots.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'background 0.25s, color 0.25s',
          }}
          onClick={() => {
            if (selectedSlots.length === 0) return
            router.push(`/booking-summary/${venue.id}?slots=${selectedSlots.sort((a,b)=>a-b).join(',')}&court=${selectedCourt}`)
          }}>
          CONFIRM BOOKING
          {selectedSlots.length > 0 && <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />}
        </motion.button>
      </div>
    </div>
  )
}
