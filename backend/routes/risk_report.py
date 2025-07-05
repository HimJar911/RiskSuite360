from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Literal
import pandas as pd
import numpy as np

from core.risk_engine import generate_risk_report

router = APIRouter()

# Define request schema
class RiskReportRequest(BaseModel):
    prices: Dict[str, List[float]]         # e.g., { "AAPL": [...], "MSFT": [...] }
    weights: List[float]                   # Must be same order as prices.keys()
    freq: Literal["daily", "weekly", "monthly"]
    confidence_level: float                # e.g., 0.95
    window: int                            # e.g., 60
    risk_free_rate: float                  # e.g., 0.02
    high_vol_threshold: float              # e.g., 0.03
    low_vol_threshold: float               # e.g., 0.01


@router.post("/risk-report")
def risk_report(req: RiskReportRequest):
    try:
        # Reconstruct price DataFrame
        price_df = pd.DataFrame(req.prices)

        # Convert to NumPy array
        weights = np.array(req.weights)

        if price_df.shape[1] != len(weights):
            raise ValueError("Number of weights must match number of assets (price columns).")

        config = {
            "freq": req.freq,
            "confidence_level": req.confidence_level,
            "window": req.window,
            "risk_free_rate": req.risk_free_rate,
            "high_vol_threshold": req.high_vol_threshold,
            "low_vol_threshold": req.low_vol_threshold
        }

        report = generate_risk_report(price_df, weights, config)
        return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
