
export interface PaymentAllocation {
    loanId: string
    paymentAmount: number
    paymentDate: Date

    // Current loan state
    principalPending: number
    interestPending: number
    penaltyPending?: number
}

export interface AllocationResult {
    penaltyPortion: number
    interestPortion: number
    principalPortion: number
    excessAmount: number

    newPrincipalPending: number
    newInterestPending: number
    isLoanClosed: boolean
}

/**
 * Allocate payment amount to penalty → interest → principal
 * Standard industry practice: Pay off penalty first, then interest, then principal
 */
export function allocatePayment(input: PaymentAllocation): AllocationResult {
    let remaining = input.paymentAmount
    let penaltyPortion = 0
    let interestPortion = 0
    let principalPortion = 0
    let excessAmount = 0

    // 1. First allocate to penalty (if any)
    if (input.penaltyPending && input.penaltyPending > 0) {
        penaltyPortion = Math.min(remaining, input.penaltyPending)
        remaining -= penaltyPortion
    }

    // 2. Then allocate to interest
    if (remaining > 0 && input.interestPending > 0) {
        interestPortion = Math.min(remaining, input.interestPending)
        remaining -= interestPortion
    }

    // 3. Then allocate to principal
    if (remaining > 0 && input.principalPending > 0) {
        principalPortion = Math.min(remaining, input.principalPending)
        remaining -= principalPortion
    }

    // 4. Any excess amount
    excessAmount = remaining

    // Calculate new pending amounts
    const newPrincipalPending = input.principalPending - principalPortion
    const newInterestPending = input.interestPending - interestPortion

    return {
        penaltyPortion: Math.round(penaltyPortion),
        interestPortion: Math.round(interestPortion),
        principalPortion: Math.round(principalPortion),
        excessAmount: Math.round(excessAmount),
        newPrincipalPending: Math.round(newPrincipalPending),
        newInterestPending: Math.round(newInterestPending),
        isLoanClosed: newPrincipalPending <= 0 && newInterestPending <= 0
    }
}

/**
 * Calculate interest accrued till date
 * Useful for foreclosure or partial payments
 */
export function calculateAccruedInterest(
    principal: number,
    monthlyRate: number,
    startDate: Date,
    tillDate: Date
): number {
    const daysDiff = Math.floor(
        (tillDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const dailyRate = monthlyRate / 30
    return Math.round(principal * (dailyRate / 100) * daysDiff)
}
