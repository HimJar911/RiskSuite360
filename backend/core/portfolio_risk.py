import numpy as np
import pandas as pd

def compute_portfolio_variance(weights: np.ndarray, covariance_matrix: pd.DataFrame) -> float:
    """
    Compute portfolio variance: w^T Σ w

    Parameters:
        weights (np.ndarray): Portfolio weights (1D)
        covariance_matrix (pd.DataFrame): Asset return covariance matrix

    Returns:
        float: Portfolio variance
    """
    return float(weights.T @ covariance_matrix.values @ weights)


def compute_portfolio_volatility(weights: np.ndarray, covariance_matrix: pd.DataFrame) -> float:
    """
    Compute portfolio volatility (standard deviation)

    Returns:
        float: Portfolio standard deviation
    """
    variance = compute_portfolio_variance(weights, covariance_matrix)
    return np.sqrt(variance)


def compute_marginal_contribution_to_risk(weights: np.ndarray, covariance_matrix: pd.DataFrame) -> np.ndarray:
    """
    Marginal Contribution to Risk (MCTR): (Σw)_i / portfolio_volatility

    Returns:
        np.ndarray: MCTR for each asset
    """
    port_vol = compute_portfolio_volatility(weights, covariance_matrix)
    marginal_risk = covariance_matrix.values @ weights
    return marginal_risk / port_vol


def compute_component_contribution_to_risk(weights: np.ndarray, covariance_matrix: pd.DataFrame) -> np.ndarray:
    """
    Component Contribution to Risk (CCTR): w_i * MCTR_i

    Returns:
        np.ndarray: CCTR for each asset
    """
    mctr = compute_marginal_contribution_to_risk(weights, covariance_matrix)
    return weights * mctr


def compute_risk_contributions_report(
    asset_names: list[str],
    weights: np.ndarray,
    covariance_matrix: pd.DataFrame
) -> pd.DataFrame:
    """
    Generate a detailed report of portfolio risk contributions.

    Returns:
        pd.DataFrame with columns: Asset, Weight, MCTR, CCTR, % Contribution
    """
    mctr = compute_marginal_contribution_to_risk(weights, covariance_matrix)
    cctr = compute_component_contribution_to_risk(weights, covariance_matrix)
    port_vol = compute_portfolio_volatility(weights, covariance_matrix)

    report = pd.DataFrame({
        "Asset": asset_names,
        "Weight": weights,
        "MCTR": mctr,
        "CCTR": cctr,
        "% Contribution": 100 * cctr / port_vol
    })

    return report
