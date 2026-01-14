from pydantic import BaseModel

class TeamResponse(BaseModel):
    team_id: int
    team_name: str 
    department_id: int

    class Config:
        from_attributes = True 