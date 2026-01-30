
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ChevronRight, Check } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

            {/* Header / Nav */}
            <header className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Infinity" className="h-10 w-10 object-contain" />
                        <span className="font-extrabold text-2xl tracking-tighter">Infinity Finance</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#invest" className="hover:text-white transition-colors">Invest</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                    </div>
                    <div>
                        <Link href="/">
                            <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                                Launch App
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/infinity_bg_dark.png" alt="Background" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Glowing Orbs Effect */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse delay-1000"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        Join the future of lending
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        Finance without <br className="hidden md:block" />
                        <span className="text-white">Limits</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        Manage loans, track repayments, and unlock high-yield investing opportunities with the Infinity Finance ecosystem.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
                        <div className="p-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                            <Button className="h-14 px-8 rounded-full bg-black hover:bg-black/90 text-white text-lg font-bold">
                                Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                        <Button variant="ghost" className="h-14 px-8 rounded-full text-gray-400 hover:text-white text-lg">
                            Learn more <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Opportunities Section */}
            <section id="invest" className="py-24 bg-zinc-900/50 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Upcoming Opportunities</h2>
                        <p className="text-xl text-gray-400 max-w-xl">Exclusive high-yield investment pools available soon to early members.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group p-8 rounded-[32px] bg-black border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <img src="/infinity_logo_transparent.png" className="w-32 h-32" />
                            </div>
                            <div className="text-sm font-bold text-purple-400 mb-2">FIXED INCOME</div>
                            <h3 className="text-2xl font-bold mb-4">Corporate Debt Pool A</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">12-15%</span>
                                <span className="text-gray-400">APY</span>
                            </div>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> 6 Months Lock-in</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Monthly Payouts</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Asset Backed</li>
                            </ul>
                            <Button className="w-full rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black font-bold h-12 transition-all">
                                View Details
                            </Button>
                        </div>

                        {/* Card 2 */}
                        <div className="group p-8 rounded-[32px] bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 hover:border-purple-500 transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.2)]">
                            <div className="inline-block px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold mb-6">HOT</div>
                            <h3 className="text-2xl font-bold mb-4">Real Estate Bridge</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">18%</span>
                                <span className="text-gray-400">Target IRR</span>
                            </div>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /> Short Term (3-9mo)</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /> Senior Secured</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-purple-500" /> High Liquidity</li>
                            </ul>
                            <Button className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold h-12 shadow-lg shadow-purple-900/40">
                                Join Waitlist
                            </Button>
                        </div>

                        {/* Card 3 */}
                        <div className="group p-8 rounded-[32px] bg-black border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
                            <div className="text-sm font-bold text-blue-400 mb-2">GROWTH</div>
                            <h3 className="text-2xl font-bold mb-4">SME Discounting</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">14%</span>
                                <span className="text-gray-400">Avg ROI</span>
                            </div>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-500" /> Invoice Backed</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-500" /> 30-90 Days Cycle</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-500" /> Diversified Risk</li>
                            </ul>
                            <Button className="w-full rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black font-bold h-12 transition-all">
                                Notify Me
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center text-gray-500">
                <p>&copy; {(new Date()).getFullYear()} Infinity Finance. All rights reserved.</p>
            </footer>

        </div>
    )
}
