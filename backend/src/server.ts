import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", productRoutes);

app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});