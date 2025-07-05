import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import CustomTooltip from "./CustomTooltip";

const stressScenarios = {
  "2008 Financial Crisis": [
    { date: "Jan", value: 100 },
    { date: "Feb", value: 85 },
    { date: "Mar", value: 72 },
    { date: "Apr", value: 68 },
    { date: "May", value: 74 },
    { date: "Jun", value: 82 },
  ],
  "2020 COVID Crash": [
    { date: "Jan", value: 100 },
    { date: "Feb", value: 93 },
    { date: "Mar", value: 70 },
    { date: "Apr", value: 80 },
    { date: "May", value: 88 },
    { date: "Jun", value: 96 },
  ],
  "Dotcom Bubble": [
    { date: "Jan", value: 100 },
    { date: "Feb", value: 95 },
    { date: "Mar", value: 87 },
    { date: "Apr", value: 78 },
    { date: "May", value: 65 },
    { date: "Jun", value: 60 },
  ],
  "Inflation Shock": [
    { date: "Jan", value: 100 },
    { date: "Feb", value: 90 },
    { date: "Mar", value: 85 },
    { date: "Apr", value: 83 },
    { date: "May", value: 79 },
    { date: "Jun", value: 76 },
  ],
} as const;

const StressTestSimulator = () => {
  const [selected, setSelected] = useState<keyof typeof stressScenarios>("2008 Financial Crisis");
  
  // Memoize data to prevent unnecessary re-renders
  const data = useMemo(() => stressScenarios[selected], [selected]);
  
  // Memoize calculations to prevent re-computation
  const { drop, duration } = useMemo(() => ({
    drop: data[0].value - data[3].value,
    duration: data.length
  }), [data]);

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-md hover:scale-[1.02] transition-all space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-yellow-400">Stress Test Simulator</h3>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as keyof typeof stressScenarios)}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {Object.keys(stressScenarios).map((scenario) => (
            <option key={scenario} value={scenario}>
              {scenario}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDrop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#ccc" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#ccc" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{ pointerEvents: "none" }}
              allowEscapeViewBox={{ x: false, y: false }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#facc15"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDrop)"
              dot={false}
              activeDot={{ r: 4, stroke: "#facc15", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Animated Summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-300"
        >
          During the <span className="text-yellow-400">{selected}</span>, the portfolio dropped
          <span className="text-red-400 font-semibold"> {drop}%</span> over{" "}
          <span className="text-yellow-300">{duration} months</span>.
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StressTestSimulator;