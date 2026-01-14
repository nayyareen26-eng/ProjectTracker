from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

from app.database.database import SessionLocal
from app.models.user import User
from app.schemas.auth_schemas import (
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest
)
from app.utils.password_utils import verify_password, hash_password
from app.utils.jwt_utils import create_access_token
from app.utils.email_utils import send_reset_password_email

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Auth"]
)

# DB DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  LOGIN
@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email_id == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.password:
        raise HTTPException(
            status_code=403,
            detail="Password not set. Please reset password"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    # JWT TOKEN
    token_data = {
        "user_id": user.user_id,
        "email": user.email_id
    }

    access_token = create_access_token(token_data)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "job_profile": user.job_profile
    }


#  FORGOT PASSWORD
@router.post("/forgot-password")
async def forgot_password(
    email: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email_id == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate reset token
    token = str(uuid.uuid4())

    user.reset_token =token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)

    db.commit()

    
    reset_link = f"http://localhost:3000/set-password?token={token}"

    await send_reset_password_email(
        to_email=user.email_id,
        first_name=user.user_name,
        token=token 
    )

    return {"message": "Password reset email sent"}

#  RESET PASSWORD 
@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.reset_token == data.token,
        User.reset_token_expiry > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )

    # Password validation
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    # Hash & save password
    user.password = hash_password(data.new_password)
    user.is_active = True
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {
        "message": "Password reset successful"
    }
