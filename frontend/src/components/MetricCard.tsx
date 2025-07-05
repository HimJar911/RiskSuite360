import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import Sparkline from "./Sparkline";

interface MetricCardProps {
  name: string;
  value: number;
  trend: number[];
  risk: "low" | "moderate" | "high";
  unit?: string;
  benchmark?: number;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "text-green-400 border-green-400/50 bg-green-400/5";
    case "moderate":
      return "text-yellow-400 border-yellow-400/50 bg-yellow-400/5";
    case "high":
      return "text-red-400 border-red-400/50 bg-red-400/5";
    default:
      return "text-gray-400 border-gray-400/50 bg-gray-400/5";
  }
};

const getRiskIndicator = (risk: string) => {
  switch (risk) {
    case "low":
      return { color: "bg-green-400", label: "Low Risk", icon: "✓" };
    case "moderate":
      return { color: "bg-yellow-400", label: "Moderate Risk", icon: "⚠" };
    case "high":
      return { color: "bg-red-400", label: "High Risk", icon: "!" };
    default:
      return { color: "bg-gray-400", label: "Unknown", icon: "?" };
  }
};

const getTrendDirection = (trend: number[]) => {
  if (trend.length < 2) return "neutral";
  const recent = trend[trend.length - 1];
  const previous = trend[trend.length - 2];
  if (recent > previous) return "up";
  if (recent < previous) return "down";
  return "neutral";
};

const formatValue = (value: number, name: string, unit?: string) => {
  const formatted = Math.abs(value) >= 1000 ? 
    (value / 1000).toFixed(1) + "K" : 
    value.toFixed(2);
  
  if (unit) return formatted + unit;
  
  if (name.includes("Ratio") && value > 0) return formatted + "×";
  if (name.includes("Drawdown") || name.includes("VaR") || name.includes("Volatility")) {
    return formatted + "%";
  }
  return formatted;
};

const MetricCard = ({ name, value, trend, risk, unit, benchmark }: MetricCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const riskInfo = getRiskIndicator(risk);
  const trendDirection = getTrendDirection(trend);
  const benchmarkDiff = benchmark ? ((value - benchmark) / Math.abs(benchmark)) * 100 : null;
  
  return (
    <motion.div
      className={`relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10 ${getRiskColor(risk)} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl pointer-events-none" />
      
      {/* Header with sparkline */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
            {name}
          </h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkline data={trend} />
          {trendDirection !== "neutral" && (
            <div className={`text-xs ${
              trendDirection === "up" ? "text-green-400" : "text-red-400"
            }`}>
              {trendDirection === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main value display */}
      <div className="mb-4 relative z-10">
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
          {formatValue(value, name, unit)}
        </div>
        
        {/* Benchmark comparison */}
        {benchmark && benchmarkDiff !== null && (
          <div className={`text-xs font-medium ${
            benchmarkDiff >= 0 ? "text-green-400" : "text-red-400"
          }`}>
            {benchmarkDiff >= 0 ? "+" : ""}{benchmarkDiff.toFixed(1)}% vs benchmark
          </div>
        )}
      </div>

      {/* Risk indicator */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${riskInfo.color} shadow-sm`} />
          <span className="text-xs text-gray-400 font-medium">
            {riskInfo.label}
          </span>
        </div>
        
        {/* Trend percentage */}
        {trend.length >= 2 && (
          <div className="text-xs text-gray-500">
            {(() => {
              const change = ((trend[trend.length - 1] - trend[0]) / Math.abs(trend[0])) * 100;
              return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
            })()}
          </div>
        )}
      </div>

      {/* Detailed tooltip on hover */}
      {isHovered && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white p-3 rounded-lg shadow-xl border border-gray-600 z-50 min-w-48"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs space-y-1">
            <div className="font-semibold text-yellow-400">{name}</div>
            <div>Current: <span className="font-medium">{formatValue(value, name, unit)}</span></div>
            {benchmark && (
              <div>Benchmark: <span className="font-medium">{formatValue(benchmark, name, unit)}</span></div>
            )}
            <div>Risk Level: <span className={`font-medium ${risk === "low" ? "text-green-400" : risk === "moderate" ? "text-yellow-400" : "text-red-400"}`}>{risk}</span></div>
            <div>Trend: {trend.length >= 2 ? (
              (() => {
                const change = trend[trend.length - 1] - trend[trend.length - 2];
                return (
                  <span className={`font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {change >= 0 ? "↗" : "↘"} {Math.abs(change).toFixed(2)}
                  </span>
                );
              })()
            ) : "No data"}</div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </motion.div>
      )}

      {/* Subtle animation on value change */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-white/20 opacity-0"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default MetricCard;