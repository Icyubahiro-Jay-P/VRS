import React, { useState, useEffect } from "react";
import { reservationAPI, customerAPI } from "../api/axios";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customerID: "",
    plateNumber: "",
    startDate: "",
    endDate: "",
    reservation_status: "pending",
    rental_status: "",
    rental_date: "",
    return_date: "",
    rental_fee: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReservations();
    loadCustomers();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll();
      setReservations(response.data);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // Fix for creation: normalize fields
        customer_id: formData.customerID,
        plate_number: formData.plateNumber,
        start_date: formData.startDate,
        end_date: formData.endDate,
      };
      if (editingId) {
        await reservationAPI.update(editingId, payload);
      } else {
        await reservationAPI.create(payload);
      }
      setFormData({
        customerID: "",
        plateNumber: "",
        startDate: "",
        endDate: "",
        reservation_status: "pending",
        rental_status: "",
        rental_date: "",
        return_date: "",
        rental_fee: "",
      });
      setShowForm(false);
      setEditingId(null);
      loadReservations();
      alert('Reservation ' + (editingId ? 'updated' : 'created') + ' successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Creation failed, check console bro");
    }
  };

  const handleEdit = (reservation) => {
    setFormData({
      customerID: reservation.CustomerID || reservation.customerID?._id,
      plateNumber: reservation.Plate_Number || reservation.plateNumber,
      startDate: reservation.Start_Date || reservation.startDate,
      endDate: reservation.End_Date || reservation.endDate,
      reservation_status: reservation.Reservation_Status || reservation.reservationStatus,
      rental_status: reservation.Rental_Status || reservation.rentalStatus,
      rental_date: reservation.Rental_Date || reservation.rentalDate,
      return_date: reservation.Return_Date || reservation.returnDate,
      rental_fee: reservation.Rental_Fee || reservation.rentalFee,
    });
    setEditingId(reservation.ReservationID || reservation._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await reservationAPI.delete(id);
        loadReservations();
      } catch (err) {
        alert("Error deleting reservation");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservations & Rentals</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              customerID: "",
              plateNumber: "",
              startDate: "",
              endDate: "",
              reservation_status: "pending",
              rental_status: "",
              rental_date: "",
              return_date: "",
              rental_fee: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Reservation
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow mb-6 space-y-4"
        >
          <select
            value={formData.customerID}
            onChange={(e) =>
              setFormData({ ...formData, customerID: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.CustomerID || c._id} value={c.CustomerID || c._id}>
                {c.Full_Name || c.fullName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Vehicle Plate Number"
            value={formData.plateNumber}
            onChange={(e) =>
              setFormData({ ...formData, plateNumber: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          />

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          />

          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
            required
          />

          {editingId && (
            <>
              <select
                value={formData.reservation_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservation_status: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                placeholder="Rental Date"
                value={formData.rental_date}
                onChange={(e) =>
                  setFormData({ ...formData, rental_date: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />

              <input
                type="date"
                placeholder="Return Date"
                value={formData.return_date}
                onChange={(e) =>
                  setFormData({ ...formData, return_date: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />

              <select
                value={formData.rental_status}
                onChange={(e) =>
                  setFormData({ ...formData, rental_status: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select Rental Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="number"
                placeholder="Rental Fee"
                value={formData.rental_fee}
                onChange={(e) =>
                  setFormData({ ...formData, rental_fee: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </>
          )}

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Start Date</th>
                <th className="px-4 py-3 text-left">End Date</th>
                <th className="px-4 py-3 text-left">Res. Status</th>
                <th className="px-4 py-3 text-left">Rental Status</th>
                <th className="px-4 py-3 text-left">Fee</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr
                  key={res.ReservationID || res._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    {res.Full_Name || res.customerID?.fullName}
                  </td>
                  <td className="px-4 py-4">
                    {res.Plate_Number || res.plateNumber}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(
                      res.Start_Date || res.startDate,
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(res.End_Date || res.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {res.Reservation_Status || res.reservationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {res.Rental_Status || res.rentalStatus ? (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        {res.Rental_Status || res.rentalStatus}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4">
                    ${res.Rental_Fee || res.rentalFee || 0}
                  </td>
                  <td className="px-4 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(res)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res.ReservationID || res._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
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
