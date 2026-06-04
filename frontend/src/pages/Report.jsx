import React, { useState, useEffect } from "react";
import { reservationAPI } from "../api/axios";

export default function Report() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getReport();
      setReportData(response.data);
    } catch (err) {
      console.error("Error loading report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rental Report</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🖨️ Print
        </button>
      </div>

      {loading ? (
        <p>Loading report...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 print:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left border">Customer Name</th>
                <th className="px-3 py-2 text-left border">National ID</th>
                <th className="px-3 py-2 text-left border">Phone</th>
                <th className="px-3 py-2 text-left border">Plate</th>
                <th className="px-3 py-2 text-left border">Brand</th>
                <th className="px-3 py-2 text-left border">Model</th>
                <th className="px-3 py-2 text-center border">Year</th>
                <th className="px-3 py-2 text-left border">Type</th>
                <th className="px-3 py-2 text-left border">Res. Date</th>
                <th className="px-3 py-2 text-left border">Start</th>
                <th className="px-3 py-2 text-left border">End</th>
                <th className="px-3 py-2 text-left border">Res. Status</th>
                <th className="px-3 py-2 text-left border">Rental Date</th>
                <th className="px-3 py-2 text-left border">Return</th>
                <th className="px-3 py-2 text-right border">Fee</th>
                <th className="px-3 py-2 text-left border">Rental Status</th>
              </tr>
            </thead>
            <tbody className="print:text-xs">
              {reportData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 print:break-inside-avoid"
                >
                  <td className="px-3 py-2 border">
                    {item.Full_Name || item.customerID?.fullName || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.National_ID || item.customerID?.nationalID || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Phone || item.customerID?.phone || "-"}
                  </td>
                  <td className="px-3 py-2 border font-semibold">
                    {item.Plate_Number || item.plateNumber?.plateNumber || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Brand || item.plateNumber?.brand || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Model || item.plateNumber?.model || "-"}
                  </td>
                  <td className="px-3 py-2 border text-center">
                    {item.Year || item.plateNumber?.year || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Vehicle_Type || item.plateNumber?.vehicleType || "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {new Date(
                      item.Reservation_Date || item.reservationDate,
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border">
                    {new Date(
                      item.Start_Date || item.startDate,
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border">
                    {new Date(
                      item.End_Date || item.endDate,
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {item.Reservation_Status || item.reservationStatus || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Rental_Date
                      ? new Date(
                          item.Rental_Date || item.rentalDate,
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Return_Date
                      ? new Date(
                          item.Return_Date || item.returnDate,
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border text-right font-semibold">
                    ${item.Rental_Fee || item.rentalFee || 0}
                  </td>
                  <td className="px-3 py-2 border">
                    {item.Rental_Status ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        {item.Rental_Status || item.rentalStatus}
                      </span>
                    ) : (
                      "-"
                    )}
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
