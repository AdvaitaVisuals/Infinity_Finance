
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'
    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month') // YYYY-MM format

    if (!month) {
        return NextResponse.json({ success: false, error: "Month is required" }, { status: 400 })
    }

    try {
        const startDate = `${month}-01`
        // Calculate end date (next month's 1st day)
        const [year, monthNum] = month.split('-').map(Number)
        const endDataObj = new Date(year, monthNum, 1) // Javascript months are 0-indexed for constructor? No, `new Date(Y, M, D)` -> M is 0-11.
        // If input is "2026-01", split -> 2026, 1.
        // We want Start: 2026-01-01.
        // End: 2026-02-01.
        // new Date(2026, 1, 1) -> Feb 1st 2026. (Since M=1 is Feb).
        const endDate = endDataObj.toISOString().split('T')[0]

        // Fetch Payments
        const payments = db.prepare(`
            SELECT p.*, l.loanNumber, b.name as borrowerName 
            FROM payments p
            LEFT JOIN loans l ON p.loanId = l.id
            LEFT JOIN borrowers b ON l.borrowerId = b.id
            WHERE p.userId = ? 
            AND date(p.paymentDate) >= date(?) 
            AND date(p.paymentDate) < date(?)
            ORDER BY p.paymentDate DESC
        `).all(userId, startDate, endDate) as any[]

        // Summary
        const summary = {
            totalCollected: 0,
            principalRecovered: 0,
            interestEarned: 0
        }

        payments.forEach(p => {
            summary.totalCollected += p.amount
            summary.principalRecovered += p.principalPortion || 0
            summary.interestEarned += p.interestPortion || 0
        })

        return NextResponse.json({ success: true, data: { payments, summary } })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
