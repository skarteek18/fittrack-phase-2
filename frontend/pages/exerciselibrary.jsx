import React, { useEffect, useState } from "react";
import api from "../services/api";
import ExerciseCard from "../components/ExerciseCard";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Cardio",
    description: "",
    duration: 30,
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get("/exercises/");
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      alert("Unable to load exercises.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Cardio",
      description: "",
      duration: 30,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/exercises/${editingId}`, formData);
        alert("Exercise updated successfully!");
      } else {
        await api.post("/exercises/", formData);
        alert("Exercise added successfully!");
      }

      resetForm();
      fetchExercises();
    } catch (error) {
      console.error("Error saving exercise:", error);
      alert(
        error.response?.data?.detail || "Unable to save exercise."
      );
    }
  };

  const handleEdit = (exercise) => {
    setFormData({
      name: exercise.name,
      category: exercise.category,
      description: exercise.description || "",
      duration: exercise.duration,
    });

    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleDelete = async (exerciseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exercise?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/exercises/${exerciseId}`);
      alert("Exercise deleted successfully!");
      fetchExercises();
    } catch (error) {
      console.error("Error deleting exercise:", error);
      alert(
        error.response?.data?.detail || "Unable to delete exercise."
      );
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      exercise.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="page-loading">Loading exercise library...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Exercise Library</h1>
          <p>Explore and manage your fitness exercises.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Exercise
        </button>
      </div>

      <div className="exercise-summary">
        <div className="summary-card">
          <h3>{exercises.length}</h3>
          <p>Total Exercises</p>
        </div>

        <div className="summary-card">
          <h3>
            {exercises.filter((item) => item.category === "Cardio").length}
          </h3>
          <p>Cardio</p>
        </div>

        <div className="summary-card">
          <h3>
            {exercises.filter((item) => item.category === "Strength").length}
          </h3>
          <p>Strength</p>
        </div>

        <div className="summary-card">
          <h3>
            {exercises.filter((item) => item.category === "Yoga").length}
          </h3>
          <p>Yoga</p>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? "Edit Exercise" : "Add New Exercise"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Exercise Name</label>
              <input
                type="text"
                name="name"
                placeholder="Example: Running"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter exercise description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingId ? "Update Exercise" : "Save Exercise"}
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

      <div className="exercise-filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="All">All Categories</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
        </select>
      </div>

      <div className="exercise-results">
        <h2>Available Exercises ({filteredExercises.length})</h2>

        {filteredExercises.length === 0 ? (
          <div className="empty-state">
            <h3>No Exercises Found</h3>
            <p>Try another search or category.</p>
          </div>
        ) : (
          <div className="exercise-grid">
            {filteredExercises.map((exercise) => (
              <div className="exercise-item" key={exercise.id}>
                <ExerciseCard
                  exercise={exercise}
                  showActions={false}
                />

                <div className="exercise-management-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(exercise)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(exercise.id)}
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
  );
}

export default ExerciseLibrary;