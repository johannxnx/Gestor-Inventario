import { Request, Response } from "express";
import sql from "../database/db";

export const getProductos = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await sql.query(`
      SELECT * FROM productos
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo productos",
    });
  }
};

export const createProducto = async (req: Request, res: Response) => {
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    await new sql.Request()
      .input("codigo", sql.VarChar(50), codigo)
      .input("nombre", sql.VarChar(100), nombre)
      .input("descripcion", sql.VarChar(255), descripcion || null)
      .input("precio", sql.Decimal(10, 2), precio)
      .input("categoria", sql.VarChar(100), categoria)
      .query(`
        INSERT INTO productos (
          codigo,
          nombre,
          descripcion,
          precio,
          categoria
        )
        VALUES (
          @codigo,
          @nombre,
          @descripcion,
          @precio,
          @categoria
        )
      `);

    res.status(201).json({
      message: "Producto creado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creando producto",
    });
  }
};
