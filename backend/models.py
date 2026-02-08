from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(100), nullable=False)

    attendances = relationship("Attendance", back_populates="employee")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    # ✅ STRING FK to employees.employee_id
    employee_id = Column(
        String(50),
        ForeignKey("employees.employee_id"),
        nullable=False
    )

    date = Column(Date, nullable=False)
    status = Column(String(10), nullable=False)

    employee = relationship("Employee", back_populates="attendances")

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_attendance_per_day"),
    )