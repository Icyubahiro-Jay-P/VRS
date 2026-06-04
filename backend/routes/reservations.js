import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReport,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/", verifyToken, getAllReservations);
router.get("/report/all", verifyToken, getReport);
router.get("/:id", verifyToken, getReservationById);
router.post("/", verifyToken, createReservation);
router.put("/:id", verifyToken, updateReservation);
router.delete("/:id", verifyToken, deleteReservation);

export default router;
