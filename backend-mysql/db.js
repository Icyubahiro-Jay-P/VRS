import mysql from "mysql2/promise.js";
import dotenv from "dotenv";

dotenv.config();

let pool;

export const initializeDatabase = async () => {
  try {
    // First, create connection without database to create the database
    const initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    console.log("Creating database if not exists...");

    // Create database
    await initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "VRS"}`,
    );

    // Create tables
    const [schema] = await initialConnection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME || "VRS"}'`,
    );

    if (schema.length > 0) {
      await initialConnection.query(`USE ${process.env.DB_NAME || "VRS"}`);

      // Create Users table
      await initialConnection.query(`
        CREATE TABLE IF NOT EXISTS Users (
          UserID INT AUTO_INCREMENT PRIMARY KEY,
          Username VARCHAR(255) NOT NULL UNIQUE,
          Password VARCHAR(255) NOT NULL,
          Role VARCHAR(50) DEFAULT 'user',
          Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Customers table
      await initialConnection.query(`
        CREATE TABLE IF NOT EXISTS Customers (
          CustomerID INT AUTO_INCREMENT PRIMARY KEY,
          Full_Name VARCHAR(255) NOT NULL,
          National_ID VARCHAR(50) NOT NULL UNIQUE,
          Phone VARCHAR(20) NOT NULL,
          Email VARCHAR(255) NOT NULL,
          Address TEXT,
          Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Vehicles table
      await initialConnection.query(`
        CREATE TABLE IF NOT EXISTS Vehicles (
          Plate_Number VARCHAR(50) PRIMARY KEY,
          Brand VARCHAR(100) NOT NULL,
          Model VARCHAR(100) NOT NULL,
          Year INT NOT NULL,
          Vehicle_Type VARCHAR(50),
          Purchase_Price DECIMAL(10, 2),
          Status VARCHAR(50) DEFAULT 'available',
          Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Reservation_Rental table
      await initialConnection.query(`
        CREATE TABLE IF NOT EXISTS Reservation_Rental (
          ReservationID INT AUTO_INCREMENT PRIMARY KEY,
          CustomerID INT,
          Plate_Number VARCHAR(50),
          UserID INT,
          Reservation_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          Start_Date DATE,
          End_Date DATE,
          Reservation_Status VARCHAR(50) DEFAULT 'pending',
          Rental_Date DATE,
          Return_Date DATE,
          Rental_Status VARCHAR(50),
          Rental_Fee DECIMAL(10, 2),
          Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE SET NULL,
          FOREIGN KEY (Plate_Number) REFERENCES Vehicles(Plate_Number) ON DELETE SET NULL,
          FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
          INDEX idx_customer (CustomerID),
          INDEX idx_vehicle (Plate_Number),
          INDEX idx_user (UserID),
          INDEX idx_reservation_status (Reservation_Status)
        )
      `);

      console.log("Database and tables initialized successfully!");
    }

    await initialConnection.end();
  } catch (error) {
    console.error("Database initialization error:", error);
  }

  // Create the connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "VRS",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Database pool created successfully!");
  return pool;
};

export const getPool = () => pool;
