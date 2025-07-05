import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import TimeSeriesChart from "./TimeSeriesChart";
import LoadingSkeleton from "./LoadingSkeleton";
import { TrendingUp, AlertTriangle, Target, DollarSign } from "lucide-react";
import FactorExposures from "./FactorExposures";

// Enhanced metric data with institutional-grade completeness
const mockMetrics = [
  {
    name: "Sharpe Ratio",
    value: 1.24,
    trend: [1.1, 1.15, 1.2, 1.24],
    risk: "low",
    unit: "×",
    benchmark: 1.0,
  },
  {
    name: "Max Drawdown",
    value: -12.5,
    trend: [-15, -14, -13, -12.5],
    risk: "moderate",
    unit: "%",
    benchmark: -15.0,
  },
  {
    name: "Value at Risk",
    value: -2.8,
    trend: [-3.2, -3.0, -2.9, -2.8],
    risk: "low",
    unit: "%",
    benchmark: -3.5,
  },
  {
    name: "Conditional VaR",
    value: -4.2,
    trend: [-4.8, -4.5, -4.3, -4.2],
    risk: "moderate",
    unit: "%",
    benchmark: -5.0,
  },
  {
    name: "Sortino Ratio",
    value: 1.68,
    trend: [1.5, 1.58, 1.62, 1.68],
    risk: "low",
    unit: "×",
    benchmark: 1.2,
  },
  {
    name: "Calmar Ratio",
    value: 0.89,
    trend: [0.82, 0.85, 0.87, 0.89],
    risk: "low",
    unit: "×",
    benchmark: 0.8,
  },
  {
    name: "Volatility",
    value: 18.3,
    trend: [20.1, 19.5, 18.8, 18.3],
    risk: "moderate",
    unit: "%",
    benchmark: 20.0,
  },
  {
    name: "Skewness",
    value: -0.35,
    trend: [-0.4, -0.38, -0.36, -0.35],
    risk: "moderate",
    unit: "",
    benchmark: 0.0,
  },
  {
    name: "Kurtosis",
    value: 3.2,
    trend: [3.8, 3.5, 3.3, 3.2],
    risk: "moderate",
    unit: "",
    benchmark: 3.0,
  },
  {
    name: "Beta",
    value: 1.12,
    trend: [1.05, 1.08, 1.1, 1.12],
    risk: "moderate",
    unit: "×",
    benchmark: 1.0,
  },
];

// Mock time series data for the main chart
const mockTimeSeriesData = [
  {
    date: "2024-01",
    portfolioValue: 1000000,
    benchmark: 1000000,
    sharpe: 1.1,
    var: -3.2,
    drawdown: -15,
    regime: "Bear",
  },
  {
    date: "2024-02",
    portfolioValue: 1025000,
    benchmark: 1015000,
    sharpe: 1.15,
    var: -3.0,
    drawdown: -14,
    regime: "Bear",
  },
  {
    date: "2024-03",
    portfolioValue: 1042000,
    benchmark: 1028000,
    sharpe: 1.2,
    var: -2.9,
    drawdown: -13,
    regime: "Neutral",
  },
  {
    date: "2024-04",
    portfolioValue: 1058000,
    benchmark: 1035000,
    sharpe: 1.24,
    var: -2.8,
    drawdown: -12.5,
    regime: "Bull",
  },
  {
    date: "2024-05",
    portfolioValue: 1076000,
    benchmark: 1048000,
    sharpe: 1.28,
    var: -2.7,
    drawdown: -12,
    regime: "Bull",
  },
  {
    date: "2024-06",
    portfolioValue: 1095000,
    benchmark: 1062000,
    sharpe: 1.32,
    var: -2.6,
    drawdown: -11.5,
    regime: "Bull",
  },
];

// Format time utility
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ago`;
  if (m > 0) return `${m}m ${s}s ago`;
  return `${s}s ago`;
};

// Animation variants for smooth page loading
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const RiskSuite360 = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [regime, setRegime] = useState("Bearish");
  const [showReportModal, setShowReportModal] = useState(false);
  const [defenseScore, setDefenseScore] = useState(0);
  const [riskPulse, setRiskPulse] = useState(0);
  const [regimeChangeTime, setRegimeChangeTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("6M");

  // Enhanced effects with loading simulation
  useEffect(() => {
    // Simulate initial data loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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
      clearTimeout(loadingTimer);
      clearInterval(clock);
      clearInterval(pulse);
      clearInterval(defense);
    };
  }, []);

  // Calculate portfolio summary metrics
  const portfolioValue = mockTimeSeriesData[mockTimeSeriesData.length - 1]?.portfolioValue || 0;
  const portfolioReturn = (portfolioValue / 1000000 - 1) * 100;
  const outperformance =
    portfolioReturn -
    ((mockTimeSeriesData[mockTimeSeriesData.length - 1]?.benchmark || 1000000) / 1000000 - 1) * 100;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header
        regime={regime}
        currentTime={currentTime.toLocaleTimeString()}
        onRefresh={() => window.location.reload()}
        onReportClick={() => setShowReportModal(true)}
        onSettingsClick={() => alert("Settings clicked")}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 lg:px-8 lg:py-10 space-y-10">
        {/* Executive Summary Banner */}
        <motion.section
          className="bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 shadow-2xl"
          variants={sectionVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Portfolio Value
                </span>
              </div>
              <div className="text-3xl font-bold text-white">
                ${portfolioValue.toLocaleString()}
              </div>
              <div
                className={`text-sm font-medium ${portfolioReturn >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {portfolioReturn >= 0 ? "+" : ""}
                {portfolioReturn.toFixed(2)}% Total Return
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Outperformance
                </span>
              </div>
              <div
                className={`text-3xl font-bold ${outperformance >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {outperformance >= 0 ? "+" : ""}
                {outperformance.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">vs Benchmark</div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Risk-Adj Return
                </span>
              </div>
              <div className="text-3xl font-bold text-white">1.24×</div>
              <div className="text-sm text-green-400">Sharpe Ratio</div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Max Risk
                </span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">-12.5%</div>
              <div className="text-sm text-gray-400">Max Drawdown</div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Metrics Grid */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Risk Metrics Dashboard</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data • Updated {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <MetricCard
                  name={metric.name}
                  value={metric.value}
                  trend={metric.trend}
                  risk={metric.risk}
                  unit={metric.unit}
                  benchmark={metric.benchmark}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Portfolio Performance Chart */}
        <motion.section variants={sectionVariants}>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Portfolio Performance</h2>
              <div className="flex items-center space-x-2">
                {["1M", "3M", "6M", "1Y", "YTD"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      selectedTimeRange === range
                        ? "bg-yellow-400 text-black"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <TimeSeriesChart data={mockTimeSeriesData} />
          </div>
        </motion.section>

        {/* Visual Risk Panel */}
        <motion.section variants={sectionVariants}>
          <h2 className="text-2xl font-bold text-white mb-6">Risk Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:scale-105 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Defense Score</span>
              </h3>
              <DonutChart value={defenseScore} max={100} label="/ 100" />
            </motion.div>

            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:scale-105 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Risk Pulse</span>
              </h3>
              <RiskPulse intensity={riskPulse} />
            </motion.div>

            <RegimeCard regime={regime} timeAgo={formatTime(regimeChangeTime)} />
            <SuggestedHedgeCard regime={regime} defenseScore={defenseScore} />
          </div>
        </motion.section>

        {/* Advanced Analytics Section */}
        <motion.section variants={sectionVariants} className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>

          {/* Stress Test Simulator - Full Width */}
          <StressTestSimulator />

          {/* Top Row: Correlation Matrix + Factor Exposures */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3">
              <CorrelationMatrix />
            </div>
            <div className="xl:col-span-2">
              <FactorExposures />
            </div>
          </div>

          {/* Bottom Row: Risk Attribution - Full Width */}
          <RiskAttributionPanel />
        </motion.section>

        {/* Portfolio Holdings */}
        <motion.section variants={sectionVariants}>
          <PortfolioHoldings />
        </motion.section>

        {/* Professional Footer */}
        <motion.footer
          className="border-t border-gray-700/30 pt-8 mt-16"
          variants={sectionVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Real-Time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Institutional Grade</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Quant Verified</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500">
                RiskSuite360™ — Quantitative Portfolio Risk Intelligence
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Built for institutional asset management • v2.1.0
              </div>
            </div>
          </div>
        </motion.footer>
      </main>

      {/* Report Modal would go here */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-white">Generate Risk Report</h3>
              <p className="text-gray-400 mb-6">
                Professional risk assessment report for institutional use.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-colors font-medium"
                >
                  Generate PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RiskSuite360;
