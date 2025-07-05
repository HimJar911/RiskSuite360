import pandas as pd
import numpy as np
from core.covariance import compute_annualized_covariance
from scipy.optimize import minimize


def compute_portfolio_return(
    weights: np.ndarray, returns: pd.DataFrame, freq: str = "daily"
) -> float:
    """
    Compute annualized portfolio return from weights and asset returns.
    """
    freq_map = {"daily": 252, "weekly": 52, "monthly": 12}
    if freq not in freq_map:
        raise ValueError("Unsupported frequency.")

    expected_return = returns.mean().values @ weights
    return expected_return * freq_map[freq]


def compute_portfolio_volatility(
    weights: np.ndarray, returns: pd.DataFrame, freq: str = "daily"
) -> float:
    """
    Compute annualized portfolio volatility.
    """
    cov_matrix = compute_annualized_covariance(returns, freq=freq)
    return np.sqrt(weights.T @ cov_matrix.values @ weights)


def compute_portfolio_sharpe(
    weights: np.ndarray,
    returns: pd.DataFrame,
    risk_free_rate: float = 0.0,
    freq: str = "daily",
) -> float:
    """
    Sharpe ratio for a given portfolio.
    """
    port_return = compute_portfolio_return(weights, returns, freq)
    port_vol = compute_portfolio_volatility(weights, returns, freq)
    return (port_return - risk_free_rate) / port_vol


def generate_random_weights(n: int) -> np.ndarray:
    """
    Generate random weights that sum to 1.
    """
    weights = np.random.rand(n)
    return weights / np.sum(weights)


def validate_weights(weights: np.ndarray, n_assets: int):
    """
    Ensure weights are valid (length, sum = 1, non-negative).
    """
    if len(weights) != n_assets:
        raise ValueError("Weights length does not match number of assets.")
    if not np.isclose(weights.sum(), 1):
        raise ValueError("Weights must sum to 1.")
    if (weights < 0).any():
        raise ValueError("Negative weights not allowed.")


def portfolio_metrics(
    weights: np.ndarray,
    returns: pd.DataFrame,
    risk_free_rate: float = 0.0,
    freq: str = "daily",
) -> dict:
    """
    Combined portfolio performance metrics.
    """
    return {
        "Return": compute_portfolio_return(weights, returns, freq),
        "Volatility": compute_portfolio_volatility(weights, returns, freq),
        "Sharpe Ratio": compute_portfolio_sharpe(
            weights, returns, risk_free_rate, freq
        ),
    }


def optimize_max_sharpe(
    returns: pd.DataFrame, risk_free_rate: float = 0.0, freq: str = "daily"
) -> np.ndarray:
    """
    Find portfolio weights that maximize Sharpe Ratio.
    """

    def neg_sharpe(weights):
        return -compute_portfolio_sharpe(weights, returns, risk_free_rate, freq)

    n_assets = returns.shape[1]
    bounds = [(0, 1)] * n_assets
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    init_guess = np.ones(n_assets) / n_assets

    result = minimize(neg_sharpe, init_guess, bounds=bounds, constraints=constraints)
    return result.x
