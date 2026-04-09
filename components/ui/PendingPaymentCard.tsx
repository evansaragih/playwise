'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Timer } from 'lucide-react'

interface PendingPaymentCardProps {
  court: string
  venue: string
  schedule: string
  /** ISO string or seconds remaining — we'll count down from this */
  expiresAt?: Date
  onPayNow?: () => void
}

function useCountdown(expiresAt?: Date) {
  const getRemaining = () => {
    if (!expiresAt) return null
    const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = diff % 60
    return { h, m, s, total: diff }
  }

  const [time, setTime] = useState(getRemaining)

  useEffect(() => {
    if (!expiresAt) return
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  return time
}

export default function PendingPaymentCard({
  court,
  venue,
  schedule,
  expiresAt,
  onPayNow,
}: PendingPaymentCardProps) {
  const countdown = useCountdown(expiresAt)

  // Urgency colour: red if < 5 min, amber if < 15 min, default muted
  const urgency =
    countdown && countdown.total < 300 ? 'urgent'
    : countdown && countdown.total < 900 ? 'warning'
    : 'normal'

  const countdownColor =
    urgency === 'urgent'  ? '#FF4444'
    : urgency === 'warning' ? '#FFB800'
    : '#ADAAAA'

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      className="relative overflow-hidden tap-highlight cursor-pointer"
      style={{
        background: '#20201F',
        borderRadius: 12,
        /* Figma: stroke #484847 on HorizontalBorder — apply as subtle border */
        border: '1px solid #2A2A2A',
      }}
    >
      {/* ── Left amber accent bar — 4×172 r-9999 at x:-4 y:24 ── */}
      <div
        className="absolute left-0"
        style={{
          top: 24,
          width: 4,
          height: 172,
          background: '#FFB800',
          borderRadius: 9999,
        }}
      />

      {/* ── Card body: p-24 gap-24 ── */}
      <div style={{ padding: 24, paddingLeft: 28 }}>

        {/* ── TOP SECTION: left content + timer icon ── */}
        <div className="flex justify-between items-start" style={{ marginBottom: 0, gap: 16 }}>

          {/* Left: badge + title + venue */}
          <div className="flex flex-col" style={{ gap: 8, flex: 1 }}>

            {/* ── Row: PENDING badge + countdown ── */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* PENDING chip
                  Figma: bg #FFB800@20%, border 1px #FFB800, r-4, px-8 py-2
                  text: Lexend SemiBold 12px #FFB800
              */}
              <span
                className="text-[12px] font-semibold font-ui self-start"
                style={{
                  background: 'rgba(255,184,0,0.20)',
                  border: '1px solid #FFB800',
                  color: '#FFB800',
                  borderRadius: 4,
                  padding: '2px 8px',
                  lineHeight: '16px',
                  letterSpacing: '0.02em',
                }}
              >
                PENDING
              </span>

              {/* ── Countdown timer — new addition ── */}
              {countdown !== null && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 px-2.5 py-[3px] rounded-full"
                    style={{
                      background: urgency === 'urgent'
                        ? 'rgba(255,68,68,0.15)'
                        : 'rgba(255,184,0,0.10)',
                      border: `1px solid ${countdownColor}44`,
                    }}
                  >
                    {/* pulsing dot */}
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      className="w-1.5 h-1.5 rounded-full flex-none"
                      style={{ background: countdownColor }}
                    />
                    {/* time digits — Space Grotesk Bold for numbers */}
                    <span
                      className="font-heading font-bold tabular-nums"
                      style={{ fontSize: 12, color: countdownColor, letterSpacing: '0.04em' }}
                    >
                      {countdown.h > 0
                        ? `${String(countdown.h).padStart(2,'0')}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`
                        : `${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')}`
                      }
                    </span>
                    <span
                      className="font-ui text-[10px]"
                      style={{ color: countdownColor, opacity: 0.8 }}
                    >
                      left
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Court name — Space Grotesk Bold 22px white */}
            <p
              className="font-heading font-bold text-white leading-tight"
              style={{ fontSize: 22 }}
            >
              {court}
            </p>

            {/* Venue — location icon + Lexend Regular 14px #ADAAAA */}
            <div className="flex items-center gap-2">
              <MapPin size={12} color="#ADAAAA" strokeWidth={1.5} />
              <span className="font-ui text-[14px]" style={{ color: '#ADAAAA' }}>{venue}</span>
            </div>
          </div>

          {/* Timer icon box — 64×64 bg:#262626 r:10.67 */}
          <div
            className="flex items-center justify-center flex-none"
            style={{
              width: 64, height: 64,
              background: '#262626',
              borderRadius: 10.67,
            }}
          >
            <Timer size={32} color="#FFFFFF" strokeWidth={1.5} />
          </div>
        </div>

        {/* ── DIVIDER + SCHEDULE + PAY NOW ──
            Figma: stroke #484847 on top, pt-16
        ── */}
        <div
          className="flex justify-between items-end"
          style={{
            borderTop: '1px solid #484847',
            marginTop: 24,
            paddingTop: 16,
            gap: 16,
          }}
        >
          <div className="flex flex-col" style={{ gap: 2 }}>
            {/* "SCHEDULE" → Lexend Regular 10px #ADAAAA uppercase */}
            <span
              className="font-ui uppercase tracking-widest"
              style={{ fontSize: 10, color: '#ADAAAA', letterSpacing: '0.1em' }}
            >
              Schedule
            </span>
            {/* Time → Space Grotesk Bold 18px white */}
            <p
              className="font-heading font-bold text-white"
              style={{ fontSize: 18 }}
            >
              {schedule}
            </p>
          </div>

          {/* PAY NOW button — bg:#FFB800 r:9999 px:16 py:8.5
              text: Lexend SemiBold 12px #715200
          */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onPayNow}
            className="font-ui font-semibold tap-highlight"
            style={{
              background: '#FFB800',
              color: '#715200',
              fontSize: 12,
              borderRadius: 9999,
              height: 34,
              paddingLeft: 16,
              paddingRight: 16,
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}
          >
            PAY NOW
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}
