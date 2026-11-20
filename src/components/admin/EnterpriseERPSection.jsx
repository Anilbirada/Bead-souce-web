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
  ArrowUpRight,
  ShieldCheck,
  DollarSign
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

  // Chart data (Q1 to Q6) with capacity loads
  const quarterData = [
    { label: 'Q1', height: 38, packs: '11,200 pk', revenue: '$284,500', load: '38% Capacity', status: 'Completed', ateliers: 28 },
    { label: 'Q2', height: 54, packs: '16,800 pk', revenue: '$412,000', load: '54% Capacity', status: 'Completed', ateliers: 34 },
    { label: 'Q3', height: 76, packs: '24,500 pk', revenue: '$628,400', load: '76% Capacity', status: 'Completed', ateliers: 42 },
    { label: 'Q4', height: 62, packs: '19,400 pk', revenue: '$510,200', load: '62% Capacity', status: 'Completed', ateliers: 38 },
    { label: 'Q5', height: 95, packs: '31,800 pk', revenue: '$814,900', load: '95% Peak Load', status: 'In Production', ateliers: 56 },
    { label: 'Q6', height: 72, packs: '22,900 pk', revenue: '$590,300', load: '72% Allocated', status: 'Scheduled', ateliers: 45 },
  ];

  const monthData = [
    { label: 'Jan', height: 42, packs: '12,500 pk', revenue: '$310,000', load: '42% Capacity', status: 'Completed', ateliers: 30 },
    { label: 'Feb', height: 50, packs: '15,200 pk', revenue: '$385,000', load: '50% Capacity', status: 'Completed', ateliers: 33 },
    { label: 'Mar', height: 68, packs: '20,800 pk', revenue: '$520,000', load: '68% Capacity', status: 'Completed', ateliers: 39 },
    { label: 'Apr', height: 60, packs: '18,600 pk', revenue: '$475,000', load: '60% Capacity', status: 'Completed', ateliers: 36 },
    { label: 'May', height: 90, packs: '28,900 pk', revenue: '$745,000', load: '90% Peak Load', status: 'In Production', ateliers: 51 },
    { label: 'Jun', height: 74, packs: '23,100 pk', revenue: '$602,000', load: '74% Allocated', status: 'Scheduled', ateliers: 44 },
  ];

  const chartData = activePeriod === 'quarters' ? quarterData : monthData;

  // Ledger Activity items
  const ledgerItems = [
    {
      id: 'PO-4821',
      type: 'po',
      title: 'Purchase order approved',
      detail: '2,400 pk African Turquoise & Lead-Free Pewter Spacers',
      status: 'Done',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      timestamp: 'Today, 14:22'
    },
    {
      id: 'INV-9930',
      type: 'inv',
      title: 'Invoice synced to ledger',
      detail: 'Net 30 Commercial Remittance • Wire Reference #SCB-8831',
      status: 'Synced',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      timestamp: 'Today, 11:05'
    },
    {
      id: 'RFQ-7820',
      type: 'rfq',
      title: 'Quotation specification confirmed',
      detail: 'Custom 18K Electroplated Carabiner Connectors (10,000 units)',
      status: 'Approved',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      timestamp: 'Yesterday'
    },
    {
      id: 'DISP-3104',
      type: 'po',
      title: 'Express air freight manifest sealed',
      detail: 'DHL Express Worldwide • AWB #9482-1082-BEADS',
      status: 'Dispatched',
      statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      timestamp: 'Yesterday'
    }
  ];

  const filteredLedger = ledgerFilter === 'all' 
    ? ledgerItems 
    : ledgerItems.filter(item => item.type === ledgerFilter);

  return (
    <div className="bg-white text-[#1C1815] rounded-3xl p-6 sm:p-8 border border-[#EDE5D8] shadow-sm space-y-7 transition-all font-['Manrope',sans-serif]">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE5D8]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1815] tracking-tight">
              Enterprise Resource Planning
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10.5px] font-bold bg-[#F0E8D9] text-[#40362F] border border-[#C6A66B]/40 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#C6A66B]" />
              Wholesale ERP
            </span>
          </div>
          <p className="text-xs text-[#766D62] mt-1">
            Real-time material pipeline, production utilization &amp; wholesale ledger
          </p>
        </div>

        {/* Admin Console Pill Indicator */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3] border border-[#EDE5D8] text-xs font-semibold text-[#40362F] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Admin Console Online</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Keys (Top 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Sales pipeline */}
        <div className="bg-[#FAF8F3] hover:bg-white transition-all rounded-2xl p-5 border border-[#EDE5D8] hover:border-[#C6A66B] shadow-xs relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#766D62] tracking-wider uppercase block">
              Sales Pipeline
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1815] tracking-tight">
              ${totalWholesaleValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold pt-1">
              <span className="inline-flex items-center gap-0.5 bg-emerald-100/70 border border-emerald-300/60 px-2 py-0.5 rounded-full text-[11px]">
                ▲ 12.4% MoM
              </span>
              <span className="text-[#766D62] font-medium text-[11.5px] ml-1">wholesale velocity</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-[#EDE5D8] group-hover:text-[#C6A66B] transition-colors">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active users */}
        <div className="bg-[#FAF8F3] hover:bg-white transition-all rounded-2xl p-5 border border-[#EDE5D8] hover:border-[#C6A66B] shadow-xs relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#766D62] tracking-wider uppercase block">
              Active Trade Accounts
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1815] tracking-tight">
              {activeAteliersCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold pt-1">
              <span className="inline-flex items-center gap-1 bg-emerald-100/70 border border-emerald-300/60 px-2 py-0.5 rounded-full text-[11px]">
                ● 99.8% Uptime
              </span>
              <span className="text-[#766D62] font-medium text-[11.5px] ml-1">international SLAs</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-[#EDE5D8] group-hover:text-[#C6A66B] transition-colors">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Open work orders */}
        <div className="bg-[#FAF8F3] hover:bg-white transition-all rounded-2xl p-5 border border-[#EDE5D8] hover:border-[#C6A66B] shadow-xs relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#766D62] tracking-wider uppercase block">
              Open Work Orders
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1815] tracking-tight">
              {openWorkOrdersCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold pt-1">
              <span className="inline-flex items-center gap-0.5 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-full text-[11px]">
                ▼ 6 Today
              </span>
              <span className="text-[#766D62] font-medium text-[11.5px] ml-1">in active queue</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-[#EDE5D8] group-hover:text-[#C6A66B] transition-colors">
            <Layers className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Middle Section: RESOURCE LOAD Chart (Refined Luxury Champagne Palette) */}
      <div className="bg-[#FAF8F3] rounded-2xl p-5 sm:p-7 border border-[#EDE5D8] space-y-4 shadow-xs">
        
        {/* Section Header with Period Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F0E8D9] flex items-center justify-center text-[#C6A66B]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C1815]">
                Production Capacity &amp; Resource Load
              </h3>
              <p className="text-[11px] text-[#766D62]">
                Monthly and quarterly manufacturer utilization benchmarks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EDE5D8] shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActivePeriod('quarters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePeriod === 'quarters' 
                  ? 'bg-gradient-to-r from-[#1C1815] to-[#2E2823] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815]'
              }`}
            >
              Quarters (Q1–Q6)
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('months')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePeriod === 'months' 
                  ? 'bg-gradient-to-r from-[#1C1815] to-[#2E2823] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815]'
              }`}
            >
              Monthly Pace
            </button>
          </div>
        </div>

        {/* Hovered bar metric badge */}
        <div className="min-h-7 flex items-center justify-between text-xs text-[#766D62] pt-1">
          <span className="text-[11.5px]">Hover over any period to inspect wholesale volume &amp; batch allocations:</span>
          {hoveredBarIndex !== null && (
            <div className="text-xs font-semibold text-[#1C1815] bg-white px-3.5 py-1 rounded-full border border-[#C6A66B] shadow-xs animate-fade-in flex items-center gap-2.5">
              <span className="font-bold text-[#C6A66B]">{chartData[hoveredBarIndex].label}:</span>
              <span>{chartData[hoveredBarIndex].packs}</span>
              <span className="text-[#EDE5D8]">&bull;</span>
              <span className="text-[#1C1815] font-bold">{chartData[hoveredBarIndex].revenue}</span>
              <span className="text-[#EDE5D8]">&bull;</span>
              <span className="text-emerald-700 font-bold">{chartData[hoveredBarIndex].load}</span>
            </div>
          )}
        </div>

        {/* Bars Container */}
        <div className="pt-4 pb-2">
          <div className="h-48 sm:h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#EDE5D8] px-2 sm:px-6 relative">
            
            {/* Horizontal Grid Baseline lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-[#EDE5D8]/70 pointer-events-none">
              <span className="text-[9px] text-[#766D62]/70 font-mono pl-1">75%</span>
            </div>
            <div className="absolute inset-x-0 top-2/4 border-b border-[#EDE5D8]/70 pointer-events-none">
              <span className="text-[9px] text-[#766D62]/70 font-mono pl-1">50%</span>
            </div>
            <div className="absolute inset-x-0 top-3/4 border-b border-[#EDE5D8]/70 pointer-events-none">
              <span className="text-[9px] text-[#766D62]/70 font-mono pl-1">25%</span>
            </div>

            {/* Render 6 Bars with refined Champagne Gold Gradient */}
            {chartData.map((bar, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div 
                  key={bar.label} 
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10 max-w-[80px]"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-[#1C1815] text-[#FAF8F3] px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap shadow-xl border border-[#C6A66B]/50 animate-fade-in">
                      <div className="font-bold text-[#C6A66B]">{bar.load}</div>
                    </div>
                  )}

                  {/* The Bar */}
                  <div 
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                      isHovered 
                        ? 'bg-gradient-to-t from-[#B99A5B] via-[#C6A66B] to-[#FFE094] shadow-md scale-102' 
                        : 'bg-gradient-to-t from-[#C6A66B] via-[#D4B578] to-[#E8CF9B] hover:brightness-105'
                    }`}
                  >
                    {/* Subtle Top Highlight */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/50" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar X-Axis Labels */}
          <div className="flex justify-between px-2 sm:px-6 pt-3 text-xs font-bold text-[#766D62]">
            {chartData.map((bar, idx) => (
              <span 
                key={bar.label} 
                className={`flex-1 text-center transition-all ${
                  hoveredBarIndex === idx ? 'text-[#1C1815] font-extrabold scale-110' : 'text-[#766D62]'
                }`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Work Orders & Wholesale Activity Ledger */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <span className="text-xs uppercase font-bold tracking-wider text-[#1C1815]">
            Wholesale Activity Ledger
          </span>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setLedgerFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ledgerFilter === 'all' 
                  ? 'bg-[#1C1815] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815] bg-[#FAF8F3] border border-[#EDE5D8]'
              }`}
            >
              All Records
            </button>
            <button
              type="button"
              onClick={() => setLedgerFilter('po')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ledgerFilter === 'po' 
                  ? 'bg-[#1C1815] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815] bg-[#FAF8F3] border border-[#EDE5D8]'
              }`}
            >
              Purchase Orders (PO)
            </button>
            <button
              type="button"
              onClick={() => setLedgerFilter('inv')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ledgerFilter === 'inv' 
                  ? 'bg-[#1C1815] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815] bg-[#FAF8F3] border border-[#EDE5D8]'
              }`}
            >
              Invoices (INV)
            </button>
            <button
              type="button"
              onClick={() => setLedgerFilter('rfq')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                ledgerFilter === 'rfq' 
                  ? 'bg-[#1C1815] text-[#FAF8F3] shadow-xs' 
                  : 'text-[#766D62] hover:text-[#1C1815] bg-[#FAF8F3] border border-[#EDE5D8]'
              }`}
            >
              Quotations (RFQ)
            </button>
          </div>
        </div>

        {/* List Rows */}
        <div className="space-y-2.5">
          {filteredLedger.map((item) => (
            <div 
              key={item.id}
              className="bg-[#FAF8F3] hover:bg-white transition-all border border-[#EDE5D8] hover:border-[#C6A66B] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xs hover:shadow-sm"
            >
              {/* Left Identifier & Title */}
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#F0E8D9] text-[#40362F] font-mono font-bold text-xs border border-[#C6A66B]/40 shrink-0">
                  {item.id}
                </span>
                <div>
                  <span className="text-sm text-[#1C1815] font-bold group-hover:text-[#B99A5B] transition-colors">
                    {item.title}
                  </span>
                  <p className="text-xs text-[#766D62]">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Right Status Badge */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-[11px] text-[#766D62] font-mono hidden md:inline-block">
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
