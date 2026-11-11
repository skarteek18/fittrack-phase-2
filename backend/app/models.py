from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Table
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


# Many-to-Many Relationship: Workout Plans and Exercises
workout_plan_exercises = Table(
    "workout_plan_exercises",
    Base.metadata,
    Column(
        "workout_plan_id",
        Integer,
        ForeignKey("workout_plans.id"),
        primary_key=True
    ),
    Column(
        "exercise_id",
        Integer,
        ForeignKey("exercises.id"),
        primary_key=True
    )
)


# ==============================
# USER MODEL
# ==============================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)