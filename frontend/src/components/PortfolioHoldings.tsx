import { ArrowDown, ArrowUp, TrendingUp, Target, DollarSign } from "lucide-react";

const holdings = [
  { ticker: "AAPL", sector: "Tech", allocation: 22.5, value: 45000, change: 1.2, beta: 1.24, sharpe: 1.45, riskContrib: 18.2 },
  { ticker: "MSFT", sector: "Tech", allocation: 19.3, value: 38750, change: -0.6, beta: 1.12, sharpe: 1.32, riskContrib: 15.8 },
  { ticker: "GOOGL", sector: "Communication", allocation: 17.0, value: 34000, change: 0.8, beta: 1.08, sharpe: 1.28, riskContrib: 14.1 },
  { ticker: "NVDA", sector: "Tech", allocation: 15.2, value: 30500, change: -1.1, beta: 1.78, sharpe: 1.62, riskContrib: 22.3 },
  { ticker: "TLT", sector: "Bonds", allocation: 13.0, value: 26000, change: 0.2, beta: -0.45, sharpe: 0.82, riskContrib: 8.9 },
  { ticker: "GLD", sector: "Commodities", allocation: 13.0, value: 26000, change: -0.3, beta: 0.15, sharpe: 0.68, riskContrib: 5.2 },
];

const getSectorColor = (sector: string) => {
  const map: Record<string, { bg: string, text: string }> = {
    Tech: { bg: "bg-blue-500/20", text: "text-blue-400" },
    Communication: { bg: "bg-purple-500/20", text: "text-purple-400" },
    Bonds: { bg: "bg-green-500/20", text: "text-green-400" },
    Commodities: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  };
  return map[sector] || { bg: "bg-gray-500/20", text: "text-gray-400" };
};

const getRiskLevel = (riskContrib: number) => {
  if (riskContrib > 20) return { color: "text-red-400", level: "High" };
  if (riskContrib > 15) return { color: "text-yellow-400", level: "Moderate" };
  return { color: "text-green-400", level: "Low" };
};

const PortfolioHoldings = () => {
  const totalValue = holdings.reduce((sum, asset) => sum + asset.value, 0);
  const totalRiskContrib = holdings.reduce((sum, asset) => sum + asset.riskContrib, 0);
  const avgSharpe = holdings.reduce((sum, asset) => sum + asset.sharpe * (asset.allocation / 100), 0);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="space-y-6">
        {/* Header with Summary Metrics */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Portfolio Holdings</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Total Value:</span>
              <span className="font-bold text-white">${totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Portfolio Sharpe:</span>
              <span className="font-bold text-blue-400">{avgSharpe.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Risk Contrib:</span>
              <span className="font-bold text-red-400">{totalRiskContrib.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/50 pb-3">
          <div className="col-span-2">Asset</div>
          <div className="col-span-2">Allocation</div>
          <div className="col-span-2 text-right">Market Value</div>
          <div className="col-span-1 text-center">Beta</div>
          <div className="col-span-1 text-center">Sharpe</div>
          <div className="col-span-2 text-center">Risk Contribution</div>
          <div className="col-span-2 text-right">1D Performance</div>
        </div>

        {/* Holdings Data */}
        <div className="space-y-3">
          {holdings.map((asset, i) => {
            const sectorColors = getSectorColor(asset.sector);
            const riskInfo = getRiskLevel(asset.riskContrib);
            
            return (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 items-center bg-gray-800/30 px-4 py-4 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-200"
              >
                {/* Asset Info */}
                <div className="col-span-2 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center border border-yellow-400/20">
                    <span className="text-yellow-400 font-bold text-sm">{asset.ticker.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{asset.ticker}</div>
                    <div className={`text-xs px-2 py-0.5 rounded ${sectorColors.bg} ${sectorColors.text} font-medium`}>
                      {asset.sector}
                    </div>
                  </div>
                </div>

                {/* Allocation with Progress Bar */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{asset.allocation.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-500"
                      style={{ width: `${asset.allocation}%` }}
                    />
                  </div>
                </div>

                {/* Market Value */}
                <div className="col-span-2 text-right">
                  <div className="text-white font-bold">${asset.value.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">
                    {((asset.value / totalValue) * 100).toFixed(1)}% of total
                  </div>
                </div>

                {/* Beta */}
                <div className="col-span-1 text-center">
                  <div className={`font-bold ${
                    asset.beta > 1.5 ? 'text-red-400' : 
                    asset.beta > 1 ? 'text-yellow-400' : 
                    asset.beta > 0 ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {asset.beta.toFixed(2)}
                  </div>
                </div>

                {/* Sharpe Ratio */}
                <div className="col-span-1 text-center">
                  <div className={`font-bold ${
                    asset.sharpe > 1.5 ? 'text-green-400' : 
                    asset.sharpe > 1 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {asset.sharpe.toFixed(2)}
                  </div>
                </div>

                {/* Risk Contribution */}
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`font-bold ${riskInfo.color}`}>{asset.riskContrib.toFixed(1)}%</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-700/50 ${riskInfo.color}`}>
                      {riskInfo.level}
                    </span>
                  </div>
                </div>

                {/* 1D Performance */}
                <div className="col-span-2 text-right">
                  <div className={`flex items-center justify-end space-x-1 font-bold ${
                    asset.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {asset.change >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span>{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    ${(asset.value * (asset.change / 100)).toLocaleString()} P&L
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Summary Footer */}
        <div className="border-t border-gray-700/50 pt-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <div className="text-gray-400 text-xs uppercase tracking-wide">Concentration Risk</div>
              <div className="text-white font-bold text-lg">
                {((holdings.slice(0, 3).reduce((sum, h) => sum + h.allocation, 0))).toFixed(1)}%
              </div>
              <div className="text-gray-400 text-xs">Top 3 holdings</div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <div className="text-gray-400 text-xs uppercase tracking-wide">Sector Diversification</div>
              <div className="text-white font-bold text-lg">
                {new Set(holdings.map(h => h.sector)).size}
              </div>
              <div className="text-gray-400 text-xs">Distinct sectors</div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <div className="text-gray-400 text-xs uppercase tracking-wide">Portfolio Beta</div>
              <div className="text-white font-bold text-lg">
                {holdings.reduce((sum, h) => sum + (h.beta * h.allocation / 100), 0).toFixed(2)}
              </div>
              <div className="text-gray-400 text-xs">Weighted average</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHoldings;