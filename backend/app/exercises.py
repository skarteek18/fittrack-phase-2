from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Exercise, User
from app.schemas import (
    ExerciseCreate,
    ExerciseUpdate,
    ExerciseResponse
)
from app.auth import get_current_user


router = APIRouter()

# Allowed Exercise Categories
ALLOWED_CATEGORIES = ["Cardio", "Strength", "Yoga"]


# ==========================================
# CREATE EXERCISE
# ==========================================

@router.post(
    "/",
    response_model=ExerciseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_exercise(
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if exercise_data.category not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category must be Cardio, Strength, or Yoga"
        )

    new_exercise = Exercise(
        name=exercise_data.name,
        category=exercise_data.category,
        description=exercise_data.description,
        duration=exercise_data.duration
    )

    try:
        db.add(new_exercise)
        db.commit()
        db.refresh(new_exercise)

        return new_exercise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create exercise"
        )


# ==========================================
# GET ALL EXERCISES
# ==========================================

@router.get(
    "/",
    response_model=list[ExerciseResponse]
)
def get