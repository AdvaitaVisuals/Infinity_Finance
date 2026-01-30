
import { db } from '@/lib/db'

export async function generateLoanNumber(): Promise<string> {
    const currentYear = new Date().getFullYear()
    const prefix = `LN-${currentYear}`

    // Find last loan number for this year
    const stmt = db.prepare<string, { loanNumber: string }>(`
    SELECT loanNumber 
    FROM loans 
    WHERE loanNumber LIKE ? 
    ORDER BY loanNumber DESC 
    LIMIT 1
  `)

    const lastLoan = stmt.get(`${prefix}%`)

    let nextSeq = 1
    if (lastLoan) {
        // Expected format: LN-2025-001
        const parts = lastLoan.loanNumber.split('-')
        if (parts.length === 3) {
            const lastSeq = parseInt(parts[2], 10)
            if (!isNaN(lastSeq)) {
                nextSeq = lastSeq + 1
            }
        }
    }

    return `${prefix}-${String(nextSeq).padStart(3, '0')}`
}
