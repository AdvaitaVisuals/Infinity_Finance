
import { NextRequest, NextResponse } from 'next/server'
import { dbAll, dbBatch } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { calculateLoan } from '@/lib/calculations/interest'
import { generateLoanNumber } from '@/lib/generators/loan-number'
import { InterestType } from '@/types'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'test-user-id'

  try {
    const loans = await dbAll(`
      SELECT l.*, b.name as borrowerName
      FROM loans l JOIN borrowers b ON l.borrowerId = b.id
      WHERE l.userId = ?
      ORDER BY l.createdAt DESC
    `, userId)

    return NextResponse.json({ success: true, data: loans })
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch loans' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'test-user-id'

  try {
    const body = await req.json()

    if (!body.borrowerId || !body.principalAmount) {
      return NextResponse.json({ success: false, error: "Missing required loan fields" }, { status: 400 })
    }

    const principal = parseFloat(body.principalAmount)
    const rate = parseFloat(body.interestRate || '3')
    const duration = parseFloat(body.duration || '12')
    const type = body.interestType || 'MONTHLY_FLAT'

    const calculation = calculateLoan({
      principalAmount: principal,
      interestRate: rate,
      interestType: type as InterestType,
      duration: duration
    })

    const loanNumber = await generateLoanNumber()
    const loanId = uuidv4()
    const startDate = new Date(body.startDate || new Date())
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + duration)

    // Build batch statements
    const statements: { sql: string; args: any[] }[] = []

    // 1. Insert Loan
    statements.push({
      sql: `INSERT INTO loans (
        id, loanNumber, userId, borrowerId,
        principalAmount, interestRate, interestType, duration,
        startDate, endDate, monthlyInterest, totalInterest,
        totalReceivable, emiAmount, principalPending, interestPending,
        status, purpose, notes, consentGiven, consentTimestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        loanId, loanNumber, userId, body.borrowerId,
        principal, rate, type, duration,
        startDate.toISOString(), endDate.toISOString(), calculation.monthlyInterest, calculation.totalInterest,
        calculation.totalReceivable, calculation.emiAmount, principal, calculation.totalInterest,
        'ACTIVE', body.purpose || 'Personal', body.notes || '', body.consentGiven ? 1 : 0, new Date().toISOString()
      ]
    })

    // 2. Insert Schedule entries
    for (const entry of calculation.schedule) {
      statements.push({
        sql: `INSERT INTO payment_schedules (
          id, loanId, installmentNo, dueDate,
          emiAmount, principalPortion, interestPortion, balanceAfter,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          uuidv4(), loanId, entry.installmentNo, entry.dueDate.toISOString(),
          entry.emiAmount, entry.principalPortion, entry.interestPortion, entry.balanceAfter,
          'UPCOMING'
        ]
      })
    }

    // 3. Update Borrower Status
    statements.push({
      sql: `UPDATE borrowers SET status = 'ACTIVE' WHERE id = ?`,
      args: [body.borrowerId]
    })

    await dbBatch(statements)

    return NextResponse.json({ success: true, data: { loanId, loanNumber } })
  } catch (error: unknown) {
    console.error('Create Loan Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
