
import { z } from 'zod'

export const borrowerSchema = z.object({
    // Required Fields
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    address: z.string().min(10, "Please enter complete address"),

    // Optional Fields
    alternatePhone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, "Invalid PIN code").optional().or(z.literal('')),

    // ID Proof (Optional but recommended)
    aadhaarNumber: z.string()
        .regex(/^\d{4}\s?\d{4}\s?\d{4}$/, "Invalid Aadhaar format")
        .optional()
        .or(z.literal('')),
    panNumber: z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
        .optional()
        .or(z.literal('')),

    // Guarantor (Optional)
    guarantorName: z.string().optional(),
    guarantorPhone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
    guarantorAddress: z.string().optional(),
    guarantorRelation: z.string().optional(),

    // Notes
    notes: z.string().optional()
})

export type BorrowerFormData = z.infer<typeof borrowerSchema>
