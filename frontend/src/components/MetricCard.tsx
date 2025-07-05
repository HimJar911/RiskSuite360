import Sparkline from "./Sparkline";

interface MetricCardProps {
  name: string;
  value: number;
  trend: number[];
  risk: "low" | "moderate" | "high";
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "text-green-400 border-green-400";
    case "moderate":
      return "text-yellow-400 border-yellow-400";
    case "high":
      return "text-red-400 border-red-400";
    default:
      return "text-gray-400 border-gray-400";
  }
};

const MetricCard = ({ name, value, trend, risk }: MetricCardProps) => {
  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20 ${getRiskColor(
        risk
      )}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-300">{name}</h3>
        <Sparkline data={trend} />
      </div>
      <div className="text-2xl font-bold text-white mb-2">
        {value.toFixed(2)}
        {name.includes("Ratio") && value > 0 && "×"}
        {name.includes("Drawdown") && "%"}
        {name.includes("VaR") && "%"}
        {name.includes("Volatility") && "%"}
      </div>
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            risk === "low"
              ? "bg-green-400"
              : risk === "moderate"
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
        ></div>
        <span className="text-xs text-gray-400 capitalize">{risk} Risk</span>
      </div>
    </div>
  );
};

export default MetricCard;
