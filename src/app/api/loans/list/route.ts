
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'test-user-id'

    try {
        const loans = db.prepare(`
      SELECT l.*, b.name as borrowerName 
      FROM loans l
      JOIN borrowers b ON l.borrowerId = b.id
      WHERE l.userId = ?
      ORDER BY l.createdAt DESC
    `).all(userId)

        return NextResponse.json({ success: true, data: loans })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
