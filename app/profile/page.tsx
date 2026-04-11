'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight, Settings, Bell, CreditCard, HelpCircle,
  LogOut, Shield, Star, Trophy, Users, Zap,
} from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import { ProfileSkeleton } from '@/components/ui/Skeleton'
import { mockProfile } from '@/lib/mock-data'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
}

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: Settings,     label: 'Account Settings',  sublabel: 'Edit profile & preferences', color: '#9CFF93' },
      { icon: Bell,         label: 'Notifications',     sublabel: '3 unread alerts',            color: '#FFB800', badge: '3' },
      { icon: CreditCard,   label: 'Payment Methods',   sublabel: 'Manage cards & wallets',     color: '#0EEAFD' },
      { icon: Shield,       label: 'Privacy & Security',sublabel: 'Data and permissions',       color: '#9E9E9E' },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', sublabel: 'FAQs and contact us', color: '#9E9E9E' },
    ]
  }
]

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => { setTimeout(() => setLoading(false), 1000) }, [])
  useEffect(() => {
    if (!loading) setTimeout(() => setStatsVisible(true), 400)
  }, [loading])

  if (loading) return <div className="min-h-screen pb-20"><ProfileSkeleton /></div>

  return (
    <PageWrapper>
      <motion.div variants={stagger.container} initial="initial" animate="animate">

        {/* ── HERO ── */}
        <motion.div variants={stagger.item}
          className="relative px-4 pt-8 pb-6 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(180deg, #0A1F0A 0%, #020202 100%)' }}>

          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-3 relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, #006413, #00FF41)', color: '#020202' }}>
              {mockProfile.avatar ? (
                 <img src={mockProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                 mockProfile.name[0]
              )}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black z-10"
                 style={{ background: '#FFB800', color: '#715200', border: '2px solid #020202' }}>
              {mockProfile.level}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-black text-white tracking-tight font-heading">
            {mockProfile.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="text-xs text-neutral mt-0.5 mb-3">
            {mockProfile.handle} · Member since {mockProfile.memberSince}
          </motion.p>

          {/* Level pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: '#1A3A1A', color: '#00FF41', border: '1px solid #006413' }}>
            <Star size={11} fill="#00FF41" color="#00FF41" />
            Level {mockProfile.level} Player
          </motion.div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Games',        value: mockProfile.totalGames,   icon: Trophy, color: '#00FF41' },
              { label: 'Friends',      value: mockProfile.totalFriends, icon: Users,  color: '#0EEAFD' },
              { label: 'Total Spent',  value: mockProfile.totalSpent,   icon: Zap,    color: '#FFB800' },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1 text-center"
                style={{ background: '#20201F' }}>
                <stat.icon size={16} color={stat.color} />
                <p className="text-sm font-black text-white leading-tight font-heading">{stat.value}</p>
                <p className="text-[10px] text-neutral">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FAVOURITE SPORTS ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#20201F' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral mb-3">Favourite Sports</p>
          <div className="flex gap-2 flex-wrap">
            {mockProfile.favoriteSports.map(s => (
              <span key={s} className="px-4 py-2 rounded-full text-xs font-bold"
                    style={{ background: '#1A3A1A', color: '#00FF41', border: '1px solid #006413' }}>
                {s}
              </span>
            ))}
          </div>
          {/* Win rate bar */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #2A2A2A' }}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-neutral uppercase tracking-wider font-semibold">Win Rate</span>
              <span className="text-xs font-black" style={{ color: '#00FF41' }}>{mockProfile.stats.winRate}%</span>
            </div>
            <div className="h-2 rounded-full w-full" style={{ background: '#2A2A2A' }}>
              <motion.div className="h-2 rounded-full"
                style={{ background: 'linear-gradient(90deg, #006413, #00FF41)' }}
                initial={{ width: 0 }}
                animate={{ width: statsVisible ? `${mockProfile.stats.winRate}%` : 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── ACHIEVEMENTS ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#20201F' }}>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral">Achievements</p>
            <span className="text-[10px] text-neutral">
              {mockProfile.achievements.filter(a => a.unlocked).length}/{mockProfile.achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockProfile.achievements.map((a, i) => (
              <motion.div key={a.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 + 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl"
                style={{ background: a.unlocked ? '#1A3A1A' : '#1A1A1A',
                         border: `1px solid ${a.unlocked ? '#006413' : '#2A2A2A'}` }}>
                <span className={`text-xl ${a.unlocked ? '' : 'grayscale opacity-40'}`}>{a.icon}</span>
                <span className="text-[9px] font-semibold text-center leading-tight"
                      style={{ color: a.unlocked ? '#9CFF93' : '#555' }}>
                  {a.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RECENT ACTIVITY ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-4 rounded-2xl p-4"
          style={{ background: '#20201F' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral mb-3">Recent Activity</p>
          <div className="space-y-0">
            {mockProfile.recentActivity.map((a, i) => (
              <div key={a.id}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: i < mockProfile.recentActivity.length - 1 ? '1px solid #2A2A2A' : 'none' }}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-none"
                     style={{ background: '#00FF41' }} />
                <div className="flex-1">
                  <p className="text-xs text-white leading-relaxed">{a.text}</p>
                  <p className="text-[10px] text-neutral mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── MENU SECTIONS ── */}
        {menuSections.map((section) => (
          <motion.div key={section.title} variants={stagger.item} className="mx-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral mb-2 px-1">
              {section.title}
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#20201F' }}>
              {section.items.map((item, i) => (
                <motion.button key={item.label} whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 tap-highlight text-left transition-colors"
                  style={{ borderBottom: i < section.items.length - 1 ? '1px solid #2A2A2A' : 'none' }}>
                  {/* Icon circle */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-none"
                       style={{ background: item.color + '18' }}>
                    <item.icon size={17} color={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-neutral mt-0.5">{item.sublabel}</p>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mr-1"
                          style={{ background: '#FFB800', color: '#715200' }}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={16} color="#555" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ── LOG OUT ── */}
        <motion.div variants={stagger.item} className="mx-4 mb-8">
          <motion.button whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tap-highlight"
            style={{ background: '#1A0A0A', border: '1px solid #3A1A1A', color: '#FF4444' }}>
            <LogOut size={16} color="#FF4444" />
            Log Out
          </motion.button>
        </motion.div>

      </motion.div>
    </PageWrapper>
  )
}
