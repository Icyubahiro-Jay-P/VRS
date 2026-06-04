import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">VRS Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            title="Customers"
            link="/customers"
            icon="Customers"
            color="blue"
          />
          <DashboardCard
            title="Vehicles"
            link="/vehicles"
            icon="Vehicles"
            color="green"
          />
          <DashboardCard
            title="Reservations"
            link="/reservations"
            icon="Reservations"
            color="purple"
          />
          <DashboardCard
            title="Report"
            link="/report"
            icon="Report"
            color="orange"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Manage customers and their information</li>
            <li>✓ Track and manage vehicle fleet</li>
            <li>✓ Create and manage reservations and rentals</li>
            <li>✓ View comprehensive rental reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, link, icon, color }) {
  const navigate = useNavigate();
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
  };

  return (
    <button
      onClick={() => navigate(link)}
      className={`${colorClasses[color]} p-6 rounded-lg shadow hover:shadow-lg transition text-center`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </button>
  );
}
