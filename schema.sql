
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  businessName TEXT,
  address TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL UNIQUE,
  defaultInterestRate REAL DEFAULT 3,
  defaultInterestType TEXT DEFAULT 'MONTHLY_FLAT',
  currency TEXT DEFAULT 'INR',
  reminderDaysBefore INTEGER DEFAULT 3,
  autoBackup BOOLEAN DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Borrowers
CREATE TABLE IF NOT EXISTS borrowers (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternatePhone TEXT,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  aadhaarNumber TEXT,
  panNumber TEXT,
  otherIdType TEXT,
  otherIdNumber TEXT,
  photoUrl TEXT,
  guarantorName TEXT,
  guarantorPhone TEXT,
  guarantorAddress TEXT,
  guarantorRelation TEXT,
  status TEXT DEFAULT 'ACTIVE',
  riskScore INTEGER,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Loans
CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  loanNumber TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  borrowerId TEXT NOT NULL,
  principalAmount REAL NOT NULL,
  interestRate REAL NOT NULL,
  interestType TEXT NOT NULL,
  duration INTEGER NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  monthlyInterest REAL NOT NULL,
  totalInterest REAL NOT NULL,
  totalReceivable REAL NOT NULL,
  emiAmount REAL,
  principalPaid REAL DEFAULT 0,
  interestPaid REAL DEFAULT 0,
  totalPaid REAL DEFAULT 0,
  principalPending REAL NOT NULL,
  interestPending REAL NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  missedPayments INTEGER DEFAULT 0,
  delayDays INTEGER DEFAULT 0,
  purpose TEXT,
  notes TEXT,
  agreementUrl TEXT,
  consentGiven BOOLEAN DEFAULT 0,
  consentTimestamp DATETIME,
  closedAt DATETIME,
  closureType TEXT,
  closureNotes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (borrowerId) REFERENCES borrowers(id) ON DELETE CASCADE
);

-- Payment Schedule
CREATE TABLE IF NOT EXISTS payment_schedules (
  id TEXT PRIMARY KEY,
  loanId TEXT NOT NULL,
  installmentNo INTEGER NOT NULL,
  dueDate DATETIME NOT NULL,
  emiAmount REAL NOT NULL,
  principalPortion REAL NOT NULL,
  interestPortion REAL NOT NULL,
  balanceAfter REAL NOT NULL,
  status TEXT DEFAULT 'UPCOMING',
  paidAmount REAL,
  paidDate DATETIME,
  delayDays INTEGER,
  FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  receiptNumber TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  loanId TEXT NOT NULL,
  paymentDate DATETIME NOT NULL,
  amount REAL NOT NULL,
  paymentMode TEXT NOT NULL,
  transactionRef TEXT,
  principalPortion REAL NOT NULL,
  interestPortion REAL NOT NULL,
  penaltyPortion REAL DEFAULT 0,
  status TEXT DEFAULT 'CONFIRMED',
  receiptUrl TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
);

-- Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  loanId TEXT NOT NULL,
  reminderType TEXT NOT NULL,
  scheduledFor DATETIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  sentAt DATETIME,
  sentVia TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  action TEXT NOT NULL,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  oldData TEXT, -- JSON string
  newData TEXT, -- JSON string
  ipAddress TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
