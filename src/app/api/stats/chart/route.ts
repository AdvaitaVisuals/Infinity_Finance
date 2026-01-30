
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

        const stats = dates.map(date => {
            const lent = db.prepare(`
                SELECT SUM(principalAmount) as total 
                FROM loans 
                WHERE userId = ? 
                AND date(createdAt) = date(?)
            `).get(userId, date) as { total: number }

            const collected = db.prepare(`
                SELECT SUM(amount) as total 
                FROM payments 
                WHERE userId = ? 
                AND date(paymentDate) = date(?)
            `).get(userId, date) as { total: number }

            return {
                date,
                displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                lent: lent.total || 0,
                collected: collected.total || 0
            }
        })

        return NextResponse.json({ success: true, data: stats })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
