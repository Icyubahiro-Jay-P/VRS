import React, { useState, useEffect } from "react";
import { reportAPI } from "../api/axios";

export default function Report() {
  const [reports, setReports] = useState({
    totalRevenue: 0,
    totalReservations: 0,
    activeVehicles: 0,
    occupancyRate: 0,
  });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getSummary(dateFrom, dateTo);
      setReports(response.data.summary || reports);
      setReportData(response.data.details || []);
    } catch (err) {
      console.error("Error loading report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [dateFrom, dateTo]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Reports</h1>

      {/* Date Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <button
            onClick={loadReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">${reports.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Reservations</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{reports.totalReservations}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Active Vehicles</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{reports.activeVehicles}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Occupancy Rate</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{reports.occupancyRate}%</p>
        </div>
      </div>

      {/* Detailed Report Table */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">Generating report...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Period</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-5">{item.date}</td>
                    <td className="px-6 py-5">{item.customer}</td>
                    <td className="px-6 py-5">{item.vehicle}</td>
                    <td className="px-6 py-5">{item.period}</td>
                    <td className="px-6 py-5 text-right font-medium">${item.amount}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No data found for selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}