import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// Importo el pool de conexiones a PostgreSQL
import pool from "../database/db";

// Le digo a TypeScript que la sesión puede tener userId y usuario
declare module "express-session" {
  interface SessionData {
    userId: number;
    usuario: string;
  }
}

// Controlador de login: recibe usuario y contraseña, los valida y crea la sesión
export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    // En PostgreSQL los parámetros se pasan con $1, $2, etc. en lugar de @nombre
    // Esto evita SQL Injection de la misma forma que mssql
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    // result.rows es el array de filas que devolvió PostgreSQL
    const user = result.rows[0];

    // Verifico que el usuario exista y que la contraseña coincida con el hash
    // Uso el mismo mensaje para ambos casos para no dar pistas
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Guardo los datos del usuario en la sesión del servidor
    req.session.userId = user.id;
    req.session.usuario = user.usuario;

    return res.json({ usuario: user.usuario });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Destruye la sesión en el servidor y borra la cookie del navegador
export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

// Verifica si hay sesión activa (el frontend lo llama al cargar la app)
export const getMe = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No hay sesión activa" });
  }
  return res.json({ usuario: req.session.usuario });
};
