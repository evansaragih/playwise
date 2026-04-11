'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LuChevronLeft, LuChevronRight, LuCreditCard, LuCheck } from 'react-icons/lu'

/* ── Payment methods ── */
const METHODS = [
  {
    id: 'visa',
    label: 'Visa •••• 4242',
    sub: 'Debit / Credit Card · Expires 09/26',
    group: 'CARD',
    color: '#1A1F71',
    logo: (
      <svg viewBox="0 0 60 20" width="42" height="14">
        <text x="0" y="16" fontSize="16" fontWeight="900" fill="#1A1F71" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    id: 'gopay',
    label: 'GoPay',
    sub: 'Connected • Rp 250,000 balance',
    group: 'E-WALLET',
    color: '#00AED6',
    logo: (
      <svg viewBox="0 0 40 20" width="40" height="20">
        <circle cx="10" cy="10" r="10" fill="#00AED6"/>
        <text x="22" y="14" fontSize="10" fontWeight="700" fill="#00AED6" fontFamily="Arial">GoPay</text>
      </svg>
    ),
  },
  {
    id: 'dana',
    label: 'DANA',
    sub: 'Connected • Rp 180,000 balance',
    group: 'E-WALLET',
    color: '#118EEA',
    logo: (
      <svg viewBox="0 0 50 20" width="50" height="20">
        <rect width="50" height="20" rx="4" fill="#118EEA"/>
        <text x="8" y="14" fontSize="11" fontWeight="700" fill="white" fontFamily="Arial">DANA</text>
      </svg>
    ),
  },
  {
    id: 'ovo',
    label: 'OVO',
    sub: 'Connected • Rp 95,000 balance',
    group: 'E-WALLET',
    color: '#4C3494',
    logo: (
      <svg viewBox="0 0 40 20" width="40" height="20">
        <rect width="40" height="20" rx="4" fill="#4C3494"/>
        <text x="8" y="14" fontSize="11" fontWeight="700" fill="white" fontFamily="Arial">OVO</text>
      </svg>
    ),
  },
  {
    id: 'shopeepay',
    label: 'ShopeePay',
    sub: 'Connected • Rp 320,000 balance',
    group: 'E-WALLET',
    color: '#EE4D2D',
    logo: (
      <svg viewBox="0 0 64 20" width="64" height="20">
        <rect width="64" height="20" rx="4" fill="#EE4D2D"/>
        <text x="4" y="14" fontSize="9" fontWeight="700" fill="white" fontFamily="Arial">ShopeePay</text>
      </svg>
    ),
  },
  {
    id: 'linkaja',
    label: 'LinkAja',
    sub: 'Connected • Rp 50,000 balance',
    group: 'E-WALLET',
    color: '#E82529',
    logo: (
      <svg viewBox="0 0 54 20" width="54" height="20">
        <rect width="54" height="20" rx="4" fill="#E82529"/>
        <text x="4" y="14" fontSize="9" fontWeight="700" fill="white" fontFamily="Arial">LinkAja</text>
      </svg>
    ),
  },
  {
    id: 'qris',
    label: 'QRIS',
    sub: 'Scan QR code to pay',
    group: 'QR CODE',
    color: '#EB001B',
    logo: (
      /* Simple QR grid icon */
      <svg viewBox="0 0 20 20" width="24" height="24">
        <rect x="0" y="0" width="8" height="8" rx="1" fill="#EB001B"/>
        <rect x="2" y="2" width="4" height="4" fill="#020202"/>
        <rect x="12" y="0" width="8" height="8" rx="1" fill="#EB001B"/>
        <rect x="14" y="2" width="4" height="4" fill="#020202"/>
        <rect x="0" y="12" width="8" height="8" rx="1" fill="#EB001B"/>
        <rect x="2" y="14" width="4" height="4" fill="#020202"/>
        <rect x="12" y="12" width="4" height="4" fill="#EB001B"/>
        <rect x="18" y="12" width="2" height="2" fill="#EB001B"/>
        <rect x="12" y="18" width="8" height="2" fill="#EB001B"/>
        <rect x="10" y="10" width="2" height="2" fill="#EB001B"/>
        <rect x="10" y="0" width="2" height="8" fill="#EB001B"/>
        <rect x="0" y="10" width="8" height="2" fill="#EB001B"/>
      </svg>
    ),
  },
]

const GROUPS = ['CARD', 'E-WALLET', 'QR CODE']

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: { initial:{ opacity:0, y:14 }, animate:{ opacity:1, y:0, transition:{ duration:0.3, ease:[0.22,1,0.36,1] } } },
}

function SelectPaymentContent() {
  const router = useRouter()
  const sp     = useSearchParams()

  // Read current selection from query
  const current = sp.get('current') || 'visa'
  const [selected, setSelected] = useState(current)

  const METHOD_INFO: Record<string, {label:string; sub:string}> = {
    visa:      { label:'Visa •••• 4242',   sub:'Expires 09/26' },
    gopay:     { label:'GoPay',            sub:'Connected • Rp 250,000 balance' },
    dana:      { label:'DANA',             sub:'Connected • Rp 180,000 balance' },
    ovo:       { label:'OVO',              sub:'Connected • Rp 95,000 balance' },
    shopeepay: { label:'ShopeePay',        sub:'Connected • Rp 320,000 balance' },
    linkaja:   { label:'LinkAja',          sub:'Connected • Rp 50,000 balance' },
    qris:      { label:'QRIS',             sub:'Scan QR code to pay' },
  }

  const handleSelect = (id: string) => {
    setSelected(id)
    const info = METHOD_INFO[id] || { label: id, sub:'' }
    sessionStorage.setItem('playwise_payment_method', JSON.stringify({ id, ...info }))
    setTimeout(() => { router.back() }, 280)
  }

  const selectedMethod = METHODS.find(m => m.id === selected)

  return (
    <div className="bg-[#020202] min-h-screen" style={{ paddingBottom:'calc(32px + var(--sab,0px))' }}>

      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4" style={{ height:56, borderBottom:'1px solid #1E1E1E' }}>
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Select Payment Method
          </p>
        </div>
      </div>
      <div style={{ height:'calc(var(--sat,0px) + 56px)' }} />

      {/* ══ CONTENT ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 pt-6 flex flex-col gap-6">

        {GROUPS.map(group => {
          const items = METHODS.filter(m => m.group === group)
          return (
            <motion.div key={group} variants={stagger.item} className="flex flex-col gap-3">
              {/* Group label */}
              <p className="font-ui font-semibold text-[12px] uppercase tracking-widest"
                 style={{ color:'#ADAAAA', letterSpacing:'0.1em' }}>{group}</p>

              {/* Method rows */}
              <div className="flex flex-col gap-2">
                {items.map(m => {
                  const isSelected = selected === m.id
                  return (
                    <motion.button key={m.id}
                      whileTap={{ scale:0.98 }}
                      onClick={() => handleSelect(m.id)}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl text-left w-full tap-highlight"
                      style={{
                        background: isSelected ? 'rgba(156,255,147,0.08)' : '#20201F',
                        border: isSelected
                          ? '1.5px solid rgba(156,255,147,0.4)'
                          : '1.5px solid transparent',
                        transition: 'background 0.18s, border-color 0.18s',
                      }}>

                      {/* Logo box */}
                      <div className="flex items-center justify-center flex-none rounded-xl"
                           style={{ width:48, height:48, background:'rgba(255,255,255,0.06)',
                             border:'1px solid rgba(255,255,255,0.08)' }}>
                        {m.logo}
                      </div>

                      {/* Label + sub */}
                      <div className="flex flex-col gap-0.5 flex-1">
                        <p className="font-ui font-semibold text-[15px] text-white">{m.label}</p>
                        <p className="font-ui text-[12px]" style={{ color:'#ADAAAA' }}>{m.sub}</p>
                      </div>

                      {/* Check or chevron */}
                      <div className="flex-none">
                        {isSelected ? (
                          <motion.div
                            initial={{ scale:0 }} animate={{ scale:1 }}
                            transition={{ type:'spring', stiffness:360, damping:20 }}
                            className="flex items-center justify-center rounded-full"
                            style={{ width:24, height:24, background:'#9CFF93' }}>
                            <LuCheck size={14} color="#006413" strokeWidth={2.5} />
                          </motion.div>
                        ) : (
                          <LuChevronRight size={16} color="#555" strokeWidth={2} />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

        {/* Add new card button */}
        <motion.button variants={stagger.item}
          whileTap={{ scale:0.97 }}
          className="flex items-center justify-center gap-2 font-ui font-semibold text-[14px] tap-highlight"
          style={{ height:54, borderRadius:16, border:'1px dashed #2A2A2A',
            background:'transparent', color:'#ADAAAA' }}>
          <LuCreditCard size={18} color="#ADAAAA" strokeWidth={1.5} />
          Add New Card
        </motion.button>

      </motion.div>
    </div>
  )
}

import { Suspense } from 'react'
export default function SelectPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202]" />}>
      <SelectPaymentContent />
    </Suspense>
  )
}
