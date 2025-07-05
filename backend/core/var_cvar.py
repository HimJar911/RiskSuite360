import numpy as np
import pandas as pd
from scipy.stats import norm

def compute_historical_var(returns: pd.DataFrame, confidence_level: float = 0.95) -> pd.Series:
    """
    Compute Historical VaR for each asset.
    VaR = empirical quantile of losses at (1 - confidence_level)

    Returns:
        pd.Series: Historical VaR values for each asset
    """
    var_level = 1 - confidence_level
    return returns.quantile(var_level, interpolation="higher")


def compute_historical_cvar(returns: pd.DataFrame, confidence_level: float = 0.95) -> pd.Series:
    """
    Compute Historical CVaR (Expected Shortfall) for each asset.
    CVaR = average loss beyond VaR threshold

    Returns:
        pd.Series: Historical CVaR values for each asset
    """
    var = compute_historical_var(returns, confidence_level)
    cvar = pd.Series(index=returns.columns, dtype=float)

    for col in returns.columns:
        losses_beyond_var = returns[returns[col] <= var[col]][col]
        cvar[col] = losses_beyond_var.mean()

    return cvar


def compute_parametric_var(returns: pd.DataFrame, confidence_level: float = 0.95) -> pd.Series:
    """
    Compute Parametric (Gaussian) VaR for each asset.
    VaR = - (μ + z * σ)

    Returns:
        pd.Series: Parametric VaR values for each asset
    """
    z = norm.ppf(1 - confidence_level)
    mean = returns.mean()
    std = returns.std(ddof=0)

    return -(mean + z * std)


def compute_parametric_cvar(returns: pd.DataFrame, confidence_level: float = 0.95) -> pd.Series:
    """
    Compute Parametric (Gaussian) CVaR for each asset.
    CVaR = - (μ + (φ(z) / (1 - α)) * σ)

    Returns:
        pd.Series: Parametric CVaR values for each asset
    """
    z = norm.ppf(1 - confidence_level)
    phi = norm.pdf(z)
    mean = returns.mean()
    std = returns.std(ddof=0)

    return -(mean + (phi / (1 - confidence_level)) * std)
