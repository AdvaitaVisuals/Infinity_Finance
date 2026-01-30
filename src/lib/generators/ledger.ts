
import { dbAll } from '@/lib/db'

export async function getMonthlyLedger(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const payments = await dbAll(`
    SELECT p.*, l.loanNumber, b.name as borrowerName
    FROM payments p
    JOIN loans l ON p.loanId = l.id
    JOIN borrowers b ON l.borrowerId = b.id
    WHERE p.userId = ?
    AND p.paymentDate >= ?
    AND p.paymentDate <= ?
    ORDER BY p.paymentDate DESC
  `, userId, startDate, endDate)

    return payments
}
