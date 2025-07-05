from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
import numpy as np

from core.stress_testing import simulate_stress_scenario

router = APIRouter()

class StressTestRequest(BaseModel):
    prices: Dict[str, List[float]]          # e.g., { "AAPL": [...], "MSFT": [...] }
    weights: List[float]                    # e.g., [0.5, 0.5]
    shock: Dict[str, float]                # e.g., { "AAPL": -0.2, "MSFT": -0.1 }

@router.post("/stress-test")
def stress_test(req: StressTestRequest):
    try:
        price_df = pd.DataFrame(req.prices)
        weights = np.array(req.weights)
        shock = req.shock

        if price_df.shape[1] != len(weights):
            raise ValueError("Number of weights must match number of assets.")

        pct_change = simulate_stress_scenario(price_df, weights, shock)

        return {
            "portfolio_value_change_percent": round(pct_change * 100, 4),
            "shock": shock
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
