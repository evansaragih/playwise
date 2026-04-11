'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GrLocation } from 'react-icons/gr'
import { LuChevronLeft, LuChevronRight, LuClock, LuPlus, LuUsers, LuCreditCard, LuCheck, LuUserPlus } from 'react-icons/lu'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdTimer } from 'react-icons/md'
import { mockVenues } from '@/lib/mock-data'

type PayMode = 'full' | 'split'
type PlayerStatus = 'host' | 'paid' | 'pending'
interface Player { id: string; name: string; avatar: string; status: PlayerStatus }
interface CartEntry { court: number; hours: number[]; date: Date; sport: string }

const MON_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const VAT_RATE  = 0.11
const SERVICE_FEE = 5000
const MAX_PLAYERS = 8

function fmtRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}` }
function fmtDate(d: Date)  { return `${MON_SHORT[d.getMonth()].toUpperCase()} ${d.getDate()}` }
function fmtSlotTime(hours: number[]) {
  const s = [...hours].sort((a,b)=>a-b)
  return `${String(s[0]).padStart(2,'0')}:00 - ${String(s[s.length-1]+1).padStart(2,'0')}:00`
}

const INIT_PLAYERS: Player[] = [
  { id:'me', name:'Alex Johnson', avatar:'AJ', status:'host' },
  { id:'p2', name:'Marcus Chen',  avatar:'MC', status:'paid' },
  { id:'p3', name:'Sarah',        avatar:'S',  status:'pending' },
  { id:'p4', name:'Eric Cloe',    avatar:'EC', status:'pending' },
]

type LoadingPhase = 'idle' | 'processing' | 'done'

export default function PaymentPage() {
  const { id }        = useParams<{ id: string }>()
  const router         = useRouter()
  const venue          = mockVenues.find(v => v.id === id)

  const [cart, setCart]       = useState<CartEntry[]>([])
  const [mode, setMode]       = useState<PayMode>('full')
  const [players, setPlayers] = useState<Player[]>(INIT_PLAYERS)
  const [seconds, setSeconds] = useState(19*60+54)
  const [loading, setLoading]   = useState<LoadingPhase>('idle')
  const [payMethod, setPayMethod] = useState({ id:'visa', label:'Visa •••• 4242', sub:'Expires 09/26' })

  /* Read payment method selection from sessionStorage when coming back */
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('playwise_payment_method') : null
    if (stored) {
      try {
        setPayMethod(JSON.parse(stored))
        sessionStorage.removeItem('playwise_payment_method')
      } catch(e) {}
    }
  }, [])

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('playwise_cart_sync') : null
    if (raw) {
      try { setCart(JSON.parse(raw).map((p:any)=>({...p, date:new Date(p.date)}))) } catch(e){}
    } else {
      setCart([{ court:1, hours:[10,11], date:new Date(), sport:'padel' }])
    }
  }, [])

  useEffect(() => {
    const t = setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000)
    return ()=>clearInterval(t)
  }, [])
  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  if (!venue) return null

  const pricePerSlot = parseInt(venue.price.replace(/[^0-9]/g,''))||200000
  const subtotal  = cart.reduce((acc,b)=>acc+b.hours.length*pricePerSlot, 0) || 2*pricePerSlot
  const vat       = Math.round(subtotal * VAT_RATE)
  const total     = subtotal + vat + SERVICE_FEE
  const perPerson = Math.ceil(total / players.length)

  const handlePay = () => {
    setLoading('processing')
    // simulate payment processing: 2.2 seconds
    setTimeout(() => {
      setLoading('done')
      setTimeout(() => {
        if (mode === 'full') {
          router.push(`/booking-confirmed/${venue.id}?total=${total}&method=Visa+****+4242`)
        } else {
          router.push(`/payment-status/${venue.id}?total=${total}&perPerson=${perPerson}&players=${encodeURIComponent(JSON.stringify(players))}`)
        }
      }, 600)
    }, 2200)
  }

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return
    setPlayers(prev=>[...prev,{ id:`p${Date.now()}`, name:`Player ${prev.length+1}`, avatar:`P${prev.length+1}`, status:'pending' }])
  }
  const removePlayer = (pid: string) => setPlayers(prev=>prev.filter(p=>p.id!==pid))

  const grouped = cart.reduce((acc,b)=>{
    const key = b.date.toDateString()
    if(!acc[key]) acc[key]={ date:b.date, slots:[] }
    acc[key].slots.push(b); return acc
  }, {} as Record<string,{date:Date;slots:CartEntry[]}>)

  return (
    <div className="bg-[#020202]" style={{ paddingBottom:'calc(240px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))', background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        {/* Urgency timer */}
        <div className="flex items-center justify-center gap-2"
             style={{ background:'rgba(156,255,147,0.10)', padding:'8px 0' }}>
          <MdTimer size={15} color="#9CFF93" />
          <span className="font-ui font-semibold text-[12px]" style={{ color:'#9CFF93' }}>
            BOOKING EXPIRES IN {mm}:{ss}
          </span>
        </div>
        <div className="flex items-center gap-4 px-4" style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={()=>router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>Payment</p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 91px)' }} />

      <motion.div className="px-4 flex flex-col gap-6 pt-4">

        {/* Venue card */}
        <div className="relative rounded-3xl overflow-hidden p-6 flex flex-col gap-2" style={{ background:'#20201F' }}>
          <div className="absolute -top-8 -right-8 pointer-events-none"
               style={{ width:128, height:128, background:'rgba(156,255,147,0.10)', borderRadius:9999 }} />
          <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Upcoming Session</p>
          <p className="font-heading font-bold text-white" style={{ fontSize:22 }}>{venue.name}</p>
          <div className="flex items-center gap-1">
            <GrLocation size={14} color="#ADAAAA" />
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{venue.location} • {venue.distance}</span>
          </div>
        </div>

        {/* Payment method — tap to open selector */}
        <div className="flex flex-col gap-3">
          <p className="font-ui font-semibold text-[12px] uppercase tracking-widest" style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Choose Payment Method</p>
          <motion.button whileTap={{ scale:0.98 }}
            onClick={() => {
              sessionStorage.setItem('playwise_payment_method', JSON.stringify(payMethod))
              router.push(`/select-payment?current=${payMethod.id}&venueId=${id}`)
            }}
            className="flex items-center justify-between h-[70px] px-4 rounded-xl w-full tap-highlight"
            style={{ background:'#20201F', border:'1.5px solid rgba(156,255,147,0.25)' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-[5px]" style={{ width:38, height:38, background:'rgba(255,255,255,0.05)' }}>
                <LuCreditCard size={20} color="#9CFF93" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-ui font-semibold text-[16px] text-white">{payMethod.label}</p>
                <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{payMethod.sub}</p>
              </div>
            </div>
            <LuChevronRight size={16} color="#9CFF93" />
          </motion.button>
        </div>

        {/* Pay In Full / Split toggle */}
        <div className="flex items-center rounded-full" style={{ background:'rgba(255,255,255,0.10)', height:56, padding:4 }}>
          {(['full','split'] as PayMode[]).map(m=>(
            <motion.button key={m} whileTap={{ scale:0.97 }}
              onClick={()=>setMode(m)}
              className="flex-1 flex items-center justify-center gap-1.5 h-full rounded-full font-ui text-[12px] tap-highlight"
              style={mode===m ? { background:'rgba(255,255,255,0.10)', color:'#F5F5F5', fontWeight:500 } : { color:'rgba(245,245,245,0.6)' }}>
              {m==='full' ? <><LuCreditCard size={14}/><span>Pay In Full</span></> : <><LuUsers size={14}/><span>Split With Friends</span></>}
            </motion.button>
          ))}
        </div>

        {/* Mode content */}
        <AnimatePresence mode="wait">
          {mode==='full' ? (
            <motion.div key="full" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="rounded-2xl p-6 flex flex-col gap-4" style={{ background:'#20201F' }}>
              <p className="font-ui font-semibold text-[14px] uppercase tracking-wider"
                 style={{ color:'#ADAAAA', paddingBottom:8, borderBottom:'1px solid #2A2A2A' }}>Payment Details</p>
              <PayRow label="Subtotal"    value={fmtRp(subtotal)} />
              <PayRow label="VAT (11%)"   value={fmtRp(vat)} />
              <PayRow label="Service Fee" value={fmtRp(SERVICE_FEE)} />
              <div style={{ borderTop:'1px solid #2A2A2A', paddingTop:16 }}>
                <p className="font-ui text-[12px] mb-1" style={{ color:'#ADAAAA' }}>TOTAL PAYABLE</p>
                <p className="font-heading font-bold" style={{ fontSize:32, color:'#9CFF93', lineHeight:1 }}>{fmtRp(total)}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="split" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="font-ui font-semibold text-[12px] uppercase tracking-widest" style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>
                  Player Slots ({players.length} of {MAX_PLAYERS})
                </p>
                <span className="font-ui font-semibold text-[12px]" style={{ color:'#9CFF93' }}>{fmtRp(perPerson)} / person</span>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {players.map((p,i)=>(
                    <motion.div key={p.id}
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, scale:0.95, height:0 }}
                      transition={{ delay:i*0.04 }}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                      style={{ background:p.status==='host'?'#20201F':'#131313', border:p.status==='host'?'1px solid rgba(156,255,147,0.2)':'1px solid transparent' }}>
                      <div className="flex items-center justify-center flex-none rounded-full font-ui font-bold text-[12px]"
                           style={{ width:40, height:40, background:p.status==='host'?'rgba(156,255,147,0.15)':'#262626', color:p.status==='host'?'#9CFF93':'#ADAAAA' }}>
                        {p.avatar}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-ui font-semibold text-[14px] text-white">{p.name}</p>
                          {p.status==='host' && <span className="font-ui text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ background:'rgba(156,255,147,0.15)', color:'#9CFF93' }}>HOST</span>}
                        </div>
                        {p.status!=='host' && <StatusBadge status={p.status} />}
                      </div>
                      <div className="text-right">
                        <p className="font-ui font-semibold text-[14px]" style={{ color:p.status==='paid'?'#9CFF93':p.status==='host'?'#9CFF93':'#FFFFFF' }}>{fmtRp(perPerson)}</p>
                        {p.id!=='me' && <motion.button whileTap={{scale:0.9}} onClick={()=>removePlayer(p.id)} className="font-ui text-[10px] mt-0.5" style={{ color:'rgba(255,68,68,0.7)' }}>Remove</motion.button>}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {players.length<MAX_PLAYERS && (
                  <motion.button whileTap={{scale:0.97}} onClick={addPlayer}
                    className="flex items-center justify-center gap-2 font-ui font-bold text-[12px] tap-highlight"
                    style={{ height:52, borderRadius:12, border:'1px dashed #2A2A2A', background:'transparent', color:'#ADAAAA' }}>
                    <LuUserPlus size={16} color="#ADAAAA" strokeWidth={1.5}/>
                    Add Friend ({MAX_PLAYERS-players.length} slots left)
                  </motion.button>
                )}
              </div>
              <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background:'#20201F' }}>
                <p className="font-ui font-semibold text-[14px] uppercase tracking-wider" style={{ color:'#ADAAAA', paddingBottom:8, borderBottom:'1px solid #2A2A2A' }}>Order Details</p>
                <PayRow label="Subtotal"    value={fmtRp(subtotal)} />
                <PayRow label="VAT (11%)"   value={fmtRp(vat)} />
                <PayRow label="Service Fee" value={fmtRp(SERVICE_FEE)} />
                <div style={{ borderTop:'1px solid #2A2A2A', paddingTop:16 }}>
                  <p className="font-ui text-[12px] mb-1" style={{ color:'#ADAAAA' }}>TOTAL PAYABLE</p>
                  <p className="font-heading font-bold" style={{ fontSize:32, color:'#9CFF93', lineHeight:1 }}>{fmtRp(total)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booked schedule */}
        <div className="flex flex-col gap-4">
          <p className="font-ui font-semibold text-[12px] uppercase tracking-widest" style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Booked Schedule</p>
          {Object.values(grouped).length > 0 ? Object.values(grouped).map(group=>(
            <div key={group.date.toDateString()} className="flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>{fmtDate(group.date)}</p>
                <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{DAY_NAMES[group.date.getDay()]}</p>
              </div>
              {group.slots.map((slot,si)=>(
                <div key={si} className="rounded-xl p-5 flex justify-between items-start" style={{ background:'#131313' }}>
                  <div className="flex flex-col gap-1">
                    <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Court {slot.court}</p>
                    <div className="flex items-center gap-1.5">
                      <LuClock size={13} color="#9CFF93" strokeWidth={1.5}/>
                      <span className="font-ui font-semibold text-[14px] text-white">{fmtSlotTime(slot.hours)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{slot.hours.length} SLOTS</p>
                    <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>{fmtRp(slot.hours.length*pricePerSlot)}</p>
                  </div>
                </div>
              ))}
            </div>
          )) : (
            <div className="rounded-xl p-5 flex justify-between items-start" style={{ background:'#131313' }}>
              <div className="flex flex-col gap-1">
                <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>Court 1</p>
                <div className="flex items-center gap-1.5">
                  <LuClock size={13} color="#9CFF93" strokeWidth={1.5}/>
                  <span className="font-ui font-semibold text-[14px] text-white">10:00 - 12:00</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>2 SLOTS</p>
                <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>{fmtRp(2*pricePerSlot)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ══ FIXED BOTTOM ══ */}
      <div className="fixed z-50"
           style={{ bottom:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'linear-gradient(to top, #020202 55%, transparent 100%)', padding:'20px 16px 0' }}>

        <div className="flex justify-between items-baseline mb-3 px-1">
          <div>
            <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Total Amount</p>
            <p className="font-heading font-bold" style={{ fontSize:32, color:'#9CFF93', lineHeight:1 }}>
              {mode==='split' ? fmtRp(perPerson) : fmtRp(total)}
            </p>
          </div>
          {mode==='split' && <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>your share</p>}
        </div>
        <motion.button whileTap={{ scale:0.97 }} onClick={handlePay}
          className="w-full flex items-center justify-center gap-2 font-heading font-bold"
          style={{ background:'#9CFF93', color:'#006413', height:64, borderRadius:9999, fontSize:18, marginBottom:'max(24px,var(--sab,24px))' }}>
          CONFIRM &amp; PAY
          <LuChevronRight size={20} color="#006413" strokeWidth={2.5}/>
        </motion.button>
      </div>

      {/* ══ PAYMENT PROCESSING OVERLAY ══ */}
      <AnimatePresence>
        {loading !== 'idle' && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background:'rgba(2,2,2,0.92)', backdropFilter:'blur(12px)' }}>

            {loading === 'processing' ? (
              <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                className="flex flex-col items-center gap-8">
                {/* Spinning ring */}
                <div className="relative" style={{ width:96, height:96 }}>
                  {/* Outer pulse */}
                  <motion.div
                    animate={{ scale:[1,1.3,1], opacity:[0.4,0,0.4] }}
                    transition={{ repeat:Infinity, duration:1.6, ease:'easeInOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background:'rgba(156,255,147,0.15)' }} />
                  {/* Spinner track */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(156,255,147,0.15)" strokeWidth="4"/>
                    <motion.circle cx="48" cy="48" r="40" fill="none" stroke="#9CFF93" strokeWidth="4"
                      strokeLinecap="round" strokeDasharray={251}
                      animate={{ strokeDashoffset:[251, 0] }}
                      transition={{ duration:2, ease:'easeInOut', repeat:Infinity }}
                    />
                  </svg>
                  {/* Card icon centre */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LuCreditCard size={28} color="#9CFF93" strokeWidth={1.5}/>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="font-heading font-bold text-white" style={{ fontSize:20 }}>Processing Payment</p>
                  <motion.p
                    animate={{ opacity:[0.4,1,0.4] }}
                    transition={{ repeat:Infinity, duration:1.4 }}
                    className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>
                    Please don't close this screen...
                  </motion.p>
                </div>
                {/* Animated dots */}
                <div className="flex gap-2">
                  {[0,1,2].map(i=>(
                    <motion.div key={i}
                      animate={{ scale:[0.6,1,0.6], opacity:[0.3,1,0.3] }}
                      transition={{ repeat:Infinity, duration:0.8, delay:i*0.18 }}
                      className="rounded-full"
                      style={{ width:8, height:8, background:'#9CFF93' }} />
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Done flash before redirect */
              <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
                transition={{ type:'spring', stiffness:300, damping:20 }}
                className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ scale:[1, 1.15, 1] }}
                  transition={{ duration:0.4 }}
                  className="flex items-center justify-center rounded-full"
                  style={{ width:80, height:80, background:'rgba(156,255,147,0.20)' }}>
                  <BsFillCheckCircleFill size={40} color="#9CFF93"/>
                </motion.div>
                <p className="font-heading font-bold text-white" style={{ fontSize:20 }}>Payment Complete!</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PayRow({ label, value }: { label:string; value:string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{label}</span>
      <span className="font-ui font-semibold text-[14px] text-white">{value}</span>
    </div>
  )
}
function StatusBadge({ status }: { status: PlayerStatus }) {
  if(status==='host') return null
  const cfg = { paid:{ label:'PAID', bg:'rgba(156,255,147,0.12)', color:'#9CFF93' }, pending:{ label:'PENDING', bg:'rgba(158,158,158,0.12)', color:'#9E9E9E' } }[status]
  return <span className="font-ui text-[11px] self-start px-2 py-0.5 rounded" style={{ background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
}
