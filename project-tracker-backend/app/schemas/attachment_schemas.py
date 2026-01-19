from pydantic import BaseModel
from datetime import datetime

from typing import Optional
class AttachmentBase(BaseModel):
    task_id: int
    uploaded_by: int
    file_name: str
    file_url: str

class AttachmentCreate(AttachmentBase):
    pass

class AttachmentResponse(AttachmentBase):
    attachment_id: int
    task_id: int
    uploaded_by: Optional[int]
    file_url: str
    file_name: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
