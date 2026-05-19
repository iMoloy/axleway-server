import express from "express";
import { getCollection } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getObjectId } from "../utils/objectId.js";
import { hasRequiredFields, isPositiveNumber } from "../utils/validation.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const { search = "", type = "" } = req.query;
  const query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (type) query.type = type;

  const cars = await getCollection("cars");
  const result = await cars.find(query).sort({ createdAt: -1 }).toArray();
  res.send(result);
}));

router.post("/", verifyToken, asyncHandler(async (req, res) => {
  const requiredFields = [
    "name",
    "price",
    "type",
    "image",
    "seats",
    "location",
    "description",
    "availability"
  ];

  if (!hasRequiredFields(req.body, requiredFields)) {
    return res.status(400).send({ message: "Missing required car fields" });
  }

  if (!isPositiveNumber(req.body.price) || !isPositiveNumber(req.body.seats)) {
    return res.status(400).send({ message: "Price and seats must be positive numbers" });
  }

  const cars = await getCollection("cars");
  const car = {
    ...req.body,
    price: Number(req.body.price),
    seats: Number(req.body.seats),
    ownerEmail: req.user.email,
    bookingCount: 0,
    createdAt: new Date()
  };
  const result = await cars.insertOne(car);
  res.send(result);
}));

router.get("/owner/:email", verifyToken, asyncHandler(async (req, res) => {
  if (req.user.email !== req.params.email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const cars = await getCollection("cars");
  const result = await cars.find({ ownerEmail: req.params.email }).toArray();
  res.send(result);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const carId = getObjectId(req.params.id);
  if (!carId) {
    return res.status(400).send({ message: "Invalid car id" });
  }

  const cars = await getCollection("cars");
  const result = await cars.findOne({ _id: carId });

  if (!result) {
    return res.status(404).send({ message: "Car not found" });
  }

  res.send(result);
}));

router.patch("/:id", verifyToken, asyncHandler(async (req, res) => {
  const carId = getObjectId(req.params.id);
  if (!carId) {
    return res.status(400).send({ message: "Invalid car id" });
  }

  const cars = await getCollection("cars");
  const updates = {
    ...req.body
  };

  if (updates.price && !isPositiveNumber(updates.price)) {
    return res.status(400).send({ message: "Price must be a positive number" });
  }

  if (updates.seats && !isPositiveNumber(updates.seats)) {
    return res.status(400).send({ message: "Seats must be a positive number" });
  }

  if (updates.price) updates.price = Number(updates.price);
  if (updates.seats) updates.seats = Number(updates.seats);

  const result = await cars.updateOne(
    { _id: carId, ownerEmail: req.user.email },
    { $set: updates }
  );
  res.send(result);
}));

router.delete("/:id", verifyToken, asyncHandler(async (req, res) => {
  const carId = getObjectId(req.params.id);
  if (!carId) {
    return res.status(400).send({ message: "Invalid car id" });
  }

  const cars = await getCollection("cars");
  const result = await cars.deleteOne({
    _id: carId,
    ownerEmail: req.user.email
  });
  res.send(result);
}));

export default router;
