import { Request, Response } from "express";
import sql from "../database/db";

// Obtiene todos los productos guardados en la tabla productos
export const getProductos = async (
  _req: Request,
  res: Response
) => {
  try {
    // Esta consulta trae todos los registros de productos
    const result = await sql.query(`
      SELECT * FROM productos
    `);

    // recordset contiene los datos que devuelve SQL Server
    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    // Si algo falla, se responde con error 500.
    res.status(500).json({
      message: "Error obteniendo productos",
    });
  }
};

// Obtiene un producto especifico usando el id que viene en la URL
export const getProductoById = async (req: Request, res: Response) => {
  // req.params.id viene como texto, por eso se convierte a numero.
  const id = Number(req.params.id);

  // Si el id no es numero, se responde con error 400.
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    // Se usa input para enviar el id como parametro y evitar SQL injection
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        SELECT *
        FROM productos
        WHERE id = @id
      `);

    // Si no hay registros, significa que no existe un producto con ese id
    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Como se busca por id, solo se devuelve el primer producto encontrado
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo producto",
    });
  }
};

// Crea un nuevo producto con los datos enviados en el body
export const createProducto = async (req: Request, res: Response) => {
  // Se obtienen los campos que envia el cliente en formato JSON.
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  // Validacion basica para que no se guarden productos incompletos.
  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    // Se insertan los datos usando parametros para que la consulta sea mas segura
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

    // Si el insert fue correcto, se responde con estado 201
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

// Actualiza un producto existente usando el id de la URL
export const updateProducto = async (req: Request, res: Response) => {
  // Se obtiene el id desde la ruta y los datos nuevos desde el body.
  const id = Number(req.params.id);
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  // Valida que el id sea un numero valido
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  // Valida que los campos principales vengan completos
  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    // Actualiza el producto usando parametros para proteger la consulta
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

    // rowsAffected indica cuantas filas fueron modificadas
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Si se actualizo una fila, se confirma al cliente
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

// Elimina un producto usando el id que viene en la URL
export const deleteProducto = async (req: Request, res: Response) => {
  // El id viene como string, por eso se convierte a numero.
  const id = Number(req.params.id);

  // Si no es numero, se devuelve error 400
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    // Se elimina usando un parametro para evitar concatenar valores en el SQL
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM productos
        WHERE id = @id
      `);

    // Si no se afecto ninguna fila, el producto no existia
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Respuesta cuando el producto se elimino correctamente
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
