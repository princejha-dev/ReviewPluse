from pydantic import BaseModel
from typing import List
from datetime import datetime


# Simple schema for feedback data
class FeedbackCreate(BaseModel):
    review_text: str
    rating: int = None


class FeedbackResponse(BaseModel):
    id: int
    review_text: str
    rating: int
    processed: bool
    sentiment: str = None
    predicted_issue: str = None
    uploaded_at: datetime = None

    class Config:
        from_attributes = True


# Schema for category configuration
class CategoryConfig(BaseModel):
    categories: List[str]


class CategoryConfigResponse(BaseModel):
    id: int
    categories: List[str]
    uploaded_at: datetime = None

    class Config:
        from_attributes = True
