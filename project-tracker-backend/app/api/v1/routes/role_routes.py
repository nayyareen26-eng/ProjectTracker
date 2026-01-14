from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.role import Role 
from app.schemas.role_schema import RoleResponse

router = APIRouter(
    prefix="/api/v1/role",
    tags=["Role"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally: 
        db.close()

#Get all roles (dropdown)
@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

# Get SYSTEM roles (Admin dashboard)
@router.get("/system", response_model=list[RoleResponse])
def get_system_roles(db: Session = Depends(get_db)):
    return db.query(Role).filter(Role.role_scope == "SYSTEM", Role.role_type != "ADMIN").all()

# Get PROJECT roles (PM dashboard)
@router.get("/project", response_model=list[RoleResponse])
def get_project_roles(db: Session = Depends(get_db)):
    return db.query(Role).filter(Role.role_scope == "PROJECT").all()

