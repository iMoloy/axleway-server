import express from "express";
import { getCollection } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getObjectId } from "../utils/objectId.js";
import { hasRequiredFields, isPositiveNumber } from "../utils/validation.js";

const router = express.Router();

router.get("/", verifyToken, asyncHandler(async (req, res) => {
  const bookings = await getCollection("bookings");
  const result = await bookings
    .find({ userEmail: req.user.email })
    .sort({ bookingDate: -1 })
    .toArray();
  res.send(result);
}));

router.post("/", verifyToken, asyncHandler(async (req, res) => {
  const requiredFields = ["carId", "carName", "totalPrice", "driverNeeded"];

  if (!hasRequiredFields(req.body, requiredFields)) {
    return res.status(400).send({ message: "Missing required booking fields" });
  }

  if (!isPositiveNumber(req.body.totalPrice)) {
    return res.status(400).send({ message: "Total price must be a positive number" });
  }

  const carId = getObjectId(req.body.carId);
  if (!carId) {
    return res.status(400).send({ message: "Invalid car id" });
  }

  const bookings = await getCollection("bookings");
  const cars = await getCollection("cars");
  const booking = {
    ...req.body,
    carId: req.body.carId,
    totalPrice: Number(req.body.totalPrice),
    userEmail: req.user.email,
    bookingDate: new Date()
  };

  const result = await bookings.insertOne(booking);
  await cars.updateOne(
    { _id: carId },
    { $inc: { bookingCount: 1 } }
  );

  res.send(result);
}));

router.delete("/:id", verifyToken, asyncHandler(async (req, res) => {
  const bookingId = getObjectId(req.params.id);
  if (!bookingId) {
    return res.status(400).send({ message: "Invalid booking id" });
  }

  const bookings = await getCollection("bookings");
  const cars = await getCollection("cars");
  const booking = await bookings.findOne({
    _id: bookingId,
    userEmail: req.user.email
  });

  if (!booking) {
    return res.status(404).send({ message: "Booking not found" });
  }

  const result = await bookings.deleteOne({
    _id: bookingId,
    userEmail: req.user.email
  });

  const carId = getObjectId(booking.carId);
  if (carId) {
    await cars.updateOne(
      { _id: carId },
      { $inc: { bookingCount: -1 } }
    );
  }

  res.send(result);
}));

export default router;
