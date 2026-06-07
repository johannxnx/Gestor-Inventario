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

export const getProductoById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        SELECT *
        FROM productos
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo producto",
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

export const updateProducto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .input("codigo", sql.VarChar(50), codigo)
      .input("nombre", sql.VarChar(100), nombre)
      .input("descripcion", sql.VarChar(255), descripcion || null)
      .input("precio", sql.Decimal(10, 2), precio)
      .input("categoria", sql.VarChar(100), categoria)
      .query(`
        UPDATE productos
        SET
          codigo = @codigo,
          nombre = @nombre,
          descripcion = @descripcion,
          precio = @precio,
          categoria = @categoria
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto actualizado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error actualizando producto",
    });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM productos
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error eliminando producto",
    });
  }
};
