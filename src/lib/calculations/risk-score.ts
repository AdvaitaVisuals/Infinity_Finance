
import { BorrowerStatus } from '@/types'

export interface RiskInput {
    missedPayments: number
    totalDelayDays: number
    loanAmount: number
    paidPercentage: number
    borrowerHistory: {
        totalLoans: number
        closedOnTime: number
        defaulted: number
    }
}

export interface RiskResult {
    score: number           // 0-100, higher = more risky
    category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    factors: string[]
    recommendation: string
}

/**
 * Calculate risk score for a borrower/loan
 * 
 * Factors:
 * - Missed payments (weight: 40%)
 * - Delay days (weight: 25%)
 * - Payment progress (weight: 15%)
 * - Historical behavior (weight: 20%)
 */
export function calculateRiskScore(input: RiskInput): RiskResult {
    let score = 0
    const factors: string[] = []

    // 1. Missed payments (0-40 points)
    const missedScore = Math.min(input.missedPayments * 10, 40)
    score += missedScore
    if (input.missedPayments >= 3) {
        factors.push(`${input.missedPayments} missed payments - HIGH RISK`)
    } else if (input.missedPayments >= 1) {
        factors.push(`${input.missedPayments} missed payment(s)`)
    }

    // 2. Total delay days (0-25 points)
    const delayScore = Math.min(Math.floor(input.totalDelayDays / 7) * 5, 25)
    score += delayScore
    if (input.totalDelayDays > 30) {
        factors.push(`${input.totalDelayDays} days total delay`)
    }

    // 3. Payment progress (0-15 points)
    // If paid less than expected, add risk
    const expectedProgress = 50 // Expected 50% by mid-term
    if (input.paidPercentage < expectedProgress) {
        const progressScore = Math.round((expectedProgress - input.paidPercentage) / 4)
        score += Math.min(progressScore, 15)
        factors.push(`Only ${input.paidPercentage}% paid so far`)
    }

    // 4. Historical behavior (0-20 points)
    if (input.borrowerHistory.totalLoans > 0) {
        const defaultRate = input.borrowerHistory.defaulted / input.borrowerHistory.totalLoans
        const historyScore = Math.round(defaultRate * 20)
        score += historyScore
        if (defaultRate > 0) {
            factors.push(`Previous default history: ${input.borrowerHistory.defaulted} loans`)
        }
    }

    // Determine category
    let category: RiskResult['category']
    let recommendation: string

    if (score <= 20) {
        category = 'LOW'
        recommendation = 'Borrower is performing well. Continue monitoring.'
    } else if (score <= 45) {
        category = 'MEDIUM'
        recommendation = 'Send reminder. Consider follow-up call.'
    } else if (score <= 70) {
        category = 'HIGH'
        recommendation = 'Immediate action required. Personal visit recommended.'
    } else {
        category = 'CRITICAL'
        recommendation = 'Consider legal action or write-off. Document everything.'
    }

    return {
        score: Math.min(score, 100),
        category,
        factors,
        recommendation
    }
}

/**
 * Update borrower status based on risk
 */
export function getBorrowerStatus(missedPayments: number): BorrowerStatus {
    if (missedPayments === 0) return 'ACTIVE'        // 🟢
    if (missedPayments <= 2) return 'DELAY'          // 🟡
    return 'DEFAULT_RISK'                             // 🔴
}
