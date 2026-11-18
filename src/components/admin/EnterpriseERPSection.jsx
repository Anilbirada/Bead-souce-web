import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Layers, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function EnterpriseERPSection({ stats, orders = [], quotes = [], onNavigateTab }) {
  const [activePeriod, setActivePeriod] = useState('quarters'); // 'quarters' | 'months'
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [ledgerFilter, setLedgerFilter] = useState('all'); // 'all' | 'po' | 'inv' | 'rfq'

  // Dynamic calculations combining real store stats with enterprise wholesale projections
  const totalWholesaleValue = stats?.totalRevenue 
    ? (stats.totalRevenue > 50000 ? stats.totalRevenue : 1248390) 
    : 1248390;

  const activeAteliersCount = (stats?.usersCount && stats.usersCount > 50) 
    ? stats.usersCount 
    : 1490;

  const openWorkOrdersCount = (stats?.pendingQuotes || stats?.pendingOrders) 
    ? ((stats.pendingQuotes || 0) + (stats.pendingOrders || 0) + 300) 
    : 312;

  // Chart data mirroring the exact visual cadence in the reference image (Q1 to Q6)
  const quarterData = [
    { label: 'Q1', height: 35, packs: '11,200 pk', revenue: '$284,500', load: '35% Capacity', status: 'Completed', ateliers: 28 },
    { label: 'Q2', height: 52, packs: '16,800 pk', revenue: '$412,000', load: '52% Capacity', status: 'Completed', ateliers: 34 },
    { label: 'Q3', height: 75, packs: '24,500 pk', revenue: '$628,400', load: '75% Capacity', status: 'Completed', ateliers: 42 },
    { label: 'Q4', height: 62, packs: '19,400 pk', revenue: '$510,200', load: '62% Capacity', status: 'Completed', ateliers: 38 },
    { label: 'Q5', height: 94, packs: '31,800 pk', revenue: '$814,900', load: '94% Peak Load', status: 'In Production', ateliers: 56 },
    { label: 'Q6', height: 70, packs: '22,900 pk', revenue: '$590,300', load: '70% Allocated', status: 'Scheduled', ateliers: 45 },
  ];

  const monthData = [
    { label: 'Jan', height: 40, packs: '12,500 pk', revenue: '$310,000', load: '40% Capacity', status: 'Completed', ateliers: 30 },
    { label: 'Feb', height: 48, packs: '15,200 pk', revenue: '$385,000', load: '48% Capacity', status: 'Completed', ateliers: 33 },
    { label: 'Mar', height: 65, packs: '20,800 pk', revenue: '$520,000', load: '65% Capacity', status: 'Completed', ateliers: 39 },
    { label: 'Apr', height: 58, packs: '18,600 pk', revenue: '$475,000', load: '58% Capacity', status: 'Completed', ateliers: 36 },
    { label: 'May', height: 88, packs: '28,900 pk', revenue: '$745,000', load: '88% Peak Load', status: 'In Production', ateliers: 51 },
    { label: 'Jun', height: 72, packs: '23,100 pk', revenue: '$602,000', load: '72% Allocated', status: 'Scheduled', ateliers: 44 },
  ];

  const chartData = activePeriod === 'quarters' ? quarterData : monthData;

  // Ledger Activity items matching the user's reference mockup
  const ledgerItems = [
    {
      id: 'PO-4821',
      type: 'po',
      title: 'Purchase order approved',
      detail: '2,400 pk African Turquoise & Lead-Free Pewter Spacers',
      status: 'Done',
      statusColor: 'bg-[#0d2818] text-[#34d399] border-[#166534]',
      timestamp: 'Today, 14:22'
    },
    {
      id: 'INV-9930',
      type: 'inv',
      title: 'Invoice synced to ledger',
      detail: 'Net 30 Commercial Remittance • Wire Reference #SCB-8831',
      status: 'Synced',
      statusColor: 'bg-[#0c2340] text-[#60a5fa] border-[#1e40af]',
      timestamp: 'Today, 11:05'
    },
    {
      id: 'RFQ-7820',
      type: 'rfq',
      title: 'Quotation specification confirmed',
      detail: 'Custom 18K Electroplated Carabiner Connectors (10,000 units)',
      status: 'Approved',
      statusColor: 'bg-[#291b0c] text-[#fbbf24] border-[#92400e]',
      timestamp: 'Yesterday'
    },
    {
      id: 'DISP-3104',
      type: 'po',
      title: 'Express air freight manifest sealed',
      detail: 'DHL Express Worldwide • AWB #9482-1082-BEADS',
      status: 'Dispatched',
      statusColor: 'bg-[#24123a] text-[#c084fc] border-[#6b21a8]',
      timestamp: 'Yesterday'
    }
  ];

  const filteredLedger = ledgerFilter === 'all' 
    ? ledgerItems 
    : ledgerItems.filter(item => item.type === ledgerFilter);

  return (
    <div className="bg-[#0b1324] text-white rounded-3xl p-6 sm:p-8 border border-[#1e293b] shadow-2xl space-y-7 transition-all">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1e293b]/70">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Enterprise Resource Planning
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
              Wholesale ERP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time material pipeline, production utilization &amp; wholesale ledger
          </p>
        </div>

        {/* Admin Console Pill Indicator */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131d33] border border-[#223354] text-xs font-medium text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-200">Admin console</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Keys (Top 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Sales pipeline */}
        <div className="bg-[#121c30] hover:bg-[#16233d] transition-all rounded-2xl p-5 border border-[#1e2d4a] relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Sales pipeline
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#fbbf24] tracking-tight font-mono">
              ${totalWholesaleValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <span className="inline-block text-[11px]">▲</span>
              <span>12.4% MoM</span>
              <span className="text-slate-500 font-normal ml-1">wholesale velocity</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-slate-700 group-hover:text-amber-500/30 transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active users */}
        <div className="bg-[#121c30] hover:bg-[#16233d] transition-all rounded-2xl p-5 border border-[#1e2d4a] relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Active users
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#fbbf24] tracking-tight font-mono">
              {activeAteliersCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <span>99.8% uptime</span>
              <span className="text-slate-500 font-normal ml-1">&bull; international SLAs</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-slate-700 group-hover:text-blue-500/30 transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Open work orders */}
        <div className="bg-[#121c30] hover:bg-[#16233d] transition-all rounded-2xl p-5 border border-[#1e2d4a] relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400 tracking-wide block">
              Open work orders
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#fbbf24] tracking-tight font-mono">
              {openWorkOrdersCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-1">
              <span className="inline-block text-[11px]">▼</span>
              <span>6 today</span>
              <span className="text-slate-500 font-normal ml-1">&bull; active queue</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-slate-700 group-hover:text-amber-500/30 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Middle Section: RESOURCE LOAD Chart */}
      <div className="bg-[#10192b] rounded-2xl p-5 sm:p-6 border border-[#1d2b45] space-y-4">
        
        {/* Section Header with Period Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Resource Load
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#0b1324] p-1 rounded-xl border border-[#1e2d4a]">
            <button
              onClick={() => setActivePeriod('quarters')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePeriod === 'quarters' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quarters (Q1–Q6)
            </button>
            <button
              onClick={() => setActivePeriod('months')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePeriod === 'months' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Pace
            </button>
          </div>
        </div>

        {/* Hovered bar metric badge */}
        <div className="min-h-6 flex items-center justify-between text-xs text-slate-400">
          <span>Production and atelier volume allocation across periods</span>
          {hoveredBarIndex !== null && (
            <div className="text-xs font-medium text-blue-300 bg-blue-950/80 px-3 py-0.5 rounded-full border border-blue-800/80 animate-fade-in flex items-center gap-2">
              <span className="font-bold text-white">{chartData[hoveredBarIndex].label}:</span>
              <span>{chartData[hoveredBarIndex].packs}</span>
              <span>&bull;</span>
              <span className="text-[#fbbf24] font-semibold">{chartData[hoveredBarIndex].revenue}</span>
              <span>&bull;</span>
              <span className="text-emerald-400">{chartData[hoveredBarIndex].load}</span>
            </div>
          )}
        </div>

        {/* Bars Container */}
        <div className="pt-4 pb-2">
          <div className="h-48 sm:h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#1f2d47] px-2 sm:px-6 relative">
            
            {/* Horizontal Grid Baseline lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-[#1e2a42]/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-b border-[#1e2a42]/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-3/4 border-b border-[#1e2a42]/40 pointer-events-none" />

            {/* Render 6 Bars */}
            {chartData.map((bar, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div 
                  key={bar.label} 
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-[#16233d] border border-blue-500/50 text-white px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap shadow-xl">
                      <div className="font-bold text-[#fbbf24]">{bar.load}</div>
                    </div>
                  )}

                  {/* The Bar */}
                  <div 
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                      isHovered 
                        ? 'bg-gradient-to-t from-[#2563eb] via-[#3b82f6] to-[#93c5fd] shadow-[0_0_20px_rgba(59,130,246,0.6)]' 
                        : 'bg-gradient-to-t from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]'
                    }`}
                  >
                    {/* Subtle Top Highlight */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar X-Axis Labels */}
          <div className="flex justify-between px-2 sm:px-6 pt-3 text-xs font-semibold text-slate-400">
            {chartData.map((bar, idx) => (
              <span 
                key={bar.label} 
                className={`flex-1 text-center transition-colors ${
                  hoveredBarIndex === idx ? 'text-blue-300 font-bold scale-110' : 'text-slate-400'
                }`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Work Orders & Ledger Activities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Wholesale Activity Ledger
          </span>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setLedgerFilter('all')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                ledgerFilter === 'all' ? 'bg-[#1e2d4a] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setLedgerFilter('po')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                ledgerFilter === 'po' ? 'bg-[#1e2d4a] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Orders (PO)
            </button>
            <button
              onClick={() => setLedgerFilter('inv')}
              className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                ledgerFilter === 'inv' ? 'bg-[#1e2d4a] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Invoices (INV)
            </button>
          </div>
        </div>

        {/* List Rows */}
        <div className="space-y-2.5">
          {filteredLedger.map((item) => (
            <div 
              key={item.id}
              className="bg-[#121c30] hover:bg-[#16233d] transition-all border border-[#1e2d4a] hover:border-blue-500/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Identifier & Title */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#241c0e] text-[#fbbf24] font-mono font-bold text-xs border border-[#5c4418] shrink-0">
                  {item.id}
                </span>
                <div>
                  <span className="text-sm text-slate-100 font-semibold group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </span>
                  <p className="text-xs text-slate-400">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Right Status Badge */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
                  {item.timestamp}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
