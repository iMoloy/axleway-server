import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { search = "", type = "" } = req.query;
  const query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (type) query.type = type;

  const cars = await getCollection("cars");
  const result = await cars.find(query).sort({ createdAt: -1 }).toArray();
  res.send(result);
});

router.post("/", verifyToken, async (req, res) => {
  const cars = await getCollection("cars");
  const car = {
    ...req.body,
    ownerEmail: req.user.email,
    bookingCount: 0,
    createdAt: new Date()
  };
  const result = await cars.insertOne(car);
  res.send(result);
});

router.get("/owner/:email", verifyToken, async (req, res) => {
  if (req.user.email !== req.params.email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const cars = await getCollection("cars");
  const result = await cars.find({ ownerEmail: req.params.email }).toArray();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  const cars = await getCollection("cars");
  const result = await cars.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

router.patch("/:id", verifyToken, async (req, res) => {
  const cars = await getCollection("cars");
  const result = await cars.updateOne(
    { _id: new ObjectId(req.params.id), ownerEmail: req.user.email },
    { $set: req.body }
  );
  res.send(result);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const cars = await getCollection("cars");
  const result = await cars.deleteOne({
    _id: new ObjectId(req.params.id),
    ownerEmail: req.user.email
  });
  res.send(result);
});

export default router;
