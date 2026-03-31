from sqlalchemy.orm import Session
from .models import Feedback
import json
from datetime import datetime
from collections import defaultdict

# Hardcoded restaurant categories
RESTAURANT_CATEGORIES = ["staff", "food_quality", "ambience", "wait_time", "hygiene"]


def save_feedback_batch(db: Session, reviews_data: list) -> list:
    """Save multiple reviews to database"""
    feedback_items = []
    for review in reviews_data:
        feedback = Feedback(
            review_text=review.get('review_text'),
            rating=review.get('rating'),
            processed=False,
            uploaded_at=datetime.now()
        )
        db.add(feedback)
        feedback_items.append(feedback)
    db.commit()
    return feedback_items


def get_unprocessed_reviews(db: Session, limit: int = 15) -> list:
    """Get reviews not yet processed by AI (batch of 15)"""
    return db.query(Feedback).filter(
        Feedback.processed == False
    ).limit(limit).all()


def update_feedback_results(db: Session, feedback_id: int, sentiment: str, issue_category: str):
    """Update feedback with AI analysis results"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if feedback:
        feedback.sentiment = sentiment
        feedback.predicted_issue = issue_category
        # Determine category type based on sentiment
        if sentiment == "positive":
            feedback.category_type = "strength"
        elif sentiment == "negative":
            feedback.category_type = "issue"
        else:
            feedback.category_type = "observation"
        feedback.processed = True
        feedback.analyzed_at = datetime.now()
        db.commit()
        db.refresh(feedback)
    return feedback


def get_feedback_summary(db: Session) -> dict:
    """Dashboard summary: totals, sentiment counts, strengths vs issues"""
    feedbacks = db.query(Feedback).all()
    processed = [f for f in feedbacks if f.processed]
    total = len(feedbacks)
    total_processed = len(processed)

    positive = sum(1 for f in processed if f.sentiment == "positive")
    neutral = sum(1 for f in processed if f.sentiment == "neutral")
    negative = sum(1 for f in processed if f.sentiment == "negative")

    # Build issues (negative) and strengths (positive) breakdown
    issues = {}
    strengths = {}
    for f in processed:
        if f.predicted_issue:
            if f.category_type == "issue":
                issues[f.predicted_issue] = issues.get(f.predicted_issue, 0) + 1
            elif f.category_type == "strength":
                strengths[f.predicted_issue] = strengths.get(f.predicted_issue, 0) + 1

    return {
        "total": total,
        "total_processed": total_processed,
        "positive": positive,
        "neutral": neutral,
        "negative": negative,
        "issues": issues,
        "strengths": strengths,
    }


def get_all_feedbacks(db: Session) -> list:
    """Get all feedbacks for the feedback list page"""
    return db.query(Feedback).order_by(Feedback.uploaded_at.desc()).all()


def get_sentiment_trend(db: Session) -> list:
    """Sentiment counts grouped by date for line chart"""
    feedbacks = db.query(Feedback).filter(Feedback.processed == True).all()
    daily = defaultdict(lambda: {"positive": 0, "neutral": 0, "negative": 0})
    for f in feedbacks:
        date_key = f.analyzed_at.strftime("%Y-%m-%d") if f.analyzed_at else f.uploaded_at.strftime("%Y-%m-%d")
        if f.sentiment in ("positive", "neutral", "negative"):
            daily[date_key][f.sentiment] += 1
    return [
        {"name": d, "positive": daily[d]["positive"], "neutral": daily[d]["neutral"], "negative": daily[d]["negative"]}
        for d in sorted(daily.keys())
    ]


def get_insights(db: Session) -> dict:
    """Issue breakdown, strengths breakdown, KPIs"""
    feedbacks = db.query(Feedback).filter(Feedback.processed == True).all()
    total = len(feedbacks)

    if total == 0:
        return {"issue_breakdown": [], "strength_breakdown": [], "kpis": {"total_processed": 0, "issues_found": 0, "negative_rate": 0, "positive_rate": 0}}

    issue_counts = {}
    strength_counts = {}
    for f in feedbacks:
        if f.predicted_issue:
            if f.category_type == "issue":
                issue_counts[f.predicted_issue] = issue_counts.get(f.predicted_issue, 0) + 1
            elif f.category_type == "strength":
                strength_counts[f.predicted_issue] = strength_counts.get(f.predicted_issue, 0) + 1

    issue_breakdown = [
        {"name": k, "count": v, "percentage": round((v / total) * 100, 1)}
        for k, v in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)
    ]
    strength_breakdown = [
        {"name": k, "count": v, "percentage": round((v / total) * 100, 1)}
        for k, v in sorted(strength_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    negative_count = sum(1 for f in feedbacks if f.sentiment == "negative")
    positive_count = sum(1 for f in feedbacks if f.sentiment == "positive")

    return {
        "issue_breakdown": issue_breakdown,
        "strength_breakdown": strength_breakdown,
        "kpis": {
            "total_processed": total,
            "issues_found": len(issue_counts),
            "strengths_found": len(strength_counts),
            "negative_rate": round((negative_count / total) * 100, 1),
            "positive_rate": round((positive_count / total) * 100, 1),
        },
    }


def get_alerts(db: Session) -> list:
    """Generate dynamic alerts based on feedback data"""
    alerts = []
    all_feedbacks = db.query(Feedback).all()
    total = len(all_feedbacks)
    processed = [f for f in all_feedbacks if f.processed]
    unprocessed_count = total - len(processed)

    if len(processed) > 0:
        negative_count = sum(1 for f in processed if f.sentiment == "negative")
        negative_pct = round((negative_count / len(processed)) * 100, 1)

        if negative_pct > 30:
            alerts.append({
                "type": "critical", "title": "⚠️ High Negative Sentiment",
                "message": f"Negative sentiment is at {negative_pct}% — exceeds 30% threshold.", "color": "red"
            })

        # Repeated negative issues
        issue_counts = {}
        for f in processed:
            if f.predicted_issue and f.sentiment == "negative":
                issue_counts[f.predicted_issue] = issue_counts.get(f.predicted_issue, 0) + 1
        for issue, count in issue_counts.items():
            if count >= 3:
                alerts.append({
                    "type": "warning", "title": f"🔁 Repeated Issue: {issue.replace('_', ' ').title()}",
                    "message": f"{count} negative reviews about '{issue.replace('_', ' ')}'. Consider taking action.", "color": "orange"
                })

        # Positive trend
        positive_count = sum(1 for f in processed if f.sentiment == "positive")
        positive_pct = round((positive_count / len(processed)) * 100, 1)
        if positive_pct > 60:
            alerts.append({
                "type": "success", "title": "📈 Strong Positive Trend",
                "message": f"Positive sentiment is at {positive_pct}%. Great work!", "color": "green"
            })

        # Top strength alert
        strength_counts = {}
        for f in processed:
            if f.predicted_issue and f.sentiment == "positive":
                strength_counts[f.predicted_issue] = strength_counts.get(f.predicted_issue, 0) + 1
        if strength_counts:
            top_strength = max(strength_counts, key=strength_counts.get)
            alerts.append({
                "type": "success", "title": f"💪 Top Strength: {top_strength.replace('_', ' ').title()}",
                "message": f"{strength_counts[top_strength]} positive reviews praise '{top_strength.replace('_', ' ')}'.", "color": "green"
            })

    if unprocessed_count > 0:
        alerts.append({
            "type": "info", "title": "⏳ Pending Reviews",
            "message": f"{unprocessed_count} reviews are waiting for AI processing.", "color": "blue"
        })

    if not alerts:
        alerts.append({
            "type": "info", "title": "✅ All Good",
            "message": "No alerts. Upload feedback to get started.", "color": "green"
        })

    return alerts
