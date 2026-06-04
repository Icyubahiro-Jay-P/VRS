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
    if (confirm("Are you sure?")) {
      try {
        await vehicleAPI.delete(id);
        loadVehicles();
      } catch (err) {
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              plate_number: "",
              brand: "",
              model: "",
              year: "",
              vehicle_type: "",
              purchase_price: "",
              status: "available",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Vehicle
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow mb-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Plate Number"
            value={formData.plate_number}
            onChange={(e) =>
              setFormData({ ...formData, plate_number: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
            disabled={editingId}
          />
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Vehicle Type"
            value={formData.vehicle_type}
            onChange={(e) =>
              setFormData({ ...formData, vehicle_type: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={formData.purchase_price}
            onChange={(e) =>
              setFormData({ ...formData, purchase_price: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by plate, brand, or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Plate</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Model</th>
                <th className="px-6 py-3 text-left">Year</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.Plate_Number || vehicle._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-semibold">
                    {vehicle.Plate_Number || vehicle.plateNumber}
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.Brand || vehicle.brand}
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.Model || vehicle.model}
                  </td>
                  <td className="px-6 py-4">{vehicle.Year || vehicle.year}</td>
                  <td className="px-6 py-4">
                    {vehicle.Vehicle_Type || vehicle.vehicleType}
                  </td>
                  <td className="px-6 py-4">
                    ${vehicle.Purchase_Price || vehicle.purchasePrice}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                        (vehicle.Status || vehicle.status) === "available"
                          ? "bg-green-500"
                          : (vehicle.Status || vehicle.status) === "rented"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    >
                      {vehicle.Status || vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(vehicle.Plate_Number || vehicle._id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
