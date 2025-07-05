from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Literal
import pandas as pd
import numpy as np

from core.returns import compute_log_returns, compute_cumulative_returns
from core.regime_detection import compute_rolling_volatility, compute_rolling_sharpe_ratio, detect_volatility_regime

router = APIRouter()

class RiskHistoryRequest(BaseModel):
    prices: Dict[str, List[float]]
    freq: Literal["daily", "weekly", "monthly"] = "daily"
    window: int = 60
    risk_free_rate: float = 0.02
    high_vol_threshold: float = 0.03
    low_vol_threshold: float = 0.01

@router.post("/risk-history")
def risk_history(req: RiskHistoryRequest):
    try:
        price_df = pd.DataFrame(req.prices)
        log_returns = compute_log_returns(price_df)

        # Rolling metrics
        rolling_vol = compute_rolling_volatility(log_returns, window=req.window)
        rolling_sharpe = compute_rolling_sharpe_ratio(
            log_returns,
            risk_free_rate=req.risk_free_rate,
            window=req.window,
            freq=req.freq
        )

        # Regime detection
        avg_vol_series = rolling_vol.mean(axis=1)
        regime_labels = detect_volatility_regime(
            avg_vol_series,
            high_threshold=req.high_vol_threshold,
            low_threshold=req.low_vol_threshold
        )

        # Cumulative returns
        portfolio_cum_returns = compute_cumulative_returns(log_returns).mean(axis=1)

        return {
            "rolling_volatility": rolling_vol.round(5).to_dict(),
            "rolling_sharpe_ratio": rolling_sharpe.round(5).to_dict(),
            "regime_labels": regime_labels.astype(str).to_dict(),
            "portfolio_cumulative_returns": portfolio_cum_returns.round(5).to_dict()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
