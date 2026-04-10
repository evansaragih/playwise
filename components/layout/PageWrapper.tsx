'use client'
import { motion } from 'framer-motion'
import BottomNav from './BottomNav'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* status-bar-spacer: height = var(--sat) = env(safe-area-inset-top)
          This fills exactly the iOS status bar area with the page background
          so the clock/battery never overlaps content. */}
      <div className="status-bar-spacer" />

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        /* pb accounts for nav height (80px) + home bar (var(--sab)) */
        style={{ paddingBottom: 'calc(80px + var(--sab, 0px))' }}
      >
        {children}
      </motion.main>

      <BottomNav />
    </>
  )
}
