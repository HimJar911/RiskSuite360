import numpy as np
import pandas as pd
from scipy.optimize import minimize


def minimize_volatility(
    covariance_matrix: pd.DataFrame,
    allow_short: bool = False
) -> np.ndarray:
    """
    Compute the minimum volatility (minimum variance) portfolio.

    Parameters:
        covariance_matrix (pd.DataFrame): Covariance matrix of returns
        allow_short (bool): Allow short positions (weights < 0)

    Returns:
        np.ndarray: Optimal weights
    """
    n = len(covariance_matrix)
    init_guess = np.ones(n) / n

    bounds = None if allow_short else [(0.0, 1.0) for _ in range(n)]
    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}

    result = minimize(
        lambda w: w.T @ covariance_matrix.values @ w,
        init_guess,
        bounds=bounds,
        constraints=constraints
    )

    return result.x


def maximize_sharpe_ratio(
    returns: pd.DataFrame,
    risk_free_rate: float = 0.0,
    freq: str = 'daily',
    allow_short: bool = False
) -> np.ndarray:
    """
    Maximize the Sharpe Ratio.

    Parameters:
        returns (pd.DataFrame): Historical returns
        risk_free_rate (float): Annualized risk-free rate
        freq (str): 'daily', 'weekly', 'monthly'
        allow_short (bool): Allow short positions

    Returns:
        np.ndarray: Optimal weights
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}")

    mean_returns = returns.mean().values * freq_map[freq]
    cov_matrix = returns.cov().values * freq_map[freq]
    n = len(mean_returns)
    init_guess = np.ones(n) / n

    bounds = None if allow_short else [(0.0, 1.0) for _ in range(n)]
    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}

    def neg_sharpe(w):
        port_return = w @ mean_returns
        port_vol = np.sqrt(w @ cov_matrix @ w)
        return - (port_return - risk_free_rate) / port_vol

    result = minimize(
        neg_sharpe,
        init_guess,
        bounds=bounds,
        constraints=constraints
    )

    return result.x


def compute_portfolio_return(weights: np.ndarray, mean_returns: pd.Series, freq: str = 'daily') -> float:
    """
    Compute expected portfolio return (annualized).

    Returns:
        float: Expected return
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    return weights @ (mean_returns * freq_map[freq])


def compute_portfolio_volatility(weights: np.ndarray, covariance_matrix: pd.DataFrame, freq: str = 'daily') -> float:
    """
    Compute expected portfolio volatility (annualized).

    Returns:
        float: Portfolio standard deviation
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    port_var = weights.T @ (covariance_matrix.values * freq_map[freq]) @ weights
    return np.sqrt(port_var)
