from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.comment import Comment
from app.schemas.comment_schemas import CommentCreate, CommentResponse

router = APIRouter(
    prefix="/api/v1/comment",
    tags=["Comment"]
)

# Create comment
@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

# Get all comments for a task
@router.get("/task/{task_id}", response_model=list[CommentResponse])
def get_task_comments(task_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.task_id == task_id).all()

# Update comment
@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, updated: CommentCreate, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.content = updated.content
    db.commit()
    db.refresh(comment)
    return comment

# Delete comment
@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"detail": "Comment deleted"}
