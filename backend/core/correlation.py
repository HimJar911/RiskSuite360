import pandas as pd

def compute_correlation_matrix(returns: pd.DataFrame) -> pd.DataFrame:
    """
    Compute the correlation matrix of asset returns.

    Parameters:
        returns (pd.DataFrame): DataFrame of returns

    Returns:
        pd.DataFrame: Correlation matrix
    """
    if (returns < -1).any().any():
        raise ValueError("Invalid return values: Less than -100% found.")

    return returns.corr()


def compute_rolling_correlation(
    returns: pd.DataFrame,
    asset1: str,
    asset2: str,
    window: int = 60
) -> pd.Series:
    """
    Compute rolling correlation between two assets over a moving window.

    Parameters:
        returns (pd.DataFrame): DataFrame of returns
        asset1 (str): First asset column name
        asset2 (str): Second asset column name
        window (int): Rolling window size (in periods)

    Returns:
        pd.Series: Rolling correlation between asset1 and asset2
    """
    if asset1 not in returns.columns or asset2 not in returns.columns:
        raise ValueError("Both assets must be present in the returns DataFrame.")

    return returns[asset1].rolling(window).corr(returns[asset2])
