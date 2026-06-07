import { Router } from "express";
import {
  createProducto,
  getProductoById,
  getProductos,
} from "../controllers/productController";

const router = Router();

router.get("/productos", getProductos);
router.get("/productos/:id", getProductoById);
router.post("/productos", createProducto);

console.log("Rutas de productos cargadas");

export default router;
