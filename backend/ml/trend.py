import sys
import os

backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.ml.trend import (
    WindowMetrics,
    WindowTransition,
    TrendResult,
    compute_trend
)
