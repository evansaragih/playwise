'use client'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuClock } from 'react-icons/lu'
import { GrLocation } from 'react-icons/gr'
import { BsFillCheckCircleFill } from 'react-icons/bs'

const MON_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function fmtRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}` }

/* ── Receipt data keyed by booking pass id ── */
const RECEIPTS: Record<string, {
  receiptNo: string
  venue: string
  location: string
  schedule: { date: Date; slots: { court:string; sport:string; time:string; slots:number; amount:number }[] }[]
  subtotal: number
  vat: number
  serviceFee: number
  players: { id:string; name:string; avatar:string; role:string; status:string; amount:number }[] | null
}> = {
  'g-t1': {
    receiptNo: '020394',
    venue: 'SportHub Arena', location: 'South Jakarta • 2.8 km',
    schedule: [
      { date: new Date(2024,9,14), slots: [
        { court:'Court 1', sport:'Padel',  time:'10:00 - 12:00', slots:2, amount:800000 },
      ]},
    ],
    subtotal: 800000, vat: 88000, serviceFee: 5000,
    players: null,   // solo — hide player slots section
  },
  'g-t2': {
    receiptNo: '020395',
    venue: 'SportHub Arena', location: 'Central Jakarta • 1.2 km',
    schedule: [
      { date: new Date(2024,9,14), slots: [
        { court:'Court 4', sport:'Padel', time:'16:30 - 18:00', slots:2, amount:800000 },
      ]},
    ],
    subtotal: 1600000, vat: 176000, serviceFee: 5000,
    players: [
      { id:'me', name:'Alex Johnson', avatar:'AJ', role:'HOST',   status:'paid', amount:445250 },
      { id:'p2', name:'Marcus Chen',  avatar:'MC', role:'PLAYER', status:'paid', amount:445250 },
      { id:'p3', name:'Sarah',        avatar:'S',  role:'PLAYER', status:'paid', amount:445250 },
      { id:'p4', name:'Eric Cloe',    avatar:'EC', role:'PLAYER', status:'paid', amount:445250 },
    ],
  },
  'g-tm1': {
    receiptNo: '020396',
    venue: 'Metro Sports Center', location: 'South Jakarta • 2.8 km',
    schedule: [
      { date: new Date(2024,9,14), slots: [
        { court:'Court 1', sport:'Padel',  time:'10:00 - 12:00', slots:2, amount:800000 },
        { court:'Court 2', sport:'Padel',  time:'14:00 - 15:00', slots:2, amount:400000 },
      ]},
      { date: new Date(2024,9,15), slots: [
        { court:'Court 1', sport:'Tennis', time:'09:00 - 10:00', slots:2, amount:400000 },
      ]},
    ],
    subtotal: 1600000, vat: 176000, serviceFee: 5000,
    players: [
      { id:'me', name:'Alex Johnson', avatar:'AJ', role:'HOST',   status:'paid', amount:445250 },
      { id:'p2', name:'Marcus Chen',  avatar:'MC', role:'PLAYER', status:'paid', amount:445250 },
      { id:'p3', name:'Sarah',        avatar:'S',  role:'PLAYER', status:'paid', amount:445250 },
      { id:'p4', name:'Eric Cloe',    avatar:'EC', role:'PLAYER', status:'paid', amount:445250 },
    ],
  },
}

const stagger = {
  container: { animate:{ transition:{ staggerChildren:0.05 } } },
  item: { initial:{ opacity:0, y:14 }, animate:{ opacity:1, y:0, transition:{ duration:0.34, ease:[0.22,1,0.36,1] } } },
}

export default function ReceiptPage() {
  const { id }  = useParams<{ id:string }>()
  const router   = useRouter()
  const receipt  = RECEIPTS[id as string] || RECEIPTS['g-t2']

  const total = receipt.subtotal + receipt.vat + receipt.serviceFee
  const perPerson = receipt.players
    ? Math.ceil(total / receipt.players.length)
    : total

  return (
    <div className="bg-[#020202]"
         style={{ paddingBottom:'calc(40px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))', background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4" style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2}/>
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Receipt #{receipt.receiptNo}
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 56px)' }} />

      {/* ══ CONTENT ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 pt-4 flex flex-col gap-6">

        {/* ── VENUE HEADER CARD ── */}
        <motion.div variants={stagger.item}
          className="relative rounded-3xl overflow-hidden p-6 flex flex-col gap-2"
          style={{ background:'#20201F' }}>
          <div className="absolute -top-8 -right-8 pointer-events-none"
               style={{ width:128, height:128, background:'rgba(156,255,147,0.10)', borderRadius:9999 }} />
          <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>Upcoming Session</p>
          <p className="font-heading font-bold text-white" style={{ fontSize:22 }}>{receipt.venue}</p>
          <div className="flex items-center gap-1">
            <GrLocation size={14} color="#ADAAAA"/>
            <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{receipt.location}</span>
          </div>
        </motion.div>

        {/* ── BOOKED SCHEDULE ── */}
        <motion.div variants={stagger.item} className="flex flex-col gap-4">
          <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
             style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>Booked Schedule</p>

          {receipt.schedule.map((group, gi) => {
            const d = group.date
            const month = MON_SHORT[d.getMonth()].toUpperCase()
            const day   = DAY_NAMES[d.getDay()]
            return (
              <div key={gi} className="flex flex-col gap-3">
                {/* Date header */}
                <div className="flex justify-between items-baseline">
                  <p className="font-heading font-bold" style={{ fontSize:18, color:'#9CFF93' }}>
                    {month} {d.getDate()}
                  </p>
                  <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{day}</p>
                </div>
                {/* Slot rows */}
                {group.slots.map((slot, si) => (
                  <div key={si} className="flex items-center justify-between px-5 py-4 rounded-xl"
                       style={{ background:'#131313' }}>
                    <div className="flex flex-col gap-1">
                      {/* Court name + sport on same row */}
                      <div className="flex items-center justify-between gap-8">
                        <p className="font-heading font-bold text-white" style={{ fontSize:18 }}>{slot.court}</p>
                        <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{slot.sport}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LuClock size={13} color="#9CFF93" strokeWidth={1.5}/>
                        <span className="font-ui font-semibold text-[14px] text-white">{slot.time}</span>
                        <span className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>
                          {slot.slots} SLOT{slot.slots>1?'S':''}
                        </span>
                      </div>
                    </div>
                    <p className="font-heading font-bold flex-none" style={{ fontSize:18, color:'#9CFF93' }}>
                      {fmtRp(slot.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )
          })}
        </motion.div>

        {/* ── PAYMENT DETAILS CARD ── bg:#20201F r:24 p:24 */}
        <motion.div variants={stagger.item}
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background:'#20201F' }}>
          <p className="font-ui font-semibold text-[14px] uppercase tracking-wider"
             style={{ color:'#ADAAAA', paddingBottom:8, borderBottom:'1px solid #2A2A2A' }}>
            Payment Details
          </p>
          <ReceiptRow label="Subtotal"    value={fmtRp(receipt.subtotal)} />
          <ReceiptRow label="VAT (11%)"   value={fmtRp(receipt.vat)} />
          <ReceiptRow label="Service Fee" value={fmtRp(receipt.serviceFee)} />
          {/* Total */}
          <div style={{ borderTop:'1px solid #2A2A2A', paddingTop:16 }}>
            <p className="font-ui text-[12px] mb-1" style={{ color:'#ADAAAA' }}>TOTAL PAYABLE</p>
            <p className="font-heading font-bold" style={{ fontSize:32, color:'#9CFF93', lineHeight:1 }}>
              {fmtRp(total)}
            </p>
          </div>
        </motion.div>

        {/* ── PLAYER SLOTS (multi only — hidden for solo) ── */}
        {receipt.players && receipt.players.length > 1 && (
          <motion.div variants={stagger.item} className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                 style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>
                Player Slots ({receipt.players.length} of 8)
              </p>
              <span className="font-ui font-semibold text-[12px]" style={{ color:'#9CFF93' }}>
                {fmtRp(perPerson)} / person
              </span>
            </div>

            {/* Player rows */}
            <div className="flex flex-col gap-3">
              {receipt.players.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.05 }}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                  style={{
                    background: p.role==='HOST' ? '#20201F' : '#131313',
                    border: p.role==='HOST' ? '1px solid rgba(156,255,147,0.2)' : '1px solid transparent',
                  }}>
                  {/* Avatar */}
                  <div className="flex items-center justify-center flex-none rounded-full font-ui font-bold text-[12px]"
                       style={{ width:40, height:40,
                         background: p.role==='HOST' ? 'rgba(156,255,147,0.20)' : '#262626',
                         color: p.role==='HOST' ? '#9CFF93' : '#ADAAAA' }}>
                    {p.id==='me' ? 'Me' : p.avatar}
                  </div>
                  {/* Name + role */}
                  <div className="flex flex-col gap-0.5 flex-1">
                    <p className="font-ui font-semibold text-[14px] text-white">{p.name}</p>
                    <div className="flex items-center gap-2">
                      {p.status === 'paid' && (
                        <BsFillCheckCircleFill size={11} color="#9CFF93"/>
                      )}
                      <span className="font-ui text-[12px]"
                            style={{ color: p.role==='HOST' ? '#9CFF93' : '#9E9E9E' }}>
                        {p.role==='HOST' ? 'HOST' : p.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {/* Amount */}
                  <p className="font-ui font-semibold text-[14px] flex-none"
                     style={{ color: p.role==='HOST' ? '#9CFF93' : '#FFFFFF' }}>
                    {fmtRp(p.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}

function ReceiptRow({ label, value }: { label:string; value:string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-ui text-[14px]" style={{ color:'#ADAAAA' }}>{label}</span>
      <span className="font-ui font-semibold text-[14px] text-white">{value}</span>
    </div>
  )
}
