import { Router } from "express";
import {
  createProducto,
  getProductos,
} from "../controllers/productController";

const router = Router();

router.get("/productos", getProductos);
router.post("/productos", createProducto);

console.log("Rutas de productos cargadas");

export default router;
