import pandas as pd
from typing import Tuple
import io

def validate_csv(file_content) -> Tuple[bool, str, pd.DataFrame]:
    """
    Validate CSV file structure.
    Required columns: review_text (required), rating (optional)
    """
    try:
        # Read the contents explicitly to avoid SpooledTemporaryFile issues
        content = file_content.read()
        file_content.seek(0)
        df = pd.read_csv(io.BytesIO(content))

        if 'review_text' not in df.columns:
            return False, "CSV must have 'review_text' column", None

        if len(df) == 0:
            return False, "CSV file is empty", None

        df = df.dropna(subset=['review_text'])

        if len(df) == 0:
            return False, "No valid reviews found in CSV", None

        return True, "CSV is valid", df

    except Exception as e:
        return False, f"Error reading CSV: {str(e)}", None
