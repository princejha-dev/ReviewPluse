from sqlalchemy.orm import Session
from ..db.crud import get_unprocessed_reviews, update_feedback_results
from ..services.ai_service import analyze_batch
from typing import Dict


def process_all_batches(db: Session, batch_size: int = 15) -> Dict:
    """
    Process ALL unprocessed reviews in batches
    
    Step 3: Get unprocessed reviews (15 at a time)
    Step 4: Send to Groq AI for analysis
    
    Returns: {
        "total_processed": 45,
        "batches_processed": 3,
        "errors": 0,
        "success": True
    }
    """
    
    total_processed = 0
    batches_processed = 0
    errors = 0
    
    while True:
        # STEP 3: Get next batch of unprocessed reviews
        batch = get_unprocessed_reviews(db, limit=batch_size)
        
        if not batch:  # No more reviews to process
            break
        
        # Prepare batch data
        reviews_for_ai = [
            {"id": r.id, "review_text": r.review_text}
            for r in batch
        ]
        
        # STEP 4: Send to Groq AI (no need to pass categories, they're hardcoded)
        ai_results = analyze_batch(reviews_for_ai)
        
        if ai_results is None:
            errors += len(batch)
            continue
        
        # Update database with AI results
        for result in ai_results:
            update_feedback_results(
                db,
                feedback_id=result["id"],
                sentiment=result["sentiment"],
                issue_category=result["issue_category"]
            )
        
        total_processed += len(batch)
        batches_processed += 1
        
        print(f"✓ Batch {batches_processed} processed: {len(batch)} reviews")
    
    return {
        "total_processed": total_processed,
        "batches_processed": batches_processed,
        "errors": errors,
        "success": errors == 0
    }


def process_single_batch(db: Session) -> Dict:
    """
    Process just ONE batch of 15 reviews
    Useful for testing and manual triggers
    """
    
    # STEP 3: Get one batch
    batch = get_unprocessed_reviews(db, limit=15)
    
    if not batch:
        return {
            "message": "No unprocessed reviews",
            "count": 0,
            "success": False
        }
    
    # Prepare batch data
    reviews_for_ai = [
        {"id": r.id, "review_text": r.review_text}
        for r in batch
    ]
    
    # STEP 4: Send to Groq AI (categories are hardcoded)
    ai_results = analyze_batch(reviews_for_ai)
    
    if ai_results is None:
        return {"message": "AI analysis failed", "success": False}
    
    # Update database
    for result in ai_results:
        update_feedback_results(
            db,
            feedback_id=result["id"],
            sentiment=result["sentiment"],
            issue_category=result["issue_category"]
        )
    
    return {
        "message": "Batch processed successfully",
        "reviews_processed": len(batch),
        "results": ai_results,
        "success": True
    }
