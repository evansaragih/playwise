'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuCalendarCheck, LuBellRing, LuTag, LuCreditCard } from 'react-icons/lu'
import { mockNotifications } from '@/lib/mock-data'

export default function NotificationsPage() {
  const router = useRouter()

  const stagger = {
    container: { animate: { transition: { staggerChildren:0.08 } } },
    item: { initial:{ opacity:0, y:12 }, animate:{ opacity:1, y:0, transition:{ duration:0.35, ease:[0.22,1,0.36,1] } } },
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <LuCalendarCheck size={18} color="#9CFF93" />
      case 'reminder': return <LuBellRing size={18} color="#FFB800" />
      case 'promo': return <LuTag size={18} color="#FF4444" />
      case 'payment': return <LuCreditCard size={18} color="#00FF41" />
      default: return <LuBellRing size={18} color="#ADAAAA" />
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking': return 'rgba(156,255,147,0.15)'
      case 'reminder': return 'rgba(255,184,0,0.15)'
      case 'promo': return 'rgba(255,68,68,0.15)'
      case 'payment': return 'rgba(0,255,65,0.15)'
      default: return 'rgba(173,170,170,0.15)'
    }
  }

  return (
    <div className="bg-[#020202] min-h-[100svh] relative">
      {/* ══ FIXED TOP BAR ══ */}
      <div className="fixed z-50 pt-2"
           style={{ top:0, left:'max(0px,calc(50% - 215px))', right:'max(0px,calc(50% - 215px))',
             background:'#0E0E0E' }}>
        <div className="status-bar-spacer" style={{ background:'#0E0E0E' }} />
        <div className="flex items-center gap-4 px-4 py-3">
          <motion.button whileTap={{ scale:0.9 }} onClick={() => router.back()}
            className="flex items-center justify-center flex-none tap-highlight liquid-glass-icon bg-[#1A1A1A]"
            style={{ width:40, height:40, borderRadius:9999 }}>
            <LuChevronLeft size={18} color="#F5F5F5" strokeWidth={2} />
          </motion.button>
          <p className="font-heading font-bold text-white uppercase tracking-wide" style={{ fontSize:16 }}>
            Notifications
          </p>
        </div>
      </div>

      <div style={{ height:'calc(var(--sat,0px) + 80px)' }} />

      {/* ══ SCROLLABLE CONTENT ══ */}
      <motion.div variants={stagger.container} initial="initial" animate="animate"
        className="px-4 flex flex-col gap-4 pb-24">
        
        {mockNotifications.map((notif) => (
          <motion.div key={notif.id} variants={stagger.item}
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{ 
              background: notif.unread ? '#20201F' : '#131313', 
              border: notif.unread ? '1px solid rgba(156,255,147,0.3)' : '1px solid #1E1E1E' 
            }}>
            
            {/* Unread indicator */}
            {notif.unread && (
               <div className="absolute top-5 right-5 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(156,255,147,0.8)]" style={{ background: '#9CFF93' }} />
            )}

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-none"
                   style={{ background: getIconBg(notif.type) }}>
                {getIcon(notif.type)}
              </div>
              <div className="flex flex-col gap-1 pr-6">
                <p className="font-heading font-bold text-white leading-snug" style={{ fontSize: 16 }}>
                  {notif.title}
                </p>
                <p className="font-ui text-[13px] leading-relaxed mt-1" style={{ color: notif.unread ? '#D1D1D1' : '#9E9E9E' }}>
                  {notif.body}
                </p>
                <p className="font-ui font-medium text-[11px] mt-2" style={{ color: '#666666' }}>
                  {notif.time}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {mockNotifications.length === 0 && (
          <motion.div variants={stagger.item} className="flex flex-col items-center justify-center py-20 opacity-60">
            <LuBellRing size={48} color="#555" strokeWidth={1} className="mb-4" />
            <p className="font-heading font-bold text-white text-lg">All caught up!</p>
            <p className="font-ui text-[14px] color-[#ADAAAA]">You have no new notifications.</p>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
