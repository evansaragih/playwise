'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

/*
  Splash screen shown once per PWA session.
  After animations complete (~3.2s) it redirects to /home.
  Uses sessionStorage so it only shows on first open — not on every nav.
*/

const SPORT_ICONS = [
  /* Padel racket */
  <svg key="padel" viewBox="0 0 40 40" width="40" height="40" fill="none">
    <ellipse cx="20" cy="16" rx="12" ry="13" stroke="#9CFF93" strokeWidth="2.5"/>
    <circle  cx="20" cy="16" r="5"  stroke="#9CFF93" strokeWidth="2"/>
    <line x1="20" y1="29" x2="20" y2="38" stroke="#9CFF93" strokeWidth="3" strokeLinecap="round"/>
  </svg>,
  /* Tennis ball */
  <svg key="tennis" viewBox="0 0 40 40" width="40" height="40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="#9CFF93" strokeWidth="2.5"/>
    <path d="M8 14 Q20 20 32 14" stroke="#9CFF93" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M8 26 Q20 20 32 26" stroke="#9CFF93" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>,
  /* Football */
  <svg key="football" viewBox="0 0 40 40" width="40" height="40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="#9CFF93" strokeWidth="2.5"/>
    <polygon points="20,10 24,15 20,20 16,15" stroke="#9CFF93" strokeWidth="1.5" fill="none"/>
    <polygon points="20,20 26,22 25,28 15,28 14,22" stroke="#9CFF93" strokeWidth="1.5" fill="none"/>
  </svg>,
  /* Basketball */
  <svg key="basketball" viewBox="0 0 40 40" width="40" height="40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="#9CFF93" strokeWidth="2.5"/>
    <line x1="6"  y1="20" x2="34" y2="20" stroke="#9CFF93" strokeWidth="2"/>
    <line x1="20" y1="6"  x2="20" y2="34" stroke="#9CFF93" strokeWidth="2"/>
    <path d="M9 11 Q20 20 9 29" stroke="#9CFF93" strokeWidth="2" fill="none"/>
    <path d="M31 11 Q20 20 31 29" stroke="#9CFF93" strokeWidth="2" fill="none"/>
  </svg>,
]

/* Positions for the orbiting sport icons (4 corners) */
const ICON_POSITIONS = [
  { x: -90, y: -90 },
  { x:  90, y: -90 },
  { x: -90, y:  90 },
  { x:  90, y:  90 },
]

export default function SplashPage() {
  const router  = useRouter()
  const [phase, setPhase] = useState<'enter'|'hold'|'exit'>('enter')

  useEffect(() => {
    /* Skip if already seen this session */
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('playwise_splash_shown')) {
        router.replace('/home')
        return
      }
      sessionStorage.setItem('playwise_splash_shown', '1')
    }

    /* Timeline:
       0ms   — mount / logo scales in
       1400ms — icons orbit in
       2600ms — hold
       3200ms — exit fade
       3800ms — navigate */
    const t1 = setTimeout(() => setPhase('hold'),  2600)
    const t2 = setTimeout(() => setPhase('exit'),  3200)
    const t3 = setTimeout(() => router.replace('/home'), 3900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [router])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
         style={{ background:'#020202', zIndex:9999 }}>

      {/* ── Background radial glow ── */}
      <motion.div
        initial={{ opacity:0, scale:0.5 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.18, scale: 1.4 }}
        transition={{ duration:1.2, ease:'easeOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width:420, height:420, background:'radial-gradient(circle, #9CFF93 0%, transparent 70%)' }}
      />

      {/* ── Orbiting sport icons ── */}
      {ICON_POSITIONS.map((pos, i) => (
        <motion.div key={i}
          initial={{ opacity:0, x: pos.x * 0.3, y: pos.y * 0.3, scale:0.4 }}
          animate={phase === 'exit'
            ? { opacity:0, x: pos.x * 0.3, y: pos.y * 0.3, scale:0.3 }
            : { opacity: phase === 'hold' ? 0.35 : 0.35,
                x: pos.x, y: pos.y, scale:1,
                rotate: [0, 8, -8, 0] }}
          transition={{
            default:  { delay: 0.3 + i * 0.08, duration:0.7, ease:[0.22,1,0.36,1] },
            rotate:   { delay: 1.2, duration:3, repeat:Infinity, ease:'easeInOut' },
            opacity:  { duration: phase === 'exit' ? 0.4 : 0.6 },
          }}
          className="absolute opacity-0"
          style={{ opacity:0 }}>
          {SPORT_ICONS[i]}
        </motion.div>
      ))}

      {/* ── Centre logo mark ── */}
      <AnimatePresence>
        {phase !== 'exit' && (
          <motion.div
            key="logo"
            initial={{ scale:0.4, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:0.85, opacity:0 }}
            transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}
            className="flex flex-col items-center gap-6 relative z-10">

            {/* App icon — green circle with P */}
            <motion.div
              animate={{ scale:[1, 1.04, 1] }}
              transition={{ repeat:Infinity, duration:2.4, ease:'easeInOut' }}
              className="flex items-center justify-center rounded-3xl"
              style={{ width:96, height:96, background:'#006413',
                boxShadow:'0 0 60px rgba(156,255,147,0.35), 0 0 120px rgba(156,255,147,0.15)' }}>
              <span className="font-heading font-bold text-[#9CFF93]" style={{ fontSize:52, lineHeight:1 }}>
                P
              </span>
            </motion.div>

            {/* Wordmark */}
            <div className="flex flex-col items-center gap-1">
              {/* PlayWise — staggered letter entrance */}
              <motion.p
                initial={{ opacity:0, y:12, letterSpacing:'0.4em' }}
                animate={{ opacity:1, y:0, letterSpacing:'0.12em' }}
                transition={{ delay:0.4, duration:0.7, ease:[0.22,1,0.36,1] }}
                className="font-heading font-bold text-white"
                style={{ fontSize:32, letterSpacing:'0.12em' }}>
                PLAYWISE
              </motion.p>
              {/* Tagline */}
              <motion.p
                initial={{ opacity:0, y:8 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.65, duration:0.6 }}
                className="font-ui text-[14px]"
                style={{ color:'#ADAAAA', letterSpacing:'0.04em' }}>
                Smart Sports Booking
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading bar ── */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ delay:0.8 }}
        className="absolute"
        style={{ bottom:'15%', width:160 }}>
        {/* Track */}
        <div className="rounded-full overflow-hidden"
             style={{ height:2, background:'rgba(156,255,147,0.15)' }}>
          <motion.div
            initial={{ width:'0%' }}
            animate={{ width: phase === 'exit' ? '100%' : ['0%','40%','70%','88%','100%'] }}
            transition={{ duration: phase === 'exit' ? 0.3 : 3.0, ease:'easeInOut' }}
            className="h-full rounded-full"
            style={{ background:'#9CFF93' }} />
        </div>
      </motion.div>

      {/* ── Powered by text ── */}
      <motion.p
        initial={{ opacity:0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.35 }}
        transition={{ delay:1.0 }}
        className="absolute font-ui text-[11px]"
        style={{ bottom:'10%', color:'#ADAAAA', letterSpacing:'0.08em' }}>
        POWERED BY PLAYWISE
      </motion.p>

      {/* ── Full page exit overlay ── */}
      <AnimatePresence>
        {phase === 'exit' && (
          <motion.div
            key="overlay"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:0.5 }}
            className="absolute inset-0"
            style={{ background:'#020202', zIndex:20 }} />
        )}
      </AnimatePresence>
    </div>
  )
}
