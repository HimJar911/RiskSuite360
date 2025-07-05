import { Zap } from "lucide-react";

interface RiskPulseProps {
  intensity: number; // 0–100
}

const RiskPulse = ({ intensity }: RiskPulseProps) => {
  const scale = 0.8 + intensity / 500;
  const speed = 2 - intensity / 100;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-red-400/20 animate-pulse"></div>
      <div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-400/40 to-red-400/40"
        style={{
          animation: `pulse ${speed}s ease-in-out infinite`,
          transform: `scale(${scale})`,
        }}
      ></div>
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-yellow-400 to-red-400 flex items-center justify-center">
        <Zap className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default RiskPulse;
