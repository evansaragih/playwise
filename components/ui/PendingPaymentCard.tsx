'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Timer } from 'lucide-react'

interface Props {
  court: string
  venue: string
  schedule: string
  expiresAt?: Date
  onPayNow?: () => void
}

function useCountdown(expiresAt?: Date) {
  const calc = () => {
    if (!expiresAt) return null
    const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    return { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60, total: diff }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    if (!expiresAt) return
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  return time
}

export default function PendingPaymentCard({ court, venue, schedule, expiresAt, onPayNow }: Props) {
  const countdown = useCountdown(expiresAt)

  // Urgency: red < 5min, else match the PENDING amber style
  const isUrgent = countdown && countdown.total < 300

  return (
    <motion.div whileTap={{ scale: 0.985 }} className="relative overflow-hidden tap-highlight cursor-pointer"
      style={{ background: '#20201F', borderRadius: 12 }}>

      {/* ── Left amber accent bar: w:4 h:172 r:9999 at x:0 y:24 ── */}
      <div className="absolute left-0"
           style={{ top: 24, width: 4, height: 172, background: '#FFB800', borderRadius: 9999 }} />

      {/* ── Card body: pt:24 pb:24 pr:24 pl:28 ── */}
      <div style={{ paddingTop: 24, paddingBottom: 24, paddingRight: 24, paddingLeft: 28 }}>

        {/* ── TOP ROW: left content + timer icon ── */}
        <div className="flex justify-between items-start" style={{ gap: 16 }}>

          {/* Left column */}
          <div className="flex flex-col flex-1" style={{ gap: 8 }}>

            {/* ── Badge row: PENDING + countdown on same baseline ── */}
            <div className="flex items-center flex-wrap" style={{ gap: 8 }}>

              {/* PENDING chip
                  Figma: bg #FFB800@20%, border 1px solid #FFB800, r:4, px:8 py:2
                  Lexend SemiBold 12px #FFB800
              */}
              <span className="font-ui font-semibold text-[12px] inline-flex items-center"
                    style={{
                      background: 'rgba(255,184,0,0.20)',
                      border: '1px solid #FFB800',
                      color: '#FFB800',
                      borderRadius: 4,
                      padding: '2px 8px',
                      lineHeight: '16px',
                    }}>
                PENDING
              </span>

              {/* Countdown — same amber style as PENDING chip, always amber unless urgent */}
              {countdown !== null && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center"
                    style={{
                      background: isUrgent ? 'rgba(255,68,68,0.15)' : 'rgba(255,184,0,0.15)',
                      border: `1px solid ${isUrgent ? 'rgba(255,68,68,0.5)' : 'rgba(255,184,0,0.5)'}`,
                      borderRadius: 4,
                      padding: '2px 8px',
                      gap: 5,
                    }}>
                    {/* Pulsing dot */}
                    <motion.span
                      animate={{ opacity: [1, 0.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                      style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: isUrgent ? '#FF4444' : '#FFB800',
                      }} />
                    {/* Time — Space Grotesk Bold tabular nums, same amber/red */}
                    <span className="font-heading font-bold tabular-nums"
                          style={{
                            fontSize: 12, lineHeight: '16px',
                            color: isUrgent ? '#FF4444' : '#FFB800',
                            letterSpacing: '0.04em',
                          }}>
                      {countdown.h > 0
                        ? `${String(countdown.h).padStart(2,'0')}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`
                        : `${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`}
                    </span>
                    {/* "left" — Lexend Regular 12px same color */}
                    <span className="font-ui text-[12px]"
                          style={{ color: isUrgent ? '#FF4444' : '#FFB800', opacity: 0.8 }}>
                      left
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Court name — Space Grotesk Bold 22px white */}
            <p className="font-heading font-bold text-white" style={{ fontSize: 22, lineHeight: '1.2' }}>
              {court}
            </p>

            {/* Venue — location icon + Lexend Regular 14px #ADAAAA */}
            <div className="flex items-center" style={{ gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="11" r="3"/>
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
              </svg>
              <span className="font-ui text-[14px]" style={{ color: '#ADAAAA' }}>{venue}</span>
            </div>
          </div>

          {/* Timer icon box — 64×64 bg:#262626 r:10.67 */}
          <div className="flex items-center justify-center flex-none"
               style={{ width: 64, height: 64, background: '#262626', borderRadius: 10.67 }}>
            <Timer size={32} color="#FFFFFF" strokeWidth={1.5} />
          </div>
        </div>

        {/* ── DIVIDER + SCHEDULE + PAY NOW ──
            borderTop: 1px solid #484847, mt:24, pt:16
        ── */}
        <div className="flex justify-between items-end"
             style={{ borderTop: '1px solid #484847', marginTop: 24, paddingTop: 16, gap: 16 }}>
          <div className="flex flex-col" style={{ gap: 2 }}>
            {/* "SCHEDULE" — Lexend Regular 10px #ADAAAA */}
            <span className="font-ui uppercase tracking-widest"
                  style={{ fontSize: 10, color: '#ADAAAA', letterSpacing: '0.1em' }}>
              Schedule
            </span>
            {/* Time — Space Grotesk Bold 18px white */}
            <p className="font-heading font-bold text-white" style={{ fontSize: 18 }}>{schedule}</p>
          </div>

          {/* PAY NOW — bg:#FFB800 r:9999 h:34 px:16
              Lexend SemiBold 12px #715200 */}
          <motion.button whileTap={{ scale: 0.94 }} onClick={onPayNow}
            className="font-ui font-semibold tap-highlight flex-none"
            style={{
              background: '#FFB800', color: '#715200',
              fontSize: 12, borderRadius: 9999,
              height: 34, paddingLeft: 16, paddingRight: 16,
            }}>
            PAY NOW
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
