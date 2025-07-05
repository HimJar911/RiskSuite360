import pandas as pd
import numpy as np

def compute_rolling_volatility(
    returns: pd.DataFrame,
    window: int = 60
) -> pd.DataFrame:
    """
    Compute rolling volatility for each asset.

    Returns:
        pd.DataFrame: Rolling volatility (standard deviation)
    """
    return returns.rolling(window).std(ddof=0)


def compute_rolling_sharpe_ratio(
    returns: pd.DataFrame,
    risk_free_rate: float = 0.0,
    window: int = 60,
    freq: str = 'daily'
) -> pd.DataFrame:
    """
    Compute rolling Sharpe ratio for each asset.

    Returns:
        pd.DataFrame: Rolling Sharpe Ratio
    """
    freq_map = {'daily': 252, 'weekly': 52, 'monthly': 12}
    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}")

    mean_ret = returns.rolling(window).mean()
    std_dev = returns.rolling(window).std(ddof=0)
    annual_factor = freq_map[freq]

    excess_ret = mean_ret - (risk_free_rate / annual_factor)
    return (excess_ret * annual_factor) / std_dev


def compute_z_score(
    series: pd.Series,
    window: int = 60
) -> pd.Series:
    """
    Compute rolling z-score for a single time series.

    Returns:
        pd.Series: Z-score indicating how far a value is from its rolling mean
    """
    rolling_mean = series.rolling(window).mean()
    rolling_std = series.rolling(window).std(ddof=0)

    return (series - rolling_mean) / rolling_std


def detect_volatility_regime(
    rolling_volatility: pd.Series,
    high_threshold: float,
    low_threshold: float
) -> pd.Series:
    """
    Detect volatility regime labels.

    - "Volatile" if rolling vol > high_threshold
    - "Calm" if rolling vol < low_threshold
    - "Neutral" otherwise

    Returns:
        pd.Series: Regime labels for each period
    """
    regimes = pd.Series(index=rolling_volatility.index, dtype="object")

    regimes[rolling_volatility > high_threshold] = "Volatile"
    regimes[rolling_volatility < low_threshold] = "Calm"
    regimes[(rolling_volatility <= high_threshold) & (rolling_volatility >= low_threshold)] = "Neutral"

    return regimes
