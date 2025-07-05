import React, { useState, useEffect } from "react";
import Header from "./Header";
import MetricCard from "./MetricCard";
import DonutChart from "./DonutChart";
import RiskPulse from "./RiskPulse";
import RegimeCard from "./RegimeCard";
import SuggestedHedgeCard from "./SuggestedHedgeCard";
import StressTestSimulator from "./StressTestSimulator";
import CorrelationMatrix from "./CorrelationMatrix";
import PortfolioHoldings from "./PortfolioHoldings";
import RiskAttributionPanel from "./RiskAttributionPanel";

// Dummy metric data
const mockMetrics = [
  { name: "Sharpe Ratio", value: 1.24, trend: [1.1, 1.15, 1.2, 1.24], risk: "low" },
  { name: "Max Drawdown", value: -12.5, trend: [-15, -14, -13, -12.5], risk: "moderate" },
  { name: "Value at Risk", value: -2.8, trend: [-3.2, -3.0, -2.9, -2.8], risk: "low" },
  { name: "Conditional VaR", value: -4.2, trend: [-4.8, -4.5, -4.3, -4.2], risk: "moderate" },
  { name: "Sortino Ratio", value: 1.68, trend: [1.5, 1.58, 1.62, 1.68], risk: "low" },
  { name: "Calmar Ratio", value: 0.89, trend: [0.82, 0.85, 0.87, 0.89], risk: "low" },
  { name: "Volatility", value: 18.3, trend: [20.1, 19.5, 18.8, 18.3], risk: "moderate" },
  { name: "Skewness", value: -0.35, trend: [-0.4, -0.38, -0.36, -0.35], risk: "moderate" },
  { name: "Kurtosis", value: 3.2, trend: [3.8, 3.5, 3.3, 3.2], risk: "moderate" },
  { name: "Beta", value: 1.12, trend: [1.05, 1.08, 1.1, 1.12], risk: "moderate" }, // ✅ NEW
];

// Format how long ago regime changed
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ago`;
  if (m > 0) return `${m}m ${s}s ago`;
  return `${s}s ago`;
};

const RiskSuite360 = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [regime, setRegime] = useState("Bearish");
  const [showReportModal, setShowReportModal] = useState(false);
  const [defenseScore, setDefenseScore] = useState(0);
  const [riskPulse, setRiskPulse] = useState(0);
  const [regimeChangeTime, setRegimeChangeTime] = useState(0);

  // Clock + animations
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
      setRegimeChangeTime((prev) => prev + 1);
    }, 1000);

    const pulse = setInterval(() => {
      setRiskPulse((prev) => (prev + 1) % 100);
    }, 100);

    const defense = setInterval(() => {
      setDefenseScore((prev) => (prev < 78 ? prev + 1 : 78));
    }, 50);

    return () => {
      clearInterval(clock);
      clearInterval(pulse);
      clearInterval(defense);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header
        regime={regime}
        currentTime={currentTime.toLocaleTimeString()}
        onRefresh={() => window.location.reload()}
        onReportClick={() => setShowReportModal(true)}
        onSettingsClick={() => alert("Settings clicked")}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {mockMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              name={metric.name}
              value={metric.value}
              trend={metric.trend}
              risk={metric.risk}
            />
          ))}
        </section>

        {/* Visual Risk Panel */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Defense Score</h3>
            <DonutChart value={defenseScore} max={100} label="/ 100" />
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Risk Pulse</h3>
            <RiskPulse intensity={riskPulse} />
          </div>

          <RegimeCard regime={regime} timeAgo={formatTime(regimeChangeTime)} />
          <SuggestedHedgeCard regime={regime} defenseScore={defenseScore} />
        </section>
        {/* Stress Test Simulator */}
        <section className="mt-8">
          <StressTestSimulator />
        </section>
        {/* Correlation Matrix */}
        <section className="mt-8">
          <CorrelationMatrix />
          <PortfolioHoldings />
          <RiskAttributionPanel />
        </section>
      </main>
    </div>
  );
};

export default RiskSuite360;
