import { Shield } from "lucide-react";

interface SuggestedHedgeCardProps {
  regime: string;
  defenseScore: number;
}

const getSuggestion = (regime: string, defenseScore: number) => {
  if (regime === "Bearish") {
    return { icon: "🛡️", text: "Consider GLD or TLT for defensive positioning", type: "defensive" };
  } else if (regime === "Bullish" && defenseScore < 60) {
    return { icon: "⚡", text: "Consider BTC or growth stocks for momentum", type: "aggressive" };
  } else if (defenseScore > 80) {
    return { icon: "🏦", text: "Portfolio well-hedged, consider rebalancing", type: "neutral" };
  } else {
    return { icon: "📊", text: "Consider VIX calls for tail risk protection", type: "moderate" };
  }
};

const SuggestedHedgeCard = ({ regime, defenseScore }: SuggestedHedgeCardProps) => {
  const suggestion = getSuggestion(regime, defenseScore);

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:scale-105 transition-transform text-center">
      <h3 className="text-lg font-semibold mb-2 text-yellow-400 flex items-center justify-center gap-2">
        <Shield className="w-5 h-5 text-yellow-400" />
        Suggested Hedge
      </h3>
      <div className="text-3xl mb-2">{suggestion.icon}</div>
      <div className="text-sm text-gray-300">{suggestion.text}</div>
    </div>
  );
};

export default SuggestedHedgeCard;
