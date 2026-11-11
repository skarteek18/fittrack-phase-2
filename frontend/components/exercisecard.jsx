import React from "react";

function ExerciseCard({
  exercise,
  onAddToWorkout,
  onDelete,
  showActions = true
}) {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "cardio":
        return "🏃";

      case "strength":
        return "🏋️";

      case "yoga":
        return "🧘";

      default:
        return "💪";
    }
  };

  const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case "cardio":
        return "cardio";

      case "strength":
        return "strength";

      case "yoga":
        return "yoga";

      default:
        return "other";
    }
  };

  return (
    <div className="exercise-card">

      <div className="exercise-card-header">
        <div className="exercise-icon">
          {getCategoryIcon(exercise.category)}
        </div>

        <span
          className={`exercise-category ${getCategoryClass(
            exercise.category
          )}`}
        >
          {exercise.category}
        </span>
      </div>

      <div className="exercise-card-body">
        <h3>{exercise.name}</h3>

        <p>
          {exercise.description ||
            "No description available for this exercise."}
        </p>

        <div className="exercise-duration">
          <span>⏱️</span>
          <span>{exercise.duration} minutes</span>
        </div>
      </div>

      {showActions && (
        <div className="exercise-card-actions">

          {onAddToWorkout && (
            <button
              className="add-workout-button"
              onClick={() => onAddToWorkout(exercise)}
            >
              + Add to Workout
            </button>
          )}

          {onDelete && (
            <button
              className="delete-exercise-button"
              onClick={() => onDelete(exercise.id)}
              title="Delete Exercise"
            >
              🗑️
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default ExerciseCard;