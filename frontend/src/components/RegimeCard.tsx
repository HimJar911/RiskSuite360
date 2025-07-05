import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RegimeCardProps {
  regime: string;
  timeAgo: string;
}

const getRegimeIcon = (regime: string) => {
  switch (regime) {
    case "Bullish":
      return <TrendingUp className="w-8 h-8 text-green-400" />;
    case "Bearish":
      return <TrendingDown className="w-8 h-8 text-red-400" />;
    default:
      return <Minus className="w-8 h-8 text-yellow-400" />;
  }
};

const RegimeCard = ({ regime, timeAgo }: RegimeCardProps) => {
  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-transform text-center">
      <h3 className="text-lg font-semibold mb-2 text-yellow-400">Current Regime</h3>
      <div className="text-4xl mb-2">{getRegimeIcon(regime)}</div>
      <div className="text-lg font-bold text-white">{regime}</div>
      <div className="text-sm text-gray-400">Changed: {timeAgo}</div>
    </div>
  );
};

export default RegimeCard;
