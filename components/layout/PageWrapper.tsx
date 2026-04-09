'use client'
import { motion } from 'framer-motion'
import BottomNav from './BottomNav'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pb-28 min-h-screen"
      >
        {children}
      </motion.main>
      <BottomNav />
    </>
  )
}
