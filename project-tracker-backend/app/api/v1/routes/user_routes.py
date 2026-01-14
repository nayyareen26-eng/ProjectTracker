from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.user_schemas import UserCreate, UserResponse
from typing import List

router = APIRouter(
    prefix="/api/v1/user",
    tags=["Users"]
)

#create user (Admin)
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email_id == user.email_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        user_name=user.user_name,
        email_id=user.email_id,
        job_profile=user.job_profile
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

#get users for PM while creating a project
@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
