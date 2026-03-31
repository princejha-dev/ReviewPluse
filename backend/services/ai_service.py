from google import genai
from typing import List, Dict
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize new Google GenAI client
client = genai.Client(api_key=API_KEY)

# Hardcoded restaurant categories
RESTAURANT_CATEGORIES = ["staff", "food_quality", "ambience", "wait_time", "hygiene"]


def analyze_batch(reviews: List[Dict]) -> List[Dict]:
    """
    Send a batch of reviews to Google AI for sentiment + category analysis.
    Uses hardcoded restaurant categories. Processes in batches of 15.
    """
    reviews_text = "\n".join([
        f"ID: {r['id']}, Review: {r['review_text']}"
        for r in reviews
    ])

    categories_str = ", ".join(RESTAURANT_CATEGORIES)

    prompt = f"""You are analyzing restaurant customer reviews. For EACH review:
1. Determine sentiment: positive, negative, or neutral
2. Choose the BEST matching category from: {categories_str}

Categories explained:
- staff: about employees, service quality, friendliness, professionalism
- food_quality: about taste, freshness, presentation, portion size, menu
- ambience: about atmosphere, decor, music, lighting, seating comfort
- wait_time: about how long customers waited for food/service/table
- hygiene: about cleanliness, sanitation, washrooms, kitchen hygiene

Reviews to analyze:
{reviews_text}

IMPORTANT: Respond ONLY with valid JSON array. Example:
[
  {{"id": 1, "sentiment": "positive", "issue_category": "food_quality"}},
  {{"id": 2, "sentiment": "negative", "issue_category": "wait_time"}}
]
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        response_text = response.text.strip()

        # Clean markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("```", 1)[0].strip()

        results = json.loads(response_text)
        return results

    except json.JSONDecodeError:
        print("Error: AI response was not valid JSON")
        return None

    except Exception as e:
        print(f"Error calling Google AI: {str(e)}")
        return None
