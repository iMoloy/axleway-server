import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const bookings = await getCollection("bookings");
  const result = await bookings
    .find({ userEmail: req.user.email })
    .sort({ bookingDate: -1 })
    .toArray();
  res.send(result);
});

router.post("/", verifyToken, async (req, res) => {
  const bookings = await getCollection("bookings");
  const cars = await getCollection("cars");
  const booking = {
    ...req.body,
    userEmail: req.user.email,
    bookingDate: new Date()
  };

  const result = await bookings.insertOne(booking);
  await cars.updateOne(
    { _id: new ObjectId(req.body.carId) },
    { $inc: { bookingCount: 1 } }
  );

  res.send(result);
});

export default router;

