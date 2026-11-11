from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import (
    User,
    Workout,
    WorkoutPlan,
    Goal,
    Streak,
    UserBadge
)
from app.schemas import DashboardResponse
from app.auth import get_current_user


router = APIRouter()


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    tomorrow = today + timedelta(days=1)

    # Daily workout summary
    daily_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= today,
        Workout.workout_date < tomorrow
    ).all()

    total_workouts = len(daily_workouts)

    daily_calories = sum(
        workout.calories_burned or 0
        for workout in daily_workouts
    )

    # Upcoming workout plans
    upcoming_workouts = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.scheduled_date >= today
    ).order_by(
        WorkoutPlan.scheduled_date.asc()
    ).limit(5).all()

    upcoming_workout_data = [
        {
            "id": workout.id,
            "title": workout.title,
            "description": workout.description,
            "scheduled_date": workout.scheduled_date
        }
        for workout in upcoming_workouts
    ]

    # Goal progress
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    goal_progress = []

    for goal in goals:
        target = goal.target_value or 0
        current = goal.current_value or 0

        percentage = (
            min((current / target) * 100, 100)
            if target > 0 else 0
        )

        goal_progress.append({
            "id": goal.id,
            "title": goal.title,
            "description": goal.description,
            "target_value": target,
            "current_value": current,
            "unit": goal.unit,
            "progress_percentage": round(percentage, 2),
            "is_completed": goal.is_completed
        })

    # Streak information
    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    current_streak = 0
    longest_streak = 0
    last_workout_date = None

    if streak:
        current_streak = streak.current_streak
        longest_streak = streak.longest_streak
        last_workout_date = streak.last_workout_date

        if last_workout_date:
            if isinstance(last_workout_date, str):
                last_workout_date = date.fromisoformat(
                    last_workout_date
                )

            if last_workout_date < today - timedelta(days=1):
                current_streak = 0

    streak_data = {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "last_workout_date": last_workout_date
    }

    # Recently earned badges
    user_badges = db.query(UserBadge).options(
        joinedload(UserBadge.badge)
    ).filter(
        UserBadge.user_id == current_user.id
    ).order_by(
        UserBadge.earned_at.desc()
    ).limit(5).all()

    achievements = [
        {
            "id": user_badge.badge.id,
            "name": user_badge.badge.name,
            "description": user_badge.badge.description,
            "icon": user_badge.badge.icon,
            "earned_at": user_badge.earned_at
        }
        for user_badge in user_badges
        if user_badge.badge
    ]

    # Final dashboard response
    return {
        "user_name": current_user.name,
        "daily_workouts": total_workouts,
        "daily_calories": daily_calories,
        "upcoming_workouts": upcoming_workout_data,
        "goal_progress": goal_progress,
        "streak": streak_data,
        "achievements": achievements
    }


# Get today's dashboard summary
@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    tomorrow = today + timedelta(days=1)

    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= today,
        Workout.workout_date < tomorrow
    ).all()

    return {
        "date": today,
        "total_workouts": len(workouts),
        "total_calories": sum(
            workout.calories_burned or 0
            for workout in workouts
        ),
        "total_duration": sum(
            workout.duration or 0
            for workout in workouts
        )
    }


# Get user's fitness goal progress
@router.get("/goals")
def get_dashboard_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    result = []

    for goal in goals:
        target = goal.target_value or 0
        current = goal.current_value or 0

        percentage = (
            min((current / target) * 100, 100)
            if target > 0 else 0
        )

        result.append({
            "id": goal.id,
            "title": goal.title,
            "target_value": target,
            "current_value": current,
            "unit": goal.unit,
            "progress_percentage": round(percentage, 2),
            "is_completed": goal.is_completed
        })

    return result


# Get upcoming workout plans
@router.get("/upcoming-workouts")
def get_dashboard_upcoming_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    workouts = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.scheduled_date >= today
    ).order_by(
        WorkoutPlan.scheduled_date.asc()
    ).limit(10).all()

    return workouts


# Get recent achievements
@router.get("/achievements")
def get_dashboard_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    badges = db.query(UserBadge).options(
        joinedload(UserBadge.badge)
    ).filter(
        UserBadge.user_id == current_user.id
    ).order_by(
        UserBadge.earned_at.desc()
    ).limit(10).all()

    return [
        {
            "badge_id": item.badge.id,
            "name": item.badge.name,
            "description": item.badge.description,
            "icon": item.badge.icon,
            "earned_at": item.earned_at
        }
        for item in badges
        if item.badge
    ]