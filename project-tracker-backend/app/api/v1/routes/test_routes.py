# app/api/v1/routes/test_routes.py

from fastapi import APIRouter, Depends
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/test", tags=["Test"])

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "email": current_user.email_id,
        "role": current_user.job_profile
    }
