# fittrack-phase-2

FitTrack – Fitness & Workout Management Platform

Phase 2: Advanced Tracking & User Engagement

Project Overview

FitTrack is a full-stack fitness and workout management platform designed to help users manage their fitness activities, schedule workouts, track progress, and achieve their fitness goals.

Phase 2 enhances the existing Phase 1 platform by introducing advanced workout tracking, exercise management, progress comparison, streak tracking, achievement badges, and a personalized dashboard.

Technology Stack

Backend

- Python 3.9+
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- Bcrypt
- Uvicorn

Frontend

- React.js
- Vite
- JavaScript
- Axios
- React Router
- Recharts
- React Icons
- CSS

Phase 2 Modules

Module 7: Workout Plans & Scheduling

- Create workout plans.
- Schedule workouts for future dates.
- View upcoming workouts.
- Manage scheduled workout activities.
- Display workouts in a calendar view.

Module 8: Exercise Library

- View predefined exercises.
- Search exercises by name.
- Filter exercises by category.
- Support Cardio, Strength, and Yoga categories.
- Add exercises to workout plans.

Module 9: Progress Comparison

- Compare weekly workout progress.
- Compare monthly fitness statistics.
- Display performance improvement trends.
- Visualize progress using charts.

Module 10: Streak Tracking System

- Track consecutive workout days.
- Calculate current workout streak.
- Maintain longest workout streak.
- Reset streak when a workout day is missed.
- Display workout consistency statistics.

Module 11: Achievement Badges

- Award badges for completing workouts.
- Reward users for maintaining workout streaks.
- Award badges for achieving fitness goals.
- Display earned badges.
- Show achievement notifications.

Module 12: Personalized Dashboard

- Display daily workout summaries.
- Show upcoming workout schedules.
- Display goal completion progress.
- Show current workout streak.
- Display achievement statistics.

Database Tables

Existing Tables

- Users
- Workouts
- Progress
- Goals
- Notifications

New Tables

- Workout_Plans
- Exercises
- Streak
- Badges
- User_Badges

Security Features

- JWT-based authentication.
- Password hashing using Bcrypt.
- User ownership validation.
- Protected API endpoints.
- Input validation using Pydantic.
- Secure environment configuration.

Project Structure

FitTrack/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── config.py
│   ├── auth.py
│   ├── workouts.py
│   ├── progress.py
│   ├── goals.py
│   ├── reports.py
│   ├── notifications.py
│   ├── workout_plans.py
│   ├── exercises.py
│   ├── comparison.py
│   ├── streaks.py
│   ├── badges.py
│   ├── dashboard.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
├── .gitignore
└── README.md

Installation and Execution

1. Clone Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd FitTrack

2. Backend Setup

cd backend

Create a virtual environment:

python -m venv venv

Activate the environment:

Windows:

venv\Scripts\activate

Linux / macOS:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Start the backend server:

uvicorn main:app --reload

Backend URL:

http://127.0.0.1:8000

Swagger API Documentation:

http://127.0.0.1:8000/docs

3. Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Frontend URL:

http://localhost:5173

Expected Outcome

After completing Phase 2, FitTrack will provide:

- Advanced workout scheduling.
- Exercise library management.
- Weekly and monthly progress comparison.
- Automatic workout streak tracking.
- Achievement and reward system.
- Personalized fitness dashboard.

Future Enhancements

- AI-based workout recommendations.
- Diet and nutrition tracking.
- Wearable device integration.
- Fitness performance analytics.
- Personalized health insights.

Project Information

Project Name: FitTrack

Phase: Phase 2 – Advanced Tracking & User Engagement

Backend: FastAPI

Frontend: React + Vite

Database: SQLite

Task Duration: 2 Days

Objective: To develop an interactive and personalized fitness management platform that motivates users to maintain consistent workout routines and monitor their fitness improvements.
