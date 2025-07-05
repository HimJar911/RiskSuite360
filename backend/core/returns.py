import pandas as pd
import numpy as np

def clean_price_data(df: pd.DataFrame) -> pd.DataFrame:
    """ 
    Clean raw price data:
    - Parse date index
    - Sort by date
    - Forward-fill missing values
    - Drop any rows still containing NaNs
    """
    df = df.copy()
    df.index = pd.to_datetime(df.index)
    df.sort.index(inplace=True)
    df = df.ffill().dropna(how='any')
    return df

def compute_simple_returns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute simple (percentage) returns:
    R_t = (P_t - P_{t-1} / P_{t-1})
    """
    return df.pct_change().dropna()

def compute_returns(df: pd.DataFrame, method: str = 'log') -> pd.DataFrame:
    """
    Compute returns for asset prices.
    method: 'log' or 'simple'
    """
    if method not in {'log', 'simple'}:
        raise ValueError("method must be 'log' or 'simple'")
    if method == 'log':
        returns = np.log(df / df.shift(1))
    else:
        returns = df.pct_change()
    return returns.dropna()

def compute_cumulative_returns(returns: pd.DataFrame) -> pd.DataFrame:
    """
    Compute cumulative returns from simple or log returns.
    """
    if(returns < -1).any().any():
        raise ValueError("Found return less than -100%, cannot compute cumulative returns.")
    return (1+ returns).cumprod() - 1

def resample_prices(df: pd.DataFrame, frequency: str = 'W') -> pd.DataFrame:
    """
    Resample price data to a new frequency (e.g., weekly/monthly)
    frequency: 'D', 'W', 'M', 'Q', etc. 
    """
    return df.resample(frequency).last().dropna()