from sqlalchemy.orm import Session
from .models import Feedback
from datetime import datetime


def save_feedback_batch(db: Session, reviews_data: list) -> list:
    """
    Save multiple reviews (feedbacks) to database
    reviews_data format: [
        {'review_text': '...', 'rating': 5},
        {'review_text': '...', 'rating': 4},
        ...
    ]
    """
    feedback_items = []
    
    for review in reviews_data:
        feedback = Feedback(
            review_text=review.get('review_text'),
            rating=review.get('rating'),  # Optional
            processed=False,  # Not yet processed by AI
            uploaded_at=datetime.now()
        )
        db.add(feedback)
        feedback_items.append(feedback)
    
    db.commit()
    return feedback_items


def get_unprocessed_reviews(db: Session, limit: int = 15) -> list:
    """
    Get reviews that haven't been processed by AI yet
    Used for batch processing
    """
    reviews = db.query(Feedback).filter(
        Feedback.processed == False
    ).limit(limit).all()
    return reviews


def update_feedback_results(db: Session, feedback_id: int, sentiment: str, issue_category: str):
    """
    Update feedback with AI analysis results
    Used after AI processes the batch
    """
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if feedback:
        feedback.sentiment = sentiment
        feedback.predicted_issue = issue_category
        feedback.processed = True
        feedback.analyzed_at = datetime.now()
        db.commit()
        db.refresh(feedback)
    
    return feedback
