import pandas as pd
import numpy as np

from core.returns import compute_log_returns
from core.risk_metrics import compute_sharpe_ratio, compute_sortino_ratio, compute_calmar_ratio, compute_max_drawdown, compute_cagr
from core.covariance import compute_annualized_covariance
from core.portfolio_risk import compute_portfolio_volatility, compute_marginal_contribution_to_risk, compute_component_contribution_to_risk
from core.var_cvar import compute_historical_var, compute_historical_cvar, compute_parametric_var, compute_parametric_cvar
from core.stress_testing import simulate_stress_scenario
from core.correlation import compute_correlation_matrix
from core.regime_detection import compute_rolling_volatility, detect_volatility_regime
from core.optimization import maximize_sharpe_ratio, minimize_volatility, compute_portfolio_return

def generate_risk_report(
    prices: pd.DataFrame,
    weights: np.ndarray,
    config: dict
) -> dict:
    """
    Generate a full portfolio risk report.

    Parameters:
        prices (pd.DataFrame): Price data
        weights (np.ndarray): Portfolio weights (aligned with prices.columns)
        config (dict): Settings like freq, window, confidence_level, risk_free_rate

    Returns:
        dict: Full risk metrics and decompositions
    """
    # Step 1: Returns
    log_returns = compute_log_returns(prices)

    # Step 2: Rolling metrics
    rolling_vol = compute_rolling_volatility(log_returns, window=config["window"])
    volatility_regime = detect_volatility_regime(
        rolling_vol.mean(axis=1),
        config["high_vol_threshold"],
        config["low_vol_threshold"]
    )

    # Step 3: Portfolio stats
    cov_matrix = compute_annualized_covariance(log_returns, freq=config["freq"])
    port_vol = compute_portfolio_volatility(weights, cov_matrix, freq=config["freq"])
    port_ret = compute_portfolio_return(weights, log_returns.mean(), freq=config["freq"])

    # Step 4: Risk contribution
    mctr = compute_marginal_contribution_to_risk(weights, cov_matrix)
    cctr = compute_component_contribution_to_risk(weights, cov_matrix)

    # Step 5: VaR & CVaR
    hist_var = compute_historical_var(log_returns, config["confidence_level"])
    hist_cvar = compute_historical_cvar(log_returns, config["confidence_level"])
    param_var = compute_parametric_var(log_returns, config["confidence_level"])
    param_cvar = compute_parametric_cvar(log_returns, config["confidence_level"])

    # Step 6: Traditional metrics
    sharpe = compute_sharpe_ratio(log_returns, config["risk_free_rate"], freq=config["freq"])
    sortino = compute_sortino_ratio(log_returns, config["risk_free_rate"], freq=config["freq"])
    calmar = compute_calmar_ratio(prices, freq=config["freq"])
    cagr = compute_cagr(prices)
    max_dd = compute_max_drawdown(prices)

    # Step 7: Correlation matrix
    corr_matrix = compute_correlation_matrix(log_returns)

    return {
        "portfolio": {
            "expected_return": port_ret,
            "volatility": port_vol,
            "sharpe_ratio": float(sharpe.mean()),
            "sortino_ratio": float(sortino.mean()),
            "calmar_ratio": float(calmar.mean()),
            "cagr": float(cagr.mean()),
            "max_drawdown": float(max_dd.mean())
        },
        "risk_contributions": {
            "marginal": mctr.tolist(),
            "component": cctr.tolist()
        },
        "tail_risk": {
            "historical_var": hist_var.to_dict(),
            "historical_cvar": hist_cvar.to_dict(),
            "parametric_var": param_var.to_dict(),
            "parametric_cvar": param_cvar.to_dict()
        },
        "correlation_matrix": corr_matrix.to_dict(),
        "regime": {
            "labels": volatility_regime.astype(str).to_dict(),
            "rolling_volatility": rolling_vol.to_dict()
        }
    }
