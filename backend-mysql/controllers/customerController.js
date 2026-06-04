import { getPool } from "../db.js";

export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM Customers";
    let params = [];

    if (search) {
      query += " WHERE Full_Name LIKE ? OR Email LIKE ? OR Phone LIKE ?";
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    const [customers] = await conn.query(query, params);
    conn.release();

    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    const [customers] = await conn.query(
      "SELECT * FROM Customers WHERE CustomerID = ?",
      [req.params.id],
    );
    conn.release();

    if (customers.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customers[0]);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { full_name, national_id, phone, email, address } = req.body;

    if (!full_name || !national_id || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO Customers (Full_Name, National_ID, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)",
      [full_name, national_id, phone, email, address || ""],
    );
    conn.release();

    res.status(201).json({ message: "Customer created successfully" });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { full_name, national_id, phone, email, address } = req.body;

    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query(
      "UPDATE Customers SET Full_Name = ?, National_ID = ?, Phone = ?, Email = ?, Address = ? WHERE CustomerID = ?",
      [full_name, national_id, phone, email, address || "", req.params.id],
    );
    conn.release();

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM Customers WHERE CustomerID = ?", [
      req.params.id,
    ]);
    conn.release();

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
