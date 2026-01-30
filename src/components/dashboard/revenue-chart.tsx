"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { useEffect, useState } from "react"

export function RevenueChart({ range = '7' }: { range?: string }) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetch(`/api/stats/chart?days=${range}`, {
            headers: { 'x-user-id': 'test-user-id' }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setData(res.data)
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [range])

    if (loading) return <div className="h-[350px] flex items-center justify-center text-gray-400">Loading chart...</div>

    if (data.length === 0) return <div className="h-[350px] flex items-center justify-center text-gray-400">No data available</div>

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis
                    dataKey="displayDate"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-black text-white text-xs rounded-lg p-3 shadow-xl border border-gray-800">
                                    <p className="font-bold mb-2 text-gray-300">{label}</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                        <p>Lent: <span className="font-bold">₹{payload[0].value?.toLocaleString()}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                        <p>Collected: <span className="font-bold">₹{payload[1].value?.toLocaleString()}</span></p>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="lent"
                    stroke="#000"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "white", stroke: "black", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="collected"
                    stroke="#94a3b8"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
