'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSportsTennis, MdSportsCricket } from 'react-icons/md'
import { IoTennisball, IoFootball, IoBasketball } from 'react-icons/io5'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { mockVenues } from '@/lib/mock-data'

const DAY_NAMES  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MON_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const ALL_HOURS  = [8,9,10,11,12,13,14,15,16,17,18,19,20]

const SPORT_ICONS: Record<string, React.ReactNode> = {
  padel:     <MdSportsTennis  size={14} />,
  tennis:    <IoTennisball    size={14} />,
  futsal:    <IoFootball      size={14} />,
  badminton: <IoBasketball    size={14} />,
  cricket:   <MdSportsCricket size={14} />,
  basket:    <IoBasketball    size={14} />,
}

function getDays(base: Date, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i); return d
  })
}
function slotStatus(court: number, hour: number): 'available' | 'booked' {
  return ((court * 13 + hour * 7) % 10) < 3 ? 'booked' : 'available'
}

export default function SchedulePage() {
  const { id }         = useParams<{ id: string }>()
  const router          = useRouter()
  const searchParams    = useSearchParams()
  const venue           = mockVenues.find(v => v.id === id)

  const today  = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const days   = useMemo(() => getDays(today, 14), [today])

  /* Pre-fill state from query params when coming back from edit */
  const editCourtParam = searchParams.get('court')
  const editCourt = editCourtParam ? parseInt(editCourtParam) : null
  const editDateParam = searchParams.get('date')
  const editDate = editDateParam ? new Date(editDateParam) : null

  const initialCart = useMemo(() => {
    let cart: any[] = []
    const cartParam = searchParams.get('cart')
    if (cartParam) {
      try {
        const parsed = JSON.parse(cartParam)
        cart = parsed.map((p: any) => ({ ...p, date: new Date(p.date) }))
      } catch(e) { }
    }
    const slotsParam = searchParams.get('slots')
    if (slotsParam) {
      const c = parseInt(searchParams.get('court') || '1')
      const d = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()
      d.setHours(0,0,0,0)
      const hours = slotsParam.split(',').map(Number)
      
      const idx = cart.findIndex(b => b.court === c && b.date.toDateString() === d.toDateString())
      if (idx !== -1) {
         cart[idx].hours = Array.from(new Set([...cart[idx].hours, ...hours])).sort((a,b)=>a-b)
      } else {
         cart.push({ court: c, date: d, hours })
      }
    }
    return cart
  }, [searchParams])

  const [localCart, setLocalCart] = useState<any[]>(initialCart)
  // Sync if navigation happens within same component instance
  useEffect(() => { setLocalCart(initialCart) }, [initialCart])

  const [selectedDay,   setDay]    = useState<Date>(() => editDate && !isNaN(editDate.getTime()) ? editDate : today)
  const [selectedSport, setSport]  = useState<string>(() => venue?.sports[0] ?? 'padel')
  const [selectedCourt, setCourt]  = useState(editCourt ?? 1)
  const [sportLoading,  setLoading] = useState(false)

  if (!venue) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <p className="font-ui text-[#ADAAAA]">Venue not found</p>
    </div>
  )

  const pricePerSlot = parseInt(venue.price.replace(/[^0-9]/g, '')) || 200000
  
  const totalActiveSlots = localCart.reduce((sum, b) => sum + b.hours.length, 0)
  const totalAmount  = totalActiveSlots * pricePerSlot
  const fmtAmount    = `Rp ${totalAmount.toLocaleString('id-ID')}`
  const monthLabel   = MON_NAMES[selectedDay.getMonth()] + ' ' + selectedDay.getFullYear()

  const changeSport = (s: string) => {
    if (s === selectedSport) return
    setLoading(true)
    setTimeout(() => { setSport(s); setLoading(false) }, 900)
  }

  const toggleSlot = (hour: number) => {
    if (slotStatus(selectedCourt, hour) === 'booked') return

    setLocalCart(prevCart => {
      const idx = prevCart.findIndex(b => b.court === selectedCourt && b.date.toDateString() === selectedDay.toDateString())
      if (idx !== -1) {
        const item = prevCart[idx]
        if (item.hours.includes(hour)) {
          const newHours = item.hours.filter((h: number) => h !== hour)
          if (newHours.length === 0) return prevCart.filter((_, i) => i !== idx)
          const newCart = [...prevCart]
          newCart[idx] = { ...item, hours: newHours }
          return newCart
        } else {
          const newCart = [...prevCart]
          newCart[idx] = { ...item, hours: [...item.hours, hour].sort((a,b)=>a-b) }
          return newCart
        }
      } else {
        return [...prevCart, { court: selectedCourt, date: selectedDay, hours: [hour] }]
      }
    })
  }

  const handleConfirm = () => {
    const params = new URLSearchParams()
    
    if (localCart.length > 0) {
       params.set('cart', JSON.stringify(localCart))
    }

    const editId = searchParams.get('editId')
    if (editId) params.set('editId', editId)

    router.push(`/booking-summary/${venue.id}?${params.toString()}`)
  }

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(140px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{
             top: 0,
             left:  'max(0px, calc(50% - 215px))',
             right: 'max(0px, calc(50% - 215px))',
             background: '#0E0E0E',
           }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4 py-4">
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Set a Schedule
          </p>
        </div>
      </div>

      {/* Spacer to push content below fixed top bar */}
      <div style={{ height:'calc(var(--sat,0px) + 72px)' }} />

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div className="px-4 flex flex-col gap-6 pt-4">

        {/* ── SELECT DATE ── */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Select Date</p>
            <p className="font-ui text-[14px]" style={{ color:'#9E9E9E' }}>{monthLabel}</p>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2" style={{ width:'max-content', paddingRight:16 }}>
              {days.map(day => {
                const isSel = day.toDateString() === selectedDay.toDateString()
                return (
                  <motion.button key={day.toISOString()} whileTap={{ scale:0.92 }}
                    onClick={() => { setDay(day); }}
                    className="flex flex-col items-center justify-center rounded-2xl flex-none"
                    style={{ width:64, height:99,
                      background: isSel ? 'rgba(156,255,147,0.10)' : '#20201F',
                      border: isSel ? '1px solid rgba(156,255,147,0.4)' : '1px solid transparent' }}>
                    <span className="font-ui text-[12px]" style={{ color: isSel ? '#9CFF93' : '#ADAAAA' }}>
                      {day.toLocaleDateString('en',{month:'short'})}
                    </span>
                    <span className="font-heading font-bold" style={{ fontSize:24, color: isSel ? '#9CFF93' : '#ADAAAA', lineHeight:1.1 }}>
                      {day.getDate()}
                    </span>
                    <span className="font-ui font-medium text-[10px]" style={{ color: isSel ? '#9CFF93' : '#ADAAAA' }}>
                      {DAY_NAMES[day.getDay()]}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── SPORT FILTER — no "All", just venue sports ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {venue.sports.map(s => (
            <motion.button key={s} whileTap={{ scale:0.95 }}
              onClick={() => changeSport(s)}
              className="flex-none flex items-center gap-1.5 font-ui font-semibold text-[12px] h-[34px] px-4 rounded-full capitalize transition-all"
              style={selectedSport === s
                ? { background:'#9CFF93', color:'#006413' }
                : { background:'#20201F', color:'#ADAAAA' }}>
              <span style={{ color: selectedSport === s ? '#006413' : '#9E9E9E' }}>{SPORT_ICONS[s]}</span>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* ── SELECT COURT ── */}
        <div className="flex flex-col gap-3">
          <p className="font-heading font-bold uppercase tracking-widest"
             style={{ fontSize:14, color:'#ADAAAA', letterSpacing:'0.06em' }}>Select Court</p>
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: venue.courts }, (_, i) => i + 1).map(c => {
              const isActive = selectedCourt === c
              return (
                <motion.button key={c} whileTap={{ scale:0.92 }}
                  onClick={() => { setCourt(c); }}
                  className="flex items-center gap-2 font-ui font-semibold text-[12px] h-[34px] px-3 rounded-xl"
                  style={isActive
                    ? { background:'rgba(156,255,147,0.10)', border:'1px solid rgba(156,255,147,0.4)', color:'#9CFF93' }
                    : { background:'#20201F', border:'1px solid transparent', color:'#ADAAAA' }}>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background:'#9CFF93' }} />}
                  Court {c}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── LEGEND ── */}
        <div className="flex items-center gap-6 px-1">
          {[
            { dot:'bg', bg:'#262626', label:'Booked' },
            { dot:'border', bg:'transparent', label:'Available' },
            { dot:'bg', bg:'#9CFF93', label:'Selected' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: item.bg,
                      border: item.dot === 'border' ? '1.5px solid #9E9E9E' : 'none' }} />
              <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── TIME SLOTS — with sport-change loading skeleton ── */}
        <AnimatePresence mode="wait">
          {sportLoading ? (
            <motion.div key="loading"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="grid grid-cols-2 gap-[15px]">
              {ALL_HOURS.map(h => (
                <div key={h} className="skeleton rounded-2xl" style={{ height:89 }} />
              ))}
            </motion.div>
          ) : (
            <motion.div key={`${selectedSport}-${selectedCourt}-${selectedDay.toDateString()}`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.22 }}
              className="grid grid-cols-2 gap-[15px]">
              {ALL_HOURS.map((hour, i) => {
                const isBooked   = slotStatus(selectedCourt, hour) === 'booked'
                const isSelected = localCart.some((b: any) => 
                  b.court === selectedCourt && 
                  b.date.toDateString() === selectedDay.toDateString() && 
                  b.hours.includes(hour)
                )
                return (
                  <motion.button key={hour}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i * 0.025 }}
                    whileTap={isBooked ? {} : { scale:0.95 }}
                    onClick={() => toggleSlot(hour)}
                    disabled={isBooked}
                    className="flex flex-col items-center justify-center rounded-2xl"
                    style={{ height:89, gap:4, cursor: isBooked ? 'not-allowed' : 'pointer',
                      background: isSelected ? '#9CFF93' : isBooked ? 'rgba(38,38,38,0.30)' : '#131313' }}>
                    <span className="font-heading font-bold" style={{ fontSize:18,
                      color: isSelected ? '#006413' : isBooked ? '#ADAAAA' : '#FFFFFF' }}>
                      {String(hour).padStart(2,'0')}:00
                    </span>
                    <span className="font-ui text-[10px]" style={{ fontWeight: isSelected ? 700 : 400,
                      color: isSelected ? '#006413' : '#ADAAAA' }}>
                      {isSelected ? 'Selected' : isBooked ? 'Reserved' : 'Available'}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ARENA POLICY ── */}
        <div className="relative rounded-2xl p-5 overflow-hidden flex flex-col gap-3"
             style={{ background:'#131313', border:'1px solid #1E1E1E' }}>
          <div className="absolute right-4 bottom-4 opacity-10 text-[80px] pointer-events-none select-none">🎾</div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-none"
                 style={{ background:'rgba(156,255,147,0.15)', border:'1px solid rgba(156,255,147,0.3)' }}>
              <span style={{ fontSize:12, color:'#9CFF93' }}>ℹ</span>
            </div>
            <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Arena Policy</p>
          </div>
          <p className="font-ui text-[14px] leading-relaxed" style={{ color:'#9E9E9E' }}>{venue.policy}</p>
        </div>
      </div>

      {/* ══ FIXED BOTTOM — Summary + CTA ══ */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)',
             padding:'20px 16px max(24px, var(--sab,24px))' }}>
        {totalActiveSlots > 0 && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            className="flex justify-between items-center mb-3 px-1">
            <div>
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Selected Slots</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading font-bold" style={{ fontSize:22 }}>{totalActiveSlots}</span>
                <span className="font-ui font-semibold text-[14px]" style={{ color:'#9CFF93' }}>x 60 MIN</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Total Amount</p>
              <p className="font-heading font-bold mt-0.5" style={{ fontSize:22 }}>{fmtAmount}</p>
            </div>
          </motion.div>
        )}
        <motion.button whileTap={totalActiveSlots > 0 ? { scale:0.97 } : {}}
          onClick={handleConfirm}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{ background: totalActiveSlots > 0 ? '#9CFF93' : '#20201F',
            color: totalActiveSlots > 0 ? '#006413' : '#555',
            height:64, borderRadius:9999, fontSize:18,
            cursor: totalActiveSlots > 0 ? 'pointer' : 'not-allowed',
            transition:'background 0.25s, color 0.25s' }}>
          CONFIRM BOOKING
          {totalActiveSlots > 0 && <LuChevronRight size={20} color="#006413" strokeWidth={2.5} />}
        </motion.button>
      </div>
    </div>
  )
}
