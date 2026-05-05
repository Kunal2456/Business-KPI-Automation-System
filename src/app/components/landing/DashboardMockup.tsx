import { motion } from 'motion/react';

export function DashboardMockup() {
  const barHeights = [45, 65, 52, 78, 40, 85, 62, 70, 55, 80, 68, 75, 60, 88];

  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(10,14,26,0.12)] overflow-hidden border border-gray-200">
      {/* Top Bar */}
      <div className="bg-[#0A0E1A] px-5 py-3.5 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-md text-[11px] text-white/50 font-mono">
          app.shelfiq.in/dashboard
        </div>
        <div className="text-[11px] text-white/30">All Stores ▾</div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          <KPICard label="Revenue" value="₹8.4L" change="+23%" up />
          <KPICard label="Profit" value="₹1.9L" change="+18%" up />
          <KPICard label="Avg Order" value="₹847" change="-2%" up={false} />
        </div>

        {/* Chart */}
        <div className="bg-[#FAFBFF] border border-[#E8EBF4] rounded-xl p-3.5 mb-3.5">
          <div className="text-[11px] text-[#5A6478] font-semibold mb-2.5">
            Sales Trend — Last 14 Days
          </div>
          <div className="flex items-end gap-1 h-[60px]">
            {barHeights.map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="bg-gradient-to-r from-red-50 to-red-25 border border-red-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
            🔴
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-900 mb-0.5">
              Low Stock Alert — 3 Products
            </div>
            <div className="text-[11px] text-red-600">
              Britannia NutriChoice: Only 8 units left (reorder at 50)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="bg-[#FAFBFF] border border-[#E8EBF4] rounded-lg p-3">
      <div className="text-[10px] text-[#8A93A8] font-medium mb-1">{label}</div>
      <div className="text-xl font-extrabold text-[#0A0E1A] tracking-tight">{value}</div>
      <div className={`text-[11px] font-semibold mt-0.5 ${up ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </div>
    </div>
  );
}