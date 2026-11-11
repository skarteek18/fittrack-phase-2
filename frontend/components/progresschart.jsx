import React, { useEffect, useState } from "react";
import api from "../services/api";

function Progress() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError("");

      const [weekly, monthly, trends] = await Promise.all([
        api.get("/progress/weekly-comparison"),
        api.get("/progress/monthly-comparison"),
        api.get("/progress/trends?days=7")
      ]);

      setWeeklyData(weekly.data);
      setMonthlyData(monthly.data);
      setTrendData(trends.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load progress information."
      );
    } finally {
      setLoading(false);
    }
  };

  const getChangeClass = (value) => {
    if (value > 0) return "progress-positive";
    if (value < 0) return "progress-negative";
    return "progress-neutral";
  };

  const renderSummary = (data, title) => {
    if (!data) return null;

    const current = data.current_period || {};

    return (
      <div className="progress-period-card">
        <h3>{title}</h3>

        <div className="progress-stats">
          <div>
            <span>Workouts</span>
            <h2>{current.total_workouts || 0}</h2>
          </div>

          <div>
            <span>Calories Burned</span>
            <h2>{current.total_calories || 0}</h2>
          </div>

          <div>
            <span>Workout Duration</span>
            <h2>{current.total_duration || 0} min</h2>
          </div>

          <div>
            <span>Average Weight</span>
            <h2>
              {current.average_weight ?? "N/A"}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  const renderComparison = (data, title) => {
    if (!data) return null;

    return (
      <div className="comparison-card">
        <h3>{title} Comparison</h3>

        <div className="comparison-item">
          <span>Workout Difference</span>

          <strong className={getChangeClass(
            data.workout_difference || 0
          )}>
            {data.workout_difference > 0 ? "+" : ""}
            {data.workout_difference || 0}
          </strong>
        </div>

        <div className="comparison-item">
          <span>Calorie Difference</span>

          <strong className={getChangeClass(
            data.calorie_difference || 0
          )}>
            {data.calorie_difference > 0 ? "+" : ""}
            {data.calorie_difference || 0}
          </strong>
        </div>

        <div className="comparison-item">
          <span>Workout Improvement</span>

          <strong className={getChangeClass(
            data.improvement_percentage || 0
          )}>
            {data.improvement_percentage || 0}%
          </strong>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="progress-page">
        <h2>Loading Progress...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <h2>Progress Comparison</h2>
        <p className="progress-error">{error}</p>

        <button onClick={fetchProgressData}>
          Try Again
        </button>
      </div>
    );
  }

  const maxWorkouts = Math.max(
    1,
    ...trendData.map((item) => item.workouts_completed || 0)
  );

  return (
    <div className="progress-page">

      <div className="progress-header">
        <div>
          <h1>Progress Comparison</h1>
          <p>Track your fitness journey and improvements.</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchProgressData}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Weekly Progress */}
      {renderSummary(weeklyData, "Weekly Progress")}

      {renderComparison(weeklyData, "Weekly")}

      {/* Monthly Progress */}
      {renderSummary(monthlyData, "Monthly Progress")}

      {renderComparison(monthlyData, "Monthly")}

      {/* Workout Trends */}
      <div className="progress-trend-card">
        <h3>Daily Workout Trends</h3>

        {trendData.length === 0 ? (
          <p>No workout records available yet.</p>
        ) : (
          <div className="trend-chart">
            {trendData.map((item, index) => {
              const workoutCount = item.workouts_completed || 0;

              const height = Math.max(
                workoutCount > 0 ? 8 : 0,
                (workoutCount / maxWorkouts) * 160
              );

              return (
                <div
                  className="trend-column"
                  key={item.date || index}
                >
                  <div className="trend-value">
                    {workoutCount}
                  </div>

                  <div
                    className="trend-bar"
                    style={{ height: `${height}px` }}
                    title={`${workoutCount} workouts`}
                  />

                  <span className="trend-date">
                    {item.date
                      ? new Date(
                          `${item.date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short"
                        })
                      : ""}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default Progress;