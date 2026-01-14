from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.department import Department
from app.schemas.department_schemas import DepartmentResponse

router = APIRouter(
    prefix="/api/v1",
    tags=["Department"]
)

#  All departments
@router.get("/department", response_model=list[DepartmentResponse])
def get_all_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

#  Departments in a specific company
@router.get("/company/{company_id}/department", response_model=list[DepartmentResponse])
def get_departments_by_company(company_id: int, db: Session = Depends(get_db)):
    return db.query(Department).filter(Department.company_id == company_id).all()
