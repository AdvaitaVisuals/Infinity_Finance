
import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbRun } from '@/lib/db'

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        const body = await req.json()
        const { name, phone, address, aadharNumber, panNumber, email, defaultInterestRate } = body

        if (!name || !phone) {
            return NextResponse.json({ success: false, error: "Name and Phone are required" }, { status: 400 })
        }

        await dbRun(`
        UPDATE borrowers
        SET name = ?, phone = ?, address = ?, aadharNumber = ?, panNumber = ?, email = ?, defaultInterestRate = ?
        WHERE id = ?
    `, name, phone, address, aadharNumber, panNumber, email, defaultInterestRate, id)

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
        const activeLoans = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM loans WHERE borrowerId = ? AND status = ?', id, 'ACTIVE')
        if (activeLoans && activeLoans.count > 0) {
            return NextResponse.json({ success: false, error: "Cannot delete borrower with active loans." }, { status: 400 })
        }

        await dbRun('DELETE FROM borrowers WHERE id = ?', id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        if (error.message.includes("FOREIGN KEY constraint failed")) {
            await dbRun("UPDATE borrowers SET status = 'DELETED' WHERE id = ?", id)
            return NextResponse.json({ success: true, message: "Soft deleted due to constraints" })
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
