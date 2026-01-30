
import { NextRequest, NextResponse } from 'next/server'
import { dbAll } from '@/lib/db'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'
    const { searchParams } = new URL(req.url)
    const month = searchParams.get('month')

    if (!month) {
        return NextResponse.json({ success: false, error: "Month is required" }, { status: 400 })
    }

    try {
        const startDate = `${month}-01`
        const [year, monthNum] = month.split('-').map(Number)
        const endDataObj = new Date(year, monthNum, 1)
        const endDate = endDataObj.toISOString().split('T')[0]

        const payments = await dbAll(`
            SELECT p.*, l.loanNumber, b.name as borrowerName
            FROM payments p
            LEFT JOIN loans l ON p.loanId = l.id
            LEFT JOIN borrowers b ON l.borrowerId = b.id
            WHERE p.userId = ?
            AND date(p.paymentDate) >= date(?)
            AND date(p.paymentDate) < date(?)
            ORDER BY p.paymentDate DESC
        `, userId, startDate, endDate) as any[]

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
