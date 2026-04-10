export const mockUser = {
  name: 'Alex',
  handle: '@alexj',
  avatar: null,
  level: 5,
  activityStreak: 12,
  // 5 active segments matching Figma progress bar
  activityDays: [true, true, true, true, true, false, false],
}

export const mockPendingPayments = [
  {
    id: '1',
    status: 'PENDING',
    sport: 'Padel',
    court: 'Court 1 - Padel',
    venue: 'SportHub Arena',
    schedule: '10:00 - 12:00',
    amount: 'Rp 800,000',
  },
]

export const mockMonthlySpend = {
  amount: 'Rp 4,482,500',
  // Exact text from Figma
  trend: '+Rp 537,900 from last month',
  chart: [
    { month: 'Jan', value: 2800000 },
    { month: 'Feb', value: 3200000 },
    { month: 'Mar', value: 2600000 },
    { month: 'Apr', value: 3800000 },
    { month: 'May', value: 4482500 },
  ],
}

export const mockUpcomingGames = [
  {
    id: '1',
    status: 'UPCOMING',
    title: 'Padel Championship\nQuarter Finals',
    venue: 'Central Arena',
    date: '16 Oct, 18:00 • Central Arena',
    image: 'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop',
  },
]

export const mockNearbyVenues = [
  {
    id: '1',
    name: 'Urban Padel Club',
    location: 'Chamberí, Madrid • 1.2km',
    rating: 4.9,
    availableFrom: '17:00',
    priceFrom: 'Rp 400,000',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=85&fit=crop',
  },
  {
    id: '2',
    name: 'Urban Padel Club',
    location: 'Chamberí, Madrid • 1.2km',
    rating: 4.9,
    availableFrom: '17:00',
    priceFrom: 'Rp 400,000',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=85&fit=crop',
  },
  {
    id: '3',
    name: 'SportHub Arena',
    location: 'Central Jakarta • 1.2km',
    rating: 4.9,
    availableFrom: '08:00',
    priceFrom: 'Rp 400,000',
    image: 'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop',
  },
]

export const mockVenues = [
  {
    id: '1',
    name: 'SportHub Arena',
    location: 'Central Jakarta',
    distance: '1.2km',
    rating: 4.9,
    hours: '08:00 - 23:00',
    priceFrom: 'Rp 400,000',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=85&fit=crop',
    sports: ['padel', 'tennis'],
  },
  {
    id: '2',
    name: 'Metro Sports Center',
    location: 'South Jakarta',
    distance: '2.8km',
    rating: 4.9,
    hours: '08:00 - 23:00',
    priceFrom: 'Rp 340,000',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&q=85&fit=crop',
    sports: ['futsal', 'badminton'],
  },
  {
    id: '3',
    name: 'The Padel Club',
    location: 'Kuningan',
    distance: '0.8km',
    rating: 4.9,
    hours: '08:00 - 23:00',
    priceFrom: 'Rp 250,000',
    image: 'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop',
    sports: ['padel'],
  },
  {
    id: '4',
    name: 'Elite Tennis Court',
    location: 'Menteng',
    distance: '3.1km',
    rating: 4.7,
    hours: '07:00 - 22:00',
    priceFrom: 'Rp 180,000',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=85&fit=crop',
    sports: ['tennis'],
  },
]

export const mockGames = {
  upcoming: [
    {
      id: '1',
      status: 'PENDING',
      statusColor: '#FFB800',
      sport: 'Padel',
      court: 'Court 1 - Padel',
      venue: 'SportHub Arena',
      schedule: '10:00 - 12:00',
      date: 'Today',
      hasQR: true,
      action: 'PAY NOW',
    },
    {
      id: '2',
      status: 'CONFIRMED',
      statusColor: '#00FF41',
      sport: 'Padel',
      court: 'Court 1 - Padel',
      venue: 'SportHub Arena',
      schedule: '10:00 - 12:00',
      date: 'Today',
      dateLabel: 'Oct 14',
      hasQR: true,
      action: 'VIEW PASS',
    },
    {
      id: '3',
      status: 'CONFIRMED',
      statusColor: '#00FF41',
      sport: 'Padel',
      court: 'Court 4 - Padel',
      venue: 'SportHub Arena',
      schedule: '16:30 - 18:00',
      date: 'Today',
      hasQR: true,
      action: 'VIEW PASS',
    },
    {
      id: '4',
      status: 'PAID',
      statusColor: '#9CFF93',
      sport: 'Padel',
      court: 'Court 4 - Padel',
      venue: 'Metro Sports Center',
      schedule: '16:30 - 18:00',
      date: 'Tomorrow',
      dateLabel: 'Oct 15',
      hasQR: false,
      action: 'DETAILS',
    },
  ],
  past: [
    {
      id: '5',
      status: 'COMPLETED',
      statusColor: '#9E9E9E',
      sport: 'Futsal',
      court: 'Court 2 - Futsal',
      venue: 'Metro Sports Center',
      schedule: '14:00 - 16:00',
      date: 'Oct 10',
      hasQR: false,
      action: 'DETAILS',
    },
    {
      id: '6',
      status: 'COMPLETED',
      statusColor: '#9E9E9E',
      sport: 'Tennis',
      court: 'Court 1 - Tennis',
      venue: 'Elite Tennis Court',
      schedule: '09:00 - 11:00',
      date: 'Oct 7',
      hasQR: false,
      action: 'DETAILS',
    },
  ],
}

export const mockInsights = {
  monthlySpend: 'Rp 4,482,500',
  vsLastMonth: '+12% vs Last Month',
  chart: [
    { month: 'Jan', value: 2.8 },
    { month: 'Feb', value: 3.2 },
    { month: 'Mar', value: 2.6 },
    { month: 'Apr', value: 3.8 },
    { month: 'May', value: 4.48 },
  ],
  bestValue: {
    title: 'Best Value for your habits',
    venue: 'Smash Hub Kuningan',
    desc: 'Based on your Tuesday night patterns, this venue offers the best loyalty rate today.',
    price: 'Rp 120.000',
    badge: '32% Below Market',
  },
  sportBreakdown: [
    { sport: 'Padel',  amount: 'Rp 2,913,625', pct: 65 },
    { sport: 'Tennis', amount: 'Rp 1,568,875', pct: 35 },
  ],
  avgCost: { value: 'Rp 222,440', label: '-4% efficiency' },
  peakHour: { value: '-12%', label: '-4% efficiency' },
  venuePrices: [
    { name: 'Padel City',    type: 'Member Price',  price: 'Rp 280,000', badge: 'Lowest',  badgeColor: '#00FF41' },
    { name: 'The Smash Club', type: 'Public Rate',   price: 'Rp 350,000', badge: '-25%',    badgeColor: '#FF4444' },
    { name: 'Vista Padel',   type: 'Public Rate',   price: 'Rp 420,000', badge: 'Peak Hours', badgeColor: '#FFB800' },
  ],
}

export const mockProfile = {
  name: 'Alex Johnson',
  handle: '@alexj',
  level: 5,
  totalGames: 36,
  totalFriends: 24,
  totalSpent: 'Rp 28,450,000',
  memberSince: 'March 2023',
  favoriteSports: ['Padel', 'Tennis', 'Futsal'],
  achievements: [
    { id: '1', title: 'First Game',      icon: '🏅', unlocked: true },
    { id: '2', title: 'Regular Player',  icon: '🔥', unlocked: true },
    { id: '3', title: 'Social Butterfly',icon: '🦋', unlocked: false },
    { id: '4', title: 'Multi-Sport',     icon: '⚡', unlocked: false },
  ],
  recentActivity: [
    { id: '1', text: 'Booked Court 1 - Padel at SportHub Arena', time: '2 hours ago' },
    { id: '2', text: 'Completed game at Metro Sports Center',    time: 'Yesterday' },
    { id: '3', text: 'Paid for futsal session',                 time: '3 days ago' },
  ],
  stats: {
    winRate: 68,
    avgSessionHrs: 1.5,
    favoriteTime: '18:00 - 20:00',
  },
}
