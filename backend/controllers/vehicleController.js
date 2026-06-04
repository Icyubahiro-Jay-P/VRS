import Vehicle from "../models/Vehicle.js";

export const getAllVehicles = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { plateNumber: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVehicleByPlate = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ plateNumber: req.params.plate });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Get vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const {
      plateNumber,
      brand,
      model,
      year,
      vehicleType,
      purchasePrice,
      status,
      plate_number,
      vehicle_type,
      purchase_price,
    } = req.body;

    // Support both camelCase and snake_case
    const plate = plateNumber || plate_number;
    const type = vehicleType || vehicle_type;
    const price = purchasePrice || purchase_price;

    if (!plate || !brand || !model || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vehicle = new Vehicle({
      plateNumber: plate,
      brand,
      model,
      year,
      vehicleType: type || "",
      purchasePrice: price || 0,
      status: status || "available",
    });

    await vehicle.save();

    res.status(201).json({ message: "Vehicle created successfully", vehicle });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      vehicleType,
      purchasePrice,
      status,
      vehicle_type,
      purchase_price,
    } = req.body;

    // Support both camelCase and snake_case
    const type = vehicleType || vehicle_type;
    const price = purchasePrice || purchase_price;

    const vehicle = await Vehicle.findOneAndUpdate(
      { plateNumber: req.params.plate },
      {
        brand,
        model,
        year,
        vehicleType: type,
        purchasePrice: price,
        status,
      },
      { new: true },
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      plateNumber: req.params.plate,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
