from fastapi import APIRouter, File, UploadFile, HTTPException
from ..db.database import SessionLocal
from ..db.crud import save_feedback_batch
from ..utils.csv_parser import validate_csv
from ..services.batch_processor import process_single_batch, process_all_batches
from ..services.alert_engine import AlertEngine
from ..services.insights_engine import InsightEngine
import json

router = APIRouter(prefix="/api", tags=["feedback"])


@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...)
):
    """
    Upload CSV file with restaurant reviews
    
    Expected format:
    - CSV columns: review_text (required), rating (optional)
    
    Categories are hardcoded in backend:
    - food_quality
    - service_quality
    - ambience_cleanliness
    - wait_time_efficiency
    - pricing_value
    """
    
    db = SessionLocal()
    
    try:
        # Validate and read CSV
        is_valid, error_msg, df = validate_csv(file.file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Prepare reviews for database
        reviews_data = []
        for _, row in df.iterrows():
            reviews_data.append({
                'review_text': row['review_text'],
                'rating': row.get('rating')  # Optional
            })
        
        # Save all reviews to database
        feedback_items = save_feedback_batch(db, reviews_data)
        
        return {
            "message": "Upload successful",
            "reviews_uploaded": len(feedback_items),
            "reviews_ready_for_processing": len(feedback_items),
            "categories": [
                "food_quality",
                "service_quality",
                "ambience_cleanliness",
                "wait_time_efficiency",
                "pricing_value"
            ]
        }
    
    except HTTPException:
        db.close()
        raise
    
    except Exception as e:
        db.close()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
    finally:
        db.close()


@router.post("/process-batch")
async def process_one_batch():
    """
    STEP 3 & 4: Process ONE batch of 15 unprocessed reviews
    
    This triggers:
    - Get 15 unprocessed reviews (Step 3)
    - Send to Google AI (Step 4)
    - Save results to database
    """
    db = SessionLocal()
    
    try:
        result = process_single_batch(db)
        return result
    
    except Exception as e:
        return {"message": f"Batch processing failed: {str(e)}", "success": False}
    
    finally:
        db.close()


@router.post("/process-all-batches")
async def process_all():
    """
    STEP 3 & 4: Process ALL unprocessed reviews in batches of 15
    
    This continuously:
    - Gets 15 unprocessed reviews (Step 3)
    - Sends to Groq AI (Step 4)
    - Saves results
    - Repeats until no more reviews
    """
    db = SessionLocal()
    
    try:
        result = process_all_batches(db)
        return result
    
    except Exception as e:
        return {"message": f"Batch processing failed: {str(e)}", "success": False}
    
    finally:
        db.close()


@router.get("/alerts")
async def get_alerts():
    """
    Get active alerts based on current feedback analysis
    
    Alerts include:
    - Negative sentiment spike
    - Issue concentration (one problem dominates)
    - Rating/sentiment mismatches
    """
    db = SessionLocal()
    
    try:
        alert_engine = AlertEngine(db)
        alerts = alert_engine.get_all_alerts()
        
        return {
            "active_alerts": len(alerts),
            "alerts": alerts
        }
    
    except Exception as e:
        return {"error": str(e), "alerts": []}
    
    finally:
        db.close()


@router.get("/insights")
async def get_insights():
    """
    Generate AI-powered insights from all processed feedback
    
    Returns:
    - Top strengths
    - Areas for improvement
    - Actionable recommendations
    - Overall assessment
    """
    db = SessionLocal()
    
    try:
        insight_engine = InsightEngine(db)
        insights = insight_engine.generate_insights()
        return insights
    
    except Exception as e:
        return {"success": False, "error": str(e)}
    
    finally:
        db.close()