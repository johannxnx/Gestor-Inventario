import { Request, Response } from "express";

// Importo el pool de PostgreSQL
import pool from "../database/db";

// Obtiene todos los productos de la tabla productos
export const getProductos = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id");
    // result.rows contiene el array de productos en PostgreSQL
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

// Obtiene un producto por su id
export const getProductoById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "El id del producto debe ser un numero valido" });
  }

  try {
    // $1 es el primer parámetro, reemplaza al @id de mssql
    const result = await pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo producto" });
  }
};

// Crea un producto nuevo con los datos del body
export const createProducto = async (req: Request, res: Response) => {
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({ message: "Codigo, nombre, precio y categoria son obligatorios" });
  }

  try {
    // Cada $1, $2, $3... corresponde a cada valor en el array del segundo argumento
    await pool.query(
      `INSERT INTO productos (codigo, nombre, descripcion, precio, categoria)
       VALUES ($1, $2, $3, $4, $5)`,
      [codigo, nombre, descripcion || null, precio, categoria]
    );

    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto" });
  }
};

// Actualiza un producto existente por su id
export const updateProducto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "El id del producto debe ser un numero valido" });
  }

  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({ message: "Codigo, nombre, precio y categoria son obligatorios" });
  }

  try {
    const result = await pool.query(
      `UPDATE productos
       SET codigo = $1, nombre = $2, descripcion = $3, precio = $4, categoria = $5
       WHERE id = $6`,
      [codigo, nombre, descripcion || null, precio, categoria, id]
    );

    // rowCount indica cuántas filas fueron afectadas por el UPDATE
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando producto" });
  }
};

// Elimina un producto por su id
export const deleteProducto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "El id del producto debe ser un numero valido" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM productos WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
};
