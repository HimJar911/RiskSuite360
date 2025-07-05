from fastapi import FastAPI
from routes import risk_report, optimize, stress_test, var_cvar, risk_summary, risk_history

app = FastAPI()

app.include_router(risk_report.router, prefix="/api")
app.include_router(optimize.router, prefix="/api")
app.include_router(stress_test.router, prefix="/api")
app.include_router(var_cvar.router, prefix="/api")
app.include_router(risk_summary.router, prefix="/api")
app.include_router(risk_history.router, prefix="/api")