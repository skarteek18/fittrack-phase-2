from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Streak, Workout, User
from app.schemas import StreakResponse
from app.auth import get_current_user


router = APIRouter()


def get_or_create_streak(db: Session, user_id: int):
    streak