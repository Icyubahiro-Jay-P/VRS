import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import vehicleRoutes from "./routes/vehicles.js";
import reservationRoutes from "./routes/reservations.js";
import { verifyToken } from "./middleware/auth.js";
import { initializeDatabase } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/customers", verifyToken, customerRoutes);
app.use("/api/vehicles", verifyToken, vehicleRoutes);
app.use("/api/reservations", verifyToken, reservationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
