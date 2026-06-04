import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/vehicles", label: "Vehicles" },
    { path: "/reservations", label: "Reservations" },
    { path: "/report", label: "Report" },
  ];

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-16">
          <div className="flex space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-white transition-colors py-5 border-b-2 ${
                  location.pathname === item.path
                    ? "border-white text-white"
                    : "border-transparent text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}