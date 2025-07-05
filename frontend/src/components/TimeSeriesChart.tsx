import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

interface TimeSeriesData {
  date: string;
  portfolioValue: number;
  benchmark: number;
  sharpe: number;
  var: number;
  drawdown: number;
  regime: string;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const portfolioReturn = ((data.portfolioValue / 1000000 - 1) * 100);
    const benchmarkReturn = ((data.benchmark / 1000000 - 1) * 100);
    const outperformance = portfolioReturn - benchmarkReturn;
    
    return (
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-xl">
        <div className="text-yellow-400 font-semibold text-sm mb-2">{label}</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between space-x-4">
            <span className="text-gray-400">Portfolio:</span>
            <span className="text-white font-medium">${data.portfolioValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-gray-400">Benchmark:</span>
            <span className="text-gray-300">${data.benchmark.toLocaleString()}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-gray-400">Return:</span>
            <span className={`font-medium ${portfolioReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioReturn >= 0 ? '+' : ''}{portfolioReturn.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-gray-400">Outperformance:</span>
            <span className={`font-medium ${outperformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {outperformance >= 0 ? '+' : ''}{outperformance.toFixed(2)}%
            </span>
          </div>
          <div className="border-t border-gray-700 pt-1 mt-1">
            <div className="flex justify-between space-x-4">
              <span className="text-gray-400">Sharpe:</span>
              <span className="text-blue-400 font-medium">{data.sharpe.toFixed(2)}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-400">Regime:</span>
              <span className={`font-medium ${
                data.regime === 'Bull' ? 'text-green-400' : 
                data.regime === 'Bear' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {data.regime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TimeSeriesChart = ({ data }: TimeSeriesChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'sharpe' | 'drawdown'>('performance');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const formatYAxis = (value: number) => {
    if (selectedMetric === 'performance') {
      return `${(value / 1000).toFixed(0)}K`;
    } else if (selectedMetric === 'sharpe') {
      return value.toFixed(1);
    } else {
      return `${value.toFixed(0)}%`;
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'sharpe':
        return data.map(d => ({ ...d, value: d.sharpe, benchmarkValue: 1.0 }));
      case 'drawdown':
        return data.map(d => ({ ...d, value: d.drawdown, benchmarkValue: -15 }));
      default:
        return data.map(d => ({ ...d, value: d.portfolioValue, benchmarkValue: d.benchmark }));
    }
  };

  const chartData = getMetricData();
  const latestValue = chartData[chartData.length - 1]?.value || 0;
  const initialValue = chartData[0]?.value || 0;
  const totalChange = selectedMetric === 'performance' 
    ? ((latestValue - initialValue) / initialValue) * 100
    : latestValue - initialValue;

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            {[
              { key: 'performance', label: 'Performance', icon: TrendingUp },
              { key: 'sharpe', label: 'Sharpe Ratio', icon: Target },
              { key: 'drawdown', label: 'Drawdown', icon: TrendingDown }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key as any)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded transition-all ${
                  selectedMetric === key
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBenchmark}
              onChange={(e) => setShowBenchmark(e.target.checked)}
              className="rounded bg-gray-800 border-gray-600 text-yellow-400 focus:ring-yellow-400 focus:ring-2"
            />
            <span className="text-sm text-gray-400">Show Benchmark</span>
          </label>
        </div>

        {/* Performance Summary */}
        <div className="text-right">
          <div className="text-sm text-gray-400">
            {selectedMetric === 'performance' ? 'Total Return' : 
             selectedMetric === 'sharpe' ? 'Current Sharpe' : 'Max Drawdown'}
          </div>
          <div className={`text-xl font-bold ${
            totalChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {selectedMetric === 'performance' ? (
              `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}%`
            ) : selectedMetric === 'sharpe' ? (
              `${latestValue.toFixed(2)}×`
            ) : (
              `${latestValue.toFixed(1)}%`
            )}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-80 bg-gray-800/20 rounded-xl p-4 border border-gray-700/30">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Benchmark Area (if enabled) */}
            {showBenchmark && (
              <Area
                type="monotone"
                dataKey="benchmarkValue"
                stroke="#6b7280"
                strokeWidth={1.5}
                fill="url(#benchmarkGradient)"
                strokeDasharray="5 5"
              />
            )}
            
            {/* Portfolio Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#facc15"
              strokeWidth={2.5}
              fill="url(#portfolioGradient)"
              dot={{ fill: "#facc15", strokeWidth: 0, r: 0 }}
              activeDot={{ 
                r: 5, 
                stroke: "#facc15", 
                strokeWidth: 2, 
                fill: "#1f2937",
                shadow: "0 0 10px #facc15"
              }}
            />
            
            {/* Reference line for break-even */}
            {selectedMetric === 'performance' && (
              <ReferenceLine 
                y={1000000} 
                stroke="#374151" 
                strokeDasharray="2 2" 
                label={{ value: "Break Even", position: "topRight", style: { fill: "#6b7280", fontSize: 10 } }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-400">Portfolio</span>
        </div>
        {showBenchmark && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-gray-500 rounded" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-400">Benchmark</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">
            {selectedMetric === 'performance' ? 'Portfolio Value Over Time' :
             selectedMetric === 'sharpe' ? 'Risk-Adjusted Returns' : 'Maximum Drawdown Analysis'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;