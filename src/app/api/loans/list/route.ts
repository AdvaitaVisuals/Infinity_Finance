
import { NextRequest, NextResponse } from 'next/server'
import { dbAll } from '@/lib/db'

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
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
