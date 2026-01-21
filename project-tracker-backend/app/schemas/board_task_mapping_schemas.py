from pydantic import BaseModel

class BoardTaskMappingCreate(BaseModel):
    board_id: int
    task_id: int