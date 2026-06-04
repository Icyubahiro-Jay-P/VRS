import React, { useState, useEffect } from "react";
import { customerAPI } from "../api/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    national_id: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll(search);
      setCustomers(response.data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerAPI.update(editingId, formData);
      } else {
        await customerAPI.create(formData);
      }
      setFormData({
        full_name: "",
        national_id: "",
        phone: "",
        email: "",
        address: "",
      });
      setShowForm(false);
      setEditingId(null);
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      full_name: customer.Full_Name || customer.fullName,
      national_id: customer.National_ID || customer.nationalID,
      phone: customer.Phone || customer.phone,
      email: customer.Email || customer.email,
      address: customer.Address || customer.address,
    });
    setEditingId(customer.CustomerID || customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this customer?")) {
      try {
        await customerAPI.delete(id);
        loadCustomers();
      } catch (err) {
        alert("Error deleting customer");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Customers</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ full_name: "", national_id: "", phone: "", email: "", address: "" });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
        >
          + New Customer
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Customer" : "New Customer"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="National ID"
              value={formData.national_id}
              onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 col-span-1 md:col-span-2"
            />

            <div className="flex gap-3 mt-4 col-span-1 md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                {editingId ? "Update Customer" : "Create Customer"}
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading customers...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">National ID</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Phone</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Address</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.CustomerID || customer._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium">{customer.Full_Name || customer.fullName}</td>
                  <td className="px-6 py-5">{customer.National_ID || customer.nationalID}</td>
                  <td className="px-6 py-5">{customer.Phone || customer.phone}</td>
                  <td className="px-6 py-5 text-gray-700">{customer.Email || customer.email}</td>
                  <td className="px-6 py-5 text-gray-600">{customer.Address || customer.address}</td>
                  <td className="px-6 py-5 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.CustomerID || customer._id)}
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