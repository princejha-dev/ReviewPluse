from groq import Groq
from typing import List, Dict
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Hardcoded Restaurant Categories
RESTAURANT_CATEGORIES = [
    "food_quality",
    "service_quality",
    "ambience_cleanliness",
    "wait_time_efficiency",
    "pricing_value"
]

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


def analyze_batch(reviews: List[Dict]) -> List[Dict]:
    """
    Send a batch of restaurant reviews to Groq LLM for sentiment analysis
    
    Input:
    reviews = [
        {"id": 1, "review_text": "Great food, amazing service"},
        {"id": 2, "review_text": "Terrible experience, very slow"}
    ]
    
    Output:
    [
        {"id": 1, "sentiment": "positive", "issue_category": "food_quality"},
        {"id": 2, "sentiment": "negative", "issue_category": "wait_time_efficiency"}
    ]
    """
    
    # Build the prompt for AI
    reviews_text = "\n".join([
        f"ID: {r['id']}, Review: {r['review_text']}"
        for r in reviews
    ])
    
    categories_str = ", ".join(RESTAURANT_CATEGORIES)
    
    prompt = f"""You are a sentiment analysis expert for restaurant reviews.

For EACH review below:
1. Determine sentiment: positive, negative, or neutral
2. Choose BEST matching category from: {categories_str}

Reviews:
{reviews_text}

Output ONLY a JSON array, nothing else. Format:
[
  {{"id": 1, "sentiment": "positive", "issue_category": "food_quality"}},
  {{"id": 2, "sentiment": "negative", "issue_category": "wait_time_efficiency"}}
]

Remember: Output ONLY JSON array, no text before or after."""
    
    try:
        # Call Groq LLM with reliable model
        message = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,  # Lower temp for consistent JSON output
            max_tokens=2000
        )
        response_text = message.choices[0].message.content.strip()
        
        # Extract JSON from response (handle cases where model adds text)
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            json_str = response_text
        
        # Parse JSON response
        results = json.loads(json_str)
        
        return results
    
    except json.JSONDecodeError as e:
        print(f"Error: Could not parse JSON. Raw response: {response_text[:200]}")
        print(f"JSON Error: {str(e)}")
        return None
    
    except Exception as e:
        print(f"Error calling Groq LLM: {str(e)}")
        return None
