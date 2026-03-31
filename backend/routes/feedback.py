from fastapi import APIRouter, File, UploadFile, HTTPException
from ..db.database import SessionLocal
from ..db.crud import save_feedback_batch, get_feedback_summary, get_all_feedbacks, get_sentiment_trend, get_insights, get_alerts
from ..utils.csv_parser import validate_csv
from ..services.batch_processor import process_all_batches

router = APIRouter(prefix="/api", tags=["feedback"])


@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload CSV file with reviews.
    Categories are hardcoded for restaurants: staff, food_quality, ambience, wait_time, hygiene.
    After upload, auto-processes all reviews in batches of 15.
    """
    db = SessionLocal()

    try:
        # Validate CSV
        is_valid, error_msg, df = validate_csv(file.file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        # Prepare reviews
        reviews_data = []
        for _, row in df.iterrows():
            reviews_data.append({
                'review_text': row['review_text'],
                'rating': row.get('rating')
            })

        # Save all reviews to database
        feedback_items = save_feedback_batch(db, reviews_data)
        reviews_count = len(feedback_items)

        # Auto-process in batches of 15
        process_result = process_all_batches(db, batch_size=15)

        return {
            "message": "Upload and processing complete",
            "reviews_uploaded": reviews_count,
            "processing": process_result,
            "success": True
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    finally:
        db.close()


@router.get("/summary")
async def get_summary():
    """Dashboard summary: totals, sentiment counts, strengths, issues"""
    db = SessionLocal()
    try:
        return get_feedback_summary(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/feedback")
async def get_feedbacks():
    """Get all feedbacks for the feedback list"""
    db = SessionLocal()
    try:
        feedbacks = get_all_feedbacks(db)
        return [
            {
                "id": f.id,
                "text": f.review_text,
                "sentiment": f.sentiment or "pending",
                "issue": f.predicted_issue or "pending",
                "category_type": f.category_type or "pending",
                "rating": f.rating,
                "processed": f.processed,
            }
            for f in feedbacks
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/trend")
async def get_trend():
    """Sentiment trend data grouped by date"""
    db = SessionLocal()
    try:
        return get_sentiment_trend(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/insights")
async def get_insights_data():
    """Issue breakdown, strength breakdown, KPIs"""
    db = SessionLocal()
    try:
        return get_insights(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/alerts")
async def get_alerts_data():
    """Dynamic alerts based on feedback analysis"""
    db = SessionLocal()
    try:
        return get_alerts(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()