// ─────────────────────────────────────────────────────────────────────────────
// mockData.js — All dummy/mock data for the entire frontend
// Replace these values with real API responses when backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

// ── Current queue status ─────────────────────────────────────────────────────
export const MOCK_QUEUE_STATUS = {
  nowServing: 42,
  totalInQueue: 17,
  avgWaitMinutes: 12,
  activeCounters: 3,
  tokensServedToday: 134,
  priorityUsersWaiting: 2,
};

// ── Tokens in queue ──────────────────────────────────────────────────────────
export const MOCK_TOKENS = [
  { id: 'T043', name: 'Ramesh Kumar',    category: 'normal',   position: 1,  waitMin: 3  },
  { id: 'T044', name: 'Sunita Devi',     category: 'senior',   position: 2,  waitMin: 6  },
  { id: 'T045', name: 'Arjun Singh',     category: 'disabled', position: 3,  waitMin: 9  },
  { id: 'T046', name: 'Priya Mohanty',   category: 'pregnant', position: 4,  waitMin: 12 },
  { id: 'T047', name: 'Bikram Sahoo',    category: 'normal',   position: 5,  waitMin: 15 },
  { id: 'T048', name: 'Kavita Sharma',   category: 'normal',   position: 6,  waitMin: 18 },
  { id: 'T049', name: 'Mohan Patra',     category: 'senior',   position: 7,  waitMin: 21 },
  { id: 'T050', name: 'Deepa Nayak',     category: 'normal',   position: 8,  waitMin: 24 },
];

// ── Predicted footfall by hour (for admin chart) ─────────────────────────────
export const MOCK_FOOTFALL = [
  { hour: '9AM',  count: 28  },
  { hour: '10AM', count: 52  },
  { hour: '11AM', count: 78  },
  { hour: '12PM', count: 95  },
  { hour: '1PM',  count: 58  },
  { hour: '2PM',  count: 72  },
  { hour: '3PM',  count: 88  },
  { hour: '4PM',  count: 47  },
  { hour: '5PM',  count: 21  },
];

// ── Average wait time by hour (for admin chart) ───────────────────────────────
export const MOCK_WAIT_TIME = [
  { hour: '9AM',  wait: 5  },
  { hour: '10AM', wait: 10 },
  { hour: '11AM', wait: 18 },
  { hour: '12PM', wait: 24 },
  { hour: '1PM',  wait: 14 },
  { hour: '2PM',  wait: 17 },
  { hour: '3PM',  wait: 22 },
  { hour: '4PM',  wait: 11 },
  { hour: '5PM',  wait: 6  },
];

// ── Landing page stats ────────────────────────────────────────────────────────
export const MOCK_STATS = [
  { label: 'Tokens Served Today', value: '134+' },
  { label: 'Average Wait Time',   value: '12 min' },
  { label: 'Active Counters',     value: '3' },
  { label: 'Priority Users Helped', value: '28' },
];

// ── Mock staff login credentials (frontend check only) ───────────────────────
// Replace with real API auth when backend is ready.
export const MOCK_STAFF = {
  email: 'admin@demo.com',
  password: 'password123',
  name: 'Admin User',
  role: 'admin',
};

// ── Helper: generate a random token number ───────────────────────────────────
export function generateToken() {
  const num = Math.floor(Math.random() * 900) + 100;
  return `T${num}`;
}

// ── Helper: estimate wait time based on category and queue length ─────────────
export function estimateWait(category, queueLength = 17) {
  const base = queueLength * 1.5; // 1.5 min per person in queue
  const priority = { senior: 0.6, disabled: 0.5, pregnant: 0.55, normal: 1 };
  return Math.round(base * (priority[category] || 1));
}

// ── Category display config ───────────────────────────────────────────────────
export const CATEGORY_CONFIG = {
  normal:   { label: 'Normal',               badgeVariant: 'normal',   icon: '👤' },
  senior:   { label: 'Senior Citizen (60+)', badgeVariant: 'senior',   icon: '👴' },
  disabled: { label: 'Person w/ Disability', badgeVariant: 'disabled', icon: '♿' },
  pregnant: { label: 'Pregnant / New Mother', badgeVariant: 'pregnant', icon: '🤰' },
};
