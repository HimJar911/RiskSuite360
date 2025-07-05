from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import pandas as pd

from core.var_cvar import (
    compute_historical_var,
    compute_historical_cvar,
    compute_parametric_var,
    compute_parametric_cvar
)

router = APIRouter()

class VaRCVaRRequest(BaseModel):
    returns: Dict[str, List[float]]     # e.g., { "AAPL": [...], "MSFT": [...] }
    confidence_level: float = 0.95      # e.g., 0.95

@router.post("/var-cvar")
def compute_tail_risk(req: VaRCVaRRequest):
    try:
        returns_df = pd.DataFrame(req.returns)

        hist_var = compute_historical_var(returns_df, req.confidence_level)
        hist_cvar = compute_historical_cvar(returns_df, req.confidence_level)
        param_var = compute_parametric_var(returns_df, req.confidence_level)
        param_cvar = compute_parametric_cvar(returns_df, req.confidence_level)

        return {
            "confidence_level": req.confidence_level,
            "historical_var": hist_var.round(5).to_dict(),
            "historical_cvar": hist_cvar.round(5).to_dict(),
            "parametric_var": param_var.round(5).to_dict(),
            "parametric_cvar": param_cvar.round(5).to_dict()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
