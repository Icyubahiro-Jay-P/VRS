import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool } from "../db.js";

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();

    // Check if user exists
    const [existing] = await conn.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username],
    );

    if (existing.length > 0) {
      conn.release();
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await conn.query(
      "INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)",
      [username, hashedPassword, role || "user"],
    );

    conn.release();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const pool = getPool();
    const conn = await pool.getConnection();

    const [users] = await conn.query("SELECT * FROM Users WHERE Username = ?", [
      username,
    ]);

    if (users.length === 0) {
      conn.release();
      return res.status(400).json({ message: "User not found" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      conn.release();
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userID: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    conn.release();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: { userID: user.UserID, username: user.Username, role: user.Role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};
