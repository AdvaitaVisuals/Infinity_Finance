
import { NextRequest, NextResponse } from 'next/server'
import { dbGet } from '@/lib/db'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get('days') || '7')

        const dates = []
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            dates.push(d.toISOString().split('T')[0])
        }

        const stats = await Promise.all(dates.map(async (date) => {
            const lent = await dbGet<{ total: number }>(`
                SELECT SUM(principalAmount) as total
                FROM loans WHERE userId = ? AND date(createdAt) = date(?)
            `, userId, date)

            const collected = await dbGet<{ total: number }>(`
                SELECT SUM(amount) as total
                FROM payments WHERE userId = ? AND date(paymentDate) = date(?)
            `, userId, date)

            return {
                date,
                displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                lent: lent?.total || 0,
                collected: collected?.total || 0
            }
        }))

        return NextResponse.json({ success: true, data: stats })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
