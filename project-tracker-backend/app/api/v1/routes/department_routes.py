from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.department import Department

router = APIRouter(
    prefix="/api/v1/department",
    tags=["Department"]
)

#department list
@router.get("/")
def get_all_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()
    
