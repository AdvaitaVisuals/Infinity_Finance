
import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbBatch } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const payments = await dbAll(`
            SELECT p.*, l.loanNumber, b.name as borrowerName
            FROM payments p
            JOIN loans l ON p.loanId = l.id
            JOIN borrowers b ON l.borrowerId = b.id
            WHERE p.userId = ?
            ORDER BY p.paymentDate DESC
            LIMIT 100
        `, userId)

        return NextResponse.json({ success: true, data: payments })
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const body = await req.json()

        if (!body.borrowerId || !body.amount || !body.paymentDate) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        const amount = parseFloat(body.amount)
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })
        }

        const paymentType = body.paymentType || 'INTEREST'

        let interestPortion = 0
        let principalPortion = 0

        if (paymentType === 'INTEREST') {
            interestPortion = amount
        } else {
            principalPortion = amount
        }

        const paymentId = uuidv4()
        const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`

        const statements: { sql: string; args: any[] }[] = []

        // 1. Insert Payment
        statements.push({
            sql: `INSERT INTO payments (
                id, userId, loanId, amount,
                interestPortion, principalPortion,
                paymentDate, paymentMode, receiptNumber, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                paymentId, userId, body.loanId || null, amount,
                interestPortion, principalPortion,
                new Date(body.paymentDate).toISOString(),
                body.paymentMode || 'CASH',
                receiptNumber, body.notes || ''
            ]
        })

        // 2. Update Loan Balance
        if (body.loanId) {
            statements.push({
                sql: `UPDATE loans SET totalPaid = totalPaid + ? WHERE id = ?`,
                args: [amount, body.loanId]
            })

            if (paymentType === 'PRINCIPAL') {
                statements.push({
                    sql: `UPDATE loans SET principalPending = MAX(0, principalPending - ?) WHERE id = ?`,
                    args: [amount, body.loanId]
                })
            } else if (paymentType === 'INTEREST') {
                statements.push({
                    sql: `UPDATE loans SET interestPending = MAX(0, interestPending - ?) WHERE id = ?`,
                    args: [amount, body.loanId]
                })
            } else if (paymentType === 'FULL_SETTLEMENT') {
                statements.push({
                    sql: `UPDATE loans SET status = 'CLOSED', principalPending = 0, interestPending = 0 WHERE id = ?`,
                    args: [body.loanId]
                })
            }
        }

        await dbBatch(statements)

        return NextResponse.json({ success: true, data: { paymentId, receiptNumber } })

    } catch (error: unknown) {
        console.error('Record Payment Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}
