
"use client"

import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Lock, Bell, Database, User, Shield, LogOut, Moon, Zap, Smartphone, Globe, Upload, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Camera, Fingerprint, Eye, EyeOff } from 'lucide-react'
import { useState, useRef, ChangeEvent, useEffect } from 'react'

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('account') // Default to Account as requested
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

    // Profile Photo State
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const profileInputRef = useRef<HTMLInputElement>(null)

    // Import Data State
    const [fileName, setFileName] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Load saved avatar
        const saved = localStorage.getItem('userAvatar')
        if (saved) setProfileImage(saved)
    }, [])

    const handleSave = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }

    const handleProfilePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setProfileImage(result)
                localStorage.setItem('userAvatar', result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            setUploadStatus('uploading')
            setTimeout(() => {
                setUploadStatus('success')
            }, 2000)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900 overflow-hidden">
            {/* ... sidebar ... */}
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen relative">
                {/* ... header ... */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-rose-50/30 pointer-events-none" />

                <header className="mb-8 relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 animate-in fade-in slide-in-from-left-4 duration-700">
                            Settings
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Control center for your financial dashboard.</p>
                    </div>
                </header>

                <div className="relative z-10 flex gap-10">
                    {/* ... nav ... */}
                    <div className="w-64 shrink-0 space-y-2 pt-4">
                        <SettingsNav
                            icon={<Globe className="w-5 h-5" />}
                            label="General"
                            active={activeTab === 'general'}
                            onClick={() => setActiveTab('general')}
                        />
                        <SettingsNav
                            icon={<User className="w-5 h-5" />}
                            label="Account"
                            active={activeTab === 'account'}
                            onClick={() => setActiveTab('account')}
                        />
                        {/* ... other navs ... */}
                        <SettingsNav
                            icon={<Shield className="w-5 h-5" />}
                            label="Security"
                            active={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                        />
                        <SettingsNav
                            icon={<Database className="w-5 h-5" />}
                            label="Import Data"
                            active={activeTab === 'import'}
                            onClick={() => setActiveTab('import')}
                        />

                        <div className="pt-12">
                            <button className="flex items-center gap-3 w-full px-5 py-4 text-red-600 hover:bg-red-50 rounded-full transition-all font-bold">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-white/60 animate-in fade-in zoom-in-95 duration-500 min-h-[600px]">

                            {/* ... general tab ... */}
                            {activeTab === 'general' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <SectionHeader
                                        icon={<Globe className="w-6 h-6" />}
                                        title="General Preferences"
                                        description="Manage global application settings."
                                        color="bg-blue-500"
                                        shadow="shadow-blue-500/30"
                                    />

                                    <div className="grid grid-cols-2 gap-8">
                                        <InputField label="Default Interest Rate" defaultValue="3" suffix="%" />
                                        <InputField label="Default Currency" defaultValue="INR (₹)" disabled />
                                        <div className="col-span-2">
                                            <InputField label="Business Name" defaultValue="Ankit Finance" />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm"><Moon className="w-5 h-5" /></div>
                                            <div>
                                                <p className="font-bold">Dark Mode</p>
                                                <p className="text-sm text-gray-500">Easier on the eyes at night</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <SaveButton onClick={handleSave} isLoading={isLoading} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <SectionHeader
                                        icon={<User className="w-6 h-6" />}
                                        title="Account Information"
                                        description="Manage your personal details and profile."
                                        color="bg-slate-900"
                                        shadow="shadow-slate-900/30"
                                    />

                                    <div className="flex items-center gap-8 pb-8 border-b border-gray-100">
                                        <input
                                            type="file"
                                            ref={profileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfilePhotoSelect}
                                        />
                                        <div className="relative group cursor-pointer" onClick={() => profileInputRef.current?.click()}>
                                            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-slate-900/20 overflow-hidden">
                                                {profileImage ? (
                                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    "AS"
                                                )}
                                            </div>
                                            <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 group-hover:scale-110 transition-transform">
                                                <Camera className="w-4 h-4 text-black" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Ankit Sharma</h3>
                                            <p className="text-gray-500">Admin • +91 99999 99999</p>
                                            <Button
                                                variant="link"
                                                className="px-0 text-blue-600"
                                                onClick={() => profileInputRef.current?.click()}
                                            >
                                                Change Profile Photo
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <InputField label="Full Name" defaultValue="Ankit Sharma" />
                                        <InputField label="Email Address" defaultValue="ankit@example.com" />
                                        <InputField label="Phone Number" defaultValue="+91 99999 99999" />
                                        <InputField label="Role" defaultValue="Administrator" disabled />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <SaveButton onClick={handleSave} isLoading={isLoading} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <SectionHeader
                                        icon={<Shield className="w-6 h-6" />}
                                        title="Security & Privacy"
                                        description="Secure your account and data."
                                        color="bg-emerald-500"
                                        shadow="shadow-emerald-500/30"
                                    />

                                    <div className="space-y-6">
                                        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm"><Shield className="w-5 h-5 text-blue-600" /></div>
                                            <div>
                                                <p className="font-bold text-blue-900">Account Security</p>
                                                <p className="text-sm text-blue-700">Your account is currently protected with a strong password.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Change Password</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Current Password</Label>
                                                <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-white border-gray-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>New Password</Label>
                                                <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-white border-gray-200" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <SaveButton onClick={handleSave} isLoading={isLoading} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'import' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <SectionHeader
                                        icon={<Database className="w-6 h-6" />}
                                        title="Import Data"
                                        description="Migrate data from other sources."
                                        color="bg-violet-600"
                                        shadow="shadow-violet-600/30"
                                    />

                                    {/* Drag & Drop Zone */}
                                    <div
                                        onClick={handleUploadClick}
                                        className="border-3 border-dashed border-gray-200 hover:border-violet-400 bg-slate-50/50 hover:bg-violet-50/30 rounded-[32px] p-12 transition-all cursor-pointer group text-center space-y-4"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".csv,.pdf,.xlsx"
                                        />

                                        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {uploadStatus === 'uploading' ? (
                                                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : uploadStatus === 'success' ? (
                                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-violet-500" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xl font-bold text-gray-700">
                                                {uploadStatus === 'success' ? 'Upload Complete!' : 'Click to Upload or Drag File'}
                                            </p>
                                            <p className="text-gray-400 mt-2">
                                                {fileName || 'Support for PDF, CSV, and Excel files'}
                                            </p>
                                        </div>
                                    </div>

                                    {uploadStatus === 'success' && (
                                        <div className="p-4 bg-green-100 text-green-800 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Successfully processed <b>{fileName}</b>. 14 Records found. (Demo)</span>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

// Reusable Components

function SettingsNav({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 w-full px-6 py-4 rounded-full transition-all duration-300 font-bold ${active
                ? 'bg-black text-white shadow-xl shadow-black/25 scale-105'
                : 'text-gray-500 hover:bg-white/80 hover:text-black hover:shadow-lg hover:scale-105'
                }`}
        >
            {icon}
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
        </button>
    )
}

function SectionHeader({ icon, title, description, color, shadow }: any) {
    return (
        <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg ${shadow}`}>
                {icon}
            </div>
            <div>
                <h2 className="text-3xl font-black">{title}</h2>
                <p className="text-gray-500 font-medium">{description}</p>
            </div>
        </div>
    )
}

function InputField({ label, defaultValue, disabled, suffix }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-gray-500 font-bold ml-1">{label}</Label>
            <div className="relative group">
                <Input
                    defaultValue={defaultValue}
                    disabled={disabled}
                    className={`h-14 rounded-2xl bg-slate-50 border-transparent focus:border-black focus:bg-white focus:ring-0 transition-all text-lg font-bold pl-5 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {suffix && <span className="absolute right-5 top-4 text-gray-400 font-bold">{suffix}</span>}
            </div>
        </div>
    )
}

function SaveButton({ onClick, isLoading }: any) {
    return (
        <Button
            onClick={onClick}
            className="bg-black text-white hover:bg-gray-900 rounded-2xl px-10 h-14 text-lg font-bold shadow-xl shadow-black/30 hover:scale-105 transition-all"
        >
            {isLoading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span> : 'Save Changes'}
        </Button>
    )
}
