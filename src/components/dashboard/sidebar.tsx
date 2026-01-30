
"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home, PieChart, Users, Settings, Briefcase,
    Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/'
        return pathname.startsWith(path)
    }

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="w-24 bg-black rounded-[40px] flex flex-col items-center py-8 justify-between shrink-0 h-[calc(100vh-2rem)] sticky top-4 shadow-2xl shadow-black/40">
                <div className="flex flex-col gap-10 items-center w-full">
                    {/* Logo */}
                    <Link href="/infinity">
                        <div className="w-10 h-10 flex items-center justify-center mb-4 transition-transform hover:scale-110 cursor-pointer">
                            <img src="/logo.svg" alt="Infinity Finance" className="w-full h-full object-contain" />
                        </div>
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-6 w-full items-center">
                        <NavItem href="/" icon={<Home className="w-6 h-6" />} active={isActive('/')} label="Home" />
                        <NavItem href="/loans" icon={<Briefcase className="w-6 h-6" />} active={isActive('/loans')} label="Loans" />
                        <NavItem href="/payments" icon={<Wallet className="w-6 h-6" />} active={isActive('/payments')} label="Payments" />
                        <NavItem href="/reports" icon={<PieChart className="w-6 h-6" />} active={isActive('/reports')} label="Reports" />
                        <NavItem href="/borrowers" icon={<Users className="w-6 h-6" />} active={isActive('/borrowers')} label="Borrowers" />
                        <NavItem href="/settings" icon={<Settings className="w-6 h-6" />} active={isActive('/settings')} label="Settings" />
                    </nav>
                </div>

                <div className="flex flex-col gap-8 items-center pb-4 opacity-0 pointer-events-none">
                    {/* Hidden Spacer */}
                </div>
            </aside>
        </TooltipProvider>
    )
}

function NavItem({ href, icon, active, label }: { href: string; icon: React.ReactNode; active: boolean; label: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={href} className={cn("relative group flex items-center justify-center w-full h-12 transition-all duration-300", active ? "text-white" : "text-gray-500 hover:text-white")}>
                    {active && (
                        <div className="absolute inset-0 bg-white/10 rounded-xl blur-md"></div>
                    )}
                    {active && (
                        <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                    )}
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black/90 border-none text-white font-bold ml-2">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    )
}
