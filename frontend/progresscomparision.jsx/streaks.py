from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app.models import User, Workout, Streak
from app.schemas import StreakResponse, StreakUpdate


router = APIRouter()


def get_or_create_streak(db: Session, user_id: int):
    streak = db.query(Streak).filter(
        Streak.user_id == user_id
    ).first()

    if not streak:
        streak = Streak(
            user_id=user_id,
            current_streak=0,
            longest_streak=0,
            last_workout_date=None
        )

        db.add(streak)
        db.commit()
        db.refresh(streak)

    return streak


def check_and_reset_streak(streak: Streak):
    today = date.today()

    if streak.last_workout_date is None:
        return

    if streak.last_workout_date < today - timedelta(days=1):
        streak.current_streak = 0


@router.get("/", response_model=StreakResponse)
def get_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    streak = get_or_create_streak(db, current_user.id)

    check_and_reset_streak(streak)

    db.commit()
    db.refresh(streak)

    return streak


@router.post("/update", response_model=StreakResponse)
def update_streak(
    data: StreakUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    streak = get_or_create_streak(db, current_user.id)

    # Verify that the user completed a workout today.
    today_start = date.today()

    completed_workout = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= today_start,
        Workout.workout_date < today_start + timedelta(days=1)
    ).first()

    if not completed_workout:
        raise HTTPException(
            status_code=400,
            detail="Complete a workout before updating your streak."
        )

    if streak.last_workout_date == today:
        return streak

    if streak.last_workout_date == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        streak.current_streak = 1

    streak.longest_streak = max(
        streak.current_streak,
        streak.longest_streak
    )

    streak.last_workout_date = today

    db.commit()
    db.refresh(streak)

    return streak


@router.get("/statistics")
def get_streak_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    streak = get_or_create_streak(db, current_user.id)

    check_and_reset_streak(streak)

    db.commit()

    return {
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "last_workout_date": streak.last_workout_date,
        "is_active_today": streak.last_workout_date == date.today()
    }


@router.post("/reset")
def reset_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    streak = get_or_create_streak(db, current_user.id)

    streak.current_streak = 0
    streak.longest_streak = 0
    streak.last_workout_date = None

    db.commit()
    db.refresh(streak)

    return {
        "message": "Workout streak reset successfully",
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak
    }