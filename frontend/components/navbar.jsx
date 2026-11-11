import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">💪</span>
          <span>FitTrack</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/workout-plans">Workout Plans</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/streaks">Streaks</Link>
          <Link to="/achievements">Achievements</Link>
        </div>

        {/* User Actions */}
        <div className="