from sqlalchemy import Integer, Column, Text, String, Boolean, DateTime
from datetime import datetime
from .database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    review_text = Column(Text)
    rating = Column(Integer, nullable=True)

    # AI Analysis Results
    sentiment = Column(String, nullable=True)         # positive, negative, neutral
    predicted_issue = Column(String, nullable=True)   # food_quality, service_quality, ambience_cleanliness, wait_time_efficiency, pricing_value

    processed = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.now)
    analyzed_at = Column(DateTime, nullable=True)