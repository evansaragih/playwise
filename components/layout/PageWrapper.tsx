'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Home page has its own embedded BottomNav matching Figma style
  const showNav = pathname !== '/home'
  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pb-20 min-h-screen"
      >
        {children}
      </motion.main>
      {showNav && <BottomNav />}
    </>
  )
}
