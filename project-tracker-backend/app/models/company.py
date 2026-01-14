from sqlalchemy import Column, Integer, String 
from sqlalchemy.orm import relationship
from app.database.database import Base

class Company(Base):
    __tablename__ = "company"

    id = Column("company_id", Integer, primary_key=True, index=True)
    company_name = Column(String(20), nullable=True)

    department = relationship("Department", back_populates="company")