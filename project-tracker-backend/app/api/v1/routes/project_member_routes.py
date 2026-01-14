from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.database import SessionLocal
from app.models.project_member import ProjectMember
from app.schemas.project_member_schema import (ProjectMemberCreate, ProjectMemberResponse)

router = APIRouter(
    prefix="/api/v1/project-members",
    tags=["Project Members"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProjectMemberResponse)
def add_project_member(data: ProjectMemberCreate, db: Session = Depends(get_db)):
    
    #check duplicate
    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == data.project_id,
        ProjectMember.user_id == data.user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already added to this Project"
        )
    member = ProjectMember(**data.dict())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


#Get all members of a project
@router.get("/project/{project_id}")
def get_project_members(project_id: int, db: Session = Depends(get_db)):

    query = text("""
        SELECT 
            u.user_id,
            u.user_name,
            u.email_id,
            r.id AS role_id,
            r.role_type
        FROM project_member pm
        JOIN user u ON pm.user_id = u.user_id
        JOIN role r ON pm.role_id = r.id
        WHERE pm.project_id = :project_id
    """)

    result = db.execute(query, {"project_id": project_id}).mappings().all()

    return result