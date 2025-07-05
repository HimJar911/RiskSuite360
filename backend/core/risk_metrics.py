import pandas as pd
import numpy as np


def compute_volatility(returns: pd.DataFrame, freq: str = 'daily') -> pd.Series:
    """
    Annualized volatility of each asset.
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}")
    
    return returns.std() * np.sqrt(freq_map[freq])


def compute_sharpe_ratio(returns: pd.DataFrame, risk_free_rate: float = 0.0, freq: str = 'daily') -> pd.Series:
    """
    Annualized Sharpe Ratio of each asset.
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}")

    excess_returns = returns - risk_free_rate / freq_map[freq]
    annualized_returns = excess_returns.mean() * freq_map[freq]
    annualized_volatility = excess_returns.std() * np.sqrt(freq_map[freq])
    
    return annualized_returns / annualized_volatility


def compute_max_drawdown(cumulative_returns: pd.DataFrame) -> pd.Series:
    """
    Computes the maximum drawdown for each asset.
    """
    peak = cumulative_returns.cummax()
    drawdown = (cumulative_returns - peak) / peak
    return drawdown.min()


def compute_cagr(cumulative_returns: pd.DataFrame, periods_per_year: int = 252) -> pd.Series:
    """
    Compute Compound Annual Growth Rate.
    Assumes input is cumulative returns like (1 + r).cumprod() - 1
    """
    n_periods = cumulative_returns.shape[0]
    ending_values = (1 + cumulative_returns).iloc[-1]
    return (1 + ending_values) ** (periods_per_year / n_periods) - 1

def compute_sortino_ratio(returns: pd.DataFrame, risk_free_rate: float = 0.0, freq: str = 'daily') -> pd.Series:
    """
    Sortino Ratio = (Return - RiskFree) / Downside Deviation
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}")

    downside_returns = returns[returns < 0]
    expected_return = (returns.mean() - risk_free_rate / freq_map[freq]) * freq_map[freq]
    downside_deviation = downside_returns.std(ddof=0) * np.sqrt(freq_map[freq])

    return expected_return / downside_deviation


def compute_calmar_ratio(cumulative_returns: pd.DataFrame, freq: str = 'daily') -> pd.Series:
    """
    Calmar Ratio = CAGR / |Max Drawdown|
    """
    cagr = compute_cagr(cumulative_returns)
    max_dd = compute_max_drawdown(cumulative_returns).abs()
    return cagr / max_dd

def compute_rolling_sharpe(returns: pd.DataFrame, window: int = 60, risk_free_rate: float = 0.0) -> pd.DataFrame:
    """
    Compute rolling Sharpe Ratio.
    """
    excess = returns - risk_free_rate / 252
    return (excess.rolling(window).mean() / excess.rolling(window).std()) * np.sqrt(252)


def compute_rolling_volatility(returns: pd.DataFrame, window: int = 60) -> pd.DataFrame:
    """
    Rolling annualized volatility.
    """
    return returns.rolling(window).std() * np.sqrt(252)

def compute_skewness(returns: pd.DataFrame) -> pd.Series:
    """
    Return skewness (asymmetry).
    """
    return returns.skew()


def compute_kurtosis(returns: pd.DataFrame) -> pd.Series:
    """
    Return kurtosis (fat tails).
    """
    return returns.kurtosis()
