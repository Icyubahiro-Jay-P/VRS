-- Create database
CREATE DATABASE IF NOT EXISTS VRS;
USE VRS;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(255) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  Role VARCHAR(50) DEFAULT 'user',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS Customers (
  CustomerID INT AUTO_INCREMENT PRIMARY KEY,
  Full_Name VARCHAR(255) NOT NULL,
  National_ID VARCHAR(50) NOT NULL UNIQUE,
  Phone VARCHAR(20) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Address TEXT,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Vehicles table
CREATE TABLE IF NOT EXISTS Vehicles (
  Plate_Number VARCHAR(50) PRIMARY KEY,
  Brand VARCHAR(100) NOT NULL,
  Model VARCHAR(100) NOT NULL,
  Year INT NOT NULL,
  Vehicle_Type VARCHAR(50),
  Purchase_Price DECIMAL(10, 2),
  Status VARCHAR(50) DEFAULT 'available',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reservation_Rental table
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
  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_customer_email ON Customers(Email);
CREATE INDEX idx_vehicle_status ON Vehicles(Status);
CREATE INDEX idx_reservation_customer ON Reservation_Rental(CustomerID);
CREATE INDEX idx_reservation_vehicle ON Reservation_Rental(Plate_Number);
CREATE INDEX idx_reservation_status ON Reservation_Rental(Reservation_Status);
