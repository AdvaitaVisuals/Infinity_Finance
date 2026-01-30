
import { dbGet } from '@/lib/db'

export async function generateReceiptNumber(): Promise<string> {
    const currentYear = new Date().getFullYear()
    const prefix = `RCP-${currentYear}`

    const lastReceipt = await dbGet<{ receiptNumber: string }>(`
    SELECT receiptNumber
    FROM payments
    WHERE receiptNumber LIKE ?
    ORDER BY receiptNumber DESC
    LIMIT 1
  `, `${prefix}%`)

    let nextSeq = 1
    if (lastReceipt) {
        const parts = lastReceipt.receiptNumber.split('-')
        if (parts.length === 3) {
            const lastSeq = parseInt(parts[2], 10)
            if (!isNaN(lastSeq)) {
                nextSeq = lastSeq + 1
            }
        }
    }

    return `${prefix}-${String(nextSeq).padStart(3, '0')}`
}
