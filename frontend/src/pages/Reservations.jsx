import React, { useState, useEffect } from "react";
import { reservationAPI } from "../api/axios";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    vehicle_id: "",
    start_date: "",
    end_date: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [search, statusFilter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll(search, statusFilter);
      setReservations(response.data);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await reservationAPI.update(editingId, formData);
      } else {
        await reservationAPI.create(formData);
      }
      setFormData({
        customer_id: "",
        vehicle_id: "",
        start_date: "",
        end_date: "",
        status: "pending",
      });
      setShowForm(false);
      setEditingId(null);
      loadReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (res) => {
    setFormData({
      customer_id: res.CustomerID || res.customerId,
      vehicle_id: res.VehicleID || res.vehicleId,
      start_date: res.Start_Date || res.startDate,
      end_date: res.End_Date || res.endDate,
      status: res.Status || res.status,
    });
    setEditingId(res.ReservationID || res._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this reservation?")) {
      try {
        await reservationAPI.delete(id);
        loadReservations();
      } catch (err) {
        alert("Error deleting reservation");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Reservations</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ customer_id: "", vehicle_id: "", start_date: "", end_date: "", status: "pending" });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
        >
          + New Reservation
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Reservation" : "New Reservation"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Customer ID"
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Vehicle ID / Plate"
              value={formData.vehicle_id}
              onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 col-span-1 md:col-span-2"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex gap-3 mt-4 col-span-1 md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                {editingId ? "Update Reservation" : "Create Reservation"}
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
          placeholder="Search by customer or vehicle..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading reservations...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Vehicle</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Start Date</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">End Date</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.ReservationID || res._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-5">{res.CustomerName || "N/A"}</td>
                  <td className="px-6 py-5 font-medium">{res.PlateNumber || res.VehicleID}</td>
                  <td className="px-6 py-5">{res.Start_Date || res.startDate}</td>
                  <td className="px-6 py-5">{res.End_Date || res.endDate}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                      (res.Status || res.status) === "confirmed" || (res.Status || res.status) === "active" 
                        ? "bg-green-100 text-green-700" 
                        : (res.Status || res.status) === "pending" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {res.Status || res.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(res)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res.ReservationID || res._id)}
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