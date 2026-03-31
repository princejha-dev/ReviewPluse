from sqlalchemy import Integer, Column, Text, String, Boolean, DateTime
from datetime import datetime
from .database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    review_text = Column(Text)
    rating = Column(Integer, nullable=True)

    predicted_issue = Column(String, nullable=True)  # staff, food_quality, ambience, wait_time, hygiene
    sentiment = Column(String, nullable=True)         # positive, negative, neutral
    category_type = Column(String, nullable=True)     # strength, issue, observation

    processed = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.now)
    analyzed_at = Column(DateTime, nullable=True)