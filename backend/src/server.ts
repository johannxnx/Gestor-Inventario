import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});