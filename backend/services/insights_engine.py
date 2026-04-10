from sqlalchemy.orm import Session
from ..db.models import Feedback
from groq import Groq
import json
import os
import re
from dotenv import load_dotenv
from typing import Dict

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


class InsightEngine:
    """
    Generate AI-powered insights from feedback analysis results
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_sentiment_distribution(self) -> Dict:
        """Get sentiment counts and percentages"""
        reviews = self.db.query(Feedback).filter(
            Feedback.processed == True
        ).all()
        
        if not reviews:
            return {}
        
        sentiment_counts = {
            "positive": 0,
            "negative": 0,
            "neutral": 0
        }
        
        for review in reviews:
            if review.sentiment in sentiment_counts:
                sentiment_counts[review.sentiment] += 1
        
        total = sum(sentiment_counts.values())
        
        return {
            "positive": {
                "count": sentiment_counts["positive"],
                "percentage": (sentiment_counts["positive"] / total * 100) if total > 0 else 0
            },
            "negative": {
                "count": sentiment_counts["negative"],
                "percentage": (sentiment_counts["negative"] / total * 100) if total > 0 else 0
            },
            "neutral": {
                "count": sentiment_counts["neutral"],
                "percentage": (sentiment_counts["neutral"] / total * 100) if total > 0 else 0
            },
            "total": total
        }
    
    
    def get_issue_breakdown(self) -> Dict:
        """Get top issues and their frequencies"""
        reviews = self.db.query(Feedback).filter(
            Feedback.processed == True
        ).all()
        
        if not reviews:
            return {}
        
        issue_counts = {}
        for review in reviews:
            if review.predicted_issue:
                issue_counts[review.predicted_issue] = issue_counts.get(review.predicted_issue, 0) + 1
        
        # Get average rating per issue
        issue_ratings = {}
        for review in reviews:
            if review.predicted_issue and review.rating:
                if review.predicted_issue not in issue_ratings:
                    issue_ratings[review.predicted_issue] = []
                issue_ratings[review.predicted_issue].append(review.rating)
        
        issue_data = {}
        for issue, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
            ratings = issue_ratings.get(issue, [])
            avg_rating = sum(ratings) / len(ratings) if ratings else 0
            
            issue_data[issue] = {
                "count": count,
                "percentage": (count / len(reviews) * 100),
                "avg_rating": round(avg_rating, 2)
            }
        
        return issue_data
    
    
    def get_summary_stats(self) -> Dict:
        """Get key statistics"""
        reviews = self.db.query(Feedback).filter(
            Feedback.processed == True
        ).all()
        
        if not reviews:
            return {}
        
        ratings = [r.rating for r in reviews if r.rating]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        
        return {
            "total_reviews": len(reviews),
            "average_rating": round(avg_rating, 2),
            "min_rating": min(ratings) if ratings else 0,
            "max_rating": max(ratings) if ratings else 0
        }
    
    
    def generate_insights(self) -> Dict:
        """
        Generate AI-powered insights using Groq
        Based on aggregated sentiment, issues, and ratings
        """
        sentiment_dist = self.get_sentiment_distribution()
        issue_breakdown = self.get_issue_breakdown()
        summary = self.get_summary_stats()
        
        if not sentiment_dist or summary.get("total_reviews", 0) == 0:
            return {
                "success": False,
                "message": "Not enough processed reviews for insights"
            }
        
        # Convert data to readable format for AI
        data_summary = f"""
Restaurant Feedback Analysis Summary:

Overall Statistics:
- Total Reviews Analyzed: {summary['total_reviews']}
- Average Rating: {summary['average_rating']}/5
- Rating Range: {summary['min_rating']} to {summary['max_rating']}

Sentiment Distribution:
- Positive: {sentiment_dist['positive']['count']} reviews ({sentiment_dist['positive']['percentage']:.1f}%)
- Negative: {sentiment_dist['negative']['count']} reviews ({sentiment_dist['negative']['percentage']:.1f}%)
- Neutral: {sentiment_dist['neutral']['count']} reviews ({sentiment_dist['neutral']['percentage']:.1f}%)

Top Issues:
"""
        for issue, data in list(issue_breakdown.items())[:5]:
            data_summary += f"\n- {issue}: {data['count']} mentions ({data['percentage']:.1f}%) | Avg Rating: {data['avg_rating']}"
        
        prompt = f"""You are a restaurant consultant analyzing customer feedback.

{data_summary}

Based on this analysis, provide a JSON response with these exact keys:
- strengths: array of 3 strings
- improvements: array of 3 strings
- recommendations: array of 2-3 strings
- assessment: single string sentence

Return ONLY valid JSON object, no other text.

Example format:
{{
  "strengths": ["Good food quality", "Friendly staff", "Clean"],
  "improvements": ["Reduce wait times", "Lower prices", "Better parking"],
  "recommendations": ["Add more staff", "Speed up kitchen"],
  "assessment": "Good restaurant with potential."
}}
"""
        
        try:
            message = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            response_text = message.choices[0].message.content.strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                json_str = response_text
            
            # Try to parse as JSON
            try:
                insights = json.loads(json_str)
            except json.JSONDecodeError:
                # If not valid JSON, return as text with fallback
                print(f"Warning: Could not parse insights JSON. Raw: {response_text[:200]}")
                insights = {
                    "strengths": ["Analysis in progress"],
                    "improvements": ["Pending"],
                    "recommendations": ["See raw response"],
                    "assessment": response_text[:100]
                }
            
            # Deterministic override for strengths/improvements
            try:
                # Calculate the most positive and negative issues
                # Get reviews
                from sqlalchemy import func
                from ..db.models import Feedback
                
                pos_issues = self.db.query(
                    Feedback.predicted_issue, func.count(Feedback.id).label("count")
                ).filter(Feedback.processed == True, Feedback.sentiment == "positive").group_by(Feedback.predicted_issue).order_by(func.count(Feedback.id).desc()).all()
                
                neg_issues = self.db.query(
                    Feedback.predicted_issue, func.count(Feedback.id).label("count")
                ).filter(Feedback.processed == True, Feedback.sentiment == "negative").group_by(Feedback.predicted_issue).order_by(func.count(Feedback.id).desc()).all()
                
                real_strengths = [row.predicted_issue.replace('_', ' ').capitalize() for row in pos_issues if row.predicted_issue]
                real_issues = [row.predicted_issue.replace('_', ' ').capitalize() for row in neg_issues if row.predicted_issue]
                
                if real_strengths:
                    insights["strengths"] = real_strengths[:3]
                if real_issues:
                    insights["improvements"] = real_issues[:3]
                    
            except Exception as ex:
                print(f"Error overriding deterministically: {ex}")

            return {
                "success": True,
                "insights": insights,
                "summary": {
                    "total_reviews": summary['total_reviews'],
                    "average_rating": summary['average_rating'],
                    "sentiment": sentiment_dist,
                    "top_issues": issue_breakdown
                }
            }
        
        except Exception as e:
            return {
                "success": False,
                "message": f"Error generating insights: {str(e)}"
            }
