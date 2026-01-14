from fastapi import APIRouter , Depends, HTTPException
from sqlalchemy.orm import Session 

from app.database.database import SessionLocal
from app.models.user import User
from app.schemas.auth_schemas import LoginRequest, LoginResponse

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Auth"]
)

#DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email_id == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")
    
    return {
        "message": "Login successful",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "job_profile": user.job_profile
        }
