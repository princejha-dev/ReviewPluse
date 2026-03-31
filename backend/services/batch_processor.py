from sqlalchemy.orm import Session
from ..db.crud import get_unprocessed_reviews, update_feedback_results
from ..services.ai_service import analyze_batch
from typing import Dict


def process_all_batches(db: Session, batch_size: int = 15) -> Dict:
    """
    Process ALL unprocessed reviews in batches of 15.
    Each batch is sent to Google AI separately, results saved, then next batch.
    """
    total_processed = 0
    batches_processed = 0
    errors = 0

    while True:
        # Get next batch of 15 unprocessed reviews
        batch = get_unprocessed_reviews(db, limit=batch_size)

        if not batch:
            break

        # Prepare batch data for AI
        reviews_for_ai = [
            {"id": r.id, "review_text": r.review_text}
            for r in batch
        ]

        # Send batch to AI
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
