// Importo los tipos de Express para que TypeScript no se queje
import { Request, Response } from "express";

// Importo la instancia de SQL Server para hacer consultas a la base de datos
import sql from "../database/db";

// Controlador para obtener TODOS los productos de la base de datos
// Se llama cuando el frontend hace GET /api/productos
export const getProductos = async (
  _req: Request, // el guión bajo antes de req indica que no uso esa variable
  res: Response
) => {
  try {
    // Hago una consulta simple para traer todos los registros de la tabla productos
    const result = await sql.query(`
      SELECT * FROM productos
    `);

    // result.recordset es el array con todos los productos que devolvió SQL Server
    // Lo mando como JSON al frontend
    res.json(result.recordset);
  } catch (error) {
    // Muestro el error en la consola del servidor para poder depurar
    console.error(error);

    // HTTP 500: algo falló dentro del servidor (no es culpa del cliente)
    res.status(500).json({
      message: "Error obteniendo productos",
    });
  }
};

// Controlador para obtener UN solo producto usando su id
// Se llama cuando el frontend hace GET /api/productos/5 (por ejemplo)
export const getProductoById = async (req: Request, res: Response) => {
  // req.params.id viene como texto (string) porque así viajan los parámetros en la URL
  // Lo convierto a número porque en la base de datos el id es un entero
  const id = Number(req.params.id);

  // Si el texto no era un número válido, Number() devuelve NaN (Not a Number)
  // En ese caso, devuelvo un error al cliente antes de ir a la base de datos
  // HTTP 400: el cliente mandó una petición incorrecta
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    // Uso .input() para pasar el id como parámetro seguro
    // Si concatenara directamente el id en el SQL, sería vulnerable a SQL Injection
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        SELECT *
        FROM productos
        WHERE id = @id
      `);

    // Si recordset está vacío, no existe ningún producto con ese id
    // HTTP 404: el recurso que buscan no existe
    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Como busqué por id (que es único), solo puede haber uno, tomo el primero
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo producto",
    });
  }
};

// Controlador para CREAR un nuevo producto
// Se llama cuando el frontend hace POST /api/productos con los datos del formulario
export const createProducto = async (req: Request, res: Response) => {
  // Desestructuro el body de la petición para sacar los campos del formulario
  // req.body contiene lo que el frontend mandó en formato JSON
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  // Validación: los campos obligatorios no pueden estar vacíos
  // descripcion no está aquí porque es opcional
  // precio === undefined lo chequeo así porque 0 es un precio válido
  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    // Hago el INSERT usando parámetros para cada campo
    // sql.VarChar(50) le dice a mssql el tipo y tamaño del parámetro en SQL Server
    // Si descripcion no viene, guardo null en la base de datos (está permitido)
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

    // HTTP 201: "Created", se usa cuando algo se creó exitosamente
    // Es más específico que el 200, indica que se creó un recurso nuevo
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

// Controlador para MODIFICAR un producto existente
// Se llama cuando el frontend hace PUT /api/productos/5 con los datos actualizados
export const updateProducto = async (req: Request, res: Response) => {
  // El id viene en la URL (/api/productos/:id) y los datos nuevos vienen en el body
  const id = Number(req.params.id);
  const { codigo, nombre, descripcion, precio, categoria } = req.body;

  // Verifico que el id sea un número válido
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  // Verifico que los campos obligatorios vengan completos
  if (!codigo || !nombre || precio === undefined || !categoria) {
    return res.status(400).json({
      message: "Codigo, nombre, precio y categoria son obligatorios",
    });
  }

  try {
    // Hago el UPDATE con todos los campos usando parámetros seguros
    // El WHERE id = @id asegura que solo se modifique ESE producto
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

    // rowsAffected[0] indica cuántas filas fueron modificadas por el UPDATE
    // Si es 0, significa que no existía ningún producto con ese id
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Si se modificó al menos una fila, el update fue exitoso
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

// Controlador para ELIMINAR un producto
// Se llama cuando el frontend hace DELETE /api/productos/5
export const deleteProducto = async (req: Request, res: Response) => {
  // El id del producto a eliminar viene en la URL
  const id = Number(req.params.id);

  // Siempre valido que el id sea un número antes de ir a la base de datos
  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "El id del producto debe ser un numero valido",
    });
  }

  try {
    // Hago el DELETE usando un parámetro para el id
    // El @id evita que alguien pueda inyectar SQL malicioso en la URL
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM productos
        WHERE id = @id
      `);

    // Si rowsAffected[0] es 0, no había ningún producto con ese id
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Producto eliminado correctamente
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
