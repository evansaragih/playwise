export const mockUser = {
  name: 'Alex',
  handle: '@alexj',
  avatar: '/avatar.png',
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



export const mockVenues = [
  // Jakarta Pusat
  { id:'1',  name:'SportHub Arena',       location:'Central Jakarta',  area:'Jakarta Pusat',   distance:'1.2km', rating:4.9, hours:'08:00 - 23:00', price:'Rp 400,000', sports:['padel','tennis'],     courts:4, lat:-6.1754, lng:106.8272, image:'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop',  policy:'Bookings for Court 1 include complimentary water and ball rental. Please arrive 10 minutes before your slot.' },
  { id:'2',  name:'Metro Sports Center',  location:'South Jakarta',    area:'Jakarta Selatan', distance:'2.8km', rating:4.9, hours:'08:00 - 23:00', price:'Rp 340,000', sports:['futsal','badminton'],  courts:3, lat:-6.2615, lng:106.8106, image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=720&q=85&fit=crop',  policy:'Court shoes required. Lockers available at Rp 10,000/session.' },
  { id:'3',  name:'The Padel Club',       location:'Kuningan',         area:'Jakarta Selatan', distance:'0.8km', rating:4.9, hours:'08:00 - 23:00', price:'Rp 250,000', sports:['padel'],               courts:4, lat:-6.2297, lng:106.8310, image:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=720&q=85&fit=crop',  policy:'Padel rackets available for rent at Rp 30,000/session.' },
  { id:'4',  name:'Elite Tennis Court',   location:'Menteng',          area:'Jakarta Pusat',   distance:'3.1km', rating:4.7, hours:'07:00 - 22:00', price:'Rp 180,000', sports:['tennis'],              courts:2, lat:-6.1964, lng:106.8317, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=720&q=85&fit=crop',  policy:'Tennis balls provided. Professional coaching available on request.' },
  // Jakarta Utara
  { id:'5',  name:'Ancol Sports Park',    location:'Ancol, North Jakarta', area:'Jakarta Utara',   distance:'5.2km', rating:4.6, hours:'07:00 - 22:00', price:'Rp 200,000', sports:['tennis','futsal'],  courts:3, lat:-6.1276, lng:106.8345, image:'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=720&q=85&fit=crop',  policy:'Seaside venue. Bring sunscreen for daytime sessions.' },
  { id:'6',  name:'Pluit Sports Center',  location:'Pluit, North Jakarta', area:'Jakarta Utara',   distance:'6.1km', rating:4.5, hours:'08:00 - 21:00', price:'Rp 175,000', sports:['badminton','futsal'], courts:4, lat:-6.1189, lng:106.7978, image:'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop', policy:'Group bookings (6+) receive 15% discount.' },
  { id:'7',  name:'Marina Bay Court',     location:'Penjaringan, North Jakarta', area:'Jakarta Utara', distance:'7.0km', rating:4.7, hours:'06:00 - 22:00', price:'Rp 220,000', sports:['padel','tennis'], courts:2, lat:-6.1358, lng:106.8074, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=720&q=85&fit=crop', policy:'Premium waterfront courts. Valet parking available.' },
  // Jakarta Selatan
  { id:'8',  name:'Senayan Sports Hall',  location:'Senayan, South Jakarta', area:'Jakarta Selatan', distance:'3.5km', rating:4.8, hours:'07:00 - 23:00', price:'Rp 300,000', sports:['badminton','padel'], courts:5, lat:-6.2181, lng:106.8027, image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=720&q=85&fit=crop', policy:'Olympic-grade facilities. Court reservation required 2 hours in advance.' },
  { id:'9',  name:'Kemang Tennis Club',   location:'Kemang, South Jakarta',  area:'Jakarta Selatan', distance:'4.2km', rating:4.6, hours:'08:00 - 21:00', price:'Rp 165,000', sports:['tennis'],           courts:3, lat:-6.2605, lng:106.8131, image:'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=720&q=85&fit=crop', policy:'Members get priority booking. Non-members welcome.' },
  { id:'10', name:'Pondok Indah Arena',   location:'Pondok Indah, South Jakarta', area:'Jakarta Selatan', distance:'6.8km', rating:4.9, hours:'06:00 - 23:00', price:'Rp 450,000', sports:['padel','tennis','futsal'], courts:6, lat:-6.2849, lng:106.7883, image:'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=720&q=85&fit=crop', policy:'Premium club. Towel service and showers included.' },
  // Jakarta Timur
  { id:'11', name:'Cibubur Sports Center',location:'Cibubur, East Jakarta', area:'Jakarta Timur',  distance:'8.5km', rating:4.5, hours:'08:00 - 21:00', price:'Rp 150,000', sports:['futsal','badminton'], courts:4, lat:-6.3607, lng:106.8963, image:'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=720&q=85&fit=crop', policy:'Family-friendly facility. Kids under 12 play free with paying adult.' },
  { id:'12', name:'Pulo Gadung Court',    location:'Pulo Gadung, East Jakarta', area:'Jakarta Timur', distance:'7.2km', rating:4.4, hours:'07:00 - 22:00', price:'Rp 130,000', sports:['badminton','tennis'], courts:3, lat:-6.1883, lng:106.8919, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=720&q=85&fit=crop', policy:'Budget-friendly. Equipment rental available at low cost.' },
  // Jakarta Barat
  { id:'13', name:'Taman Anggrek Sports', location:'Taman Anggrek, West Jakarta', area:'Jakarta Barat', distance:'5.6km', rating:4.7, hours:'08:00 - 22:00', price:'Rp 280,000', sports:['padel','futsal'],   courts:3, lat:-6.1797, lng:106.7901, image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=720&q=85&fit=crop', policy:'Located in a premium mall complex. Parking validated for 3 hours.' },
  { id:'14', name:'Grogol Arena',         location:'Grogol, West Jakarta',      area:'Jakarta Barat', distance:'6.3km', rating:4.5, hours:'07:00 - 21:00', price:'Rp 160,000', sports:['tennis','badminton'], courts:2, lat:-6.1666, lng:106.7936, image:'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=720&q=85&fit=crop', policy:'Public venue. Walk-ins welcome subject to availability.' },
]

export const mockNearbyVenues = mockVenues.slice(0, 4).map(v => ({
  id: v.id,
  name: v.name,
  location: `${v.location} • ${v.distance}`,
  rating: v.rating,
  availableFrom: v.hours.split(' - ')[0],
  priceFrom: v.price,
  image: v.image,
}))


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
  avatar: '/avatar.png',
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

export const mockNotifications = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Confirmed!',
    body: 'Your Padel session at SportHub Arena for tomorrow at 10:00 is confirmed.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Upcoming Game Reminder',
    body: 'Don\'t forget! You have a Tennis match at Metro Sports Center in 3 hours.',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'promo',
    title: 'Weekend Promo 🎾',
    body: 'Get 20% off all indoor futsal and padel bookings this weekend. Use code PLAY20.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'payment',
    title: 'Payment Successful',
    body: 'We have received your payment of Rp 340,000 for your recent Futsal booking.',
    time: '2 days ago',
    unread: false,
  },
]
