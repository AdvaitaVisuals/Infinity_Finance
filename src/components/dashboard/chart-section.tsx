"use client"

import { useState } from "react"
import { RevenueChart } from "./revenue-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export function DashboardChartSection() {
    const [range, setRange] = useState("7")

    return (
        <Card className="rounded-[24px] border-none shadow-sm bg-white p-6 col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Stats</h3>
                <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="w-[180px] border-none bg-slate-50 rounded-full h-8 text-xs font-medium text-gray-500 focus:ring-0">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="14">Last 2 weeks</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <RevenueChart range={range} />
        </Card>
    )
}
