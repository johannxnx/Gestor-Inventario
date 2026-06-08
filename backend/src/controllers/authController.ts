// Importo los tipos Request y Response de Express
// Request representa la petición que llega (lo que manda el cliente)
// Response representa la respuesta que devuelvo (lo que le mando al cliente)
import { Request, Response } from "express";

// bcryptjs es la librería para manejar contraseñas de forma segura
// Nunca guardamos contraseñas en texto plano en la base de datos, siempre hasheadas
// Un hash es una transformación irreversible: puedo verificar si coincide, pero no "descifrarlo"
import bcrypt from "bcryptjs";

// Importo la conexión a SQL Server para hacer consultas a la base de datos
import sql from "../database/db";

// Por defecto, TypeScript no sabe qué datos personalizados guardo en la sesión de Express
// Con este "declare module" le digo que la sesión puede tener userId y usuario
declare module "express-session" {
  interface SessionData {
    userId: number;   // el id del usuario en la tabla usuarios
    usuario: string;  // el nombre de usuario (para mostrarlo en la navbar)
  }
}

// Controlador de login: recibe usuario y contraseña, los valida y crea la sesión
export const login = async (req: Request, res: Response) => {
  // Saco los datos que el frontend mandó en el cuerpo (body) de la petición
  const { usuario, password } = req.body;

  // Validación básica: si falta cualquiera de los dos campos, devuelvo error
  // HTTP 400 significa "Bad Request": la petición está incompleta o mal formada
  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    // Busco el usuario en la base de datos por su nombre
    // IMPORTANTE: uso .input() para pasar el valor como parámetro (@usuario)
    // Esto evita SQL Injection, que es cuando alguien mete código SQL en los campos del formulario
    const result = await new sql.Request()
      .input("usuario", sql.NVarChar(50), usuario)
      .query("SELECT * FROM usuarios WHERE usuario = @usuario");

    // result.recordset es el array de filas que devolvió la consulta
    // Tomo solo el primero porque el nombre de usuario debería ser único
    const user = result.recordset[0];

    // Verifico dos cosas en una sola condición:
    // 1. Que el usuario exista en la base de datos
    // 2. Que la contraseña ingresada coincida con el hash guardado
    // bcrypt.compare devuelve true si coinciden, false si no
    // Uso el MISMO mensaje de error para ambos casos a propósito:
    // si digo "usuario no encontrado", le doy pistas a alguien que quiera adivinar usuarios
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      // HTTP 401 significa "Unauthorized": las credenciales no son válidas
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Si llegué hasta aquí, el usuario existe y la contraseña es correcta
    // Guardo los datos del usuario en la sesión del servidor
    // Esto es lo que hace que el usuario "quede logueado"
    // Internamente express-session guarda estos datos y le da una cookie al navegador
    req.session.userId = user.id;
    req.session.usuario = user.usuario;

    // Le devuelvo el nombre de usuario al frontend para mostrarlo en la navbar
    return res.json({ usuario: user.usuario });
  } catch (error) {
    // Si algo falla en la base de datos, lo muestro en la consola del servidor
    console.error("Error en login:", error);
    // HTTP 500 significa "Internal Server Error": algo falló dentro del servidor
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Controlador de logout: destruye la sesión en el servidor y borra la cookie del navegador
export const logout = (req: Request, res: Response) => {
  // session.destroy() elimina la sesión del almacenamiento del servidor
  // Una vez destruida, la cookie que tiene el navegador ya no sirve para nada
  req.session.destroy(() => {
    // También le digo al navegador que borre la cookie "connect.sid"
    // "connect.sid" es el nombre por defecto que le da express-session a la cookie
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

// Controlador para verificar si hay sesión activa
// El frontend llama a este endpoint cuando carga la app para saber si el usuario ya estaba logueado
export const getMe = (req: Request, res: Response) => {
  // Si no hay userId en la sesión, significa que no hay usuario logueado
  if (!req.session.userId) {
    // HTTP 401: no hay sesión activa
    return res.status(401).json({ error: "No hay sesión activa" });
  }
  // Si hay sesión, devuelvo el nombre de usuario guardado en ella
  return res.json({ usuario: req.session.usuario });
};
