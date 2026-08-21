// ─────────────────────────────────────────────────────────────────────────────
// mockData.js — All dummy/mock data for CityCare Hospital frontend
// Replace these values with real API responses when backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

// ── Current queue / OPD status ────────────────────────────────────────────────
export const MOCK_QUEUE_STATUS = {
  nowServing: 42,
  totalInQueue: 17,
  avgWaitMinutes: 18,
  activeCounters: 4,
  tokensServedToday: 134,      // patients served today
  doctorsOnDuty: 14,
  priorityUsersWaiting: 2,
};

// ── Patient tokens in OPD queue ───────────────────────────────────────────────
export const MOCK_TOKENS = [
  { id: 'OPD-043', name: 'Ramesh Kumar',    category: 'normal',   position: 1,  waitMin: 3  },
  { id: 'OPD-044', name: 'Sunita Devi',     category: 'senior',   position: 2,  waitMin: 6  },
  { id: 'OPD-045', name: 'Arjun Singh',     category: 'disabled', position: 3,  waitMin: 9  },
  { id: 'OPD-046', name: 'Priya Mohanty',   category: 'pregnant', position: 4,  waitMin: 12 },
  { id: 'OPD-047', name: 'Bikram Sahoo',    category: 'normal',   position: 5,  waitMin: 15 },
  { id: 'OPD-048', name: 'Kavita Sharma',   category: 'normal',   position: 6,  waitMin: 18 },
  { id: 'OPD-049', name: 'Mohan Patra',     category: 'senior',   position: 7,  waitMin: 21 },
  { id: 'OPD-050', name: 'Deepa Nayak',     category: 'normal',   position: 8,  waitMin: 24 },
];

// ── Predicted patient footfall by hour (for admin chart) ─────────────────────
export const MOCK_FOOTFALL = [
  { hour: '8AM',  count: 18  },
  { hour: '9AM',  count: 45  },
  { hour: '10AM', count: 78  },
  { hour: '11AM', count: 95  },
  { hour: '12PM', count: 62  },
  { hour: '1PM',  count: 38  },
  { hour: '2PM',  count: 55  },
  { hour: '3PM',  count: 72  },
  { hour: '4PM',  count: 41  },
  { hour: '5PM',  count: 20  },
];

// ── Average consultation wait time by hour (for admin chart) ─────────────────
export const MOCK_WAIT_TIME = [
  { hour: '8AM',  wait: 5  },
  { hour: '9AM',  wait: 10 },
  { hour: '10AM', wait: 18 },
  { hour: '11AM', wait: 24 },
  { hour: '12PM', wait: 16 },
  { hour: '1PM',  wait: 12 },
  { hour: '2PM',  wait: 19 },
  { hour: '3PM',  wait: 22 },
  { hour: '4PM',  wait: 13 },
  { hour: '5PM',  wait: 7  },
];

// ── Patient portal stats (displayed on landing page) ─────────────────────────
export const MOCK_STATS = [
  { label: 'Patients Served Today', value: '134+' },
  { label: 'Average Wait Time',     value: '18 min' },
  { label: 'Departments Open',      value: '4' },
  { label: 'Doctors On Duty',       value: '14' },
];

// ── Mock staff login credentials (frontend check only) ───────────────────────
// Replace with real API auth when backend is ready.
export const MOCK_STAFF = {
  email: 'admin@citycare.in',
  password: 'password123',
  name: 'Admin User',
  role: 'admin',
};

// ── Helper: generate a random OPD token number ───────────────────────────────
export function generateToken(prefix = 'OPD') {
  const num = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${num}`;
}

// ── Helper: estimate wait time based on category and queue length ─────────────
export function estimateWait(category, queueLength = 17) {
  const base = queueLength * 2; // ~2 min per patient (consultation)
  const priority = { senior: 0.6, disabled: 0.5, pregnant: 0.55, normal: 1 };
  return Math.round(base * (priority[category] || 1));
}

// ── Patient priority category display config ──────────────────────────────────
export const CATEGORY_CONFIG = {
  normal:   { label: 'General Patient',          badgeVariant: 'normal',   icon: '👤' },
  senior:   { label: 'Senior Citizen (60+)',      badgeVariant: 'senior',   icon: '👴' },
  disabled: { label: 'Person with Disability',   badgeVariant: 'disabled', icon: '♿' },
  pregnant: { label: 'Pregnant / New Mother',     badgeVariant: 'pregnant', icon: '🤰' },
};

// ── Hospital department / OPD counter config ──────────────────────────────────
export const DEPARTMENT_CONFIG = [
  {
    id: 'registration',
    code: 'REG',
    name: 'Registration & Inquiries',
    icon: '📋',
    description: 'Patient check-in, registration, UHID creation, and general queries',
    counter: 'Counter 01 — Registration',
  },
  {
    id: 'opd',
    code: 'OPD',
    name: 'General OPD',
    icon: '🏥',
    description: 'General physician consultations, triage, internal medicine, and basic checkups',
    counter: 'Counter 02 — General OPD',
  },
  {
    id: 'cardiology',
    code: 'CARD',
    name: 'Cardiology',
    icon: '🫀',
    description: 'Heart specialists, ECG reviews, echo consults, and hypertension clinic',
    counter: 'Room 104 — Cardiology OPD',
  },
  {
    id: 'orthopedics',
    code: 'ORTHO',
    name: 'Orthopedics',
    icon: '🦴',
    description: 'Bone & joint care, trauma review, fracture management, and joint pain clinic',
    counter: 'Room 106 — Ortho OPD',
  },
  {
    id: 'pediatrics',
    code: 'PED',
    name: 'Pediatrics',
    icon: '👶',
    description: 'Child healthcare, newborn examinations, immunizations, and pediatric care',
    counter: 'Room 108 — Pediatrics OPD',
  },
  {
    id: 'pharmacy',
    code: 'PH',
    name: 'Pharmacy & Medicines',
    icon: '💊',
    description: 'Prescription dispensing, medication collection, and pharmacy refills',
    counter: 'Counter 06 — Pharmacy',
  },
];

// ── Per-department wait estimates & doctor availability ────────────────────────
// Used by: TokenPage dept cards, QueueDisplayPage counter cards
// Represents backend feature: wait time prediction + doctor/counter status
export const DEPT_WAIT_ESTIMATES = {
  registration: { waitMin: 4,  doctorsAvailable: 2, totalDoctors: 2,  doctorName: 'Clerk S. Mohapatra',      specialty: 'Desk Registration' },
  opd:          { waitMin: 15, doctorsAvailable: 4, totalDoctors: 5,  doctorName: 'Dr. A. K. Patnaik',       specialty: 'General Medicine' },
  cardiology:   { waitMin: 22, doctorsAvailable: 2, totalDoctors: 2,  doctorName: 'Dr. S. R. Mishra',        specialty: 'Cardiology (DM)' },
  orthopedics:  { waitMin: 18, doctorsAvailable: 3, totalDoctors: 3,  doctorName: 'Dr. B. K. Das',           specialty: 'Orthopedic Surgeon' },
  pediatrics:   { waitMin: 12, doctorsAvailable: 2, totalDoctors: 3,  doctorName: 'Dr. M. Sahu',             specialty: 'Child Health Specialist' },
  pharmacy:     { waitMin: 6,  doctorsAvailable: 3, totalDoctors: 4,  doctorName: 'Sr. Pharmacist A. Jena', specialty: 'Prescription Dispensing' },
  // Backward compatibility fallbacks
  lab:          { waitMin: 10, doctorsAvailable: 2, totalDoctors: 2,  doctorName: 'Sr. R. Tripathy',         specialty: 'Pathology & Radiology' },
  emergency:    { waitMin: 2,  doctorsAvailable: 2, totalDoctors: 2,  doctorName: 'Dr. P. Behera',           specialty: 'Emergency Medicine' },
};

// ── Yesterday's baseline stats for Admin KPI trend arrows ────────────────────
// Used by: AdminDashboardPage KPI cards (↑↓ % change)
export const MOCK_YESTERDAY_STATS = {
  tokensServedYesterday:    118,
  avgWaitYesterday:          22,
  activeCountersYesterday:    3,
  doctorsYesterday:          12,
};

// ── Pre-appointment time slots (for scheduled visit booking) ─────────────────
// Used by: TokenPage "Schedule Visit" tab
// Represents backend feature: pre-appointment / scheduled booking
export const MOCK_TIME_SLOTS = [
  { id: 's1', time: '09:00 AM', available: true  },
  { id: 's2', time: '09:30 AM', available: true  },
  { id: 's3', time: '10:00 AM', available: false },
  { id: 's4', time: '10:30 AM', available: true  },
  { id: 's5', time: '11:00 AM', available: true  },
  { id: 's6', time: '11:30 AM', available: false },
  { id: 's7', time: '02:00 PM', available: true  },
  { id: 's8', time: '02:30 PM', available: true  },
  { id: 's9', time: '03:00 PM', available: false },
  { id: 's10', time: '03:30 PM', available: true },
];

