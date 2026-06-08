// Router me permite separar las rutas en archivos independientes
// Sin esto, tendría todas las rutas mezcladas en server.ts y sería un desastre
import { Router } from "express";

// Importo todas las funciones del controlador de productos
import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  updateProducto,
} from "../controllers/productController";

// Creo el router para las rutas de productos
const router = Router();

// GET /api/productos → devuelve TODOS los productos
router.get("/productos", getProductos);

// GET /api/productos/:id → devuelve UN solo producto por su id
// :id es un parámetro dinámico que cambia según lo que ponga el cliente en la URL
router.get("/productos/:id", getProductoById);

// POST /api/productos → crea un producto nuevo con los datos del body
router.post("/productos", createProducto);

// PUT /api/productos/:id → modifica un producto existente por su id
router.put("/productos/:id", updateProducto);

// DELETE /api/productos/:id → elimina un producto por su id
router.delete("/productos/:id", deleteProducto);

// Aviso en consola que las rutas se cargaron bien (útil para depurar)
console.log("Rutas de productos cargadas");

// Exporto el router para que server.ts pueda usarlo con app.use("/api", productRoutes)
export default router;
