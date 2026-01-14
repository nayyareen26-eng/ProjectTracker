from sqlalchemy import Column, Integer, String,DateTime, Boolean
from app.database.database import Base

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100))
    email_id = Column(String(100))
    job_profile = Column(String(50))
    password = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=False)
    
