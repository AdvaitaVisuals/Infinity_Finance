
"use client"

import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, User, Phone, MapPin, BadgeCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBorrowerPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        aadhaarNumber: '',
        panNumber: '',
        guarantorName: '',
        guarantorPhone: '',
        notes: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/borrowers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': 'test-user-id' // Mock ID for testing
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success) {
                // Success
                router.push('/borrowers')
                router.refresh()
            } else {
                alert("Error creating borrower: " + result.error)
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8 flex items-center gap-4">
                    <Link href="/borrowers">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Add Borrower</h1>
                        <p className="text-gray-500 mt-1">Create a new client profile</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

                    {/* Personal Info */}
                    <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-black text-white p-2 rounded-lg">
                                    <User className="w-4 h-4" />
                                </div>
                                <CardTitle>Personal Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name *</Label>
                                <Input required name="name" placeholder="Ex. Rahul Kumar" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                    <Input required name="phone" placeholder="9876543210" className="pl-10 bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email (Optional)</Label>
                                <Input name="email" type="email" placeholder="rahul@example.com" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label>Address *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                    <Input required name="address" placeholder="House No, Street, City" className="pl-10 bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KYC & Identity */}
                    <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 text-white p-2 rounded-lg">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                                <CardTitle>Identity Proof (Optional)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Aadhaar Number</Label>
                                <Input name="aadhaarNumber" placeholder="XXXX XXXX XXXX" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>PAN Number</Label>
                                <Input name="panNumber" placeholder="ABCDE1234F" className="bg-slate-50 border-none h-12 rounded-xl uppercase" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Default Interest Rate (% / month)</Label>
                                <Input name="defaultInterestRate" type="number" step="0.01" placeholder="2.0" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guarantor Info */}
                    <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                            <CardTitle>Guarantor Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Guarantor Name</Label>
                                <Input name="guarantorName" placeholder="Name" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Guarantor Phone</Label>
                                <Input name="guarantorPhone" placeholder="Phone" className="bg-slate-50 border-none h-12 rounded-xl" onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4 pb-12">
                        <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800 rounded-xl px-12 h-12 text-base font-bold shadow-lg shadow-black/20">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Borrower
                        </Button>
                    </div>

                </form>
            </main>
        </div>
    )
}
