import sys
import os

# Ensure backend root is on path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from data.sequences import DEMO_SEQUENCES, get_sequence_by_id, list_sequences
