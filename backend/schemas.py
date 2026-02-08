from pydantic import BaseModel
from datetime import date


class EmployeeCreate(BaseModel):
    employee_id: str
    name: str
    email: str
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    name: str
    email: str
    department: str

    class Config:
        orm_mode = True


class AttendanceCreate(BaseModel):
    employee_id: str      # ✅ THIS IS THE FIX
    date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str

    class Config:
        orm_mode = True
