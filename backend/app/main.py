from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models

from app.auth import router as auth_router
from app.workout_plans import router as workout_plans_router
from app.exercises import router as exercises_router
from app.progress_comparison import router as progress_router
from app.streaks import router as streaks_router
from app.badges import router as badges_router
from app.dashboard import router as dashboard_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI application
app = FastAPI