import { getPool } from "../db.js";

export const getAllReservations = async (req, res) => {
  try {
    const { customerID, status, dateFrom, dateTo } = req.query;
    let query = `
      SELECT rr.*, c.Full_Name, c.National_ID, c.Phone, v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type, u.Username
      FROM Reservation_Rental rr
      LEFT JOIN Customers c ON rr.CustomerID = c.CustomerID
      LEFT JOIN Vehicles v ON rr.Plate_Number = v.Plate_Number
      LEFT JOIN Users u ON rr.UserID = u.UserID
      WHERE 1=1
    `;
    let params = [];

    if (customerID) {
      query += " AND rr.CustomerID = ?";
      params.push(customerID);
    }

    if (status) {
      query += " AND (rr.Reservation_Status = ? OR rr.Rental_Status = ?)";
      params.push(status, status);
    }

    if (dateFrom) {
      query += " AND DATE(rr.Reservation_Date) >= DATE(?)";
      params.push(dateFrom);
    }

    if (dateTo) {
      query += " AND DATE(rr.Reservation_Date) <= DATE(?)";
      params.push(dateTo);
    }

    query += " ORDER BY rr.ReservationID DESC";

    const pool = getPool();
    const conn = await pool.getConnection();
    const [reservations] = await conn.query(query, params);
    conn.release();

    res.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    const [reservations] = await conn.query(
      `SELECT rr.*, c.Full_Name, v.Plate_Number, v.Brand, u.Username
       FROM Reservation_Rental rr
       LEFT JOIN Customers c ON rr.CustomerID = c.CustomerID
       LEFT JOIN Vehicles v ON rr.Plate_Number = v.Plate_Number
       LEFT JOIN Users u ON rr.UserID = u.UserID
       WHERE rr.ReservationID = ?`,
      [req.params.id],
    );
    conn.release();

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservations[0]);
  } catch (error) {
    console.error("Get reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createReservation = async (req, res) => {
  try {
    const { customerID, plateNumber, startDate, endDate } = req.body;

    if (!customerID || !plateNumber || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO Reservation_Rental (CustomerID, Plate_Number, UserID, Reservation_Date, Start_Date, End_Date, Reservation_Status)
       VALUES (?, ?, ?, NOW(), ?, ?, 'pending')`,
      [customerID, plateNumber, req.user.userID, startDate, endDate],
    );
    conn.release();

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const {
      reservation_status,
      rental_status,
      rental_date,
      return_date,
      rental_fee,
    } = req.body;

    let query = "UPDATE Reservation_Rental SET ";
    let updates = [];
    let params = [];

    if (reservation_status !== undefined) {
      updates.push("Reservation_Status = ?");
      params.push(reservation_status);
    }

    if (rental_status !== undefined) {
      updates.push("Rental_Status = ?");
      params.push(rental_status);
    }

    if (rental_date !== undefined) {
      updates.push("Rental_Date = ?");
      params.push(rental_date);
    }

    if (return_date !== undefined) {
      updates.push("Return_Date = ?");
      params.push(return_date);
    }

    if (rental_fee !== undefined) {
      updates.push("Rental_Fee = ?");
      params.push(rental_fee);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    query += updates.join(", ") + " WHERE ReservationID = ?";
    params.push(req.params.id);

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(query, params);
    conn.release();

    res.json({ message: "Reservation updated successfully" });
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM Reservation_Rental WHERE ReservationID = ?", [
      req.params.id,
    ]);
    conn.release();

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReport = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    const [report] = await conn.query(`
      SELECT 
        c.Full_Name,
        c.National_ID,
        c.Phone,
        v.Plate_Number,
        v.Brand,
        v.Model,
        v.Year,
        v.Vehicle_Type,
        rr.Reservation_Date,
        rr.Start_Date,
        rr.End_Date,
        rr.Reservation_Status,
        rr.Rental_Date,
        rr.Return_Date,
        rr.Rental_Fee,
        rr.Rental_Status
      FROM Reservation_Rental rr
      LEFT JOIN Customers c ON rr.CustomerID = c.CustomerID
      LEFT JOIN Vehicles v ON rr.Plate_Number = v.Plate_Number
      ORDER BY rr.Reservation_Date DESC
    `);
    conn.release();

    res.json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
