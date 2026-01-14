from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.department import Department

class Team(Base):
    __tablename__ = "team"

    team_id = Column(Integer, primary_key=True, index=True)
    team_name = Column(String(50))

    department_id = Column(Integer, ForeignKey("department.department_id"))

    department = relationship("Department", back_populates="teams")
