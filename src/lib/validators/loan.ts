
import { z } from 'zod'

export const loanSchema = z.object({
    borrowerId: z.string().min(1, "Select a borrower"),

    // Loan Amount
    principalAmount: z.number()
        .min(1000, "Minimum loan amount is ₹1,000")
        .max(10000000, "Maximum loan amount is ₹1 Crore"),

    // Interest
    interestRate: z.number()
        .min(0.5, "Minimum interest rate is 0.5%")
        .max(36, "Maximum interest rate is 36%"),
    interestType: z.enum([
        'MONTHLY_FLAT',
        'MONTHLY_REDUCING',
        'YEARLY_FLAT',
        'DAILY'
    ]),

    // Duration
    duration: z.number()
        .min(1, "Minimum duration is 1 month")
        .max(120, "Maximum duration is 10 years"),
    startDate: z.date(),

    // Optional
    purpose: z.string().optional(),
    notes: z.string().optional(), // Verbal agreement details

    // Consent
    consentGiven: z.boolean().refine(val => val === true, {
        message: "Borrower consent is required"
    })
})

export type LoanFormData = z.infer<typeof loanSchema>
