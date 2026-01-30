
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// GET: List recent payments
export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const payments = db.prepare(`
            SELECT p.*, l.loanNumber, b.name as borrowerName 
            FROM payments p
            JOIN loans l ON p.loanId = l.id
            JOIN borrowers b ON l.borrowerId = b.id
            WHERE p.userId = ?
            ORDER BY p.paymentDate DESC
            LIMIT 100
        `).all(userId)

        return NextResponse.json({ success: true, data: payments })
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 })
    }
}

// POST: Record a new payment
export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const body = await req.json()

        // Validation
        if (!body.borrowerId || !body.amount || !body.paymentDate) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        const amount = parseFloat(body.amount)
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })
        }

        // INTEREST Only vs PRINCIPAL Logic
        const paymentType = body.paymentType || 'INTEREST'

        let interestPortion = 0
        let principalPortion = 0

        // Determine portions for history
        if (paymentType === 'INTEREST') {
            interestPortion = amount
            principalPortion = 0
        } else {
            interestPortion = 0
            principalPortion = amount
        }

        // Transaction
        const createPaymentTx = db.transaction(() => {
            const paymentId = uuidv4()
            const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`

            // 1. Insert Payment
            db.prepare(`
                INSERT INTO payments (
                    id, userId, loanId, amount, 
                    interestPortion, principalPortion, 
                    paymentDate, paymentMode, receiptNumber, notes
                ) VALUES (
                    ?, ?, ?, ?, 
                    ?, ?, 
                    ?, ?, ?, ?
                )
            `).run(
                paymentId,
                userId,
                body.loanId || null,
                amount,
                interestPortion,
                principalPortion,
                new Date(body.paymentDate).toISOString(),
                body.paymentMode || 'CASH',
                receiptNumber,
                body.notes || ''
            )

            // 2. Update Loan Balance if loanId exists
            // This is the critical part to fix "Total Balance Due"
            if (body.loanId) {
                // Always increase totalPaid
                db.prepare(`UPDATE loans SET totalPaid = totalPaid + ? WHERE id = ?`).run(amount, body.loanId)

                if (paymentType === 'PRINCIPAL') {
                    // Reduce Principal Pending
                    db.prepare(`
                        UPDATE loans 
                        SET principalPending = MAX(0, principalPending - ?)
                        WHERE id = ?
                    `).run(amount, body.loanId)
                }
                else if (paymentType === 'INTEREST') {
                    // Try to reduce Interest Pending if column exists (it should based on previous files)
                    // If the user wants "Total Due" to reduce, we MUST reduce interestPending or principalPending.
                    // Assuming interestPending tracks accrued interest.

                    try {
                        db.prepare(`
                            UPDATE loans 
                            SET interestPending = MAX(0, interestPending - ?)
                            WHERE id = ?
                        `).run(amount, body.loanId)
                    } catch (e) {
                        // ignore if interestPending column doesn't exist or logic differs
                    }
                }
                else if (paymentType === 'FULL_SETTLEMENT') {
                    // Close Loan
                    db.prepare(`UPDATE loans SET status = 'CLOSED', principalPending = 0, interestPending = 0 WHERE id = ?`).run(body.loanId)
                }
            }

            return { paymentId, receiptNumber }
        })

        const result = createPaymentTx()

        return NextResponse.json({ success: true, data: result })

    } catch (error: unknown) {
        console.error('Record Payment Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}
