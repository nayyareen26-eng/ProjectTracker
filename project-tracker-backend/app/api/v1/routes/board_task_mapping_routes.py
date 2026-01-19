from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.board_task_mapping import BoardTaskMapping
from app.models.task import Task
from app.schemas.board_task_mapping_schemas import BoardTaskMappingCreate

router = APIRouter(
    prefix="/api/v1/board_task_mapping",
    tags=["BoardTaskMapping"]
)

# 1️⃣ Create a board-task mapping
@router.post("/")
def create_board_task_mapping(
    mapping: BoardTaskMappingCreate,
    db: Session = Depends(get_db)
):
    # ✅ Check if this task is already assigned to the board
    existing = db.query(BoardTaskMapping).filter(
        BoardTaskMapping.board_id == mapping.board_id,
        BoardTaskMapping.task_id == mapping.task_id
    ).first()

    if existing:
        return {
            "message": "Task already assigned to this board",
            "id": existing.id
        }

    new_mapping = BoardTaskMapping(
        board_id=mapping.board_id,
        task_id=mapping.task_id
    )
    db.add(new_mapping)
    db.commit()
    db.refresh(new_mapping)
    return {
        "message": "Task assigned to board",
        "id": new_mapping.id
    }

# 2️⃣ Get all tasks for a board
@router.get("/board/{board_id}/task")
def get_tasks_by_board(board_id: int, db: Session = Depends(get_db)):
    mappings = db.query(BoardTaskMapping).filter(BoardTaskMapping.board_id == board_id).all()
    if not mappings:
        return {"message": "No tasks found for this board", "tasks": []}
    
    tasks = []
    for m in mappings:
        task = db.query(Task).filter(Task.task_id == m.task_id).first()
        if task:
            tasks.append(task)
    return tasks
