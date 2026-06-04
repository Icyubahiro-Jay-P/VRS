import Reservation from "../models/Reservation.js";

export const getAllReservations = async (req, res) => {
  try {
    const { customerID, status, dateFrom, dateTo } = req.query;
    let query = {};

    if (customerID) {
      query.customerID = customerID;
    }

    if (status) {
      query.$or = [{ reservationStatus: status }, { rentalStatus: status }];
    }

    if (dateFrom || dateTo) {
      query.reservationDate = {};
      if (dateFrom) query.reservationDate.$gte = new Date(dateFrom);
      if (dateTo) query.reservationDate.$lte = new Date(dateTo);
    }

    const reservations = await Reservation.find(query)
      .populate("customerID")
      .populate("plateNumber")
      .populate("userID")
      .sort({ reservationDate: -1 });

    res.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("customerID")
      .populate("plateNumber")
      .populate("userID");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
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

    const reservation = new Reservation({
      customerID,
      plateNumber,
      userID: req.user.userID,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reservationStatus: "pending",
    });

    await reservation.save();
    await reservation.populate(["customerID", "plateNumber", "userID"]);

    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const {
      reservationStatus,
      rentalStatus,
      rentalDate,
      returnDate,
      rentalFee,
      reservation_status,
      rental_status,
      rental_date,
      return_date,
      rental_fee,
    } = req.body;

    const updateData = {};
    if (reservationStatus !== undefined)
      updateData.reservationStatus = reservationStatus;
    if (rentalStatus !== undefined) updateData.rentalStatus = rentalStatus;
    if (rentalDate !== undefined) updateData.rentalDate = rentalDate;
    if (returnDate !== undefined) updateData.returnDate = returnDate;
    if (rentalFee !== undefined) updateData.rentalFee = rentalFee;
    // Support snake_case from frontend
    if (reservation_status !== undefined)
      updateData.reservationStatus = reservation_status;
    if (rental_status !== undefined) updateData.rentalStatus = rental_status;
    if (rental_date !== undefined) updateData.rentalDate = rental_date;
    if (return_date !== undefined) updateData.returnDate = return_date;
    if (rental_fee !== undefined) updateData.rentalFee = rental_fee;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    )
      .populate("customerID")
      .populate("plateNumber")
      .populate("userID");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Reservation.find()
      .populate({
        path: "customerID",
        select: "fullName nationalID phone",
      })
      .populate({
        path: "plateNumber",
        select: "plateNumber brand model year vehicleType",
      })
      .select(
        "reservationDate startDate endDate reservationStatus rentalDate returnDate rentalFee rentalStatus",
      )
      .sort({ reservationDate: -1 });

    res.json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
