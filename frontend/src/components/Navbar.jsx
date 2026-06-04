import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-linear-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/dashboard"
            className="text-2xl font-bold hover:text-blue-100 transition"
          >
            VRS
          </Link>

          <div className="hidden md:flex space-x-1">
            <NavLink to="/customers">Customers</NavLink>
            <NavLink to="/vehicles">Vehicles</NavLink>
            <NavLink to="/reservations">Reservations</NavLink>
            <NavLink to="/report">Report</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded hover:bg-blue-700 transition font-medium text-sm"
    >
      {children}
    </Link>
  );
}
