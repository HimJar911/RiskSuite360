import pandas as pd
import numpy as np

def compute_covariance_matrix(returns: pd.DataFrame) -> pd.DataFrame:
    """
    Compute the covariance matrix of asset returns.

    Parameters:
        returns (pd.DataFrame): DataFrame of log or simple returns

    Returns:
        pd.DataFrame: Covariance matrix
    """
    if (returns < -1).any().any():
        raise ValueError("Invalid return values: Less than -100% found.")

    return returns.cov()


def compute_annualized_covariance(returns: pd.DataFrame, freq: str = 'daily') -> pd.DataFrame:
    """
    Annualize the covariance matrix of returns.

    Parameters:
        returns (pd.DataFrame): DataFrame of returns
        freq (str): Frequency of data - 'daily', 'weekly', 'monthly'

    Returns:
        pd.DataFrame: Annualized covariance matrix
    """
    freq_map = {
        'daily': 252,
        'weekly': 52,
        'monthly': 12
    }

    if freq not in freq_map:
        raise ValueError(f"Unsupported frequency: {freq}. Choose from {list(freq_map.keys())}")

    cov_matrix = compute_covariance_matrix(returns)
    annual_factor = freq_map[freq]

    return cov_matrix * annual_factor


def compute_correlation_matrix(returns: pd.DataFrame) -> pd.DataFrame:
    """
    Compute the correlation matrix from asset returns.

    Parameters:
        returns (pd.DataFrame): DataFrame of returns

    Returns:
        pd.DataFrame: Correlation matrix
    """
    return returns.corr()

def compute_ew_covariance(returns: pd.DataFrame, span: int = 60) -> pd.DataFrame:
    """
    Exponentially Weighted Covariance Matrix (RiskMetrics-style).
    """
    return returns.ewm(span=span).cov(pairwise=True).dropna()
