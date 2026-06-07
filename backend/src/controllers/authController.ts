import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import sql from "../database/db";

// Extiende la interfaz de sesión para incluir los datos del usuario autenticado
declare module "express-session" {
  interface SessionData {
    userId: number;
    usuario: string;
  }
}

// Recibe usuario y contraseña, los verifica y crea la sesión si son correctos
export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  try {
    const result = await new sql.Request()
      .input("usuario", sql.NVarChar(50), usuario)
      .query("SELECT * FROM usuarios WHERE usuario = @usuario");

    const user = result.recordset[0];

    // Se usa el mismo mensaje de error tanto si el usuario no existe como si la contraseña es incorrecta
    // para no dar pistas sobre qué dato falló
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Guarda los datos del usuario en la sesión del servidor
    req.session.userId = user.id;
    req.session.usuario = user.usuario;

    return res.json({ usuario: user.usuario });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Destruye la sesión en el servidor y limpia la cookie del navegador
export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

// Devuelve los datos del usuario actualmente autenticado
export const getMe = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No hay sesión activa" });
  }
  return res.json({ usuario: req.session.usuario });
};
