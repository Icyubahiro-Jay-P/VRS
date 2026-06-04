import { getPool } from "../db.js";

export const getAllVehicles = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = "SELECT * FROM Vehicles";
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push("(Plate_Number LIKE ? OR Brand LIKE ? OR Model LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      conditions.push("Status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    const [vehicles] = await conn.query(query, params);
    conn.release();

    res.json(vehicles);
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVehicleByPlate = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    const [vehicles] = await conn.query(
      "SELECT * FROM Vehicles WHERE Plate_Number = ?",
      [req.params.plate],
    );
    conn.release();

    if (vehicles.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicles[0]);
  } catch (error) {
    console.error("Get vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const {
      plate_number,
      brand,
      model,
      year,
      vehicle_type,
      purchase_price,
      status,
    } = req.body;

    if (!plate_number || !brand || !model || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO Vehicles (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        plate_number,
        brand,
        model,
        year,
        vehicle_type || "",
        purchase_price || 0,
        status || "available",
      ],
    );
    conn.release();

    res.status(201).json({ message: "Vehicle created successfully" });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { brand, model, year, vehicle_type, purchase_price, status } =
      req.body;

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(
      "UPDATE Vehicles SET Brand = ?, Model = ?, Year = ?, Vehicle_Type = ?, Purchase_Price = ?, Status = ? WHERE Plate_Number = ?",
      [
        brand,
        model,
        year,
        vehicle_type || "",
        purchase_price || 0,
        status || "available",
        req.params.plate,
      ],
    );
    conn.release();

    res.json({ message: "Vehicle updated successfully" });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM Vehicles WHERE Plate_Number = ?", [
      req.params.plate,
    ]);
    conn.release();

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
