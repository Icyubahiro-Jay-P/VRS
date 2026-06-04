import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllVehicles,
  getVehicleByPlate,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", verifyToken, getAllVehicles);
router.get("/:plate", verifyToken, getVehicleByPlate);
router.post("/", verifyToken, createVehicle);
router.put("/:plate", verifyToken, updateVehicle);
router.delete("/:plate", verifyToken, deleteVehicle);

export default router;
