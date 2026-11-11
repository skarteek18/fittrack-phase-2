import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StreakCounter from "../components/StreakCounter";
import BadgeCard from "../components/BadgeCard";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Fetch dashboard information
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/");

      setDashboard(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(
      `${String(date).split("T")[0]}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading FitTrack Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>

        <button onClick={fetchDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome back, {dashboard.user_name}! 👋
          </h1>

          <p>
            Track your fitness journey and achieve your goals.
          </p>
        </div>

        <button
          className="dashboard-refresh"
          onClick={fetchDashboard}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Daily Summary */}
      <section className="dashboard-summary">

        <div className="summary-card">
          <span className="summary-icon">🏋️</span>
          <h2>{dashboard.daily_workouts}</h2>
          <p>Today's Workouts</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🔥</span>
          <h2>{dashboard.daily_calories}</h2>
          <p>Calories Burned</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🎯</span>
          <h2>{dashboard.goal_progress.length}</h2>
          <p>Fitness Goals</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🏆</span>
          <h2>{dashboard.achievements.length}</h2>
          <p>Recent Achievements</p>
        </div>

      </section>

      {/* Upcoming Workouts */}
      <section className="dashboard-section">

        <div className="section-header">
          <h2>📅 Upcoming Workouts</h2>

          <Link to="/workout-plans">
            View All
          </Link>
        </div>

        {dashboard.upcoming_workouts.length === 0 ? (
          <p className="empty-message">
            No upcoming workouts scheduled.
          </p>
        ) : (
          <div className="upcoming-workout-grid">

            {dashboard.upcoming_workouts.map((workout) => (
              <div
                className="upcoming-workout-card"
                key={workout.id}
              >
                <h3>{workout.title}</h3>

                <p>
                  {workout.description ||
                    "No description available."}
                </p>

                <span>
                  📅 {formatDate(workout.scheduled_date)}
                </span>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* Fitness Goals */}
      <section className="dashboard-section">

        <div className="section-header">
          <h2>🎯 Fitness Goal Progress</h2>

          <Link to="/goals">
            View Goals
          </Link>
        </div>

        {dashboard.goal_progress.length === 0 ? (
          <p className="empty-message">
            No fitness goals added yet.
          </p>
        ) : (
          <div className="goal-progress-list">

            {dashboard.goal_progress.map((goal) => (
              <div
                className="goal-progress-card"
                key={goal.id}
              >
                <div className="goal-info">
                  <h3>{goal.title}</h3>

                  <span>
                    {goal.current_value} / {goal.target_value}{" "}
                    {goal.unit}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${goal.progress_percentage}%`
                    }}
                  />
                </div>

                <div className="goal-footer">
                  <span>
                    {goal.progress_percentage}% completed
                  </span>

                  <span>
                    {goal.is_completed
                      ? "✓ Completed"
                      : "In Progress"}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* Workout Streak */}
      <section className="dashboard-section">

        <div className="section-header">
          <h2>🔥 Workout Streak</h2>

          <Link to="/streaks">
            View Details
          </Link>
        </div>

        <StreakCounter />

      </section>

      {/* Achievement Badges */}
      <section className="dashboard-section">

        <div className="section-header">
          <h2>🏆 Recent Achievements</h2>

          <Link to="/achievements">
            View All
          </Link>
        </div>

        {dashboard.achievements.length === 0 ? (
          <p className="empty-message">
            Complete workouts to earn your first badge!
          </p>
        ) : (
          <div className="badge-grid">

            {dashboard.achievements.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={true}
              />
            ))}

          </div>
        )}

      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">

        <h2>⚡ Quick Actions</h2>

        <div className="quick-actions">

          <Link to="/workout-plans">
            + Create Workout Plan
          </Link>

          <Link to="/exercises">
            Explore Exercises
          </Link>

          <Link to="/progress">
            View Progress
          </Link>

          <Link to="/achievements">
            View Achievements
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;