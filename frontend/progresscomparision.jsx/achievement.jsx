import React, { useEffect, useState } from "react";
import api from "../services/api";
import BadgeCard from "../components/BadgeCard";

function Achievements() {
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      const [allResponse, earnedResponse] = await Promise.all([
        api.get("/badges/"),
        api.get("/badges/my-badges"),
      ]);

      setBadges(allResponse.data);
      setEarnedBadges(earnedResponse.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError(
        error.response?.data?.detail ||
          "Unable to load achievements. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    try {
      setChecking(true);

      const response = await api.post("/badges/check-achievements");

      alert(
        response.data.message ||
          "Achievement check completed successfully!"
      );

      await fetchAchievements();
    } catch (error) {
      console.error("Error checking achievements:", error);

      alert(
        error.response?.data?.detail ||
          "Unable to check achievements."
      );
    } finally {
      setChecking(false);
    }
  };

  const isBadgeEarned = (badgeId) => {
    return earnedBadges.some(
      (earned) => earned.badge?.id === badgeId
    );
  };

  const getEarnedBadge = (badgeId) => {
    return earnedBadges.find(
      (earned) => earned.badge?.id === badgeId
    );
  };

  const earnedCount = earnedBadges.length;
  const totalCount = badges.length;

  const progressPercentage =
    totalCount > 0
      ? Math.round((earnedCount / totalCount) * 100)
      : 0;

  if (loading) {
    return (
      <div className="page-loading">
        Loading achievements...
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Achievements</h1>
          <p>Celebrate your fitness milestones and progress.</p>
        </div>

        <button
          className="primary-button"
          onClick={checkAchievements}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check Achievements"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchAchievements}>
            Retry
          </button>
        </div>
      )}

      <div className="achievement-summary">
        <div className="summary-card">
          <span className="summary-icon">🏆</span>
          <h2>{earnedCount}</h2>
          <p>Earned Badges</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🎯</span>
          <h2>{totalCount}</h2>
          <p>Total Badges</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🔒</span>
          <h2>{Math.max(totalCount - earnedCount, 0)}</h2>
          <p>Locked Badges</p>
        </div>

        <div className="summary-card">
          <span className="summary-icon">📈</span>
          <h2>{progressPercentage}%</h2>
          <p>Achievement Progress</p>
        </div>
      </div>

      <div className="achievement-progress-card">
        <div className="progress-heading">
          <h2>Your Achievement Progress</h2>
          <span>{progressPercentage}% completed</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p>
          You have unlocked {earnedCount} out of {totalCount} achievements.
        </p>
      </div>

      <section className="achievement-section">
        <h2>🏆 Earned Achievements</h2>

        {earnedBadges.length === 0 ? (
          <div className="empty-state">
            <h3>No Achievements Yet</h3>
            <p>
              Complete workouts and maintain your streak to unlock
              achievements.
            </p>
          </div>
        ) : (
          <div className="badge-grid">
            {earnedBadges.map((item) => (
              <BadgeCard
                key={item.id}
                badge={item.badge}
                earned={true}
              />
            ))}
          </div>
        )}
      </section>

      <section className="achievement-section">
        <h2>🔒 All Achievements</h2>

        {badges.length === 0 ? (
          <div className="empty-state">
            <h3>No Badges Available</h3>
            <p>Achievement badges will appear here.</p>
          </div>
        ) : (
          <div className="badge-grid">
            {badges.map((badge) => {
              const earned = isBadgeEarned(badge.id);
              const earnedData = getEarnedBadge(badge.id);

              return (
                <BadgeCard
                  key={badge.id}
                  badge={{
                    ...badge,
                    earned_at: earnedData?.earned_at,
                  }}
                  earned={earned}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Achievements;