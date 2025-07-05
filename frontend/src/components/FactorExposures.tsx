import { TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle } from "lucide-react";

const factorData = [
  { 
    name: "Market Beta", 
    exposure: 0.91, 
    benchmark: 1.00, 
    significance: "High",
    description: "Sensitivity to market movements",
    risk: "moderate"
  },
  { 
    name: "Size Factor", 
    exposure: 0.24, 
    benchmark: 0.00, 
    significance: "Moderate",
    description: "Large vs small cap bias",
    risk: "low"
  },
  { 
    name: "Value Factor", 
    exposure: -0.12, 
    benchmark: 0.00, 
    significance: "Low",
    description: "Value vs growth orientation",
    risk: "low"
  },
  { 
    name: "Quality Factor", 
    exposure: 0.18, 
    benchmark: 0.00, 
    significance: "Low",
    description: "High quality company bias",
    risk: "low"
  },
  { 
    name: "Momentum", 
    exposure: 0.15, 
    benchmark: 0.00, 
    significance: "Low",
    description: "Recent performance momentum",
    risk: "low"
  },
  { 
    name: "Volatility", 
    exposure: -0.08, 
    benchmark: 0.00, 
    significance: "Minimal",
    description: "Low vs high volatility preference",
    risk: "minimal"
  }
];

const getExposureColor = (exposure: number) => {
  const abs = Math.abs(exposure);
  if (abs > 0.75) return "text-red-400";
  if (abs > 0.5) return "text-yellow-400";
  if (abs > 0.25) return "text-blue-400";
  return "text-green-400";
};

const getSignificanceColor = (significance: string) => {
  switch (significance) {
    case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Moderate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getBarWidth = (exposure: number) => {
  return Math.min(Math.abs(exposure) * 100, 100);
};

const FactorExposures = () => {
  const totalRisk = factorData.reduce((sum, factor) => sum + Math.abs(factor.exposure), 0);
  const dominantFactor = factorData.reduce((max, factor) => 
    Math.abs(factor.exposure) > Math.abs(max.exposure) ? factor : max
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 h-full">
      <div className="space-y-6 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Factor Exposures</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <BarChart3 className="w-4 h-4" />
            <span>Systematic Risk</span>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs uppercase tracking-wide">Dominant Factor</span>
            </div>
            <div className="text-white font-bold text-sm">{dominantFactor.name}</div>
            <div className={`text-xs font-medium ${getExposureColor(dominantFactor.exposure)}`}>
              {dominantFactor.exposure.toFixed(2)} exposure
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-xs uppercase tracking-wide">Total Risk</span>
            </div>
            <div className="text-white font-bold text-sm">{totalRisk.toFixed(2)}</div>
            <div className="text-yellow-400 text-xs font-medium">Factor exposure</div>
          </div>
        </div>

        {/* Factor Exposures List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {factorData.map((factor, index) => {
            const isPositive = factor.exposure >= 0;
            const deviation = Math.abs(factor.exposure - factor.benchmark);
            
            return (
              <div key={index} className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/20 hover:bg-gray-800/30 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-medium text-sm">{factor.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getSignificanceColor(factor.significance)}`}>
                      {factor.significance}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${getExposureColor(factor.exposure)}`}>
                      {isPositive ? '+' : ''}{factor.exposure.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Exposure Bar */}
                <div className="relative mb-2">
                  <div className="w-full bg-gray-700/30 h-2 rounded-full overflow-hidden">
                    {/* Benchmark line */}
                    <div 
                      className="absolute top-0 w-0.5 h-2 bg-gray-400 z-10"
                      style={{ left: '50%' }}
                    />
                    {/* Exposure bar */}
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                        isPositive ? 'ml-auto' : 'mr-auto'
                      }`}
                      style={{
                        width: `${getBarWidth(factor.exposure)}%`,
                        backgroundColor: getExposureColor(factor.exposure).replace('text-', '').replace('-400', ''),
                        background: `linear-gradient(90deg, ${
                          isPositive 
                            ? getExposureColor(factor.exposure).includes('red') ? '#ef4444' : 
                              getExposureColor(factor.exposure).includes('yellow') ? '#eab308' :
                              getExposureColor(factor.exposure).includes('blue') ? '#3b82f6' : '#22c55e'
                            : getExposureColor(factor.exposure).includes('red') ? '#ef4444' : 
                              getExposureColor(factor.exposure).includes('yellow') ? '#eab308' :
                              getExposureColor(factor.exposure).includes('blue') ? '#3b82f6' : '#22c55e'
                        }dd, ${
                          isPositive 
                            ? getExposureColor(factor.exposure).includes('red') ? '#ef4444' : 
                              getExposureColor(factor.exposure).includes('yellow') ? '#eab308' :
                              getExposureColor(factor.exposure).includes('blue') ? '#3b82f6' : '#22c55e'
                            : getExposureColor(factor.exposure).includes('red') ? '#ef4444' : 
                              getExposureColor(factor.exposure).includes('yellow') ? '#eab308' :
                              getExposureColor(factor.exposure).includes('blue') ? '#3b82f6' : '#22c55e'
                        }99)`,
                        transformOrigin: isPositive ? 'left' : 'right'
                      }}
                    />
                  </div>
                </div>

                {/* Factor Details */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{factor.description}</span>
                  <div className="flex items-center space-x-2">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-gray-400">
                      {deviation > 0.1 ? `${deviation.toFixed(2)} vs benchmark` : 'Near benchmark'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <div className="border-t border-gray-700/30 pt-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Portfolio Factor Profile</div>
            <div className="text-sm text-gray-400">
              Balanced exposure with {dominantFactor.name.toLowerCase()} tilt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactorExposures;