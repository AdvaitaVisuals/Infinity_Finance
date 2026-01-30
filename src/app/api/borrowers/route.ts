
import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbRun, dbAll } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'test-user-id'

  try {
    const body = await req.json()

    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: "Name and Phone are required" }, { status: 400 })
    }

    const id = uuidv4()

    const userCheck = await dbGet('SELECT id FROM users WHERE id = ?', userId)
    if (!userCheck) {
      await dbRun('INSERT INTO users (id, name, phone, pin) VALUES (?, ?, ?, ?)', userId, 'Test User', '9999999999', '1234')
    }

    await dbRun(`
            INSERT INTO borrowers (
                id, userId, name, phone, alternatePhone, email,
                address, city, state, pincode,
                aadhaarNumber, panNumber,
                guarantorName, guarantorPhone, guarantorAddress, guarantorRelation,
                defaultInterestRate,
                status
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?,
                ?, ?, ?, ?,
                ?,
                ?
            )
        `,
      id, userId, body.name, body.phone,
      body.alternatePhone || null, body.email || null,
      body.address || null, body.city || 'Delhi', body.state || 'Delhi', body.pincode || '',
      body.aadhaarNumber || null, body.panNumber || null,
      body.guarantorName || null, body.guarantorPhone || null, body.guarantorAddress || null, body.guarantorRelation || null,
      body.defaultInterestRate || 0.0,
      'ACTIVE'
    )

    return NextResponse.json({ success: true, data: { id, ...body } })
  } catch (error: unknown) {
    console.error('Create Borrower Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || 'test-user-id'

  try {
    const borrowers = await dbAll('SELECT * FROM borrowers WHERE userId = ? ORDER BY createdAt DESC', userId)
    return NextResponse.json({ success: true, data: borrowers })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
