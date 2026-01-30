
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const body = await req.json()
        const { name, phone, address, aadharNumber, panNumber, email, defaultInterestRate } = body

        // Validation
        if (!name || !phone) {
            return NextResponse.json({ success: false, error: "Name and Phone are required" }, { status: 400 })
        }

        db.prepare(`
        UPDATE borrowers 
        SET name = ?, phone = ?, address = ?, aadharNumber = ?, panNumber = ?, email = ?, defaultInterestRate = ?
        WHERE id = ?
    `).run(name, phone, address, aadharNumber, panNumber, email, defaultInterestRate, id)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // Check for active loans
        const activeLoans = db.prepare('SELECT COUNT(*) as count FROM loans WHERE borrowerId = ? AND status = ?').get(id, 'ACTIVE') as { count: number }
        if (activeLoans.count > 0) {
            return NextResponse.json({ success: false, error: "Cannot delete borrower with active loans." }, { status: 400 })
        }

        // Delete related records or Cascade? Assuming SQLite FK cascade is not strictly enforced or we want manual control.
        // Ideally delete payments, loans, then borrower.
        // Or just delete borrower and let DB handle it.
        // I will try to delete borrower.
        db.prepare('DELETE FROM borrowers WHERE id = ?').run(id)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        if (error.message.includes("FOREIGN KEY constraint failed")) {
            // Fallback to soft delete if constrained
            db.prepare("UPDATE borrowers SET status = 'DELETED' WHERE id = ?").run(id)
            return NextResponse.json({ success: true, message: "Soft deleted due to constraints" })
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
