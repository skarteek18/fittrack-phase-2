import React from "react";

function BadgeCard({ badge, earned = true }) {
  const earnedDate = badge.earned_at
    ? new Date(badge.earned_at).toLocaleDateString("en-IN")
    : null;

  return (
    <div
      className={`badge-card ${
        earned ? "badge-earned" : "badge-locked"
      }`}
    >
      {/* Badge Icon */}
      <div className="badge-icon">
        {badge.icon || "🏆"}
      </div>

      {/* Badge Information */}
      <div className="badge-content">
        <h3>{badge.name}</h3>

        <p>
          {badge.description || "Complete workouts to earn this badge."}
        </p>

        {/* Achievement Status */}
        <div className="badge-status">
          {earned ? (
            <span className="earned-status">
              ✓ Earned
            </span>
          ) : (
            <span className="locked-status">
              🔒 Locked
            </span>
          )}
        </div>

        {/* Earned Date */}
        {earned && earnedDate && (
          <small className="badge-date">
            Earned on: {earnedDate}
          </small>
        )}
      </div>
    </div>
  );
}

export default BadgeCard;