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
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://axleway.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.NEXT_PUBLIC_CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter((origin, index, array) => array.indexOf(origin) === index);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "AxleWay server is running" });
});

app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`AxleWay server listening on port ${port}`);
  });
}

export default app;
