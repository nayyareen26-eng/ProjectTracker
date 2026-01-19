from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project_schemas import ProjectCreate, ProjectUpdate
from app.models.task import Task

router = APIRouter(
    prefix="/api/v1/project",
    tags=["Project"]
)

# ==========================
# CREATE PROJECT
# ==========================
@router.post("/")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
   
    creator = db.query(User).filter(
        User.user_id == project.created_by
    ).first()

    if not creator:
        raise HTTPException(status_code=404, detail="User not found")

    if creator.job_profile.strip().upper() not in [ "PROJECT MANAGER", "PRODUCT MANAGER"]:
        raise HTTPException(
            status_code=403,
            detail="Only Project Manager can create project"
        )

    new_project = Project(
        team_id=project.team_id,
        project_title=project.project_title,
        project_description=project.project_description,
        project_manager=project.project_manager,
        created_by=project.created_by
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project created successfully",
        "project_id": new_project.project_id
    }

# ==========================
# VIEW ALL PROJECTS
# ==========================
@router.get("/list")
def view_all_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return {
        "count": len(projects),
        "projects": projects
    }


# VIEW PROJECT BY ID
@router.get("/{project_id}")
def view_project_by_id(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project

# UPDATE PROJECT
@router.put("/{project_id}")
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):
    db_project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.project_title is not None:
        db_project.project_title = project.project_title

    if project.project_description is not None:
        db_project.project_description = project.project_description

    if project.project_manager is not None:
        db_project.project_manager = project.project_manager

    if project.status is not None:
        db_project.status = project.status

    db.commit()
    db.refresh(db_project)

    return {
        "message": "Project updated successfully",
        "project_id": db_project.project_id
    }


# DELETE PROJECT
@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully",
        "project_id": project_id
    }


# GET ALL TASKS OF A PROJECT

@router.get("/{project_id}/task")
def get_tasks_by_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    # check project exists
    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # fetch tasks
    tasks = db.query(Task).filter(
        Task.project_id == project_id
    ).all()

    return {
        "project_id": project_id,
        "count": len(tasks),
        "tasks": tasks
    }

#project  timeline
@router.get("/{project_id}/timeline")
def project_timeline(
    project_id: int,
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.project_id == project_id
    ).all()

    return [
        {
            "task_id": t.task_id,
            "title": t.task_title,
            "start": t.start_date,
            "end": t.due_date,
            "status": t.status
        }
        for t in tasks
    ]



from app.models.department import Department
from app.models.team import Team

#  3 GET PROJECT BY DEPARTMENT + TEAM + PROJECT ----------------
@router.get("/department/{dept_id}/team/{team_id}/project/{project_id}")
def view_project_scoped(
    dept_id: int,
    team_id: int,
    project_id: int,
    db: Session = Depends(get_db)
):
    # Check department exists
    dept = db.query(Department).filter(Department.department_id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    #  Check team exists under this department
    team = db.query(Team).filter(Team.team_id == team_id, Team.department_id == dept_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found in this department")

    #  Get the project under this team
    project = db.query(Project).filter(
        Project.project_id == project_id,
        Project.team_id == team_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this team")

    return project

@router.put("/department/{dept_id}/team/{team_id}/project/{project_id}")
def update_project_scoped(dept_id: int, team_id: int, project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)):
    # Validate department + team + project
    dept = db.query(Department).filter(Department.department_id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    team = db.query(Team).filter(Team.team_id == team_id, Team.department_id == dept_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found in this department")

    db_project = db.query(Project).filter(Project.project_id == project_id, Project.team_id == team_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found in this team")

    # Update only the fields that are provided
    if project.project_title is not None:
        db_project.project_title = project.project_title
    if project.project_description is not None:
        db_project.project_description = project.project_description
    if project.project_manager is not None:
        db_project.project_manager = project.project_manager
    if project.status is not None:
        db_project.status = project.status
   # if project.team_id is not None:
    #    db_project.team_id = project.team_id

    db.commit()
    db.refresh(db_project)

    return {"message": "Project updated successfully", "project_id": db_project.project_id}



# DELETE PROJECT

@router.delete("/department/{dept_id}/team/{team_id}/project/{project_id}")
def delete_project_scoped(dept_id: int, team_id: int, project_id: int, db: Session = Depends(get_db)):
    # Validate department + team + project
    dept = db.query(Department).filter(Department.department_id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    team = db.query(Team).filter(Team.team_id == team_id, Team.department_id == dept_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found in this department")

    project = db.query(Project).filter(Project.project_id == project_id, Project.team_id == team_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this team")

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully", "project_id": project_id}



# GET TASKS OF PROJECT

@router.get("/department/{dept_id}/team/{team_id}/project/{project_id}/task")
def get_tasks_by_project_scoped(dept_id: int, team_id: int, project_id: int, db: Session = Depends(get_db)):
    # Validate department + team + project
    dept = db.query(Department).filter(Department.department_id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    team = db.query(Team).filter(Team.team_id == team_id, Team.department_id == dept_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found in this department")

    project = db.query(Project).filter(Project.project_id == project_id, Project.team_id == team_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this team")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return {"project_id": project_id, "count": len(tasks), "tasks": tasks}



# PROJECT TIMELINE

@router.get("/department/{dept_id}/team/{team_id}/project/{project_id}/timeline")
def project_timeline_scoped(dept_id: int, team_id: int, project_id: int, db: Session = Depends(get_db)):
    # Validate department + team + project
    dept = db.query(Department).filter(Department.department_id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    team = db.query(Team).filter(Team.team_id == team_id, Team.department_id == dept_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found in this department")

    project = db.query(Project).filter(Project.project_id == project_id, Project.team_id == team_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this team")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return [
        {
            "task_id": t.task_id,
            "title": t.task_title,
            "start": t.start_date,
            "end": t.due_date,
            "status": t.status
        }
        for t in tasks
    ]
