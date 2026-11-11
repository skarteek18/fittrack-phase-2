import React, { useState } from "react";

function WorkoutCalendar({ workouts = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getDateString = (day) => {
    const date = new Date(year, month, day);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const handleDateClick = (day) => {
    const dateString = getDateString(day);

    setSelectedDate(dateString);

    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  const selectedWorkouts = workouts.filter((workout) => {
    const workoutDate = String(workout.scheduled_date).split("T")[0];
    return workoutDate === selectedDate;
  });

  return (
    <div className="workout-calendar">

      <div className="calendar-header">
        <h2>Workout Calendar</h2>

        <div className="calendar-navigation">
          <button onClick={previousMonth}>
            ❮
          </button>

          <h3>
            {monthNames[month]} {year}
          </h3>

          <button onClick={nextMonth}>
            ❯
          </button>
        </div>
      </div>

      <div className="calendar-grid">

        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="calendar-empty"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateString = getDateString(day);

          const dayWorkouts = workouts.filter((workout) => {
            const workoutDate = String(
              workout.scheduled_date
            ).split("T")[0];

            return workoutDate === dateString;
          });

          const isToday = dateString === todayString;
          const isSelected = dateString === selectedDate;

          return (
            <button
              key={day}
              className={`calendar-day ${
                isToday ? "today" : ""
              } ${isSelected ? "selected" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              <span>{day}</span>

              {dayWorkouts.length > 0 && (
                <span className="workout-indicator">
                  {dayWorkouts.length} workout
                  {dayWorkouts.length > 1 ? "s" : ""}
                </span>
              )}
            </button>
          );
        })}

      </div>

      <div className="selected-workouts">
        <h3>
          Scheduled Workouts - {selectedDate}
        </h3>

        {selectedWorkouts.length === 0 ? (
          <p>No workouts scheduled for this date.</p>
        ) : (
          selectedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="calendar-workout-card"
            >
              <h4>{workout.title}</h4>

              <p>
                {workout.description || "No description available"}
              </p>

              <small>
                Scheduled: {selectedDate}
              </small>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default WorkoutCalendar;