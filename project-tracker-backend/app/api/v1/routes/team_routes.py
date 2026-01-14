from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.team import Team
from app.schemas.team_schemas import TeamResponse

router = APIRouter(
    prefix="/api/v1/department",
    tags=["Teams"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Get all teams of a dep
@router.get(
    "/{department_id}/team",
    response_model=list[TeamResponse]
)

def get_teams_by_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    teams = db.query(Team).filter(
        Team.department_id == department_id
    ).all()
    return teams