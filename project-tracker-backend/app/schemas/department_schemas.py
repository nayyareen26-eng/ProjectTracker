from pydantic import BaseModel

class DepartmentResponse(BaseModel):
    department_id: int
    company_id: int
    department_name: str
    department_type: str

    class Config:
        orm_mode = True
