from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 

from app.database.database import SessionLocal
from app.models.project import Project

router = APIRouter(
    prefix="/api/v1/team",
    tags=["Team Projects"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{team_id}/project")
def get_projects_by_team(
    team_id: int,
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(
        Project.team_id == team_id
    ).all()

    return {
        "count": len(projects),
        "projects": projects
    }