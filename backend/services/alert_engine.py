from sqlalchemy.orm import Session
from ..db.models import Feedback
from datetime import datetime, timedelta
from typing import List, Dict


class AlertEngine:
    """
    Generate alerts based on feedback analysis results
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def check_negative_spike(self, hours: int = 24) -> Dict:
        """
        Alert if negative feedback exceeds threshold in recent hours
        Returns alert if > 40% of recent reviews are negative
        """
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        recent_reviews = self.db.query(Feedback).filter(
            Feedback.uploaded_at >= cutoff_time,
            Feedback.processed == True
        ).all()
        
        if not recent_reviews:
            return {"alert": False, "message": "No recent reviews"}
        
        negative_count = len([r for r in recent_reviews if r.sentiment == "negative"])
        negative_percentage = (negative_count / len(recent_reviews)) * 100
        
        if negative_percentage > 40:
            return {
                "alert": True,
                "type": "NEGATIVE_SPIKE",
                "severity": "HIGH" if negative_percentage > 60 else "MEDIUM",
                "message": f"⚠️  {negative_percentage:.1f}% negative feedback in last {hours} hours",
                "details": {
                    "negative_count": negative_count,
                    "total_reviews": len(recent_reviews),
                    "percentage": negative_percentage
                }
            }
        
        return {"alert": False, "message": "Sentiment within normal range"}
    
    
    def check_issue_concentration(self, threshold: int = 30) -> Dict:
        """
        Alert if one issue category dominates > threshold% of reviews
        """
        processed_reviews = self.db.query(Feedback).filter(
            Feedback.processed == True
        ).all()
        
        if not processed_reviews:
            return {"alert": False, "message": "No processed reviews"}
        
        # Count issues
        issue_counts = {}
        for review in processed_reviews:
            issue = review.predicted_issue
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
        
        # Find dominant issue
        if issue_counts:
            dominant_issue = max(issue_counts, key=issue_counts.get)
            dominant_count = issue_counts[dominant_issue]
            dominant_percentage = (dominant_count / len(processed_reviews)) * 100
            
            if dominant_percentage > threshold:
                return {
                    "alert": True,
                    "type": "ISSUE_CONCENTRATION",
                    "severity": "MEDIUM",
                    "message": f"⚠️  {dominant_issue} accounts for {dominant_percentage:.1f}% of issues",
                    "details": {
                        "dominant_issue": dominant_issue,
                        "count": dominant_count,
                        "percentage": dominant_percentage,
                        "all_issues": issue_counts
                    }
                }
        
        return {"alert": False, "message": "Issues well distributed"}
    
    
    def check_low_ratings_with_positive_sentiment(self) -> Dict:
        """
        Alert if there's mismatch: low rating but positive sentiment
        Could indicate potential review manipulation or rating system issues
        """
        mismatches = self.db.query(Feedback).filter(
            Feedback.rating <= 2,
            Feedback.sentiment == "positive"
        ).all()
        
        if len(mismatches) > 3:
            return {
                "alert": True,
                "type": "RATING_SENTIMENT_MISMATCH",
                "severity": "LOW",
                "message": f"⚠️  {len(mismatches)} reviews have low rating but positive sentiment",
                "details": {
                    "count": len(mismatches),
                    "review_ids": [r.id for r in mismatches[:10]]  # Show first 10
                }
            }
        
        return {"alert": False, "message": "Ratings aligned with sentiment"}
    
    
    def get_all_alerts(self) -> List[Dict]:
        """
        Run all alert checks and return active alerts
        """
        alerts = []
        
        negative_spike = self.check_negative_spike(hours=24)
        if negative_spike.get("alert"):
            alerts.append(negative_spike)
        
        issue_concentration = self.check_issue_concentration(threshold=30)
        if issue_concentration.get("alert"):
            alerts.append(issue_concentration)
        
        rating_mismatch = self.check_low_ratings_with_positive_sentiment()
        if rating_mismatch.get("alert"):
            alerts.append(rating_mismatch)
        
        return alerts
