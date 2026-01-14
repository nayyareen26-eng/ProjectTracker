from sqlalchemy import Column, Integer, String
from app.database.database import Base

class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    role_type = Column(String(30), nullable=False)
    role_scope = Column(String(30), nullable=False)
