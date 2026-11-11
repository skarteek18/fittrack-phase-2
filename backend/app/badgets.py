from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Badge, UserBadge, Workout, Streak, User
from app.schemas import (
    BadgeCreate,
    BadgeResponse,
    UserBadgeResponse
)
from app.auth import get_current_user


router = APIRouter()


# Create a new achievement badge
@router.post("/", response_model=BadgeResponse)
def create_badge(
    badge_data: BadgeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_badge = db.query(Badge).filter(
        Badge.name == badge_data.name
    ).first()

    if existing_badge:
        raise HTTPException(
            status_code=400,
            detail="Badge already exists."
        )

    new_badge = Badge(
        name=badge_data.name,
        description=badge_data.description,
        icon=badge_data.icon
    )

    db.add(new_badge)
    db.commit()
    db.refresh(new_badge)

    return new_badge


# Get all available badges
@router.get("/", response_model=list[BadgeResponse])
def get_all_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Badge).order_by(Badge.id.asc()).all()


# Get badges earned by the logged-in user
@router.get("/my-badges", response_model=list[UserBadgeResponse])
def get_my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_badges = (
        db.query(UserBadge)
        .options(joinedload(UserBadge.badge))
        .filter(UserBadge.user_id == current_user.id)
        .order_by(UserBadge.earned_at.desc())
        .all()
    )

    return user_badges


# Award a badge to a user
@router.post("/award/{badge_id}")
def award_badge(
    badge_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    badge = db.query(Badge).filter(
        Badge.id == badge_id
    ).first()

    if not badge:
        raise HTTPException(
            status_code=404,
            detail="Badge not found."
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing_award = db.query(UserBadge).filter(
        UserBadge.user_id == user_id,
        UserBadge.badge_id == badge_id
    ).first()

    if existing_award:
        raise HTTPException(
            status_code=400,
            detail="User has already earned this badge."
        )

    new_award = UserBadge(
        user_id=user_id,
        badge_id=badge_id,
        earned_at=datetime.now(timezone.utc)
    )

    db.add(new_award)
    db.commit()
    db.refresh(new_award)

    return {
        "message": "Badge awarded successfully.",
        "user_id": user_id,
        "badge_id": badge_id,
        "badge_name": badge.name
    }


# Automatically award badges based on workout achievements
@router.post("/check-achievements")
def check_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout_count = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).count()

    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    current_streak = streak.current_streak if streak else 0

    achievements = [
        {
            "name": "First Workout",
            "description": "Completed your first workout.",
            "icon": "🏅",
            "condition": workout_count >= 1
        },
        {
            "name": "Workout Warrior",
            "description": "Completed 10 workouts.",
            "icon": "💪",
            "condition": workout_count >= 10
        },
        {
            "name": "Fitness Champion",
            "description": "Completed 50 workouts.",
            "icon": "🏆",
            "condition": workout_count >= 50
        },
        {
            "name": "7 Day Streak",
            "description": "Maintained a 7-day workout streak.",
            "icon": "🔥",
            "condition": current_streak >= 7
        },
        {
            "name": "30 Day Streak",
            "description": "Maintained a 30-day workout streak.",
            "icon": "⭐",
            "condition": current_streak >= 30
        }
    ]

    newly_earned = []

    for achievement in achievements:

        if not achievement["condition"]:
            continue

        badge = db.query(Badge).filter(
            Badge.name == achievement["name"]
        ).first()

        if not badge:
            badge = Badge(
                name=achievement["name"],
                description=achievement["description"],
                icon=achievement["icon"]
            )

            db.add(badge)
            db.commit()
            db.refresh(badge)

        existing_award = db.query(UserBadge).filter(
            UserBadge.user_id == current_user.id,
            UserBadge.badge_id == badge.id
        ).first()

        if not existing_award:
            new_award = UserBadge(
                user_id=current_user.id,
                badge_id=badge.id,
                earned_at=datetime.now(timezone.utc)
            )

            db.add(new_award)

            newly_earned.append({
                "badge_id": badge.id,
                "badge_name": badge.name,
                "description": badge.description,
                "icon": badge.icon
            })

    db.commit()

    return {
        "message": "Achievement check completed.",
        "total_workouts": workout_count,
        "current_streak": current_streak,
        "newly_earned_badges": newly_earned
    }


# Get a specific badge
@router.get("/{badge_id}", response_model=BadgeResponse)
def get_badge(
    badge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    badge = db.query(Badge).filter(
        Badge.id == badge_id
    ).first()

    if not badge:
        raise HTTPException(
            status_code=404,
            detail="Badge not found."
        )

    return badge