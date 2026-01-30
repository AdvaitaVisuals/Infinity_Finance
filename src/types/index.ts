export type BorrowerStatus = 'ACTIVE' | 'DELAY' | 'DEFAULT_RISK' | 'BLACKLISTED' | 'INACTIVE';
export type InterestType = 'MONTHLY_FLAT' | 'MONTHLY_REDUCING' | 'YEARLY_FLAT' | 'DAILY';
export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'CLOSED' | 'SETTLED' | 'WRITTEN_OFF' | 'LEGAL';
export type ClosureType = 'FULL_PAYMENT' | 'EARLY_CLOSURE' | 'SETTLEMENT' | 'WRITE_OFF' | 'LEGAL_RECOVERY';
export type ScheduleStatus = 'UPCOMING' | 'DUE' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'WAIVED';
export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'NEFT_RTGS' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'BOUNCED' | 'REVERSED';
export type ReminderType = 'PAYMENT_DUE' | 'PAYMENT_TODAY' | 'PAYMENT_OVERDUE' | 'CUSTOM';
export type ReminderStatus = 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

// Models matching the previous schema but for JSON DB
export interface User {
    id: string;
    name: string;
    email?: string;
    phone: string;
    pin: string;
    businessName?: string;
    address?: string;
    createdAt: string; // ISO Date
    updatedAt: string;

    // Relations are handled by ID lookups in LowDB
}

export interface UserSettings {
    id: string;
    userId: string;
    defaultInterestRate: number;
    defaultInterestType: InterestType;
    currency: string;
    reminderDaysBefore: number;
    autoBackup: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Borrower {
    id: string;
    userId: string;
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    otherIdType?: string;
    otherIdNumber?: string;
    photoUrl?: string;
    guarantorName?: string;
    guarantorPhone?: string;
    guarantorAddress?: string;
    guarantorRelation?: string;
    status: BorrowerStatus;
    riskScore?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Loan {
    id: string;
    loanNumber: string;
    userId: string;
    borrowerId: string;
    principalAmount: number;
    interestRate: number;
    interestType: InterestType;
    duration: number;
    startDate: string;
    endDate: string;
    monthlyInterest: number;
    totalInterest: number;
    totalReceivable: number;
    emiAmount?: number;
    principalPaid: number;
    interestPaid: number;
    totalPaid: number;
    principalPending: number;
    interestPending: number;
    status: LoanStatus;
    missedPayments: number;
    delayDays: number;
    purpose?: string;
    notes?: string;
    agreementUrl?: string;
    consentGiven: boolean;
    consentTimestamp?: string;
    closedAt?: string;
    closureType?: ClosureType;
    closureNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentSchedule {
    id: string;
    loanId: string;
    installmentNo: number;
    dueDate: string;
    emiAmount: number;
    principalPortion: number;
    interestPortion: number;
    balanceAfter: number;
    status: ScheduleStatus;
    paidAmount?: number;
    paidDate?: string;
    delayDays?: number;
}

export interface Payment {
    id: string;
    receiptNumber: string;
    userId: string;
    loanId: string;
    paymentDate: string;
    amount: number;
    paymentMode: PaymentMode;
    transactionRef?: string;
    principalPortion: number;
    interestPortion: number;
    penaltyPortion: number;
    status: PaymentStatus;
    receiptUrl?: string;
    notes?: string;
    createdAt: string;
}

export interface Reminder {
    id: string;
    loanId: string;
    reminderType: ReminderType;
    scheduledFor: string;
    message?: string;
    status: ReminderStatus;
    sentAt?: string;
    sentVia?: string;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    oldData?: any;
    newData?: any;
    ipAddress?: string;
    createdAt: string;
}

// Database Schema
export interface Database {
    users: User[];
    settings: UserSettings[];
    borrowers: Borrower[];
    loans: Loan[];
    paymentSchedules: PaymentSchedule[];
    payments: Payment[];
    reminders: Reminder[];
    auditLogs: AuditLog[];
}
