"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface HistoryChartProps {
    data: {
        date: string;
        score: number;
        fullDate: string;
    }[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
    // We want the chart to be readable, so let's reverse the data since it usually comes in descending order (newest first)
    // Recharts reads left-to-right, so we need oldest-to-newest for a time progression
    const chartData = [...data].reverse();

    if (chartData.length === 0) {
        return null;
    }

    return (
        <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Score Progress</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: -20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[0, 9]}
                        ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                        labelStyle={{ color: "#374151", fontWeight: "bold" }}
                        formatter={(value: any) => [`Band ${value}`, "Score"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={3}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#2563eb" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
