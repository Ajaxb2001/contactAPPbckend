const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Contact API");
});

// Get all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
});

// Add a new contact
app.post("/api/contacts", async (req, res) => {
  const { name, address, phoneNumber } = req.body;
  if (!name || !address || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, address, phoneNumber });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Error adding contact", error });
  }
});

// Delete a contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
});

// Update a contact
app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, phoneNumber } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, address, phoneNumber },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
