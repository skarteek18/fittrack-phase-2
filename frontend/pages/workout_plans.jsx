import React, { useEffect, useState } from "react";
import api from "../services/api";
import WorkoutCalendar from "../components/WorkoutCalendar";

function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_date: "",
    exercise_ids: [],
  });

  useEffect(() => {
    fetchPlans();
    fetchExercises();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/workout-plans/");
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      alert("Unable to load workout plans.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await api.get("/exercises/");
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleExerciseSelection = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(
      (option) => Number(option.value)
    );

    setFormData((previous) => ({
      ...previous,
      exercise_ids: selectedIds,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      scheduled_date: "",
      exercise_ids: [],
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        exercise_ids: formData.exercise_ids,
      };

      if (editingId) {
        await api.put(`/workout-plans/${editingId}`, payload);
        alert("Workout plan updated successfully!");
      } else {
        await api.post("/workout-plans/", payload);
        alert("Workout plan created successfully!");
      }

      resetForm();
      fetchPlans();
    } catch (error) {
      console.error("Error saving workout plan:", error);
      alert(
        error.response?.data?.detail || "Unable to save workout plan."
      );
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      title: plan.title,
      description: plan.description || "",
      scheduled_date: plan.scheduled_date
        ? plan.scheduled_date.substring(0, 10)
        : "",
      exercise_ids: plan.exercises
        ? plan.exercises.map((exercise) => exercise.id)
        : [],
    });

    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout plan?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/workout-plans/${planId}`);
      alert("Workout plan deleted successfully!");
      fetchPlans();
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      alert(
        error.response?.data?.detail || "Unable to delete workout plan."
      );
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const filteredPlans = selectedDate
    ? plans.filter(
        (plan) => plan.scheduled_date?.substring(0, 10) === selectedDate
      )
    : plans;

  if (loading) {
    return <div className="page-loading">Loading workout plans...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Workout Plans</h1>
          <p>Create and schedule your fitness activities.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Create Workout Plan
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? "Edit Workout Plan" : "Create Workout Plan"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Workout Title</label>
              <input
                type="text"
                name="title"
                placeholder="Example: Morning Cardio"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe your workout plan"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Scheduled Date</label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Exercises</label>
              <select
                multiple
                value={formData.exercise_ids.map(String)}
                onChange={handleExerciseSelection}
                className="exercise-select"
              >
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} ({exercise.category})
                  </option>
                ))}
              </select>
              <small>Hold Ctrl (Windows) or Command (Mac) to select multiple exercises.</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingId ? "Update Plan" : "Save Plan"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="workout-layout">
        <div className="calendar-section">
          <h2>Workout Calendar</h2>

          <WorkoutCalendar
            workouts={plans}
            onDateSelect={handleDateSelect}
          />

          {selectedDate && (
            <button
              className="secondary-button"
              onClick={() => setSelectedDate("")}
            >
              Show All Plans
            </button>
          )}
        </div>

        <div className="plans-section">
          <h2>
            {selectedDate ? `Workouts on ${selectedDate}` : "All Workout Plans"}
          </h2>

          {filteredPlans.length === 0 ? (
            <div className="empty-state">
              <h3>No Workout Plans Found</h3>
              <p>Create a new workout plan to get started.</p>
            </div>
          ) : (
            <div className="plans-grid">
              {filteredPlans.map((plan) => (
                <div className="plan-card" key={plan.id}>
                  <div className="plan-card-header">
                    <h3>{plan.title}</h3>
                    <span className="plan-date">
                      {plan.scheduled_date?.substring(0, 10)}
                    </span>
                  </div>

                  <p>{plan.description || "No description provided."}</p>

                  <div className="plan-exercises">
                    <h4>Exercises</h4>

                    {plan.exercises?.length > 0 ? (
                      <ul>
                        {plan.exercises.map((exercise) => (
                          <li key={exercise.id}>
                            {exercise.name} - {exercise.category}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No exercises added.</p>
                    )}
                  </div>

                  <div className="plan-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlans;