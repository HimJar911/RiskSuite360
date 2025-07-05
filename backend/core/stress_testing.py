import numpy as np
import pandas as pd

def apply_price_shock(prices: pd.DataFrame, shock: dict[str, float]) -> pd.DataFrame:
    """
    Apply a shock (in %) to one or more assets and return shocked prices.

    Example shock: { 'AAPL': -0.2, 'MSFT': -0.15 }

    Returns:
        pd.DataFrame: Shocked price DataFrame
    """
    shocked_prices = prices.copy()
    for asset, shock_pct in shock.items():
        if asset in shocked_prices.columns:
            shocked_prices[asset] = shocked_prices[asset] * (1 + shock_pct)
    return shocked_prices


def simulate_stress_scenario(prices: pd.DataFrame, weights: np.ndarray, shock: dict[str, float]) -> float:
    """
    Simulate the impact of a price shock on the portfolio value.

    Returns:
        float: Percentage change in portfolio value after shock
    """
    # Portfolio value before shock
    initial_prices = prices.iloc[-1]
    initial_value = np.dot(weights, initial_prices)

    # Apply shock
    shocked_prices = apply_price_shock(prices, shock)
    shocked_value = np.dot(weights, shocked_prices.iloc[-1])

    # Return percent change
    return (shocked_value - initial_value) / initial_value
