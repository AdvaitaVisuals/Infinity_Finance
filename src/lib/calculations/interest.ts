
import { InterestType } from '@/types'

export interface LoanCalculation {
    principalAmount: number
    interestRate: number       // Monthly percentage
    interestType: InterestType
    duration: number           // In months
}

export interface CalculationResult {
    monthlyInterest: number
    totalInterest: number
    totalReceivable: number
    emiAmount: number
    schedule: ScheduleEntry[]
}

export interface ScheduleEntry {
    installmentNo: number
    dueDate: Date
    emiAmount: number
    principalPortion: number
    interestPortion: number
    balanceAfter: number
}

/**
 * Calculate loan details based on interest type
 * 
 * Interest Types:
 * 1. MONTHLY_FLAT: Simple interest - Principal × Rate × Months
 * 2. MONTHLY_REDUCING: Compound/Reducing balance
 * 3. YEARLY_FLAT: Annual simple interest
 * 4. DAILY: Per-day interest calculation
 */
export function calculateLoan(input: LoanCalculation): CalculationResult {
    const { principalAmount, interestRate, interestType, duration } = input

    switch (interestType) {
        case 'MONTHLY_FLAT':
            return calculateMonthlyFlat(principalAmount, interestRate, duration)
        case 'MONTHLY_REDUCING':
            return calculateReducingBalance(principalAmount, interestRate, duration)
        case 'YEARLY_FLAT':
            return calculateYearlyFlat(principalAmount, interestRate, duration)
        case 'DAILY':
            return calculateDailyInterest(principalAmount, interestRate, duration)
        default:
            return calculateMonthlyFlat(principalAmount, interestRate, duration)
    }
}

/**
 * Monthly Flat Interest (Most common for personal lending)
 * Total Interest = Principal × Monthly Rate × Duration
 * Example: ₹50,000 @ 3% for 6 months = ₹50,000 × 0.03 × 6 = ₹9,000
 */
function calculateMonthlyFlat(
    principal: number,
    monthlyRate: number,
    months: number
): CalculationResult {
    const monthlyInterest = principal * (monthlyRate / 100)
    const totalInterest = monthlyInterest * months
    const totalReceivable = principal + totalInterest
    const emiAmount = totalReceivable / months

    // Generate schedule
    const schedule: ScheduleEntry[] = []
    let balance = principal
    const principalPerMonth = principal / months

    for (let i = 1; i <= months; i++) {
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + i)

        schedule.push({
            installmentNo: i,
            dueDate,
            emiAmount: Math.round(emiAmount),
            principalPortion: Math.round(principalPerMonth),
            interestPortion: Math.round(monthlyInterest),
            balanceAfter: Math.round(balance - principalPerMonth)
        })

        balance -= principalPerMonth
    }

    return {
        monthlyInterest: Math.round(monthlyInterest),
        totalInterest: Math.round(totalInterest),
        totalReceivable: Math.round(totalReceivable),
        emiAmount: Math.round(emiAmount),
        schedule
    }
}

/**
 * Reducing Balance Method (Bank-style EMI)
 * EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
 * Interest reduces each month as principal is paid
 */
function calculateReducingBalance(
    principal: number,
    monthlyRate: number,
    months: number
): CalculationResult {
    const r = monthlyRate / 100 // Convert to decimal

    // EMI formula
    const emi = principal * r * Math.pow(1 + r, months) /
        (Math.pow(1 + r, months) - 1)

    // Generate schedule
    const schedule: ScheduleEntry[] = []
    let balance = principal
    let totalInterest = 0

    for (let i = 1; i <= months; i++) {
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + i)

        const interestPortion = balance * r
        const principalPortion = emi - interestPortion
        balance = Math.max(0, balance - principalPortion)
        totalInterest += interestPortion

        schedule.push({
            installmentNo: i,
            dueDate,
            emiAmount: Math.round(emi),
            principalPortion: Math.round(principalPortion),
            interestPortion: Math.round(interestPortion),
            balanceAfter: Math.round(balance)
        })
    }

    return {
        monthlyInterest: Math.round(totalInterest / months), // Average
        totalInterest: Math.round(totalInterest),
        totalReceivable: Math.round(principal + totalInterest),
        emiAmount: Math.round(emi),
        schedule
    }
}

/**
 * Yearly Flat Interest
 * Total Interest = Principal × (Annual Rate / 100) × (Months / 12)
 */
function calculateYearlyFlat(
    principal: number,
    annualRate: number,
    months: number
): CalculationResult {
    const years = months / 12
    const totalInterest = principal * (annualRate / 100) * years
    const totalReceivable = principal + totalInterest
    const emiAmount = totalReceivable / months
    const monthlyInterest = totalInterest / months

    // Generate schedule (similar to monthly flat)
    const schedule: ScheduleEntry[] = []
    let balance = principal
    const principalPerMonth = principal / months

    for (let i = 1; i <= months; i++) {
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + i)

        schedule.push({
            installmentNo: i,
            dueDate,
            emiAmount: Math.round(emiAmount),
            principalPortion: Math.round(principalPerMonth),
            interestPortion: Math.round(monthlyInterest),
            balanceAfter: Math.round(balance - principalPerMonth)
        })

        balance -= principalPerMonth
    }

    return {
        monthlyInterest: Math.round(monthlyInterest),
        totalInterest: Math.round(totalInterest),
        totalReceivable: Math.round(totalReceivable),
        emiAmount: Math.round(emiAmount),
        schedule
    }
}

/**
 * Daily Interest (Used for short-term loans)
 * Daily Interest = Principal × (Rate / 100) / 30
 */
function calculateDailyInterest(
    principal: number,
    dailyRate: number,
    months: number
): CalculationResult {
    const days = months * 30
    const dailyInterestAmount = principal * (dailyRate / 100)
    const totalInterest = dailyInterestAmount * days
    const totalReceivable = principal + totalInterest
    const emiAmount = totalReceivable / months

    const schedule: ScheduleEntry[] = []
    let balance = principal
    const principalPerMonth = principal / months
    const monthlyInterest = dailyInterestAmount * 30

    for (let i = 1; i <= months; i++) {
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + i)

        schedule.push({
            installmentNo: i,
            dueDate,
            emiAmount: Math.round(emiAmount),
            principalPortion: Math.round(principalPerMonth),
            interestPortion: Math.round(monthlyInterest),
            balanceAfter: Math.round(balance - principalPerMonth)
        })

        balance -= principalPerMonth
    }

    return {
        monthlyInterest: Math.round(monthlyInterest),
        totalInterest: Math.round(totalInterest),
        totalReceivable: Math.round(totalReceivable),
        emiAmount: Math.round(emiAmount),
        schedule
    }
}
