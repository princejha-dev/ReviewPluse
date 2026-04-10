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

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="customer") # 'customer' or 'business'
    created_at = Column(DateTime, default=datetime.now)