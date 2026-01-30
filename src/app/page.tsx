
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Users, CreditCard, Wallet, AlertCircle,
  Home, PieChart, Mail, Settings, Bell,
  Calendar, MessageSquare, ChevronRight, MoreVertical,
  Briefcase, FileText, CheckCircle2, Clock, ChevronLeft, ArrowRight
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardChartSection } from '@/components/dashboard/chart-section'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"


// Helper types
interface DashboardStats {
  totalLoans: number
  totalLent: number | null
  totalReceived: number | null
  totalPending: number | null
  totalInterest: number | null
  newLoansCount: number
  overdueCount: number
}

function getDashboardStats() {
  const userId = 'test-user-id' // Mock ID

  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalLoans,
      SUM(principalAmount) as totalLent,
      SUM(totalPaid) as totalReceived,
      SUM(principalPending + interestPending) as totalPending,
      SUM(totalInterest) as totalInterest
    FROM loans
    WHERE userId = ? AND status = 'ACTIVE'
  `).get(userId) as DashboardStats

  // New Loans (This Month)
  const newLoans = db.prepare(`
    SELECT COUNT(*) as count 
    FROM loans 
    WHERE userId = ? 
    AND strftime('%Y-%m', createdAt) = strftime('%Y-%m', 'now')
  `).get(userId) as { count: number }

  // Overdue (Active + EndDate passed)
  // Assuming SQLite. If endDate is not stored, calculate from startDate + duration (months)
  const overdue = db.prepare(`
    SELECT COUNT(*) as count 
    FROM loans 
    WHERE userId = ? 
    AND status = 'ACTIVE' 
    AND date(startDate, '+' || duration || ' months') < date('now')
  `).get(userId) as { count: number }

  const borrowerCount = db.prepare(`
    SELECT COUNT(*) as count FROM borrowers WHERE userId = ?
  `).get(userId) as { count: number }

  const recentLoans = db.prepare(`
    SELECT l.*, b.name as borrowerName, b.photoUrl
    FROM loans l
    JOIN borrowers b ON l.borrowerId = b.id
    WHERE l.userId = ?
    ORDER BY l.createdAt DESC
    LIMIT 5
  `).all(userId) as any[]

  return {
    ...stats,
    newLoansCount: newLoans.count,
    overdueCount: overdue.count,
    borrowerCount: borrowerCount?.count || 0,
    recentLoans
  }
}

export default function DashboardPage() {
  const data = getDashboardStats()

  return (
    <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900 overflow-hidden">
      {/* 1. Sidebar */}
      <div className="py-4 pl-4 shrink-0">
        <Sidebar />
      </div>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto pr-2 pl-6 pt-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Good morning, Ankit!</h1>

          <div className="flex items-center gap-4">
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="rounded-full bg-white hover:bg-slate-100 relative transition-all hover:scale-105 shadow-sm">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
              </Button>
            </Link>
            <Link href="/settings">
              <div className="flex items-center gap-2 cursor-pointer bg-white pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 transition-all hover:scale-105 shadow-sm border border-transparent hover:border-gray-200">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-black text-white font-bold">AS</AvatarFallback>
                </Avatar>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </Link>
          </div>
        </header>

        {/* 3. Stats Row (4 Columns) with Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Lent */}
          <Card className="rounded-[24px] border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-slate-900" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Link href="/loans">
                    <DropdownMenuItem>View All Loans</DropdownMenuItem>
                  </Link>
                  <Link href="/reports">
                    <DropdownMenuItem>Financial Analysis</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">₹{(data.totalLent || 0).toLocaleString()}</div>
              <p className="text-sm font-medium text-gray-500">Total Money Lent</p>
              <p className="text-xs text-gray-400 mt-1">Active Principal</p>
            </CardContent>
          </Card>

          {/* Card 2: Active Loans */}
          <Card className="rounded-[24px] border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-slate-900" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/loans?status=ACTIVE">
                    <DropdownMenuItem>View Active Only</DropdownMenuItem>
                  </Link>
                  <Link href="/loans/new">
                    <DropdownMenuItem>Create New Loan</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{data.totalLoans}</div>
              <p className="text-sm font-medium text-gray-500">Active Loans</p>
              <p className="text-xs text-gray-400 mt-1">Ongoing Repayments</p>
            </CardContent>
          </Card>

          {/* Card 3: Borrowers */}
          <Card className="rounded-[24px] border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-900" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/borrowers">
                    <DropdownMenuItem>Manage Borrowers</DropdownMenuItem>
                  </Link>
                  <Link href="/borrowers/new">
                    <DropdownMenuItem>Add New Client</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{data.borrowerCount}</div>
              <p className="text-sm font-medium text-gray-500">Borrowers</p>
              <p className="text-xs text-gray-400 mt-1">Working today</p>
            </CardContent>
          </Card>

          {/* Card 4: Collected */}
          <Card className="rounded-[24px] border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-900" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/payments/new">
                    <DropdownMenuItem>Record Payment</DropdownMenuItem>
                  </Link>
                  <Link href="/reports">
                    <DropdownMenuItem>View Ledger</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">₹{(data.totalReceived || 0).toLocaleString()}</div>
              <p className="text-sm font-medium text-gray-500">Total Collected</p>
              <p className="text-xs text-gray-400 mt-1">This month's recovery</p>
            </CardContent>
          </Card>
        </div>

        {/* 4. Middle Section */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Left Column (Stats + Chart) */}
          <div className="col-span-8 grid grid-cols-2 gap-6">
            <Link href="/loans?sort=new" className="col-span-1 block">
              <Card className="rounded-[24px] border-none shadow-sm bg-white p-6 h-full hover:shadow-md transition-all cursor-pointer group">
                <p className="text-lg font-bold mb-4">New Loans</p>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold group-hover:text-blue-600 transition-colors">{data.newLoansCount}</span>
                  <div className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-sm">
                    This Month
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/loans?filter=OVERDUE" className="col-span-1 block">
              <Card className="rounded-[24px] border-none shadow-sm bg-white p-6 h-full hover:shadow-md transition-all cursor-pointer group">
                <p className="text-lg font-bold mb-4">Overdue</p>
                <div className="flex items-center gap-4">
                  <span className={`text-5xl font-extrabold transition-colors ${data.overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{data.overdueCount}</span>
                  <div className="px-3 py-1 bg-red-100 text-red-600 font-bold rounded-lg text-sm">
                    Action Needed
                  </div>
                </div>
              </Card>
            </Link>

            {/* Chart */}
            <DashboardChartSection />

            {/* Recent Borrowers List (Bottom Section match) */}
            <Card className="rounded-[24px] border-none shadow-sm bg-white px-8 py-6 col-span-2">
              <h3 className="text-xl font-bold mb-6">Recent Borrowers</h3>
              <div className="space-y-6">
                {data.recentLoans.length === 0 ? (
                  <p className="text-gray-400">No recent activity.</p>
                ) : (
                  data.recentLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 overflow-hidden">
                          {/* Avatar placeholder */}
                          <Avatar>
                            <AvatarFallback className="bg-[#FFD88D] text-yellow-800">
                              {loan.borrowerName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="font-bold text-base group-hover:text-blue-600 transition-colors">{loan.borrowerName}</p>
                          <p className="text-sm text-gray-400">Loan #{loan.loanNumber}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 group-hover:text-black">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column (Dark Card + To Do) */}
          <div className="col-span-4 space-y-6">
            {/* Dark Card - Formation Status */}
            <Card className="rounded-[30px] border-none bg-black text-white p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-1">Loan Recovery</h3>
              <p className="text-gray-400 text-sm mb-6">Overall Progress</p>

              {/* Progress Bar Visual */}
              <div className="h-3 w-full bg-white/20 rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.round(((data.totalReceived || 0) / (data.totalLent || 1)) * 100))}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-400 mb-8">
                Recovery Rate <span className="text-white font-medium">{Math.round(((data.totalReceived || 0) / (data.totalLent || 1)) * 100)}%</span>
              </div>

              <Link href="/reports">
                <Button className="w-full bg-white text-black hover:bg-gray-100 font-bold rounded-xl h-12">
                  View status
                </Button>
              </Link>
            </Card>

            {/* To-Do List */}
            <div className="pl-2">
              <h3 className="text-lg font-bold mb-6">Your to-Do list</h3>
              <div className="space-y-6">

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    <FileText className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Run monthly report</h4>
                    <p className="text-xs text-gray-400">Mar 4 at 6:00 pm</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Clock className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Check overdue payments</h4>
                    <p className="text-xs text-gray-400">Mar 7 at 6:00 pm</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Briefcase className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Approve new loans</h4>
                    <p className="text-xs text-gray-400">Mar 12 at 6:00 pm</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Finish auditing</h4>
                    <p className="text-xs text-gray-400">Mar 12 at 6:00 pm</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Dark Small Card */}
            <Card className="rounded-[30px] border-none bg-black text-white p-6 relative overflow-hidden mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <h3 className="text-sm font-bold">Lender meeting</h3>
              </div>
              <p className="text-xs text-gray-400 mb-2">Feb 22 at 6:00 PM</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You have been invited to attend a meeting of the Associaton.
              </p>
            </Card>
          </div>
        </div>

      </main>
    </div>
  )
}
