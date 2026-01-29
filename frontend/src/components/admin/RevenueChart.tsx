'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
    data: {
        date: string;
        revenue: number;
        orders: number;
    }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">{label}</p>
                <p className="text-sm font-semibold text-primary-600">
                    Doanh thu: {formatCurrency(payload[0].value)}
                </p>
                <p className="text-sm font-semibold text-accent-600">
                    Đơn hàng: {payload[1]?.value || 0}
                </p>
            </div>
        );
    }
    return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Doanh Thu</h3>
                    <p className="text-sm text-gray-500">7 ngày gần nhất</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        <span className="text-gray-600">Doanh thu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent-500" />
                        <span className="text-gray-600">Đơn hàng</span>
                    </div>
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickFormatter={(value) => 
                                value >= 1000000 
                                    ? `${(value / 1000000).toFixed(0)}M` 
                                    : value >= 1000 
                                        ? `${(value / 1000).toFixed(0)}K` 
                                        : value
                            }
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#ec4899"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOrders)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
