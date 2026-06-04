import React, { useState, useEffect } from "react";
import { vehicleAPI } from "../api/axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    plate_number: "",
    brand: "",
    model: "",
    year: "",
    vehicle_type: "",
    purchase_price: "",
    status: "available",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [search, statusFilter]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAll(search, statusFilter);
      setVehicles(response.data);
    } catch (err) {
      console.error("Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await vehicleAPI.update(editingId, formData);
      } else {
        await vehicleAPI.create(formData);
      }
      setFormData({
        plate_number: "",
        brand: "",
        model: "",
        year: "",
        vehicle_type: "",
        purchase_price: "",
        status: "available",
      });
      setShowForm(false);
      setEditingId(null);
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      plate_number: vehicle.Plate_Number || vehicle.plateNumber,
      brand: vehicle.Brand || vehicle.brand,
      model: vehicle.Model || vehicle.model,
      year: vehicle.Year || vehicle.year,
      vehicle_type: vehicle.Vehicle_Type || vehicle.vehicleType,
      purchase_price: vehicle.Purchase_Price || vehicle.purchasePrice,
      status: vehicle.Status || vehicle.status,
    });
    setEditingId(vehicle.Plate_Number || vehicle._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this vehicle?")) {
      try {
        await vehicleAPI.delete(id);
        loadVehicles();
      } catch (err) {
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Vehicles</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              plate_number: "", brand: "", model: "", year: "",
              vehicle_type: "", purchase_price: "", status: "available"
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
        >
          + New Vehicle
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Vehicle" : "New Vehicle"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
              disabled={!!editingId}
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Vehicle Type"
              value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>

            <div className="flex gap-3 mt-4 col-span-1 md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                {editingId ? "Update Vehicle" : "Create Vehicle"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by plate, brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading vehicles...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Plate</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Brand</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Model</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Year</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.Plate_Number || vehicle._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-semibold text-gray-800">{vehicle.Plate_Number || vehicle.plateNumber}</td>
                  <td className="px-6 py-5">{vehicle.Brand || vehicle.brand}</td>
                  <td className="px-6 py-5">{vehicle.Model || vehicle.model}</td>
                  <td className="px-6 py-5">{vehicle.Year || vehicle.year}</td>
                  <td className="px-6 py-5">{vehicle.Vehicle_Type || vehicle.vehicleType}</td>
                  <td className="px-6 py-5 font-medium">
                    ${vehicle.Purchase_Price || vehicle.purchasePrice}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                      (vehicle.Status || vehicle.status) === "available" ? "bg-green-100 text-green-700" :
                      (vehicle.Status || vehicle.status) === "rented" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {vehicle.Status || vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.Plate_Number || vehicle._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}