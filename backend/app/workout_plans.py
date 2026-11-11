from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import WorkoutPlan, Exercise, User
from app.schemas import (
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    WorkoutPlanResponse
)
from app.auth import get_current_user


router = APIRouter()


# ==========================================
# CREATE WORKOUT PLAN
# ==========================================

@router.post(
    "/",
    response_model=WorkoutPlanResponse,
    status_code=status.HTTP_201_CREATED
)
def create_workout_plan(
    plan_data: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    exercises = []

    if plan_data.exercise_ids:
        exercises = db.query(Exercise).filter(
            Exercise.id.in_(plan_data.exercise_ids)
        ).all()

        if len(exercises) != len(set(plan_data.exercise_ids)):
            raise HTTPException(
                status_code=404,
                detail="One or more exercises were not found"
            )