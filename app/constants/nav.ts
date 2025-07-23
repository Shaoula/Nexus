export const NAV_ITEMS = [
  {
    label: 'Ana Sayfa',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: 'Randevular',
    icon: 'i-lucide-calendar',
    to: '/bookings',
  },
  {
    label: 'Müşteriler',
    icon: 'i-lucide-users',
    to: '/clients',
  },
  {
    label: 'Müşteri Notları',
    icon: 'i-lucide-notepad-text',
    to: '/notes',
  },
  {
    label: 'Finans',
    icon: 'i-lucide-dollar-sign',
    to: '/finance/transactions',
    // children: [
    //   {
    //     label: 'Faturalar',
    //     icon: 'i-lucide-file-text',
    //     to: '/finance/invoices',
    //   },
    //   {
    //     label: 'Gelirler & Giderler',
    //     icon: 'i-lucide-credit-card',
    //     to: '/finance/transactions',
    //   },
    // ],
  },
  {
    label: 'Raporlar',
    icon: 'i-lucide-chart-bar',
    to: '/reports',
    superAdminOnly: true,
  },
  {
    label: 'Hizmetler',
    icon: 'i-lucide-asterisk',
    to: '/services',
  },
]

export const ADMIN_NAV_ITEMS = [
  {
    label: 'nav.home',
    icon: 'i-lucide-home',
    to: '/admin',
  },
  {
    label: 'nav.orgs',
    icon: 'i-lucide-building-2',
    to: '/admin/orgs',
  },
  {
    label: 'nav.users',
    icon: 'i-lucide-users',
    to: '/admin/users',
  },
  {
    label: 'nav.clients',
    icon: 'i-lucide-users',
    to: '/admin/clients',
  },
  {
    label: 'nav.appointments',
    icon: 'i-lucide-calendar',
    to: '/admin/appointments',
  },
  {
    label: 'nav.notes',
    icon: 'i-lucide-file-text',
    to: '/admin/notes',
  },
  // {
  //     label: 'Ayarlar',
  //     icon: 'i-lucide-settings',
  //     to: '/admin/settings'
  // }
]
