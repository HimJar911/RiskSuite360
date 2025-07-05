from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Literal
import pandas as pd
import numpy as np

from core.returns import compute_log_returns
from core.risk_metrics import compute_sharpe_ratio, compute_max_drawdown, compute_cagr
from core.var_cvar import compute_parametric_var, compute_parametric_cvar
from core.portfolio_risk import compute_portfolio_volatility
from core.regime_detection import compute_rolling_volatility, detect_volatility_regime
from core.optimization import compute_portfolio_return

router = APIRouter()

class RiskSummaryRequest(BaseModel):
    prices: Dict[str, List[float]]
    weights: List[float]
    freq: Literal["daily", "weekly", "monthly"] = "daily"
    confidence_level: float = 0.95
    window: int = 60
    risk_free_rate: float = 0.02
    high_vol_threshold: float = 0.03
    low_vol_threshold: float = 0.01

@router.post("/risk-summary")
def risk_summary(req: RiskSummaryRequest):
    try:
        price_df = pd.DataFrame(req.prices)
        weights = np.array(req.weights)
        log_returns = compute_log_returns(price_df)

        mean_returns = log_returns.mean()
        cov_matrix = log_returns.cov()

        port_return = compute_portfolio_return(weights, mean_returns, freq=req.freq)
        port_vol = compute_portfolio_volatility(weights, cov_matrix, freq=req.freq)
        sharpe = compute_sharpe_ratio(log_returns, req.risk_free_rate, freq=req.freq).mean()
        cagr = compute_cagr(price_df).mean()
        max_dd = compute_max_drawdown(price_df).mean()

        param_var = compute_parametric_var(log_returns, req.confidence_level).mean()
        param_cvar = compute_parametric_cvar(log_returns, req.confidence_level).mean()

        rolling_vol = compute_rolling_volatility(log_returns, window=req.window).mean(axis=1)
        latest_vol = rolling_vol.iloc[-1]
        regime_label = detect_volatility_regime(rolling_vol, req.high_vol_threshold, req.low_vol_threshold).iloc[-1]

        return {
            "portfolio_return": round(port_return, 5),
            "portfolio_volatility": round(port_vol, 5),
            "sharpe_ratio": round(sharpe, 5),
            "cagr": round(cagr, 5),
            "max_drawdown": round(max_dd, 5),
            "parametric_var": round(param_var, 5),
            "parametric_cvar": round(param_cvar, 5),
            "current_volatility": round(latest_vol, 5),
            "regime": regime_label
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
