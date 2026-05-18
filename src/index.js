import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import carRoutes from "./routes/cars.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "AxleWay server is running" });
});

app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`AxleWay server listening on port ${port}`);
});

