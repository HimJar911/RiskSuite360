import { RefreshCw, FileText, Settings, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HeaderProps {
  regime: string;
  currentTime: string;
  onRefresh: () => void;
  onReportClick: () => void;
  onSettingsClick: () => void;
}

const Header = ({ regime, currentTime, onRefresh, onReportClick, onSettingsClick }: HeaderProps) => {
  const getRegimeIcon = (regime: string) => {
    switch (regime) {
      case "Bullish":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "Bearish":
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case "Bullish":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      case "Bearish":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      default:
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            RiskSuite360™
          </div>
          <div className="text-sm text-gray-400">Quant-Grade Portfolio Risk Intelligence</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-2 ${getRegimeColor(regime)}`}>
            {getRegimeIcon(regime)}
            <span>{regime} Regime</span>
          </div>
          <div className="text-sm text-gray-400">{currentTime}</div>
          <div className="flex items-center space-x-2">
            <button onClick={onRefresh} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={onReportClick} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
            </button>
            <button onClick={onSettingsClick} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
