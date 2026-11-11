import React, { useEffect, useState } from "react";
import api from "../services/api";

function StreakCounter() {
  const [streak, setStreak] = useState({
    current_streak: 0,
    longest_streak: 0,
    last_workout_date: null
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStreak();
  }, []);

  // Fetch streak information
  const fetchStreak = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/streaks/");
      setStreak(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load streak information."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update streak after completing a workout
  const handleUpdateStreak = async () => {
    try {
      setMessage("");
      setError("");

      const response = await api.post("/streaks/update");

      setStreak(response.data);

      setMessage("🔥 Your workout streak has been updated!");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update your streak."
      );
    }
  };

  // Fetch streak statistics
  const handleViewStatistics = async () => {
    try {
      setError("");

      const response = await api.get("/streaks/statistics");

      setStreak(response.data);

      setMessage(
        `Current streak: ${response.data.current_streak} days | Longest streak: ${response.data.longest_streak} days`
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to fetch streak statistics."
      );
    }
  };

  if (loading) {
    return (
      <div className="streak-loading">
        Loading streak information...
      </div>
    );
  }

  return (
    <div className="streak-container">

      <div className="streak-header">
        <h2>🔥 Workout Streak</h2>

        <button
          className="streak-refresh-button"
          onClick={fetchStreak}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="streak-main-card">

        <div className="streak-fire-icon">
          🔥
        </div>

        <h1>{streak.current_streak || 0}</h1>

        <h3>Current Streak</h3>

        <p>
          Keep working out every day to maintain your streak!
        </p>

      </div>

      <div className="streak-stats-grid">

        <div className="streak-stat-card">
          <span className="streak-stat-icon">🏆</span>

          <h2>{streak.longest_streak || 0}</h2>

          <p>Longest Streak</p>
        </div>

        <div className="streak-stat-card">
          <span className="streak-stat-icon">📅</span>

          <h2>
            {streak.last_workout_date
              ? new Date(
                  `${streak.last_workout_date}`.split("T")[0] +
                  "T00:00:00"
                ).toLocaleDateString("en-IN")
              : "No workouts"}
          </h2>

          <p>Last Workout Date</p>
        </div>

      </div>

      <div className="streak-message">
        <h3>💪 Stay Consistent!</h3>

        <p>
          Every workout brings you one step closer to your fitness goals.
          Don't break the chain!
        </p>
      </div>

      <div className="streak-actions">

        <button
          className="streak-update-button"
          onClick={handleUpdateStreak}
        >
          🔥 Update My Streak
        </button>

        <button
          className="streak-statistics-button"
          onClick={handleViewStatistics}
        >
          📊 View Statistics
        </button>

      </div>

      {message && (
        <p className="streak-success">
          {message}
        </p>
      )}

      {error && (
        <p className="streak-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default StreakCounter;