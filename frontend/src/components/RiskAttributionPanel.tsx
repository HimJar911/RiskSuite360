import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, AlertTriangle, Target } from "lucide-react";

const assetData = [
  { label: "AAPL", contribution: 18.2, allocation: 22.5, excessRisk: -4.3, volatility: 24.5 },
  { label: "MSFT", contribution: 15.8, allocation: 19.3, excessRisk: -3.5, volatility: 22.1 },
  { label: "GOOGL", contribution: 14.1, allocation: 17.0, excessRisk: -2.9, volatility: 26.8 },
  { label: "NVDA", contribution: 22.3, allocation: 15.2, excessRisk: 7.1, volatility: 42.3 },
  { label: "TLT", contribution: 8.9, allocation: 13.0, excessRisk: -4.1, volatility: 18.2 },
  { label: "GLD", contribution: 5.2, allocation: 13.0, excessRisk: -7.8, volatility: 16.5 },
];

const factorData = [
  { label: "Market Beta", contribution: 42.3, exposure: 0.91, significance: "High" },
  { label: "Size Factor", contribution: 18.5, exposure: 0.24, significance: "Moderate" },
  { label: "Momentum", contribution: 15.2, exposure: 0.18, significance: "Moderate" },
  { label: "Value Factor", contribution: 11.4, exposure: -0.12, significance: "Low" },
  { label: "Volatility", contribution: 9.7, exposure: 0.08, significance: "Low" },
  { label: "Quality", contribution: 2.9, exposure: 0.05, significance: "Minimal" },
];

const sectorData = [
  { label: "Technology", contribution: 68.4, count: 4 },
  { label: "Bonds", contribution: 8.9, count: 1 },
  { label: "Commodities", contribution: 5.2, count: 1 },
  { label: "Communication", contribution: 14.1, count: 1 },
];

const getBarColor = (val: number, type: "risk" | "factor" = "risk") => {
  if (type === "factor") {
    if (val > 35) return "#ef4444"; // red for high factor exposure
    if (val > 20) return "#f59e0b"; // amber for moderate
    if (val > 10) return "#eab308"; // yellow for low-moderate
    return "#22c55e"; // green for low
  }
  
  if (val > 20) return "#ef4444"; // red for high risk
  if (val > 15) return "#f59e0b"; // amber for moderate-high
  if (val > 10) return "#eab308"; // yellow for moderate
  return "#22c55e"; // green for low risk
};

const getRiskLevel = (contribution: number, allocation: number) => {
  const ratio = contribution / allocation;
  if (ratio > 1.3) return { level: "High", color: "text-red-400" };
  if (ratio > 1.1) return { level: "Elevated", color: "text-yellow-400" };
  if (ratio < 0.8) return { level: "Low", color: "text-green-400" };
  return { level: "Normal", color: "text-blue-400" };
};

const RiskAttributionPanel = () => {
  const [view, setView] = useState<"asset" | "factor" | "sector">("asset");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  
  const getCurrentData = () => {
    switch (view) {
      case "asset": return assetData;
      case "factor": return factorData;
      case "sector": return sectorData;
      default: return assetData;
    }
  };

  const data = getCurrentData();
  const totalRisk = data.reduce((sum, item) => sum + item.contribution, 0);
  const maxContributor = data.reduce((max, item) => item.contribution > max.contribution ? item : max);
  const diversificationRatio = data.length / Math.sqrt(data.reduce((sum, item) => sum + Math.pow(item.contribution, 2), 0) / 100);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 space-y-6">
      {/* Header with Controls and Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-white">Risk Attribution</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Total Risk: {totalRisk.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            {["asset", "factor", "sector"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  view === viewType
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded transition-all ${
                chartType === "bar"
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`p-2 rounded transition-all ${
                chartType === "pie"
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <PieIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">Largest Contributor</span>
          </div>
          <div className="text-white font-bold text-lg">{maxContributor.label}</div>
          <div className="text-red-400 text-sm">{maxContributor.contribution.toFixed(1)}% risk</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">Diversification</span>
          </div>
          <div className="text-white font-bold text-lg">{diversificationRatio.toFixed(2)}</div>
          <div className="text-blue-400 text-sm">Effective positions</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-xs uppercase tracking-wide">Concentration</span>
          </div>
          <div className="text-white font-bold text-lg">
            {data.slice(0, 3).reduce((sum, item) => sum + item.contribution, 0).toFixed(1)}%
          </div>
          <div className="text-yellow-400 text-sm">Top 3 holdings</div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="h-80 bg-gradient-to-br from-gray-800/15 via-gray-900/10 to-gray-800/15 rounded-xl p-6 border border-gray-700/30 shadow-inner">
        {chartType === "bar" ? (
          // Professional Bar Chart with subtle sophistication
          <div className="w-full h-full">
            <div className="text-gray-400 text-xs mb-6 text-center font-medium tracking-widest uppercase opacity-75">
              {view === "asset" ? "Risk Contribution by Asset" : 
               view === "factor" ? "Risk Contribution by Factor" : "Risk Contribution by Sector"}
            </div>
            <div className="space-y-4 h-64 overflow-y-auto">
              {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className="w-20 text-yellow-400 text-xs font-semibold text-right transition-colors group-hover:text-yellow-300">
                    {item.label}
                  </div>
                  <div className="flex-1 bg-gray-700/25 h-3 rounded-full overflow-hidden relative shadow-inner">
                    {/* Subtle gradient bar with glow effect */}
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: `${(item.contribution / Math.max(...data.map(d => d.contribution))) * 100}%`,
                        background: `linear-gradient(90deg, ${getBarColor(item.contribution, view === "factor" ? "factor" : "risk")}, ${getBarColor(item.contribution, view === "factor" ? "factor" : "risk")}dd)`,
                        boxShadow: `0 0 8px ${getBarColor(item.contribution, view === "factor" ? "factor" : "risk")}40`
                      }}
                    >
                      {/* Subtle shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-gray-300 text-xs font-semibold group-hover:text-white transition-colors">
                      {item.contribution.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Sophisticated Donut Chart with professional flair
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative flex items-center">
              {/* Enhanced donut chart with subtle glow */}
              <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90 drop-shadow-lg">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="rgba(55, 65, 81, 0.2)"
                    strokeWidth="14"
                  />
                  {/* Subtle outer glow ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.1)"
                    strokeWidth="16"
                  />
                  {(() => {
                    const total = data.reduce((sum, d) => sum + d.contribution, 0);
                    let currentAngle = 0;
                    
                    return data.map((item, index) => {
                      const percentage = item.contribution / total;
                      const angle = percentage * 360;
                      const strokeDasharray = `${(angle / 360) * (2 * Math.PI * 75)} ${2 * Math.PI * 75}`;
                      const strokeDashoffset = -currentAngle * (2 * Math.PI * 75) / 360;
                      
                      currentAngle += angle;
                      
                      return (
                        <circle
                          key={index}
                          cx="100"
                          cy="100"
                          r="75"
                          fill="none"
                          stroke={`url(#gradient-${index})`}
                          strokeWidth="14"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-sm"
                          style={{
                            filter: `drop-shadow(0 0 4px ${getBarColor(item.contribution, view === "factor" ? "factor" : "risk")}40)`
                          }}
                        />
                      );
                    });
                  })()}
                  
                  {/* Gradient definitions */}
                  <defs>
                    {data.map((item, index) => {
                      const baseColor = getBarColor(item.contribution, view === "factor" ? "factor" : "risk");
                      return (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={baseColor} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={baseColor} stopOpacity="0.7" />
                        </linearGradient>
                      );
                    })}
                  </defs>
                </svg>
                
                {/* Center content with subtle animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">Risk</div>
                    <div className="text-xs text-gray-400 tracking-wide">Attribution</div>
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mt-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Refined legend with better hierarchy */}
              <div className="ml-10 space-y-3">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-xs group hover:bg-gray-800/20 rounded px-2 py-1 transition-colors">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ 
                        backgroundColor: getBarColor(item.contribution, view === "factor" ? "factor" : "risk"),
                        boxShadow: `0 0 6px ${getBarColor(item.contribution, view === "factor" ? "factor" : "risk")}30`
                      }}
                    />
                    <span className="text-gray-400 w-20 font-medium group-hover:text-gray-300 transition-colors">{item.label}</span>
                    <span className="text-gray-300 font-semibold group-hover:text-white transition-colors">{item.contribution.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Risk Metrics Table */}
      {view === "asset" && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Risk Decomposition</h4>
          <div className="space-y-2">
            {assetData.map((asset, index) => {
              const riskLevel = getRiskLevel(asset.contribution, asset.allocation);
              return (
                <div key={index} className="grid grid-cols-6 gap-4 items-center bg-gray-800/20 px-4 py-2 rounded border border-gray-700/20">
                  <div className="text-yellow-400 font-medium">{asset.label}</div>
                  <div className="text-center">
                    <div className="text-white text-sm">{asset.allocation.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm">{asset.contribution.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Risk</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${asset.excessRisk > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {asset.excessRisk > 0 ? '+' : ''}{asset.excessRisk.toFixed(1)}%
                    </div>
                    <div className="text-gray-400 text-xs">Excess</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm">{asset.volatility.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Volatility</div>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-700/50 ${riskLevel.color}`}>
                      {riskLevel.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Factor Exposure Details */}
      {view === "factor" && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Factor Exposures</h4>
          <div className="grid grid-cols-2 gap-4">
            {factorData.map((factor, index) => (
              <div key={index} className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-400 font-medium text-sm">{factor.label}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    factor.significance === 'High' ? 'bg-red-500/20 text-red-400' :
                    factor.significance === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    factor.significance === 'Low' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {factor.significance}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{factor.contribution.toFixed(1)}%</div>
                    <div className="text-gray-400 text-xs">Risk Contribution</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${factor.exposure > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {factor.exposure.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-xs">Exposure</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAttributionPanel;