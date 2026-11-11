import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠"
    },
    {
      name: "Workout Plans",
      path: "/workout-plans",
      icon: "📅"
    },
    {
      name: "Exercise Library",
      path: "/exercises",
      icon: "🏋️"
    },
    {
      name: "Progress Comparison",
      path: "/progress",
      icon: "📊"
    },
    {
      name: "Streak Tracking",
      path: "/streaks",
      icon: "🔥"
    },
    {
      name: "Achievements",
      path: "/achievements",
      icon: "🏆"
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>FitTrack</h2>
        <