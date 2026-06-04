import Customer from "../models/Customer.js";

export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await Customer.find(query);
    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const {
      fullName,
      nationalID,
      phone,
      email,
      address,
      full_name,
      national_id,
    } = req.body;

    // Support both camelCase and snake_case
    const name = fullName || full_name;
    const id = nationalID || national_id;

    if (!name || !id || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const customer = new Customer({
      fullName: name,
      nationalID: id,
      phone,
      email,
      address: address || "",
    });

    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const {
      fullName,
      nationalID,
      phone,
      email,
      address,
      full_name,
      national_id,
    } = req.body;

    // Support both camelCase and snake_case
    const updateData = {};
    if (fullName || full_name) updateData.fullName = fullName || full_name;
    if (nationalID || national_id)
      updateData.nationalID = nationalID || national_id;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (address !== undefined) updateData.address = address;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
