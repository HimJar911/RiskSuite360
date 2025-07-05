import { useState } from "react";

const correlationData = [
  ["", "AAPL", "MSFT", "GOOGL", "NVDA", "SPY", "GLD", "TLT"],
  ["AAPL", 1.0, 0.85, 0.72, 0.68, 0.45, -0.12, -0.25],
  ["MSFT", 0.85, 1.0, 0.78, 0.74, 0.52, -0.08, -0.22],
  ["GOOGL", 0.72, 0.78, 1.0, 0.81, 0.48, -0.15, -0.28],
  ["NVDA", 0.68, 0.74, 0.81, 1.0, 0.39, -0.18, -0.31],
  ["SPY", 0.45, 0.52, 0.48, 0.39, 1.0, 0.25, 0.18],
  ["GLD", -0.12, -0.08, -0.15, -0.18, 0.25, 1.0, 0.45],
  ["TLT", -0.25, -0.22, -0.28, -0.31, 0.18, 0.45, 1.0],
];

const tickers = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'SPY', 'GLD', 'TLT'];

function getRiskLevel(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 0.8) return 'High';
  if (abs >= 0.5) return 'Moderate';
  if (abs >= 0.2) return 'Low';
  return 'Minimal';
}

function getCorrelationColor(value: number): string {
  const intensity = Math.abs(value);
  if (value > 0) {
    return `rgba(34, 197, 94, ${intensity})`;  // Green for positive
  } else {
    return `rgba(239, 68, 68, ${intensity})`;  // Red for negative
  }
}

const CorrelationMatrix = () => {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold text-white mb-6">Correlation Matrix</h3>
      
      <div className="grid grid-cols-8 gap-1 text-xs">
        {/* Headers */}
        <div></div>
        {tickers.map(ticker => (
          <div key={ticker} className="text-center font-bold text-yellow-400 p-2">
            {ticker}
          </div>
        ))}
        
        {/* Correlation matrix */}
        {correlationData.slice(1).map((row, i) => (
          <>
            <div key={`row-${i}`} className="font-bold text-yellow-400 p-2">{row[0]}</div>
            {(row.slice(1) as number[]).map((value, j) => {
              const isHovered = hoveredCell?.row === i && hoveredCell?.col === j;
              const riskLevel = getRiskLevel(value);
              
              return (
                <div
                  key={`cell-${i}-${j}`}
                  className="p-2 text-center font-medium rounded cursor-pointer hover:scale-110 transition-transform relative"
                  style={{ 
                    backgroundColor: getCorrelationColor(value),
                    color: Math.abs(value) > 0.5 ? 'white' : '#9ca3af'
                  }}
                  onMouseEnter={() => setHoveredCell({row: i, col: j})}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold">
                      {value.toFixed(2)}
                    </div>
                    <div className={`text-xs ${
                      riskLevel === 'High' ? 'text-yellow-300' :
                      riskLevel === 'Moderate' ? 'text-blue-300' :
                      riskLevel === 'Low' ? 'text-green-300' :
                      'text-gray-300'
                    }`}>
                      {riskLevel}
                    </div>
                  </div>
                  
                  {/* Enhanced tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-xl border border-gray-600 z-20 whitespace-nowrap">
                      <div className="font-bold text-yellow-400">{tickers[i]} × {tickers[j]}</div>
                      <div>{value > 0 ? 'Positive' : 'Negative'} Correlation: {Math.abs(value).toFixed(3)}</div>
                      <div className="text-gray-300">Risk Level: {riskLevel}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Negative Correlation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Positive Correlation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Perfect Correlation</span>
        </div>
      </div>
      
      {/* Risk Level Guide */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <div className="text-center py-2 px-3 bg-gray-800/30 rounded border border-gray-700/30">
          <div className="text-gray-400 text-xs">Minimal</div>
          <div className="text-white text-xs font-bold">0.0 - 0.2</div>
        </div>
        <div className="text-center py-2 px-3 bg-gray-800/30 rounded border border-gray-700/30">
          <div className="text-green-400 text-xs">Low</div>
          <div className="text-white text-xs font-bold">0.2 - 0.5</div>
        </div>
        <div className="text-center py-2 px-3 bg-gray-800/30 rounded border border-gray-700/30">
          <div className="text-blue-400 text-xs">Moderate</div>
          <div className="text-white text-xs font-bold">0.5 - 0.8</div>
        </div>
        <div className="text-center py-2 px-3 bg-gray-800/30 rounded border border-gray-700/30">
          <div className="text-yellow-400 text-xs">High</div>
          <div className="text-white text-xs font-bold">0.8 - 1.0</div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;