from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine, Base
import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- DB ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- ROOT ----------
@app.get("/")
def root():
    return {"message": "HRMS Lite API Running"}


# ---------- GET EMPLOYEES ----------
@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


# ---------- ADD EMPLOYEE ----------
@app.post("/employees", response_model=schemas.EmployeeResponse)
def add_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):

    if db.query(models.Employee).filter(models.Employee.employee_id == emp.employee_id).first():
        raise HTTPException(409, "Employee ID exists")

    if db.query(models.Employee).filter(models.Employee.email == emp.email).first():
        raise HTTPException(409, "Email exists")

    new_emp = models.Employee(**emp.dict())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp


# ---------- DELETE EMPLOYEE ----------

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    # Find employee
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Delete related attendance first (FK safety)
    db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).delete()

    # Delete employee
    db.delete(emp)
    db.commit()

    return {"message": f"Employee {employee_id} deleted successfully"}


# ---------- MARK ATTENDANCE ----------
@app.post("/attendance")
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):

    # 1. check employee using employee_id (string)
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == attendance.employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # 2. check if attendance already exists for that date
    record = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    # 3. If exists → UPDATE
    if record:
        record.status = attendance.status
        db.commit()
        db.refresh(record)
        return {"message": "Attendance updated"}

    # 4. If not exists → INSERT
    new_attendance = models.Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return {"message": "Attendance marked"}
# ---------- GET ATTENDANCE OF EMPLOYEE ----------
@app.get("/attendance/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
