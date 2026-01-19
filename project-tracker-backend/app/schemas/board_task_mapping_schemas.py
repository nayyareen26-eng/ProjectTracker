# app/schemas/board_task_mapping_schemas.py
from pydantic import BaseModel

class BoardTaskMappingCreate(BaseModel):
    board_id: int
    task_id: int
