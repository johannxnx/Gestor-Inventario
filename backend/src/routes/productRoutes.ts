import { Router } from "express";
import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  updateProducto,
} from "../controllers/productController";

// Router permite separar las rutas de productos del archivo principal server.ts
const router = Router();

// Lista todos los productos
router.get("/productos", getProductos);

// Busca un producto por id
router.get("/productos/:id", getProductoById);

// Crea un producto nuevo
router.post("/productos", createProducto);

// Modifica un producto existente por id
router.put("/productos/:id", updateProducto);

// Elimina un producto por id.
router.delete("/productos/:id", deleteProducto);

// Mensaje para confirmar en consola que este archivo de rutas se cargo
console.log("Rutas de productos cargadas");

// Se exporta el router para usarlo en server.ts
export default router;
