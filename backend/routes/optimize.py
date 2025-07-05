from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Literal
import pandas as pd
import numpy as np

from core.optimization import maximize_sharpe_ratio, minimize_volatility

router = APIRouter()

class OptimizeRequest(BaseModel):
    returns: Dict[str, List[float]]     # e.g., { "AAPL": [...], "MSFT": [...] }
    freq: Literal["daily", "weekly", "monthly"] = "daily"
    risk_free_rate: float = 0.02
    allow_short: bool = False           # default to long-only

@router.post("/optimize")
def optimize_portfolio(req: OptimizeRequest):
    try:
        # Reconstruct return DataFrame
        returns_df = pd.DataFrame(req.returns)

        if returns_df.shape[1] < 2:
            raise ValueError("At least two assets are required for optimization.")

        # Get optimal weights
        min_vol_weights = minimize_volatility(returns_df.cov(), allow_short=req.allow_short)
        max_sharpe_weights = maximize_sharpe_ratio(
            returns_df,
            risk_free_rate=req.risk_free_rate,
            freq=req.freq,
            allow_short=req.allow_short
        )

        asset_names = list(returns_df.columns)

        return {
            "assets": asset_names,
            "min_volatility_weights": dict(zip(asset_names, min_vol_weights)),
            "max_sharpe_weights": dict(zip(asset_names, max_sharpe_weights))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
