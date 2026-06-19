"use client";

import { PageHeader, Card } from "@/components/dashboard-shell";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";



const REVENUE_DATA = [
  { name: 'Jan', rev: 4000, exp: 2400 },
  { name: 'Feb', rev: 3000, exp: 1398 },
  { name: 'Mar', rev: 2000, exp: 1800 },
  { name: 'Apr', rev: 2780, exp: 1908 },
  { name: 'May', rev: 3890, exp: 2800 },
  { name: 'Jun', rev: 4390, exp: 3800 },
  { name: 'Jul', rev: 5490, exp: 4300 },
  { name: 'Aug', rev: 5000, exp: 4000 },
  { name: 'Sep', rev: 6000, exp: 3800 },
  { name: 'Oct', rev: 7200, exp: 4200 },
  { name: 'Nov', rev: 8000, exp: 5000 },
  { name: 'Dec', rev: 9500, exp: 5500 },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Business Intelligence"
        title="Analytics & Revenue"
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:scale-[1.02] transition">
            Export Report <ArrowUpRight className="h-4 w-4" />
          </button>
        }
      />
      
      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: "₹4.2Cr", delta: "+12.5%", color: "bg-op-purple" },
          { label: "Net Margin", value: "28.4%", delta: "+2.1%", color: "bg-op-pink" },
          { label: "CAC", value: "₹1,240", delta: "-8.4%", color: "bg-op-peach" },
          { label: "LTV", value: "₹38,000", delta: "+14.2%", color: "bg-op-beige" }
        ].map((k) => (
          <div key={k.label} className={`${k.color} rounded-3xl p-6 hover-lift`}>
            <div className="text-sm font-medium opacity-80">{k.label}</div>
            <div className="mt-4 font-display text-4xl">{k.value}</div>
            <div className="mt-2 text-xs font-semibold inline-flex items-center gap-1 opacity-90">
              <TrendingUp className="h-3 w-3" /> {k.delta} vs last year
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[400px] flex flex-col">
            <h3 className="font-semibold mb-6">Revenue vs Expenses (YTD)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="rev" stroke="#7e22ce" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="exp" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="h-[400px] flex flex-col">
          <h3 className="font-semibold mb-6">Customer Acquisition</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Organic', users: 4000 },
                { name: 'Ads', users: 3000 },
                { name: 'Referrals', users: 2000 },
                { name: 'Direct', users: 2780 }
              ]} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="users" fill="#171717" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Page;
