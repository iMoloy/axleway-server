import dotenv from "dotenv";
import { getCollection } from "../config/db.js";
import { seedCars } from "./cars.js";

dotenv.config();

async function seed() {
  const cars = await getCollection("cars");
  const now = new Date();
  const data = seedCars.map((car) => ({
    ...car,
    createdAt: now
  }));

  await cars.deleteMany({});
  const result = await cars.insertMany(data);

  console.log(`Inserted ${result.insertedCount} cars into MongoDB.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

