from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Workout, Progress, User
from app.schemas import (
    ProgressSummary,
    ProgressComparisonResponse,
    ProgressTrend
)
from app.auth import get_current_user


router = APIRouter()


# ==========================================
# HELPER FUNCTION: GET PROGRESS SUMMARY
# ==========================================

def get_progress_summary(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date,
    period: str
):

    workouts = db.query(Workout).filter(
        Workout.user_id == user_id,
        Workout.workout_date >= start_date,
        Workout.workout_date <= end_date
    ).all()

    total_workouts = len(workouts)

    total_duration = sum(
        workout.duration or 0
        for workout in workouts
    )

    total_calories = sum(
        workout.calories_burned or 0
        for workout in workouts
    )

    average_weight = db.query(
        func.avg(Progress.weight)
    ).filter(
        Progress.user_id == user_id,
        func.date(Progress.recorded_at) >= start_date,
        func.date(Progress.recorded_at) <= end_date,
        Progress.weight.isnot(None)
    ).scalar()

    return ProgressSummary(
        period=period,
        total_workouts=total_workouts,
        total_duration=total_duration,
        total_calories=round(total_calories, 2),
        average_weight=(
            round(float(average_weight), 2)
            if average_weight is not None
            else None
        )
    )


# ==========================================
# HELPER FUNCTION: COMPARE PROGRESS
# ==========================================

def calculate_comparison(
    current_period: ProgressSummary,
    previous_period: ProgressSummary
):

    workout_difference = (
        current_period.total_workouts -
        previous_period.total_workouts
    )

    calorie_difference = (
        current_period.total_calories -
        previous_period.total_calories
    )

    if previous_period.total_workouts > 0:
        improvement_percentage = (
            workout_difference /
            previous_period.total_workouts
        ) * 100

    elif current_period.total_workouts > 0:
        improvement_percentage = 100.0

    else:
        improvement_percentage = 0.0

    return ProgressComparisonResponse(
        current_period=current_period,
        previous_period=previous_period,
        workout_difference=workout_difference,
        calorie_difference=round(calorie_difference, 2),
        improvement_percentage=round(
            improvement_percentage, 2
        )
    )


# ==========================================
# MODULE 9: WEEKLY PROGRESS COMPARISON
# ==========================================

@router.get(
    "/weekly-comparison",
    response_model=ProgressComparisonResponse
)
def weekly_progress_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    current_start = today - timedelta(days=6)
    current_end = today

    previous_start = current_start - timedelta(days=7)
    previous_end = current_start - timedelta(days=1)

    current_summary = get_progress_summary(
        db,
        current_user.id,
        current_start,
        current_end,
        "Current Week"
    )

    previous_summary = get_progress_summary(
        db,
        current_user.id,
        previous_start,
        previous_end,
        "Previous Week"
    )

    return calculate_comparison(
        current_summary,
        previous_summary
    )


# ==========================================
# MODULE 9: MONTHLY PROGRESS COMPARISON
# ==========================================

@router.get(
    "/monthly-comparison",
    response_model=ProgressComparisonResponse
)
def monthly_progress_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    current_start = today.replace(day=1)
    current_end = today

    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end.replace(day=1)

    current_summary = get_progress_summary(
        db,
        current_user.id,
        current_start,
        current_end,
        "Current Month"
    )

    previous_summary = get_progress_summary(
        db,
        current_user.id,
        previous_start,
        previous_end,
        "Previous Month"
    )

    return calculate_comparison(
        current_summary,
        previous_summary
    )


# ==========================================
# MODULE 9: PROGRESS TRENDS
# ==========================================

@router.get(
    "/trends",
    response_model=list[ProgressTrend]
)
def get_progress_trends(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if days < 1 or days > 365:
        raise HTTPException(
            status_code=400,
            detail="Days must be between 1 and 365"
        )

    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)

    workouts = db.query(Workout).filter(
       