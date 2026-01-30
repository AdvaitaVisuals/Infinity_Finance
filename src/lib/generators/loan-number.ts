
import { dbGet } from '@/lib/db'

export async function generateLoanNumber(): Promise<string> {
    const currentYear = new Date().getFullYear()
    const prefix = `LN-${currentYear}`

    const lastLoan = await dbGet<{ loanNumber: string }>(`
    SELECT loanNumber
    FROM loans
    WHERE loanNumber LIKE ?
    ORDER BY loanNumber DESC
    LIMIT 1
  `, `${prefix}%`)

    let nextSeq = 1
    if (lastLoan) {
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
